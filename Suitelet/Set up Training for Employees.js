/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/record','N/format','N/email'],
    function (serverWidget, task, runtime, search, redirect, https,url,record,format,email) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') {
        	var form=serverWidget.createForm({title:'Assign Training'});
        	form.addField({id:'custpage_employee',label:'Assignee',type:'select',source:'employee'});
        	form.addField({id:'custpage_learning_path',label:'Learning Path',type:'select',source:'customrecord_lpp'});
        	form.addSubmitButton('Assign Training');
        	response.writePage(form);

		}
		else
		{
			var courseIds=[];
			
			var whatPerson=context.request.parameters.custpage_employee;
			var whatPath=context.request.parameters.custpage_learning_path;
			//now we need to create each potential path
			var assigned=alreadyAssigned(7,whatPerson);
			if(!assigned)
				{
					createAssignments(7,whatPerson);
					
					createAssignments(whatPath,whatPerson);
					emailEmployee(whatPerson);
				}
			else
			{
				var alreadyCreated=alreadyAssigned(whatPath,whatPerson);
				if(!alreadyCreated)
					createAssignments(whatPath,whatPerson);
			}
			
			redirect.toSuitelet({
		            scriptId:'customscript_setup_training',
		            deploymentId:'customdeploy_setup_training'
		          });

			
		}
	}
	function alreadyAssigned(course,emp)
	{
		var customrecord_lpaSearchObj = search.create({
			   type: "customrecord_lpa",
			   filters:
			   [
			      ["custrecord_lpa_assigned","anyof",emp], 
			      "AND", 
			      ["custrecord_lpa_learning_path","anyof",course]
			   ],
			   columns:
			   [
			      search.createColumn({
			         name: "scriptid",
			         sort: search.Sort.ASC,
			         label: "Script ID"
			      }),
			      search.createColumn({name: "internalid", label: "Assigned To"}),
			     
			   ]
			});
			var searchResultCount = customrecord_lpaSearchObj.runPaged().count;
			var newAssign=null;
			log.debug("customrecord_lpaSearchObj result count",searchResultCount);
			customrecord_lpaSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				newAssign=result.getValue({name:'internalid'});
			   return false;
			});
			return newAssign;
	}
	function createAssignments(course,emp)
	{
		var courseIds=[];
		var today=new Date();
		var sixMonths=today.setMonth(today.getMonth()+6);
		var customrecord_lpcSearchObj = search.create({
			   type: "customrecord_lpc",
			   filters:
			   [
			      ["custrecord_lpc_learning_path","anyof",course]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = customrecord_lpcSearchObj.runPaged().count;
			log.debug("customrecord_lpcSearchObj result count",searchResultCount);
			customrecord_lpcSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				courseIds.push(result.getValue({name:'internalid'}));
			   return true;
			});
			for(var c=0;c<courseIds.length;c++)
			{
				var assignedRecord=record.create({type:'customrecord_lpa',isDynamic:true});
					assignedRecord.setValue({fieldId:'custrecord_lpa_learning_path',value:course});
					assignedRecord.setValue({fieldId:'custrecord_lpa_assigned',value:emp});
					assignedRecord.setValue({fieldId:'custrecord_lpa_course',value:courseIds[c]});
					assignedRecord.setValue({fieldId:'custrecord_lpa_completion_date',value:new Date(sixMonths)});
					assignedRecord.save();
			}
	}
	function emailEmployee(emp)
	{
		var thisEmailBody='Morning!\n\n';
			thisEmailBody+='I have assigned Training to you.\n\n';
			thisEmailBody+='If you follow this link, you should see the courses currently assigned to you:\n';
			thisEmailBody+='https://3431133.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1652&deploy=1&compid=3431133&whence='+'\n\n';
			thisEmailBody+='If you click on the top right Star, you can add this to your shortcuts on your home page OR you can keep this email.\n\n';
			thisEmailBody+='Please do the -New User Access- first; this is hosted by Oracle and not NS so please create a new log-in and I have been told you cannot use the same password you use for NS.\n\n';
			thisEmailBody+='Please confirm to me that you are able to see your training.\n\n';
			thisEmailBody+='If there are other trainings you want, please let me know.\n\n';
			thisEmailBody+='Thanks!';
		email.send({
			author:29250,
			recipients:emp,
			subject:'New Training for NetSuite has been Assigned to you!',
			body:thisEmailBody
		});
	}

        
        return {
            onRequest: onRequest
        };
    });