/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log'],
	function(record,search,currentRecord,log){
		
		function fieldChanged(context){
			
		}
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{

		}
		function saveRecord(context)
		{
			try
				{


					var rec=context.currentRecord;
					var vRecId=rec.getValue({fieldId:'entity'});
					
					var vRec=record.load({type:'vendor',id:vRecId});

					var howMany=vRec.getLineCount({sublistId:'addressbook'});
					var isCheck=vRec.getValue({fieldId:'custentity_jpmc_ven_pm'});
					if(isCheck!=2)
						return true;

					var defaultFound=null;
					var splitAddress=null;
					var isDefault=false;
					for(var hm=0;hm<howMany;hm++)
					{
						isDefault=vRec.getSublistValue({sublistId:'addressbook',fieldId:'defaultbilling',line:hm});
						if(isDefault)
						{
							defaultFound=vRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:hm});
							splitAddress=vRec.getSublistValue({sublistId:'addressbook',fieldId:'addressbookaddress_text',line:hm});
						}
					}
					if(!defaultFound)
						{
							alert('Vendor Record is missing a default billing address. \nPlease add to vendor record and try to save again.\nWill not be able to save until this happens.')
							return false;
						}
					rec.setValue({fieldId:'billaddresslist',value:defaultFound});
					/*
					rec.setValue({
						fieldId:'billaddress',
						value:splitAddress,
						ignoreFieldChange:true
					});
					*/
					return true;
				}
				catch(err)
				{
					log.debug({title:'error',details:err.message})
					return true;
				}
		}
		return {
			updateSuitelet:updateSuitelet,
			fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			//validateLine:validateLine,
			saveRecord: saveRecord
		};
});


	