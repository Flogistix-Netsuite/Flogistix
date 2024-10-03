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
				var howMany=rec.getLineCount({sublistId:'item'});
				for(var hm=0;hm<howMany;hm++)
				{
					var currentERD=rec.getSublistValue({sublistId:'item',fieldId:'expectedreceiptdate',line:hm});
					rec.setSublistValue({sublistId:'item',fieldId:'custcol_custom_erd',line:hm,value:currentERD});
				}
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