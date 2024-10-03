/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email','N/format'],
		function(record,search,email,format) {
			function beforeLoad(context) 
			{
				var rec=context.newRecord;
			}
			function beforeSubmit(context) 
			{
				try
				{
					var rec=context.newRecord;
					var howMany=rec.getLineCount({sublistId:'item'});
					for(var hm=0;hm<howMany;hm++)
					{
						var currentERD=rec.getSublistValue({sublistId:'item',fieldId:'expectedreceiptdate',line:hm});
						rec.setSublistValue({sublistId:'item',fieldId:'custcol_po_receipt_date',value:format.focurrentERD,line:hm});
					}
				}
				catch(err)
				{

				}
				
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				
			}

			
			return {
			//beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			//afterSubmit: afterSubmit
			};
});