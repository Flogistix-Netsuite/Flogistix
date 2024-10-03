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
        if (request.method == 'GET') 
        {
        	//var myMessage=message.create({title:'Hello sir!',message:'howdy',type:'information'});
        	//myMessage.show();
        	var form=serverWidget.createForm({title:'Purchase Order Delegate'});
        		form.addField({id:'cust_start_date',label:'Start Date',type:'date'});
        		form.addField({id:'cust_end_date',label:'End Date',type:'date'});
        		form.addField({id:'cust_delegate',label:'Delegate',type:'select',source:'employee'});
        		form.addSubmitButton('Create Delegate');
        		response.writePage(form);

		}
		else
		{
			var sDate=context.request.parameters.cust_start_date;
			var eDate=context.request.parameters.cust_end_date;
			var delegate=context.request.parameters.cust_delegate;
			var currentUser=runtime.getCurrentUser();
			record.submitFields({
				type:'employee',
				id:currentUser.id,
				values:{
					custentity_delegate:delegate,
					custentity_delegate_end_date:eDate,
					custentity_delegate_start_date:sDate
				}
			});
			email.send({
				author:currentUser.id,
				recipients:[currentUser.id,delegate],
				subject:'You are my delegate while I am OOO',
				body:'Thanks for being my delegate while I am OOO\nStart Date: '+sDate+'\nEnd Date: '+eDate+'\n\nThanks again',
			});
			redirect.toTaskLink({
			    id:'CARD_-29',
			});

		}
	}

        
        return {
            onRequest: onRequest
        }
    })