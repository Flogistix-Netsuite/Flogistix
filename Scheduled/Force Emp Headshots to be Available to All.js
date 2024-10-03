/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime'], 
   function(file, record, search,runtime) {
      function execute(options){  

         var folderSearchObj = search.create({
         type: "folder",
         filters:
         [
            ["internalid","anyof","798523"], 
            "AND", 
            ["file.availablewithoutlogin","is","F"]
         ],
         columns:
         [
            
            search.createColumn({               name: "internalid",               join: "file",               label: "Available Without Login"            })
         ]
      });
      var searchResultCount = folderSearchObj.runPaged().count;
      log.debug("folderSearchObj result count",searchResultCount);
      folderSearchObj.run().each(function(result){
         var thisFile=file.load({id:result.getValue({name:'internalid',join:'file'})});
            thisFile.isOnline=true;
            thisFile.save();
         // .run().each has a limit of 4,000 results
         return true;
      });

      /*
      folderSearchObj.id="customsearch1724956821490";
      folderSearchObj.title="Custom Folder Search 2 (copy)";
      var newSearchId = folderSearchObj.save();
      */
      }
   return {
      execute  : execute
   };
})