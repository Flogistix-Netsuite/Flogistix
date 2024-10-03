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
				var rec1=currentRecord.get();
				var thisField=rec1.fieldId;
				
				if(context.fieldId=='custpage_asset')
				{
					var thisAssetId=rec1.getValue('custpage_asset');
					var assetFields=search.lookupFields({
						type:'customrecord_ncfar_asset',
						id:thisAssetId,
						columns:['custrecord_current_county','custrecord_current_state','custrecord_current_customer','custrecord_current_location']
						
					})
					var thisSite=null;
					var thisCompany=null;
					var thisCounty=null;
					var thisState=null;
					try
					{
						thisCompany=assetFields.custrecord_current_customer[0].value;
					}
					catch(err)
					{

					}
					try
					{
						thisSite=assetFields.custrecord_current_location[0].value;					
					}
					catch(err)
					{

					}
					try
					{
						thisCounty=assetFields.custrecord_current_county;					
					}
					catch(err)
					{

					}
					try
					{
						thisState=assetFields.custrecord_current_state[0].value;
					}
					catch(err)
					{

					}
					
					var cusRec=record.load({type:'customer',id:thisCompany});
					var howMany=cusRec.getLineCount({sublistId:'addressbook'});

					/*
					for(var h=0;h<howMany;h++)
					{

					
					var oldAddress=rec1.getField({fieldId:'custpage_lease'});
					oldAddress.insertSelectOption({
						value:cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h}),
						text:cusRec.getSublistValue({sublistId:'addressbook',fieldId:'label',line:h}),
					});
					}
					*/
					if(thisCompany)
						rec1.setValue({fieldId:'custpage_company',value:thisCompany,ignoreFieldChange:true});
					/*if(thisSite)
						rec1.setValue({fieldId:'custpage_lease',value:thisSite,ignoreFieldChange:true});*/
					if(thisCounty)
						rec1.setValue({fieldId:'custpage_county',value:thisCounty,ignoreFieldChange:true});
					if(thisState)
						rec1.setValue({fieldId:'custpage_state',value:thisState,ignoreFieldChange:true});

					
				}

			}
			catch(err)
			{
				log.debug({title:'err',details:err});
			}
		}
		
		
		function validateLine(context)
		{

		}
		return {
		
			fieldChanged:fieldChanged,
		
		};
});