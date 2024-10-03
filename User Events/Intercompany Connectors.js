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
				var thisID=null;
				var whatConnector=rec.getValue({fieldId:'tranid'});
				var vendorbillSearchObj = search.create({
				   type: "invoice",
				   filters:
				   [
				      ["type","anyof","CustInvc"], 
				      "AND", 
				      ["numbertext","is",whatConnector], 
				      "AND", 
				      ["mainline","is","T"]
				   ],
				   columns:
				   [
				      search.createColumn({name: "internalid", label: "Internal ID"})
				   ]
				});
				var searchResultCount = vendorbillSearchObj.runPaged().count;
				log.debug("vendorbillSearchObj result count",searchResultCount);
				vendorbillSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
					thisID=result.getValue({name:'internalid'});
				   return true;
				});
				if(thisID)
					record.submitFields({type:'invoice',id:rec.id,values:{'intercotransaction':thisID}})

				/*
				vendorbillSearchObj.id="customsearch1721748156951";
				vendorbillSearchObj.title="Custom Transaction Search 10 (copy)";
				var newSearchId = vendorbillSearchObj.save();
				*/
				
			}

			
			return {
			//beforeLoad: beforeLoad,
			//beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});