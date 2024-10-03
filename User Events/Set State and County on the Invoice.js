/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email'],
		function(record,search,email) {
			function beforeLoad(context) 
			{
				var rec=context.newRecord;
			}
			function beforeSubmit(context) 
			{
				var rec=context.newRecord;
				//pull the information from the account and then populate
				var thisAsset=rec.getValue({fieldId:'custbody_rental_unit_skid_number'});
				if(!thisAsset)
					return true;
				var cState=null;
				var cCounty=null;

				var customrecord_ncfar_assetSearchObj = search.create({
				   type: "customrecord_ncfar_asset",
				   filters:
				   [
				      ["name","is",thisAsset]
				   ],
				   columns:
				   [
				      search.createColumn({name: "custrecord_current_county", label: "Current County"}),
				      search.createColumn({name: "custrecord_current_state", label: "Current State"})
				   ]
				});
				var searchResultCount = customrecord_ncfar_assetSearchObj.runPaged().count;
				log.debug("customrecord_ncfar_assetSearchObj result count",searchResultCount);
				customrecord_ncfar_assetSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
					cState=result.getValue({name:'custrecord_current_state'});
					cCounty=result.getValue({name:'custrecord_current_county'});
				   return true;
				});
				var deleteThis=false;
				if(!cState || cState.length<2)
					deleteThis=true;
				if(!cCounty || cCounty.length<2)
					deleteThis=true;

				var howMany=rec.getLineCount({sublistId:'item'});
					for(var hm=0;hm<howMany;hm++)
					{
						rec.setSublistValue({sublistId:'item',fieldId:'custcol_asset_state',line:hm,value:cState});
						rec.setSublistValue({sublistId:'item',fieldId:'custcol_fam_county',line:hm,value:cCounty});
					}
				if(deleteThis)
					rec.setValue({fieldId:'custbody_delete_nulls',value:deleteThis});

				
				
				//any nulls, check delete this
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				//pull up the system and check if it is missing
				var deleteMe=rec.getValue({fieldId:'custbody_delete_nulls'});
				if(deleteMe)
				{
					var thisAsset=rec.getValue({fieldId:'custbody_rental_unit_skid_number'});
				
					email.send({
						author:-5,
						recipient:'accountsreceivable@flogistix.com',
						body:'Invoice cannot be saved due to missing County or State on Asset '+thisAsset,
						subject:'Invoice cannot be saved due to missing County or State on Asset '+thisAsset,
					});
					record.delete({
						type:'invoice',
						id:rec.id
					});
				}
				//if so, then, email the human and say this is broken
				
			}

			
			return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});