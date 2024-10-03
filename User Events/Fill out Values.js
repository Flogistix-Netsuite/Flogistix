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

				var whatForm=rec.getValue({fieldId:'customform'});
				if(whatForm!=215)
					return;
				var runningTotal=0;
				var howMany=rec.getLineCount({sublistId:'item'});
					for(var hm=0;hm<howMany;hm++)
					{

						var isShipped=rec.getSublistValue({sublistId:'item',fieldId:'itemreceive',line:hm});
						if(!isShipped)
							continue;
						//rec.selectLine({sublistId:'item',line:hm});
						var whatQuantity=rec.getSublistValue({sublistId:'item',fieldId:'quantity',line:hm});
						var whatRate=rec.getSublistValue({sublistId:'item',fieldId:'custcol_to_cost',line:hm});
						var newRate=Number(whatRate)*Number(whatQuantity);
						runningTotal=runningTotal+newRate;
						rec.setSublistValue({sublistId:'item',fieldId:'custcol_to_ext_cost',value:newRate,line:hm});
						//rec.commitLine({sublistId:'item'});
					}
					rec.setValue({fieldId:'custbody_total_shipped',value:runningTotal});
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