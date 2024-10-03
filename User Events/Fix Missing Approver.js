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
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				var whatStatus=rec.getValue({fieldId:'approvalstatus'})
				var whatApprover=rec.getValue({fieldId:'nextapprover'});
				if(whatStatus==1 && !whatApprover)
				{
					var thisEmployee=rec.getValue({fieldId:'employee'});
					var eRec=record.load({type:'employee',id:thisEmployee});
					var newApprover=eRec.getValue({fieldId:'purchaseorderapprover'});
					rec.setValue({fieldId:'nextapprover',value:newApprover});
				}
			}

			
			return {
			//beforeLoad: beforeLoad,
			//beforeSubmit: beforeSubmit,
			afterSubmit: beforeSubmit
			};
});