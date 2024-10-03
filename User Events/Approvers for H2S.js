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
				var currentH2S=rec.getValue({fieldId:'custrecord_h2s_current'});
				var newH2S=rec.getValue({fieldId:'custrecord_h2s_reading'});
				var currentTier=rec.getValue({fieldId:'custrecord_h2s_tiers'});
				var newTier=null;

				var 
				if(newH2S<100)//tier 1
				{
					newTier=1;
				}
				else if(newH2S>=100 && newH2S<501)//tier 2
				{
					newTier=2
				}
				else//tier 3
				{
					newTier=3;
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