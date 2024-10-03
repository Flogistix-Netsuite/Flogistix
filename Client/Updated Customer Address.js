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
			var currentRecord=context.currentRecord;
			var sublistName=context.sublistId;
			if(sublistName=='addressbook')
			{
				var whatId=currentRecord.getCurrentSublistValue({sublistId:'addressbook',fieldId:'id'});
                var whatLabel=currentRecord.getCurrentSublistValue({sublistId:'addressbook',fieldId:'label'});
                if(!whatLabel)
                {
                  alert('You must enter a Label for the Address');
                  return false;
                }
				currentRecord.setValue({fieldId:'custentity_nickname',value:whatId});
			}
			return true;
		}
		return {
			updateSuitelet:updateSuitelet,
			fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			validateLine:validateLine,
		//	saveRecord: saveRec
		};
});