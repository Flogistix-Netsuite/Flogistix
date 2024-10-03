/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *@NModuleScope public
 */
 define(['N/https', 'N/log', 'N/record', 'N/url'], function(https, log, record, url) {
    
    const POD_COMPLIANCE_FILE_TYPE_ID = 6; // POD

    function beforeLoad(context) {
        loadCustomPrintButton(context);
        loadCustomPODPrintButton(context);
    }

    function beforeSubmit(context) {
        preventOutsideUSShipping(context);
    }

    function afterSubmit(context) {
        processPODAutoCreation(context);
    }

    function loadCustomPrintButton(context) {
        try{
            const form = context.form;
            form.clientScriptModulePath = "/SuiteScripts/custom_rec_print_functions.cs.js";
            
            const contextRecord = context.newRecord;
            const createdFrom = contextRecord.getValue({
                fieldId: 'createdfrom'
            });
            const createdFromText = contextRecord.getText({
                fieldId: 'createdfrom'
            });
            if(createdFromText.indexOf('Vendor Return Authorization') >= 0) {
                const customPrintButton = form.addButton({
                    id : 'custpage_customPrintBtn',
                    label : 'Print VRMA',
                    functionName: `createPrintDocument(${createdFrom}, '${record.Type.VENDOR_RETURN_AUTHORIZATION}')`
                });
            }
        }catch(err){
            log.debug('loadCustomPrintButton err', err);
        }
    }

    function loadCustomPODPrintButton(context) {
        log.debug('Loading Custom POD Print Button...');

        try{
            const form = context.form;
            form.clientScriptModulePath = "/SuiteScripts/custom_rec_print_functions.cs.js";
            
            const contextRecord = context.newRecord;
            const ifId = contextRecord.getValue({
                fieldId: 'id'
            });
            const createdFromText = contextRecord.getText({
                fieldId: 'createdfrom'
            });
            const isShipped = contextRecord.getValue({
                fieldId: 'shipstatus'
            });
            if(createdFromText.indexOf('Sales Order') >= 0 && isShipped === 'C') { // 'C' is the value of a shipped Item Fulfillment
                const customPrintButton = form.addButton({
                    id : 'custpage_customPrintBtn',
                    label : 'Print POD',
                    functionName: `createPrintDocument(${ifId}, '${record.Type.ITEM_FULFILLMENT}', 'printPOD')`
                });
            }
        }catch(err){
            log.debug('loadCustomPODPrintButton err', err);
        }
    }

    function preventOutsideUSShipping(context) {
        log.debug('Loading Prevent Outside US Shipping...');
        const newRecord = context.newRecord;
        const eventType = context.type;
        const shipStatus = newRecord.getValue('shipstatus');

        if(eventType === context.UserEventType.SHIP || shipStatus === 'C') {
            log.debug('Record is being shipped');
            const shipCountry = newRecord.getValue('shipcountry');
            log.debug('shipCountry', shipCountry);
            if(!isShippingInUS(shipCountry) && !checkItemsForProperECCN(newRecord)) {
                throw 'The Item Fulfillment record you are marking to ship outside the US has an item without a proper ECCN value. Please update the item with the proper ECCN value or ship within the US';
            } else {
                log.debug('Record saving can continue', 'Either the Ship Country is in the US or all inventory items that are being shipped contain a ECCN value of EAR99');
            }
        }
    }

    function checkItemsForProperECCN(ifRec) {
        let eccn;
        let nonECCNFound = false;
        const lineCount = ifRec.getLineCount({
            sublistId: 'item'
        });

        for(let i = 0; i < lineCount; i++) {
            const itemId = ifRec.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            const itemType = ifRec.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemtype',
                line: i
            });
            if(itemType === 'InvtPart') {
                eccn = getECCNFromItemId(itemId);
                log.debug('ECCN on item is: ', eccn);
                if(eccn !== 'EAR99') {
                    nonECCNFound = true;
                }
            }
        }

        if(nonECCNFound) {
            log.debug('An item without the proper ECCN was found');
            return false;
        }
        log.debug('All inventory items that are being shipped on this Item Fullfilment record have the proper ECCN');
        return true;
    }

    function getECCNFromItemId(itemId) {
        const itemRec = record.load({
            type: record.Type.INVENTORY_ITEM,
            id: itemId,
            isDynamic: true
        });

        return itemRec.getValue('custitem_item_eccn');
    }

    function isShippingInUS(country) {
        return country === 'US' || country === '';
    }

    function processPODAutoCreation(context) {
        try {
            const contextRecord = context.newRecord;
            const oldContextRecord = context.oldRecord;
            const ifId = contextRecord.getValue({
                fieldId: 'id'
            });
            const createdFrom = contextRecord.getValue({
                fieldId: 'createdfrom'
            });
            log.debug('createdFrom', createdFrom);
            const recordType = record.Type.ITEM_FULFILLMENT;
            const action = 'createPOD';
            const eventType = context.type;
            if(eventType === context.UserEventType.CREATE || eventType === context.UserEventType.EDIT) {
                log.debug('processPODAutoCreation()', 'Is either created or edited...');
                
                var oldDeliveryStatus = ''
                if(eventType === context.UserEventType.EDIT) {
                    // Get Delivery Status Field
                    oldDeliveryStatus = oldContextRecord.getValue({
                        fieldId: 'custbody_wms_delivert_routing_status'
                    });
                }else{
                    oldDeliveryStatus = ''
                }

                log.debug('processPODAutoCreation() oldDeliveryStatus', oldDeliveryStatus);

                const newDeliveryStatus = contextRecord.getValue({
                    fieldId: 'custbody_wms_delivert_routing_status'
                });
                log.debug('processPODAutoCreation() newDeliveryStatus', newDeliveryStatus);
                // Get the Delivery Signature Field
                //const oldDeliverySignature = oldContextRecord.getValue({
                    //fieldId: 'custbody_wms_delivery_routing_signatur'
                //});
                //log.debug('processPODAutoCreation() oldDeliverySignature', oldDeliverySignature);
                const newDeliverySignature = contextRecord.getValue({
                    fieldId: 'custbody_wms_delivery_routing_signatur'
                });
                log.debug('processPODAutoCreation() newDeliverySignature', newDeliverySignature);
                // Check if both exists
                if((oldDeliveryStatus !== newDeliveryStatus) && (newDeliveryStatus == '4')) {
                    /*
                    // If they do, initiate the Auto POD Creation process
                    const autoPODUrl = url.resolveScript({
                        deploymentId: 'customdeploy_gex_custom_rec_print',
                        scriptId: 'customscript_gex_custom_rec_print',
                        params: {
                            recordId: ifId,
                            recordType: recordType,
                            action: action
                        },
                        returnExternalUrl: true
                    });
                    const response = https.get({
                        url: autoPODUrl
                    });
                    log.debug('processPODAutoCreation() response', response);
                    const responseBodyObj = JSON.parse(response.body);
                    log.debug('responseBodyObj', responseBodyObj);
                    if(responseBodyObj.hasOwnProperty('fileId') && responseBodyObj.fileId !== '') {
                        const fileId = responseBodyObj.fileId;
                        log.debug('fileId', fileId);
                        const createdComplianceFileId = createPODComplianceFile(fileId, createdFrom, ifId);
                        log.debug('createdComplanceFileId', createdComplianceFileId);
                    }
                    */
                }
            }
        } catch(ex) {
            log.error('Ex', ex);
        }
    }

    function createPODComplianceFile(fileId, soId, ifId) {
        const podComplianceFileRec = record.create({
            type: 'customrecord_compliancefile',
            isDynamic: true
        });

        podComplianceFileRec.setValue({
            fieldId: 'custrecord_compliancefile_document',
            value: fileId
        });

        podComplianceFileRec.setValue({
            fieldId: 'custrecord_compliancefile_so',
            value: soId
        });

        podComplianceFileRec.setValue({
            fieldId: 'custrecord_compliancefile_if',
            value: ifId
        });

        podComplianceFileRec.setValue({
            fieldId: 'custrecord_compliancefile_type',
            value: POD_COMPLIANCE_FILE_TYPE_ID
        });

        return podComplianceFileRec.save();
    }


    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
