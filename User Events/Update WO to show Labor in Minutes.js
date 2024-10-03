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
				try
				{


				var rec=context.newRecord;
				var zeroes=[];
				var thisWO=rec.getValue({fieldId:'createdfrom'});
				var wcIds=[];
				var labor=0;
				var workordercompletionSearchObj = search.create({
				   type: "workordercompletion",
				   filters:
				   [
				      ["type","anyof","WOCompl"], 
				      "AND", 
				      ["mainline","is","T"], 
				      "AND", 
				      ["createdfrom","anyof",thisWO]
				   ],
				   columns:
				   [
				      search.createColumn({name: "internalid", label: "Internal ID"})
				   ]
				});
				var searchResultCount = workordercompletionSearchObj.runPaged().count;
				log.debug("workordercompletionSearchObj result count",searchResultCount);
				workordercompletionSearchObj.run().each(function(result){
					wcIds.push(result.getValue({name:'internalid'}));

				   // .run().each has a limit of 4,000 results
				   return true;
				});
				//now we need to get each value
				for(var w=0;w<wcIds.length;w++)
				{
					var wRec=record.load({type:'workordercompletion',id:wcIds[w]});
					var howMany=wRec.getLineCount({sublistId:'operation'});
					for(var h=0;h<howMany;h++)
					{
						var totalLabor=wRec.getSublistValue({sublistId:'operation',fieldId:'laborruntime',line:h});
						labor=labor+totalLabor;
						if(totalLabor==0)
							zeroes.push(wcIds[w]);
					}

				}
				var woRec=record.load({type:'workorder',id:thisWO});
				woRec.setValue({fieldId:'custbody_total_labor',value:labor});
				if(zeroes.length>0)
					woRec.setValue({
						fieldId:'custbody_woc_zero',
						value:zeroes
					});
				woRec.save();
				/*
				workordercompletionSearchObj.id="customsearch1690436607779";
				workordercompletionSearchObj.title="Completed Work Orders (copy)";
				var newSearchId = workordercompletionSearchObj.save();

				*/
				}
				catch(err)
				{

				}
				
			}

			
			return {
			//beforeLoad: beforeLoad,
			//beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});