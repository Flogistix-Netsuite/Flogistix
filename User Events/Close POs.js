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
				var closeYay=rec.getValue({fieldId:'custbody_po_close'});
				if(!closeYay)
					return true;
				var howMany=rec.getLineCount({sublistId:'item'});
				var lines=[];
				for(var hm=0;hm<howMany;hm++)
				{
					rec.setSublistValue({sublistId:'item',fieldId:'isclosed',line:hm,value:true});
					//rec.commitLine({sublistId:'item'});
					//if(isClosed)
					//	lines.push(hm+1);
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