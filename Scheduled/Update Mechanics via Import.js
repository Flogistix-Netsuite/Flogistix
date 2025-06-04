/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime','N/task'], 
	function(file, record, search,runtime,task) {
		function execute(options){  
			//search to find any files in the folder
			var filesToConsume=[];
			var folderSearchObj = search.create({
			   type: "folder",
			   filters:
			   [
			      ["internalid","anyof","990004"]
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
			var searchResultCount = folderSearchObj.runPaged().count;
			log.debug("folderSearchObj result count",searchResultCount);
			folderSearchObj.run().each(function(result){
				filesToConsume.push(result.getValue({name:'internalid',join:'file'}));
			   // .run().each has a limit of 4,000 results
			   return true;
			});

			var assetInfo=getAssets();
			var dfdfd=99;

			var contents='Mechanic,Asset ID,Lot Number\n';
			var mechanics=[];

			//open the file.
			var whatMechanic=null;
			for(var f=0;filesToConsume && f<4;f++)
			{
				var mechanicFile=file.load({id:filesToConsume[f]});
                whatMechanic=null;
				var iterator=mechanicFile.lines.iterator();
					iterator.each(function () {return false;});
					iterator.each(function (line)
					{
						var lineValues=line.value.split(',');
						var mechanic=lineValues[0];
						if(!whatMechanic)
							whatMechanic=findMechanic(mechanic);
						var relatedAsset=lineValues[1];
						var assetInternalId=null;
						for(var a=0;a<assetInfo.length;a++)
						{
							if(assetInfo[a].name===relatedAsset)
							{
								assetInternalId=assetInfo[a].id;
								record.submitFields({type:'customrecord_ncfar_asset',id:assetInternalId,values:{'custrecord_fieldservice_mechanic':whatMechanic}});
								break;
							}
						}
						//contents=contents+mechanic+','+assetInternalId+','+assetInternalId+'\n';

						return true;

					})
					//create new file to use for import job
					
					//var newFile=file.create({name:file.name+' updated.csv',fileType:'CSV',contents:contents});

					//newFile.folder=991434;
					//newFile.save();

					mechanicFile.folder=991433;
					mechanicFile.save();
					
					
			}
			
			//consume the file
			//move the file to processed
			//end


		}
		function findMechanic(thisMechanic)
		{
			var returnValue=null;
			var employeeSearchObj = search.create({
			   type: "employee",
			   filters:
			   [
			      ["entityid","startswith",thisMechanic]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = employeeSearchObj.runPaged().count;
			log.debug("employeeSearchObj result count",searchResultCount);
			employeeSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				returnValue=result.getValue({name:'internalid'});
			   return true;
			});
			return returnValue;

			/*
			employeeSearchObj.id="customsearch1747768988211";
			employeeSearchObj.title="Custom Employee Search 10 (copy)";
			var newSearchId = employeeSearchObj.save();
			*/
		}
		function getAssets()
		{
			var assets=[];
			var customrecord_ncfar_assetSearchObj = search.create({
			   type: "customrecord_ncfar_asset",
			   filters:
			   [
			      ["custrecord_assettype","anyof","11","2"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "altname", label: "Name"}),
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var myPagedData = customrecord_ncfar_assetSearchObj.runPaged({pageSize:1000});
			myPagedData.pageRanges.forEach(function(pageRange){
				var myPage=myPagedData.fetch({index: pageRange.index});
				myPage.data.forEach(function(result){
					var assetName=result.getValue({name:'altname'});
					var assetId=result.getValue({name:'internalid'});
					assets.push({name:assetName,id:assetId});

					
				});
			});
			//log.debug("customrecord_ncfar_assetSearchObj result count",searchResultCount);

			/*
			customrecord_ncfar_assetSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   return true;
			});
			*/
			return assets;

/*
customrecord_ncfar_assetSearchObj.id="customsearch1746552225382";
customrecord_ncfar_assetSearchObj.title="Custom FAM Asset Search 7 (copy)";
var newSearchId = customrecord_ncfar_assetSearchObj.save();
*/
		}
	return {
		execute  : execute
	};
})