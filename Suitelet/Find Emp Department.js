/**
 * @NApiVersion 2.1
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

        	var returnValue=null;
        	var thisEmployee=context.request.parameters.this_employee;
        	var empDepartment=search.lookupFields({
					type:'employee',
					id:thisEmployee,
					columns:['department']
				});
        	try
        	{
        		//returnValue=empDepartment.department[0].value;
        		returnValue=9;
        	}
        	catch(err)
        	{

       		}
       		return returnValue;

		}
	}

        
        return {
            onRequest: onRequest
        }
    })