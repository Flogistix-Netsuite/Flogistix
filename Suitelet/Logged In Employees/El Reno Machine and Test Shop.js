/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url'],
    function (serverWidget, task, runtime, search, redirect, https,url) {

        function onRequest(context) {
        var request = context.request;
          
        var response = context.response;
        if (request.method == 'GET') {
          //log.error({title:'headers1',details:context.request.headers});
          //var parsedHeaders=JSON.stringify(context.request.headers);
         // var parsedSplit=
                    //log.error({title:'parsedHeaders',details:parsedHeaders});
                  //  log.error({title:'headers',details:parsedHeaders.ns_client_ip});
          var ip=context.request.headers['ns-client-ip']
          if(ip!='12.7.76.218' && ip!='150.253.64.246')
            return 200;
         // log.error({title:'ip',details:ip}); 


          
          
            var form=serverWidget.createForm({title:'Open RF Smart Session - El Reno Machine and Test Shop'});
          
            var sub=form.addSublist({id:'custpage_calls',label:' ',tab:'calltab',type:'list'});
           
               
                var ims=sub.addField({id:'custpage_image',label:'Employee Image',type:'image'});
                ims.updateDisplayType({displayType:serverWidget.FieldDisplayType.ENTRY});
                var empField=sub.addField({id:'custpage_employee',label:'Employee',type:'select',source:'employee'});//.updateDisplayType({displayType:serverWidget.FieldDisplayType.ENTRY});
                empField.updateDisplayType({displayType:serverWidget.FieldDisplayType.INLINE});
          
                var wo=sub.addField({id:'custpage_work_order',label:'Work Order',type:'text'});
               
               
                sub.addField({id:'custpage_task',label:'Operation Task',type:'text'});
                sub.addField({id:'custpage_item',label:'Assembly Item',type:'select',source:'item'}).updateDisplayType({displayType:serverWidget.FieldDisplayType.INLINE});
                sub.addField({id:'custpage_start_time',label:'Start Time',type:'text'});
                sub.addField({id:'custpage_end_time',label:'End Time',type:'text'});
               
            var foundIds=[];
           /*
            var s=search.load({id:'customsearch2724'});
            var sResults=s.run().getRange({
                start:0,
                end:500
            });
            */
            var customrecord_rfs_operation_sessionSearchObj = search.create({
               type: "customrecord_rfs_operation_session",
               filters:
               [
                  [["custrecord_rfs_op_session_end_standard","isempty",""],"OR",["custrecord_rfs_op_session_end_time","isempty",""]], 
                  "AND", 
                  ["custrecord_rfs_op_session_department","anyof","61","56"]
                 // ["custrecord_rfs_op_session_department","anyof","51","52","53","57","54","55","56","61"]
               ],
               columns:
               [
                  search.createColumn({name: "custrecord_rfs_op_session_employee_image", label: "Employee Image"}),
                  search.createColumn({name: "custrecord_rfs_op_session_employee", label: "RF-Smart Employee"}),
                  search.createColumn({
                     name: "workorder",
                     join: "CUSTRECORD_RFS_OP_SESSION_TASK",
                     label: "Work Order"
                  }),
                  search.createColumn({name: "custrecord_rfs_op_session_task", label: "Operation Task"}),
                  search.createColumn({name: "custrecord_rfs_op_session_assembly_item", label: "Assembly Item"}),
                  search.createColumn({name: "custrecord_rfs_op_session_start_standard", label: "Start Time (standard)"}),
                  search.createColumn({name: "custrecord_rfs_op_session_end_standard", label: "End Time (standard)"}),
                  search.createColumn({name: "custrecord_rfs_op_session_department", label: "Department"})
               ]
            });
            var searchResultCount = customrecord_rfs_operation_sessionSearchObj.runPaged().count;
            log.debug("customrecord_rfs_operation_sessionSearchObj result count",searchResultCount);
            var ss=0;
            customrecord_rfs_operation_sessionSearchObj.run().each(function(result){
               // .run().each has a limit of 4,000 results
               
                var thisImage1=result.getText({name:'custrecord_rfs_op_session_employee_image'});
                
                var dkdjej='https://3431133.app.netsuite.com'+thisImage1;
                sub.setSublistValue({id:'custpage_image',line:ss,value:dkdjej});
                

                var thisEmployee=result.getValue({name:'custrecord_rfs_op_session_employee'});
                sub.setSublistValue({id:'custpage_employee',line:ss,value:thisEmployee});
                

                var thisWorkOrder=result.getValue({name:'workorder',join:'CUSTRECORD_RFS_OP_SESSION_TASK'});
                sub.setSublistValue({id:'custpage_work_order',line:ss,value:thisWorkOrder});
                 
                var thisTask=result.getText({name:'custrecord_rfs_op_session_task'});
                sub.setSublistValue({id:'custpage_task',line:ss,value:thisTask});

                var thisItem=result.getValue({name:'custrecord_rfs_op_session_assembly_item'});
                sub.setSublistValue({id:'custpage_item',line:ss,value:thisItem});

                var thisStart=result.getValue({name:'custrecord_rfs_op_session_start_standard'});
                sub.setSublistValue({id:'custpage_start_time',line:ss,value:thisStart});
                ss++


               return true;
            });

            response.writePage(form);



        }
    }
    function getAttachments(ids,callIds,callAttachments)
    {
       // var findThese=ids.split(',');
        var phonecallSearchObj = search.create({
           type: "phonecall",
           filters:
           [
              ['internalid','anyof',ids],
              "AND",
              ["file.internalid","noneof","@NONE@"]
           ],
           columns:
           [
              search.createColumn({name: "internalid", label: "Internal ID"}),
              search.createColumn({name: "internalid",join: "file",label: "Internal ID"}),
              search.createColumn({name:'name',join:'file',label:'name'}),
              search.createColumn({name:'url',join:'file',label:'url'})
           ]
        });
        var crIds=[];
        var crAttachments=[];
        var crURLs=[];
        var crNames=[];
        var uniques=[];
        var uniAttachments=[];
        var searchResultCount = phonecallSearchObj.runPaged().count;
        log.debug("phonecallSearchObj result count",searchResultCount);
        phonecallSearchObj.run().each(function(result){
            crIds.push(result.getValue({name:'internalid'}));
            crAttachments.push(result.getValue({name:'internalid',join:'file'}));
            crURLs.push(result.getValue({name:'url',join:'file'}));
            crNames.push(result.getValue({name:'name',join:'file'}));
            var uniqueIndex=uniques.indexOf(result.getValue({name:'internalid'}));
            if(uniqueIndex==-1)
            {
                uniques.push(result.getValue({name:'internalid'}));
                uniAttachments.push(null);
            }
           // .run().each has a limit of 4,000 results
           return true;
        });

        //var updatedIds=[];
        
        for(var u=0;u<uniques.length;u++)
        {
            var currentLine=null;
            var findMe=uniques[u];
            for(var c=0;c<crIds.length;c++)
            {
                var thisOne=crIds[c];
                if(thisOne==findMe)
                {
                   /* var recordURL=url.resolveRecord({
                        recordType:'file',
                        recordId:crAttachments[c],
                    });
                    */
                    if(!currentLine)
                        currentLine='<a target="_blank" href="'+crURLs[c]+'">'+crNames[c]+'</a>';
                    else
                        currentLine=currentLine+' <a target="_blank" href="'+crURLs[c]+'">'+crNames[c]+'</a>';
                   
                }
            }
            uniAttachments[u]=currentLine;
        }
        return {
            uniques:uniques,
            uniAttachments:uniAttachments
        }
        
    }

        
        return {
            onRequest: onRequest
        }
    })