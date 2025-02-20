/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log','N/https','N/email'],
	function(record,search,currentRecord,log,https,email){

		function fieldChanged(context){
			
		}
      	function deleteLine(context)
		{
			var rec=context.currentRecord;

			var sublistName=context.sublistId;
			var thisField=context.fieldId;
				if(sublistName=='addressbook')
				{
					 var whatLabel=rec.getCurrentSublistValue({sublistId:'addressbook',fieldId:'label'});
                  var whatId=rec.getCurrentSublistValue({sublistId:'addressbook',fieldId:'internalid'});
				var subRec=rec.getCurrentSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress'});
              
               // var srId=subRec.id;
				var addressee=subRec.getValue({fieldId:'addressee'});
				var phone=subRec.getValue({fieldId:'addrphone'});
				var address1=subRec.getValue({fieldId:'addr1'});
				var address2=subRec.getValue({fieldId:'addr2'});
				var county=subRec.getValue({fieldId:'addr3'});
				var city=subRec.getValue({fieldId:'city'});
				var state=subRec.getText({fieldId:'state'});
				var zip=subRec.getValue({fieldId:'zip'});
				var h2s=subRec.getValue({fieldId:'custrecord20'});
				var payload={
                    
					"source":"Netsuite.UserEvent",
					"eventType":"resync.delete",
					"dataType":"customeraddressbook",
					"time":new Date(),
					"data":{
						"identifiers":{"internalid":whatId.toString()},
						"changes":{
                            label:whatLabel,
							addressee:addressee,
							phone:phone,
							address1:address1,
							address2:address2,
							county:county,
							city:city,
							state:state,
							zip:zip,
							h2s:h2s
						},
						"attributes":{"entity":rec.id}
					}
					
					};
                  var endpoint_url="https://netsuite-migrations.api.axil.ai/migrations";

				sendBodyDataToEndpoint(endpoint_url,payload);
				var ddfd='dd';
				}
          return true;
		}
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{
			var rec=context.currentRecord;

			var sublistName=context.sublistId;
			var thisField=context.fieldId;
			if(sublistName=='addressbook')
			{
				
				var whatId=rec.getCurrentSublistValue({sublistId:'addressbook',fieldId:'internalid'});
				if(!whatId)
				{
					var subRec=rec.getCurrentSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress'});
					subRec.setValue({fieldId:'custrecord_send_to_axil',value:true});
					//subRec.save();
					return true;
				}
                var whatLabel=rec.getCurrentSublistValue({sublistId:'addressbook',fieldId:'label'});
				var subRec=rec.getCurrentSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress'});
              
               // var srId=subRec.id;
				var addressee=subRec.getValue({fieldId:'addressee'});
				var phone=subRec.getValue({fieldId:'addrphone'});
				var address1=subRec.getValue({fieldId:'addr1'});
				var address2=subRec.getValue({fieldId:'addr2'});
				var county=subRec.getValue({fieldId:'addr3'});
				var city=subRec.getValue({fieldId:'city'});
				var state=subRec.getText({fieldId:'state'});
				var zip=subRec.getValue({fieldId:'zip'});
				var h2s=subRec.getValue({fieldId:'custrecord20'});
                var lat=subRec.getValue({fieldId:'custrecord_latitude'});
                var lon=subRec.getValue({fieldId:'custrecord_longitude'});
				var payload={
                    
					"source":"Netsuite.UserEvent",
					"eventType":"resync.edit",
					"dataType":"customeraddressbook",
					"time":new Date(),
					"data":{
						"identifiers":{"internalid":whatId.toString()},
						"changes":{
                            label:whatLabel,
							addressee:addressee,
							phone:phone,
							address1:address1,
							address2:address2,
							county:county,
							city:city,
							state:state,
							zip:zip,
							h2s:h2s,
                            latitude:lat,
                            longitude:lon
						},
						"attributes":{"entity":rec.id}
					}
					
				};

				//var lat
				//var long
				var endpoint_url="https://netsuite-migrations.api.axil.ai/migrations";

				sendBodyDataToEndpoint(endpoint_url,payload);
				var ddfd='dd';


			}
			return true;

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
			updateSuitelet:updateSuitelet,
			fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			validateLine:validateLine,
            validateDelete:deleteLine
		//	saveRecord: saveRec
		};
});