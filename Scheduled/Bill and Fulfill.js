/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime'], 
	function(file, record, search,runtime) {
		function execute(options){  
			var fulfillThese=[];
			var salesorderSearchObj = search.create({
			   type: "salesorder",
			   filters:
			   [
			      ["custcolsu_ship_date","within","6/30/2023"], 
			      "AND", 
			      ["type","anyof","SalesOrd"], 
			      "AND", 
			      ["quantityshiprecv","equalto","0"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = salesorderSearchObj.runPaged().count;
			log.debug("salesorderSearchObj result count",searchResultCount);
			salesorderSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				fulfillThese.push(result.getValue({name:'internalid'}));
			   return true;
			});
			//now we need to make these fulfilled
			for(var f=0;f<fulfillThese.length;f++)
			{
				var ifRec=record.transform({
					fromType: record.Type.SALES_ORDER,
					fromId: fulfillThese[f],
					toType: record.Type.ITEM_FULFILLMENT,
					//isDynamic: true,
				});
				var howMany=ifRec.getLineCount({sublistId:'item'});
					for(var hm=0;hm<howMany;hm++)
					{
						ifRec.setSublistValue({sublistId:'item',fieldId:'itemreceive',value:true,line:hm});
					}
				var ifRecId=ifRec.save();
				//now, turn into an invoice
				var invRec=record.transform({
					fromType: record.Type.SALES_ORDER,
					fromId: fulfillThese[f],
					toType: record.Type.INVOICE,
					//isDynamic: true,
				});
				invRec.save();
			}

			/*
			salesorderSearchObj.id="customsearch1694757278486";
			salesorderSearchObj.title="Bill and Fulfill These (copy)";
			var newSearchId = salesorderSearchObj.save();
			*/
		}
	return {
		execute  : execute
	};
})