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
				var thisLat=0;
				var thisLon=0;
				var addressLabel=rec.getValue({fieldId:'shipaddresslist'});
				var thisCustomer=rec.getValue({fieldId:'entity'});
                var cusRec=record.load({type:'customer',id:thisCustomer});
                var howMany=cusRec.getLineCount({sublistId:'addressbook'});

            	for(var hm=0;hm<howMany;hm++)
            	{
            		var whatLabel=cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:hm});
            		if(whatLabel==addressLabel)
            		{
            			//rec.selectLine({sublistId:'addressbook',line:hm});
            			var subRec=cusRec.getSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress',line:hm});
            			var thisLat1=subRec.getValue({fieldId:'custrecord_lat'});
            			if(thisLat1)
            				thisLat=thisLat1;
            			var thisLon1=subRec.getValue({fieldId:'custrecord_lon'});
            			if(thisLon1)
            				thisLon=thisLon1;

            			//break;

            		}
            	}
            	rec.setValue({fieldId:'custbody_to_lat',value:thisLat});
				rec.setValue({fieldId:'custbody_to_long',value:thisLon});
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				
			}

			
			return {
		//	beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
		//	afterSubmit: afterSubmit
			};
});