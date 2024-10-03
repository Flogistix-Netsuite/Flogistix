/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log'],
	function(record,search,currentRecord,log){
		
		function fieldChanged(context){
			try
			{
				var rec=context.currentRecord;
				var thisField=context.fieldId;
				var thisLat=0;
				var thisLon=0;
				if(thisField!='custbody_rental_unit_customer_location')
					return true;
				//now we search for the address value and go from there
				var addressLabel=rec.getValue({fieldId:'custbody_rental_unit_location_dropdown'});
				var thisCustomer=rec.getValue({fieldId:'custbody_rental_unit_customer'});
                var cusRec=record.load({type:'customer',id:thisCustomer});
                var howMany=cusRec.getLineCount({sublistId:'addressbook'});

            	for(var hm=0;hm<howMany;hm++)
            	{
            		var whatLabel=cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:hm});
            		if(whatLabel==addressLabel)
            		{
            			//rec.selectLine({sublistId:'addressbook',line:hm});
            			var subRec=cusRec.getSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress',line:hm});
            			var thisLat1=subRec.getValue({fieldId:'custrecord_lat'});
            			if(thisLat1)
            				thisLat=thisLat1;
            			var thisLon1=subRec.getValue({fieldId:'custrecord_lon'});
            			if(thisLon1)
            				thisLon=thisLon1;
            			//break;

            		}
            	}
               

				//now, we pop in the system the values we found
				

				rec.setValue({fieldId:'custbody_to_lat',value:thisLat});
				rec.setValue({fieldId:'custbody_to_long',value:thisLon});
				return true;

				
			}
			catch(err)
			{
				log.debug({title:'err',details:err});
				return true;
			}
			


			
		}
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{

		}
		function saveRec(context)
		{
				var rec=context.currentRecord;
				var addressLabel=rec.getValue({fieldId:'custbody_rental_unit_customer_location'});
				var thisCustomer=rec.getValue({fieldId:'custbody_rental_unit_customer'});
				var thisLon=rec.getValue({fieldId:'custbody_to_long'});
				var thisLat=rec.getValue({fieldId:'custbody_to_lat'});
				var addressId=null;
				var customerRec=record.load({type:'customer',id:thisCustomer, isDynamic:true});
				var howMany=customerRec.getLineCount({sublistId:'addressbook'});
					for(var hm=0;hm<howMany;hm++)
					{
						customerRec.selectLine({sublistId:'addressbook',line:hm});
						var whatLabel=customerRec.getCurrentSublistValue({sublistId:'addressbook',fieldId:'label'});
						if(whatLabel==addressLabel)
						{

							var subRec=customerRec.getCurrentSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress'});
							subRec.setValue({fieldId:'custrecord_lon',value:thisLon});
							subRec.setValue({fieldId:'custrecord_lat',value:thisLat});
							//subRec.save()
							customerRec.commitLine({sublistId:'addressbook'});
							customerRec.save();
							break;
						}
					}
					/*
				var customerSearchObj = search.create({
				   type: "customer",
				   filters:
				   [
				      ["addresslabel","is",addressLabel], 
				      "AND", 
				      ["internalid","is",thisCustomer]
				   ],
				   columns:
				   [
				      search.createColumn({
				         name: "internalid",
				        
				      })
				   ]
				});
				var searchResultCount = customerSearchObj.runPaged().count;
				log.debug("customerSearchObj result count",searchResultCount);
				customerSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
					addressId=result.getValue({name:'internalid'});
				   return true;
				});
				record.submitFields({
					type:'addressbook',
					id:addressId,
					values:{
						custrecord_lon:thisLon,
						custrecord_lat:thisLat
					}
				})*/
				//var addRec=record.load({type:'address',id:addressId});
				//addRec.setValue({fieldId:'',value:});



			return true;
		}
		return {
			updateSuitelet:updateSuitelet,
			fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			//validateLine:validateLine,
			saveRecord: saveRec
		};
});