/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email'],
		function(record,search,email) {
			function beforeLoad(context) 
			{
				try
				{


					var rec=context.newRecord;
					var vRecId=rec.getValue({fieldId:'entity'});
					var vRec=record.load({type:'vendor',id:vRecId});

					var howMany=vRec.getLineCount({sublistId:'addressbook'});
					var defaultFound=false;
					var splitAddress=null;
					for(var hm=0;hm<howMany;hm++)
					{
						var isDefault=vRec.getSublistValue({sublistId:'addressbook',fieldId:'defaultbilling',line:hm});
						if(isDefault)
						{
							defaultFound=vRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:hm});
							splitAddress=vRec.getSublistValue({sublistId:'addressbook',fieldId:'addressbookaddress_text',line:hm});
						}
					}
					if(!defaultFound)
						return;
					rec.setValue({fieldId:'billaddresslist',value:defaultFound});
					/*rec.setValue({
						fieldId:'address',
						value:splitAddress
					});*/
				}
				catch(err)
				{
					log.debug({title:'error',details:err.message})
					return;
				}

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
			beforeSubmit: beforeLoad,
			//afterSubmit: afterSubmit
			};
});