/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/file','N/email'],
    function (serverWidget, task, runtime, search, redirect, https,url,file,email) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') {
        	var form=serverWidget.createForm({title:'Get Labor Time!'});
        	form.addField({id:'custpage_items',type:'multiselect',label:'Labor for Item',source:'item'});
            form.addSubmitButton('Send Labor');
        	response.writePage(form);

		}
        else
        {
            var delimiter = /\u0005/;
            var theseItems=context.request.parameters.custpage_items.split(delimiter);
            var thisUser=runtime.getCurrentUser();
            //var subsidiaries =context.request.parameters.custpage_subsidiary.split(delimiter);
            //log.debug(“subsidiary”, subsidiary);
            var findThese=[];
            for(var t=0;t<theseItems.length;t++)
            {
                findThese.push(theseItems[t]);
            }
            var workorderSearchObj = search.create({
               type: "workorder",
               filters:
               [
                  ["type","anyof","WorkOrd"], 
                  "AND", 
                  ["trandate","within","daysago365","daysago0"], 
                  "AND", 
                  ["mainline","is","T"], 
                  "AND", 
                  ["item","anyof",findThese], 
                  "AND", 
                  ["location","anyof","352","660","337"]
               ],
               columns:
               [
                  search.createColumn({
                     name: "item",
                     summary: "GROUP",
                     label: "Item"
                  }),
                  search.createColumn({
                     name: "actualruntime",
                     join: "manufacturingOperationTask",
                     summary: "SUM",
                     label: "Actual Run Time"
                  })
               ]
            });
            var headers='Item,Total Time To Close\n';
            //var searchResultCount = workorderSearchObj.runPaged().count;
            //log.debug("workorderSearchObj result count",searchResultCount);
            workorderSearchObj.run().each(function(result){
                var thisItem1=result.getText({name:'item',summary:'GROUP'});
                var thisItem=thisItem1.replace(/,/gi,'');
                var thisTime=result.getValue({name:'actualruntime',join:'manufacturingOperationTask',summary:'SUM'});
                headers=headers+thisItem+','+thisTime+'\n';
               // .run().each has a limit of 4,000 results
               return true;
            });
            //create the file
            var today=dateFixer(new Date())
            var newFile=file.create({name:'Item Time To Close Dated '+today+'.csv',fileType:'CSV',contents:headers});

            email.send({
                author:-5,
                recipients:thisUser.id,
                subject:'Item Time to Close for '+today,
                body:'See Attachment',
                attachments:[newFile],
            });


            


            /*
            workorderSearchObj.id="customsearch1696878896714";
            workorderSearchObj.title="WO Time to Complete (copy)";
            var newSearchId = workorderSearchObj.save();
            */
        }
        function dateFixer(thisDate)
                {
                    var day=thisDate.getDate();
                    if(day<10)
                        day='0'+day;
                    var month=thisDate.getMonth();
                        month++
                    if(month<10)
                        month='0'+month;
                    var year=thisDate.getFullYear();
                    var rDate=month+'/'+day+'/'+year;
                    return rDate;
                }
	}


        
        return {
            onRequest: onRequest
        }
    })