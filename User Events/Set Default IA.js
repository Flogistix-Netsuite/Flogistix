/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email','N/runtime'],
		function(record,search,email,runtime) {
			function beforeLoad(context) 
			{
				var rec=context.newRecord;
				var whatForm=rec.getValue({fieldId:'customform'})
				if(customForm!=212)
					return;
				rec.setValue({fieldId:'subsidiary',value:4});
				var user=runtime.getCurrentUser();
				var whatDept=user.department;
				rec.setValue({fieldId:'department',value:whatDept}); 
				rec.setValue({fieldId:'account',value:503});

			}
			function beforeSubmit(context) 
			{
				var rec=context.newRecord;
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