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
				var oldRec=context.oldRecord;
				var oldPhone=rec.getValue({fieldId:'phone'});
				var newPhone=oldRec.getValue({fieldId:'phone'});
				if(oldPhone!=newPhone)
				{
					rec.setValue({
						fieldId:'custentity_send_to_axil',
						value:true
					});
				}

				
			}
			function afterSubmit(context)
			{
				var rec1=context.newRecord;				
				var rec=record.load({type:'employee',id:rec1.id});
				//var sendToAxil=rec.getValue({fieldId:'custentity_send_to_axil'});
                var sendToAxil=true;
				if(sendToAxil)
				{
					var familyname=rec.getValue({fieldId:'lastname'});
                    var givenname=rec.getValue({fieldId:'firstname'});
                    var email=rec.getValue({fieldId:'email'});
                    var department=rec.getValue({fieldId:'department'})
                    var phone=rec.getValue({fieldId:'homephone'});
                  var mobilePhone=rec.getValue({fieldId:'mobilephone'});
                  var inactive=rec.getValue({fieldId:'isinactive'});
                  
                    var supervisor=rec.getValue({fieldId:'supervisor'});
                    var operatingAreaId=rec.getValue({fieldId:'class'});
                    var h2sCertified=rec.getValue({fieldId:'custentityh2s_certified'});
                  var h2sSpecialist=rec.getValue({fieldId:'custentity29'});
                  var fieldServiceMechanic=rec.getValue({fieldId:'custentity_fieldservice_mechanic'});
                  var fieldServiceAreaManager=rec.getValue({fieldId:'custentity25'});
					var payload={
			                    
								"source":"Netsuite.UserEvent",
								"eventType":"edit",
								"dataType":"employee",
								"script":"generic_integration.js",
								"time":new Date(),
								"data":{
									"identifiers":{
										"id":rec1.id.toString()
									},
									"changes":{
			                            familyname:familyname,
                                        phone:phone,
										
									},
									"attributes":{
                                      givenname:givenname,
                                      familyname:familyname,
                                      phone:phone,
                                      mobilePhone:mobilePhone,
                                      email:email,
                                      department:department,
                                      supervisorId:supervisor,
                                      operatingArea:operatingAreaId,
                                      fieldServiceMechanic:fieldServiceMechanic,
                                      fieldServiceAreaManager:fieldServiceAreaManager,
                                      h2sCertified:h2sCertified,
                                      h2sSpecialist:h2sSpecialist,
                                      active:!inactive
                  
                                      
                                    }
								}
								
							};
					var endpoint_url=null;
	
	if (runtime.envType== "SANDBOX") {
		endpoint_url="https://dev-netsuite-migrations.api.axil.ai/migrations";
		}
	if(runtime.envType== "PRODUCTION"){		
		endpoint_url="https://netsuite-migrations.api.axil.ai/migrations";	                    
	}
					//var endpoint_url="https://dev-netsuite-migrations.api.axil.ai/migrations";
                    sendBodyDataToEndpoint(endpoint_url,payload);
					//subRec.setValue({fieldId:'custrecord_send_to_axil',value:false})

				}
				
				
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