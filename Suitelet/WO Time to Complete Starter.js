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
        	var whatEmp=runtime.getCurrentUser();
            var empId=whatEmp.id;
            var createTask=task.create({
                taskType:'SCHEDULED_SCRIPT',
                scriptId:'customscript_wo_time',
                deploymentId:'customdeploy_wo_time_version_one',
                params:{
                    custscript_who_to_email:empId,
                }

            });
            createTask.submit();
            response.write('You should get an email soon with WO Time To Complete!\nYou can close this page');
                
		}
	}

        
        return {
            onRequest: onRequest
        }
    })