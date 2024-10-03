/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email'],
		function(record,search,email) {
			function beforeLoad(context) 
			{
				var rec=context.newRecord;
				var thisVendor=rec.getValue({fieldId:'entity'});
				var venRec=record.load({type:'vendor',id:thisVendor});
				var venTerms=venRec.getValue({fieldId:'terms'});
				var currentTerms=rec.getValue({fieldId:'terms'});
				if(venTerms==currentTerms)
					return;
				rec.setValue({fieldId:'terms',value:venTerms});
				
				var termRec=record.load({type:'term',id:venTerms});
				var daysInFuture=termRec.getValue({fieldId:'daysuntilnetdue'});

				var billDate=rec.getValue({fieldId:'trandate'});
				var newDueDate=new Date(billDate.setDate(billDate.getDate()+daysInFuture));

				rec.setValue({fieldId:'duedate',value:newDueDate});
				

			}
			function beforeSubmit(context) 
			{
				var rec=context.newRecord;
				var thisVendor=rec.getValue({fieldId:'entity'});
				var venRec=record.load({type:'vendor',id:thisVendor});
				var venTerms=venRec.getValue({fieldId:'terms'});
				var currentTerms=rec.getValue({fieldId:'terms'});
				if(venTerms==currentTerms)
					return;
				rec.setValue({fieldId:'terms',value:venTerms});
				
				var termRec=record.load({type:'term',id:venTerms});
				var daysInFuture=termRec.getValue({fieldId:'daysuntilnetdue'});

				var billDate=rec.getValue({fieldId:'trandate'});
				var newDueDate=new Date(billDate.setDate(billDate.getDate()+daysInFuture));

				rec.setValue({fieldId:'duedate',value:newDueDate});
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				
			}

			
			return {
			//beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
		//	afterSubmit: afterSubmit
			};
});