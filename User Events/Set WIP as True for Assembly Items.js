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
				//set each location to be WIP
				var howMany=rec.getLineCount({sublistId:'location'});
					for(var hm=0;hm<howMany;hm++)
					{
						var whatLocation=rec.getSublistValue({sublistId:'location',fieldId:'location',line:hm});
						if(whatLocation==352 || whatLocation==337 || whatLocation==660)
						{
							rec.setSublistValue({sublistId:'location',fieldId:'iswip',value:true,line:hm});
							
						}
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