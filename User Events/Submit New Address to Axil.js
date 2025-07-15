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
              try {
                
              
				var rec=context.newRecord;
				var maxId=null;
				var customerSearchObj = search.create({
				   type: "customer",
				   filters:
				   [
				      ["internalidnumber","equalto",rec.id], 
				      
				   ],
				   columns:
				   [
				     
				       search.createColumn({
				         name: "addressinternalid",
				         join: "Address",
				         summary: "MAX",
				         label: "Address Internal ID",
				         sort:search.Sort.DESC
				      })
				   ]
				});
				var searchResultCount = customerSearchObj.runPaged().count;
				log.debug("customerSearchObj result count",searchResultCount);
				customerSearchObj.run().each(function(result){
					maxId=result.getValue({name:'addressinternalid',join:'address',summary:'max'});
				   // .run().each has a limit of 4,000 results
				   return true;
				});
				rec.setValue({fieldId:'custentity_current_max_id',value:maxId});
                } catch (error) {
                
              }
			}
			function afterSubmit(context)
			{
              try {
                
              
				var rec1=context.newRecord;
                
				
				var rec=record.load({type:'customer',id:rec1.id});
                var parent=null;
                try {
                 parent=rec.getValue({fieldId:'parent'})
                } catch (error) {
                  parent=null;
                }
                var typeCreation=null;
				if(context.type==context.UserEventType.CREATE)
					{
						typeCreation='create';
						var payload={
			                    
								"source":"Netsuite.UserEvent",
								"eventType":"resync.create",
								"dataType":"customer",
								"time":new Date(),
								"data":{
									"identifiers":{"internalid":rec1.id.toString()},
									"changes":{
			                           
										parent:parent,
										companyname:rec.getValue({fieldId:'altname'})
									},
									"attributes":{"entity":rec.id}
								}
								
							};

							var endpoint_url="https://netsuite-migrations.api.axil.ai/migrations";

							
					}
				else if(context.type==context.UserEventType.EDIT)
				{
					typeCreation='edit';
					var payload={
			                    
								"source":"Netsuite.UserEvent",
								"eventType":"resync.create",
								"dataType":"customer",
								"time":new Date(),
								"data":{
									"identifiers":{"internalid":rec1.id.toString()},
									"changes":{

                                      
										parent:parent,
										companyname:rec.getValue({fieldId:'altname'})
									},
									"attributes":{"entity":rec.id}
								}
								
							};
                  var endpoint_url=null;
	
	if (runtime.envType== "SANDBOX") {
		endpoint_url="https://dev-netsuite-migrations.api.axil.ai/migrations";
		}
	if(runtime.envType== "PRODUCTION"){		
		endpoint_url="https://netsuite-migrations.api.axil.ai/migrations";	                    
	}

                }

                sendBodyDataToEndpoint(endpoint_url,payload);
                log.debug({title:'sent',details:'sent first payload'});
				var maxId=rec.getValue({fieldId:'custentity_current_max_id'});
				
					//var findMe=sendIds[s];
					var howMany=rec.getLineCount({sublistId:'addressbook'});
					for(var hm=0;hm<howMany;hm++)
					{
						var whatId=rec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:hm});
                      log.debug({title:'whatId',details:whatId});
                      log.debug({title:'maxId',details:maxId});
						if(whatId>=maxId)
						{
							var whatLabel=rec.getSublistValue({sublistId:'addressbook',fieldId:'label',line:hm});
							var subRec=rec.getSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress',line:hm});
			              
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
								"eventType":"resync.create",
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

							var endpoint_url="https://netsuite-migrations.api.axil.ai/migrations";

							sendBodyDataToEndpoint(endpoint_url,payload);
							//subRec.setValue({fieldId:'custrecord_send_to_axil',value:false})
						}
					}
				
				
			

              } catch (error) {
                log.debug({title:'error',details:error});
                log.error({title:'error',details:error});
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
/*
	            email.send({
	                author: -5,
	                recipients: 'rodneyveach123@gmail.com',
	                subject: 'Netsuite Integration API Error',
	                body: info
	            });
                */
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
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});