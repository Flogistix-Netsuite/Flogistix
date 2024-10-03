/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/record','N/email','N/ui/message'],
    function (serverWidget, task, runtime, search, redirect, https,url,record,email,message) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
          //log.debug({title:'first',details:request});
        if (context.request.method == 'GET') 
        {

          log.debug({title:'worky',details:request});
          return 200;           

        }
        else
        {
          //log.debug({title:'post',details:request});
          
           var data=context.request.body;
            var ugh=JSON.parse(data);
          log.debug({
                title:'ugh',
                details:ugh,
              });
           log.debug({
                title:'context',
                details:context,
              });
           log.debug({
                title:'data',
                details:data,
              });
            var whatField=ugh.body.Resource_Field;
            var whatID=ugh.body.Object_Identifier;
            var fireOffUpdate=false;
            if(whatField=='Job Cost Code')
                fireOffUpdate=true;
            if(whatField=='Department')
                fireOffUpdate=true;

            if(fireOffUpdate)
            {
                email.send({author:-5,recipients:'rveach@flogistix.com',body:'New Update for Paycom!',subject:whatField+'\n'+whatID});
                /*
                var submittedTask;
            
                for(var s=1;s<11;s++)
                {
                  try
                  {                
                    ssTask = task.create({
                          taskType: task.TaskType.SCHEDULED_SCRIPT,
                          scriptId: 'customscript_shopify_to_aqua_order',
                          deploymentId: 'customdeploy_shopif_aqua_order_creation'+s,
                          params: {
                              'custscript_shopify_aqua_order_number': id,
                          }
                    });
                    submittedTask = ssTask.submit();
                    break;
                  }
                  catch(err)
                  {
                    continue;
                  }
                  */
            }

                return 200;
              
              

        }

              
         // return 200;
            
            
        
    }

        
        return {
            onRequest: onRequest
        }
    })