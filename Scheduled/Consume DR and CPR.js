/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime','N/file'], 
	function(file, record, search,runtime,file) {
		function execute(options){  
			//load file
			//var theseFiles=[];
			var folderSearchObj = search.create({
			   type: "folder",
			   filters:
			   [
			      ["internalid","anyof","921287"]
			   ],
			   columns:
			   [
			      search.createColumn({
			         name: "internalid",
			         join: "file",
			         label: "Internal ID"
			      })
			   ]
			});
			var thisFile=null;
			var searchResultCount = folderSearchObj.runPaged().count;
			log.debug("folderSearchObj result count",searchResultCount);
			folderSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   var thisID=result.getValue({name:'internalid',join:'file'});
			   thisFile=file.load({id:thisID});
			   var iterator=thisFile.lines.iterator();
			   iterator.each(function () {return false});
			   iterator.each(function(line)
			   {
			   	var lineValues=line.value.split(',');
			   	var linkId=lineValues[3];
			   	var cpr=lineValues[18];
			   	var dr=lineValues[19];
			   	var thisCustomer=findCustomer(linkId);
			   	if(!thisCustomer)
			   		return true;
			   	record.submitFields({type:'customer',id:thisCustomer,values:{'custentity_moody_cpr':cpr,'custentity_moody_dr':dr}});
			   	//look up customer who is linked id
			   	return true;
			   })

			   return true;
			});
			thisFile.folder=921288;
			thisFile.save();

			/*
			folderSearchObj.id="customsearch1719416426263";
			folderSearchObj.title="Custom Folder Search (copy)";
			var newSearchId = folderSearchObj.save();
			*/
			//iteratite
			//save

		}
		function findCustomer(linkId)
		{
			var returnValue=null;
			try
			{


				var customerSearchObj = search.create({
				   type: "customer",
				   filters:
				   [
				      ["custentity_moody_link_id","is",linkId]
				   ],
				   columns:
				   [
				      search.createColumn({name: "internalid", label: "Internal ID"})
				   ]
				});
				var searchResultCount = customerSearchObj.runPaged().count;
				//log.debug("customerSearchObj result count",searchResultCount);
				customerSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
					returnValue=result.getValue({name:'internalid'});
				   return false;
				});
			}
			catch(err)
			{

			}
			return returnValue;



		}
	return {
		execute  : execute
	};
})