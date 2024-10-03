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
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				var whatId=rec.id;
				var newValue=rec.getValue({fieldId:'estimatedtotalvalue'});
				var famId=null;
				var customrecord_ncfar_expenseincomeSearchObj = search.create({
				   type: "customrecord_ncfar_expenseincome",
				   filters:
				   [
				      ["custrecord_far_expinc_transaction.internalid","anyof",whatId]
				   ],
				   columns:
				   [
				      search.createColumn({name: "internalid", label: "Internal ID"})
				   ]
				});
				var searchResultCount = customrecord_ncfar_expenseincomeSearchObj.runPaged().count;
				log.debug("customrecord_ncfar_expenseincomeSearchObj result count",searchResultCount);
				customrecord_ncfar_expenseincomeSearchObj.run().each(function(result){
					famId=result.getValue({name:'internalid'});
				   // .run().each has a limit of 4,000 results
				   return false;
				});
				var famRec=record.load({type:'customrecord_ncfar_expenseincome',id:famId});
				famRec.setValue({fieldId:'custrecord_far_expinc_amount',value:newValue});
				famRec.save();

				/*
				customrecord_ncfar_expenseincomeSearchObj.id="customsearch1702939998000";
				customrecord_ncfar_expenseincomeSearchObj.title="Custom FAM Expense/Income Search (copy)";
				var newSearchId = customrecord_ncfar_expenseincomeSearchObj.save();
				*/

				
			}

			
			return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});