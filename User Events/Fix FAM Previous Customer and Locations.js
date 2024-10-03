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
				var oRec=context.oldRecord;
				var oLocation=oRec.getValue({fieldId:'custrecord_current_location'});
				var oCustomer=oRec.getValue({fieldId:'custrecord_current_customer'});
				var nLocation=rec.getValue({fieldId:'custrecord_current_location'});
				var nCustomer=rec.getValue({fieldId:'custrecord_current_customer'});
				if(oLocation!=nLocation)
					rec.setValue({fieldId:'custrecord_fam_previous_location',value:oLocation});
				if(oCustomer!=nCustomer)
					rec.setValue({fieldId:'custrecord_fam_previous_customer',value:oCustomer});
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				
			}

			
			return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});