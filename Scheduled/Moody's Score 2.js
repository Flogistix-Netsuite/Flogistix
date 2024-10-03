/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record','N/search','N/runtime','N/https'], 
	function(file, record, search,runtime,https) {
		function execute(options){  

			
			var headers={
				'Authorization': 'Basic ZmxvZ2lzdGl4YXBpQGFwaS5jb206dHhqbzZ2OGYz',
				'accept': 'application/json'
			}
			
			var customerSearchObj = search.create({
			   type: "customer",
			   filters:
			   [
			      ["custentity_moody_link_id","isnotempty",""], 
			      "AND", 
			      ["category","anyof","1","2"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "entityid", label: "ID"}),
			      search.createColumn({name: "altname", label: "Name"}),
			      search.createColumn({name: "email", label: "Email"}),
			      search.createColumn({name: "internalid", label: "Internal ID"}),
			      search.createColumn({name: "custentity_moody_link_id", label: "Moody Link ID"})
			   ]
			});
			
			var searchResultCount = customerSearchObj.runPaged().count;
			log.debug("customerSearchObj result count",searchResultCount);
			customerSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				var thisLink=result.getValue({name:'custentity_moody_link_id'});
				var thisCustomer=result.getValue({name:'internalid'});
				var url='https://connect.ecredit.com/ews/services/RestDataService/searchReport?products=Cortera Deep Dive Report&linkId='+thisLink+'&user=flogistixapi@api.com&password=txjo6v8f3';
				var response=https.get({
					url:url,
					headers:headers
				});
				var ugh=response.body;
				var dataIn=JSON.parse(ugh);
				try
				{


				var ltr=dataIn.ReportResult.MoodysLTR.LongTermRating;
				//record.submitFields({type:'customer',id:thisCustomer,values:{'custentity_moody_ltr':ltr}					});
				}
				catch(err)
				{
					log.error({title:'Error with Moody LTR',details:err});
				}

		

			   return true;
			});
			
			/*
			customerSearchObj.id="customsearch1719426172011";
			customerSearchObj.title="Moodys Credit Risks (copy)";
			var newSearchId = customerSearchObj.save();
			*/

			}

	return {
		execute  : execute
	};
})