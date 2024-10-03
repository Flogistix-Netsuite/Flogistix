/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime'], 
	function(file, record, search,runtime) {
		var ids=[];
		function execute(options){  
			var workordercompletionSearchObj = search.create({
			   type: "workordercompletion",
			   filters:
			   [			     
			      ["type","anyof","WOCompl"], 
			      "AND", 
			      ["systemnotes.date","within","8/6/2023 12:00 am"], 
			      "AND", 
			      ["mainline","is","T"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = workordercompletionSearchObj.runPaged().count;
			log.debug("workordercompletionSearchObj result count",searchResultCount);
			workordercompletionSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				ids.push(result.getValue({name:'internalid'}));
			   return true;
			});

			for(var i=0;i<ids.length;i++)
			{
				//var rec=context.newRecord;
				var rec=record.load({type:'workordercompletion',id:ids[i]});
				var zeroes=[];
				var thisWO=rec.getValue({fieldId:'createdfrom'});
				rec.setValue({fieldId:'custbody_run_labors',value:false});
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
				rec.save();
			}

			/*
			workordercompletionSearchObj.id="customsearch1691559059173";
			workordercompletionSearchObj.title="Run Completions (copy)";
			var newSearchId = workordercompletionSearchObj.save();
			*/

		}
	return {
		execute  : execute
	};
})