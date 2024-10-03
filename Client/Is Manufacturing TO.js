/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log','N/runtime','N/redirect'],
	function(record,search,currentRecord,log,runtime,redirect){
		
		function fieldChanged(context){
			
		}
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{

		}
		function pageInit(context)
		{
			var rec=context.currentRecord;
			var user=runtime.getCurrentUser();
			//rec.setValue({fieldId:'subsidiary',value:4});
			var whatForm=rec.getValue({fieldId:'customform'});
			if(whatForm==212)
				return true;
			var whatDept=user.department;
			if(whatDept!=10 && whatDept!=11)
				return true;
			var yesNo=confirm('Is this for a Manufacturer Adjustment?','Manu Adjustment?');
			if(yesNo)
			{
				rec.setValue({fieldId:'customform',value:212});
				
				rec.setValue({fieldId:'department',value:whatDept});
				rec.setValue({fieldId:'account',value:503});
				
			}
		}
		return {
			updateSuitelet:updateSuitelet,
			fieldChanged:fieldChanged,
			pageInit:pageInit,
		//	postSourcing:validateField,
			//validateLine:validateLine,
		//	saveRecord: saveRec
		};
});