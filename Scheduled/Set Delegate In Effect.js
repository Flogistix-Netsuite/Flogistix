/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime'], 
	function(file, record, search,runtime) {
		function execute(options){  
			//turn off
			var employeeSearchObj = search.create({
			   type: "employee",
			   filters:
			   [
			      ["custentity_delegate_end_date","onorbefore","today"], 
			      "AND", 
			      ["custentity_delegate_in_effect","is","T"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = employeeSearchObj.runPaged().count;
			log.debug("employeeSearchObj result count",searchResultCount);
			employeeSearchObj.run().each(function(result){
				record.submitFields({
					type:'employee',
					id:result.getValue({name:'internalid'}),
					values:{
						custentity_delegate_in_effect:false,
						custentity_delegate:null,
						custentity_delegate_end_date:null,
						custentity_delegate_start_date:null

					}
				});
			   // .run().each has a limit of 4,000 results
			   return true;
			});

			var employeeSearchObj = search.create({
			   type: "employee",
			   filters:
			   [
			      ["custentity_delegate_start_date","onorbefore","today"], 
			      "AND", 
			      ["custentity_delegate_in_effect","is","F"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = employeeSearchObj.runPaged().count;
			log.debug("employeeSearchObj result count",searchResultCount);
			employeeSearchObj.run().each(function(result){
				record.submitFields({
					type:'employee',
					id:result.getValue({name:'internalid'}),
					values:{
						custentity_delegate_in_effect:true,
					}
				});
			   // .run().each has a limit of 4,000 results
			   return true
			});

			
		}
	

	return {
		execute  : execute
	};
})