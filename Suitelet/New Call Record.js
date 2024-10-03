/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/task'],
    function (widget, task, runtime, search, redirect, https,url,task) {

    function onRequest(context) 
    {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') 
        {
        	var balances=[];
        	var emails=[];
        	var statements=[];
        	var invoices=[];
        	var customers=[];
        	var form=widget.createForm({title:'New Call Record!'});			
        		form.addField({id:'contact_phone',label:'Phone Number',type:'phone'});
        		form.addField({id:'contact_email',label:'Email',type:'email'});
        		form.addField({id:'contact_notes',label:'Discussion',type:'text'});

        		/*
        	var sList=form.addSublist({id:'customers',type:'inlineeditor',label:'Send these Statements'});
        	sList.addField({id:'sendstatement',type:'checkbox',label:'Send Statement?'});
        	sList.addField({id:'customerid',type:'select',label:'Customer',source:'customer'});
        	sList.addField({id:'emailid',type:'text',label:'Email for Statement'});
        	sList.addField({id:'yesinvoices',type:'checkbox',label:'Send Invoices?'});
        	sList.addField({id:'openamount',type:'float',label:'Total Open'});
        	var customerSearchObj1 = search.create({
			   type: "customer",
			   filters:
			   [
			      ["balance","greaterthan","0.00"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"}),
			      search.createColumn({name: "balance", label: "Balance"}),
			      search.createColumn({name: "custentity_previous_send_invoice", label: "Previous Send Invoices"}),
			      search.createColumn({name: "custentity_previous_statement_email", label: "Previous Statement Email"}),
			      search.createColumn({name: "custentity_previous_send_statement", label: "Previous Send Statement"})
			   ]
			});
			//var searchResultCount = customerSearchObj.runPaged().count;
			//log.debug("customerSearchObj result count",searchResultCount);
           var customerSearchObj=search.load({
             id:'customsearch2091',
             type:'customer',
           });
			customerSearchObj.run().each(function(result){
				var sInvoice=result.getValue({name:'custentity_previous_send_invoice'});
				var sEmails=result.getValue({name:'custentity_emails_for_invoice'});
				var sStatements=result.getValue({name:'custentity_previous_send_statement'});
				/*if(!sStatements)
					sStatements='F';
				else
					sStatements='T';*/
        		/*
				if(!sInvoice)
					sInvoice='F';
				else
					sInvoice='T';
				if(!sEmails)
					sEmails=null;
				if(!sStatements)
					sStatements='F';
				else
					sStatements='T';
				balances.push(result.getValue({name:'balance'}));
				emails.push(sEmails);
				customers.push(result.getValue({name:'internalid'}));
				statements.push(sStatements);
				invoices.push(sInvoice);
			   // .run().each has a limit of 4,000 results
			   return true;
			});
			for(var c=0;c<customers.length;c++)
			{
				//sList.setSublistValue({id:'sendstatement',line:c,value:statements[c]});
				sList.setSublistValue({id:'sendstatement',line:c,value:statements[c]});
				sList.setSublistValue({id:'customerid',line:c,value:customers[c]});
				sList.setSublistValue({id:'emailid',line:c,value:emails[c]});
				sList.setSublistValue({id:'yesinvoices',line:c,value:invoices[c]});
				sList.setSublistValue({id:'openamount',line:c,value:balances[c]});
			}

			/*
			customerSearchObj.id="customsearch1658732616736";
			customerSearchObj.title="Custom Customer Search 21 (copy)";
			var newSearchId = customerSearchObj.save();
			*/

			form.addSubmitButton({label:'Submit Call Record'})
        	context.response.writePage(form);
         
		}
		else
		{
			/*
			var request=context.request;
	        var invoiceList=context.request.getLineCount({group:'customers'});
	                        
	        var theseCustomers=[];
	        var theseEmails=[];
	        var theseInvoices=[];
	        var theseStatements=[];

	        
	        for(var i=0;i<invoiceList;i++)
	            {   
	                var sendStatements=request.getSublistValue({
	                    group:'customers',
	                    name:'sendstatement',
	                    line:i
	                });
	                var thisID=request.getSublistValue({
	                    group:'customers',
	                    name:'customerid',
	                    line:i
	                });
	                var whatEmail=request.getSublistValue({
	                    group:'customers',
	                    name:'emailid',
	                    line:i,
	                });
	                var sendInvoices=request.getSublistValue({
	                	group:'customers',
	                	name:'yesinvoices',
	                	line:i
	                });
	                theseStatements.push(sendStatements);
                	theseCustomers.push(thisID);
                    theseInvoices.push(sendInvoices);
                    theseEmails.push(whatEmail);
	            }
	        //now, we need to figure out what to do with the list
	        var headers=null;
	        for(var c=0;c<theseCustomers.length;c++)
	        {
	        	if(!headers)
	        		headers=theseCustomers[c]+','+theseInvoices[c]+','+theseEmails[c]+','+theseStatements[c]+';';
	        	else
	        		headers=headers+theseCustomers[c]+','+theseInvoices[c]+','+theseEmails[c]+','+theseStatements[c]+';';
	        }
	        //set the task
	         var ssTask = task.create({
                taskType: task.TaskType.SCHEDULED_SCRIPT,
                scriptId: 'customscript_consume_statement_suitelet',
                deploymentId: 'customdeploy_consume_statement_suitelet',
                params: {
                    'custscript_customers_to_consume': headers,
                   
                }
            });
            submittedTask = ssTask.submit();
           redirect.toTaskLink({
               id:'CARD_-29',
              })
              */
		}
	
	}

        
        return {
            onRequest: onRequest
        }
    })