define(['N/record', 'N/https', 'N/email'], function (record, https, email) {
    /**
    *@NApiVersion 2.1
    */

    var endpoint_url = "https://api.axil.ai/integrations/netsuite/events"

    var auth_url = "https://axil.auth0.com/oauth/token"
    var client_id = "ncrPXMYoe27tKaTVXkapxlvX1n7SU1pu"
    var client_secret = "GbZcCfjILtDrq9zqg4xmAfjY0hTrxnWv7r1BD3SzUeuEMFHajqJoTC_rmoJIFDJS"
    var audience = "https://api.axil.ai"

    var source_name = "Netsuite.UserEvent"

    var email_internal_sender_id = 21633 // data@axil.ai, will need to be updated in prod.
    var error_email_recipients = ["data@axil.ai"]

    function submit(scriptContext, scriptName, excludeFields, includedAttributes, identifiers) {
        logAndEmitChanges(scriptContext, scriptName, scriptContext.newRecord.type, scriptContext.oldRecord, scriptContext.newRecord, excludeFields, includedAttributes, identifiers)
    }

    function logger(title, str) {
        str.match(/.{1,3000}/g).forEach(function(smallString, idx) {
            log.debug({
                title: title + '### part ' + idx,
                details: smallString
            });
        })
    }

    function removeSpecifiedFields(fields, blacklist) {
        new_fields = fields.slice()

        for (field in blacklist) {
            var index = new_fields.indexOf(blacklist[field]);
            if (index !== -1) {
                new_fields.splice(index, 1);
            }
        }

        return new_fields
    }

    function sendBodyDataToEndpoint(endpoint, bodyData) {
        authToken = getApiKey()

        headers = ({
            'Authorization': "Bearer " + authToken
         });

        response = https.post({
            url:  endpoint,
            body: JSON.stringify(bodyData),
            headers: headers
        })

        if (response.code != 202) {
            info = "Did not get a 202 from the EventBridge API. Code: " + response.code + "\nbody: " + JSON.stringify(response.body)

            email.send({
                author: email_internal_sender_id,
                recipients: error_email_recipients,
                subject: 'Netsuite Integration API Error',
                body: info
            });
            logger("API error!!", info)
        }
    }

    function getApiKey() {
        var response = https.post({
            url: auth_url,
            headers: { 'content-type': 'application/json' },
            body: `{"client_id":"${client_id}","client_secret":"${client_secret}","audience":"${audience}","grant_type":"client_credentials"}`
        })

        if (response.code != 200) {
            info = "Did not get a 200 from the Auth API. Code: " + response.code + "\nbody: " + JSON.stringify(response.body)

            email.send({
                author: email_internal_sender_id,
                recipients: error_email_recipients,
                subject: 'Netsuite Integration Auth API Error',
                body: info
            });

            logger("API error!!", info)

            return ""
        }

        return JSON.parse(response.body)['access_token']
    }

    function getChangesAndIdentifiers(oldRecord, newRecord, fields, identifiers, requiredAttributes) {
        if (fields.length === 0) {
            fields = newRecord.getFields()
        }

        changes = {}
        ids = {}
        required_fields = {}

        for (field in fields) {
            if (String(newRecord.getValue(fields[field])) != String(oldRecord.getValue(fields[field]))) {
                changes[fields[field]] = newRecord.getValue(fields[field])
            }
        }

        for (field in identifiers) {
            ids[identifiers[field]] = newRecord.getValue(identifiers[field])
        }

        for (field in requiredAttributes) {
            required_fields[requiredAttributes[field]] = newRecord.getValue(requiredAttributes[field])
        }

        return [changes, ids, required_fields]
    }

    function getRecord(newRecord, fields, identifiers, requiredAttributes) {
        var item = {}
        var ids = {}
        var required = {}

        for (field in fields) {
            item[fields[field]] = newRecord.getValue(fields[field])
        }

        for (field in identifiers) {
            ids[identifiers[field]] = newRecord.getValue(identifiers[field])
        }

        for (field in requiredAttributes) {
            required[requiredAttributes[field]] = newRecord.getValue(requiredAttributes[field])
        }

        return [item, ids, required]
    }

    function postFilter(changes) {
        if ("entityid" in changes) {
            if (!Number.isInteger(changes["entityid"])) {
                changes['entityid'] = -99
            }
        }

        return changes
    }

    function logAndEmitChanges(context, scriptName, dataType, oldRecord, newRecord, blacklist, requiredAttributes, identifiers) {
        if (context.type === "create") {
            fields = removeSpecifiedFields(newRecord.getFields(), blacklist)

            var data;
            var ids;
            [data, ids, required] = getRecord(newRecord, fields, identifiers, requiredAttributes)
            data = postFilter(data)

            wrapped_data = {
                source: source_name,
                eventType: context.type,
                dataType: dataType,
                script: scriptName,
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                data: {
                    attributes: required,
                    identifiers: ids,
                    changes: data,
                }
            }

            logger("Create Logging Debugging", JSON.stringify(wrapped_data))
            sendBodyDataToEndpoint(endpoint_url, wrapped_data)
        }
        else if (context.type == "delete") {
            var identifier_fields = {}
            var required_attributes = {}

            for (field in identifiers) {
                identifier_fields[identifiers[field]] = newRecord.getValue(identifiers[field])
            }

            for (field in requiredAttributes) {
                required_attributes[requiredAttributes[field]] = newRecord.getValue(requiredAttributes[field])
            }

            wrapped_data = {
                source: source_name,
                eventType: context.type,
                dataType: dataType,
                script: scriptName,
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                data: {
                    identifiers: identifier_fields,
                    attributes: required_attributes
                }
            }

            logger("Delete Debug Log: ", JSON.stringify(wrapped_data))
            sendBodyDataToEndpoint(endpoint_url, wrapped_data)
        }
        else {
            new_fields = newRecord.getFields()
            old_fields = oldRecord.getFields()

            var interesting_fields = new_fields.filter(function(n) {
                return old_fields.indexOf(n) !== -1;
            });

            logged_fields = removeSpecifiedFields(interesting_fields, blacklist)

            var changes;
            var ids;
            var attributes;

            [changes, ids, attributes] = getChangesAndIdentifiers(oldRecord, newRecord, logged_fields, identifiers, requiredAttributes)
            changes = postFilter(changes)

            wrapped_data = {
                source: source_name,
                eventType: context.type,
                dataType: dataType,
                script: scriptName,
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                data: {
                    identifiers: ids,
                    changes: changes,
                    attributes: attributes
                }
            }

            logger("Update Debug log: ", JSON.stringify(wrapped_data))
            sendBodyDataToEndpoint(endpoint_url, wrapped_data)
        }
    }

    return {
        submit: submit
    }
});
Copied