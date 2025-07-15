/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email','N/https'],
		function(record,search,email,https) {
			function beforeLoad(context) 
			{
				var rec=context.newRecord;
			}
			function beforeSubmit(context) 
			{
				var rec=context.newRecord;
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				var eventType='resync.create';
				if(context.type==context.UserEventType.EDIT)
					eventType='resync.edit';

				   var id=rec.getValue({fieldId:'name'});
                    var name=rec.getValue({fieldId:'altname'});
                    var locationId=rec.getValue({fieldId:'custrecord_current_location'});
                    var customerId=rec.getValue({fieldId:'custrecord_current_customer'});
                    var toStatus=rec.getValue({fieldId:'custrecord_ae_at_to_status'});                   
                    var operatingAreaId=rec.getValue({fieldId:'custrecord_assetclass'});
                    var mechanicId=rec.getValue({fieldId:'custrecord_fieldservice_mechanic'});
                    var assetType=rec.getValue({fieldId:'custrecord_assettype'});
                    var netsuiteId=rec.getValue({fieldId:'internalid'});
                    var assetSerialNumber=rec.getValue({fieldId:'custrecord_assetserialno'});
                    var skidId=rec.getValue({fieldId:'custrecord_custasset_skid'});
                    var unitModelAttributes=null;
                    try {
                      unitModelAttributes=rec.getText({fieldId:'custrecordae_at_rental_unit_model_attr'});
                    } catch (error) {
                      unitModelAttributes=null;
                    }
                    //var 
              
					var payload={
			                    
							"source":"Netsuite.UserEvent",
							"eventType":eventType,
							"dataType":"fam_asset_unit",
							"time":new Date(),
							"data":{
								"identifiers":{"internalid":rec.id.toString()},
								"changes":{		
                                  /*
									id:id,
									name:name,
									locationId:locationId,
									customerId:customerId,
									toStatus:toStatus,
									operatingAreaId:operatingAreaId,
									mechanicId:mechanicId,
									assetType:assetType,
									netsuiteId:netsuiteId,
									assetSerialNumber:assetSerialNumber,
                                    skidId:skidId
                                    */
								},
								"attributes":{
									entity:rec.id,
                                    id:id,
									name:name,
									locationId:locationId,
									customerId:customerId,
									toStatus:toStatus,
									operatingAreaId:operatingAreaId,
									mechanicId:mechanicId,
									assetType:assetType,
									netsuiteId:netsuiteId,
									assetSerialNumber:assetSerialNumber,
                                    skidId:skidId,
                                    unitModelAttributes:unitModelAttributes
                                             },
                                
							}							
						};

				var endpoint_url=null;
	
	if (runtime.envType== "SANDBOX") {
		endpoint_url="https://dev-netsuite-migrations.api.axil.ai/migrations";
		}
	if(runtime.envType== "PRODUCTION"){		
		endpoint_url="https://netsuite-migrations.api.axil.ai/migrations";	                    
	}
				sendBodyDataToEndpoint(endpoint_url,payload);
				
			}

		function sendBodyDataToEndpoint(endpoint, bodyData) 
		{
	        authToken = getApiKey();

	        headers = ({
	            'Authorization': "Bearer " + authToken,
	            'Content-Type':'application/json'
	        });

	        response = https.post({
	            url: endpoint,
	           // body:bodyData,
	            body: JSON.stringify(bodyData),
	            headers: headers
	        });

	        if (response.code != 202) 
	        {
	            info = "Did not get a 202 from the EventBridge API. Code: " + response.code + "\nbody: " + JSON.stringify(response.body);

	            email.send({
	                author: -5,
	                recipients: 'rodneyveach123@gmail.com',
	                subject: 'Netsuite Integration API Error',
	                body: info
	            });
	           // logger("API error!!", info);
	        }
    	}

    	function getApiKey() 
	    {
	    	var auth_url = "https://axil.auth0.com/oauth/token";
	    	var client_id = "ncrPXMYoe27tKaTVXkapxlvX1n7SU1pu";
	    	var client_secret = "GbZcCfjILtDrq9zqg4xmAfjY0hTrxnWv7r1BD3SzUeuEMFHajqJoTC_rmoJIFDJS";
	    	//var audience = "https://dev-api.axil.ai"
	    	var audience = "https://api.axil.ai";
	        var response = https.post({
	            url: auth_url,
	            headers: {'content-type': 'application/json'},
	            body: JSON.stringify({"client_id":client_id,"client_secret":client_secret,"audience":audience,"grant_type":"client_credentials"})
	        });

	        if (response.code != 200) 
	        {
	            info = "Did not get a 200 from the Auth API. Code: " + response.code + "\nbody: " + JSON.stringify(response.body);

	            email.send({
	                author: -5,
	                recipients: 'rveach@flogistix.com',
	                subject: 'Netsuite Integration Auth API Error',
	                body: info
	            });

	            //logger("API error!!", info)

	            return "";
	        }

	        return JSON.parse(response.body)['access_token'];
    	}

			
			return {
		//	beforeLoad: beforeLoad,
		//	beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});