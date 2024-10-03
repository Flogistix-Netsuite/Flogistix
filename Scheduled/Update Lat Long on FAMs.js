/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime'], 
	function(file, record, search,runtime) {
		function execute(options){  

			var scriptObj=runtime.getCurrentScript();
			var thisCustomer=scriptObj.getParameter({name:'custscript_ll_customer_id'});
			var thisLabel=scriptObj.getParameter({name:'custscript_ll_label'});
			var thisLat=scriptObj.getParameter({name:'custscript_ll_lat'});
			var thisLong=scriptObj.getParameter({name:'custscript_ll_lon'});
			var fixThese=[];
			var customrecord_ncfar_assetSearchObj = search.create({
			   type: "customrecord_ncfar_asset",
			   filters:
			   [
			      ["custrecord_current_customer","anyof","17317"], 
			      "AND", 
			      ["custrecord_current_location","anyof","130459"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = customrecord_ncfar_assetSearchObj.runPaged().count;
			log.debug("customrecord_ncfar_assetSearchObj result count",searchResultCount);
			customrecord_ncfar_assetSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				fixThese.push(result.getValue({name:'internalid'}));
			   return true;
			});
			for(var f=0;f<fixThese.length;f++)
			{
				record.submitFields({type:'customrecord_ncfar_asset',id:fixThese[f],values:{'custrecord_fam_longitude':thisLong,'custrecord_fam_lat':thisLat}});
			}

			/*
			customrecord_ncfar_assetSearchObj.id="customsearch1712612883370";
			customrecord_ncfar_assetSearchObj.title="Custom FAM Asset Search 3 (copy)";
			var newSearchId = customrecord_ncfar_assetSearchObj.save();
			*/
		}
	return {
		execute  : execute
	};
})