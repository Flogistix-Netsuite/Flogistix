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
        	var form = serverWidget.createForm({title: 'Enter SFTP Credentials'});
			var credField = form.addCredentialField({
				id: 'custfield_sftp_password_token',
				label: 'SFTP Password',
				restrictToScriptIds: ['customscript_visa_connection'],
				restrictToDomains:['asftp.flogistix.com']//1@CQPqArRjcCW%Nx
				
			});
			//credField.maxLength = 64;
			form.addSubmitButton();
			response.writePage(form);
			}
		else
		{
			var passwordToken = request.parameters.custfield_sftp_password_token;
				log.debug({
				title: 'New password token',
				details: passwordToken
				});

		}
	}


        
        return {
            onRequest: onRequest
        }
    })