/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/task','N/record'],
    function (widget, task, runtime, search, redirect, https,url,task,record) {

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
        	var form=widget.createForm({title:'New Contact!'});			
        		form.addField({id:'contact_phone',label:'Phone Number',type:'phone'});
        		form.addField({id:'contact_email',label:'Email',type:'email'});
        		form.addField({id:'contact_firstname',label:'First Name',type:'text'});
        		form.addField({id:'contact_lastname',label:'Last Name',type:'text'});

        		//form.addField({id:'contact_address',label:'Address',type:'text'});
        		form.addField({id:'contact_company',label:'Company',type:'select',source:'customer'});


			form.addSubmitButton({label:'Save New Contact!'})
        	context.response.writePage(form);
         
		}
		else
		{
			var firstName=context.request.parameters.contact_firstname;
			var lastName=context.request.parameters.contact_lastname;
			var phone=context.request.parameters.contact_phone;
			var email=context.request.parameters.contact_email
			var company=context.request.parameters.contact_company;
			var con=record.create({type:'contact',isDynamic:true});
			var concatName=firstName +' '+lastName;
				con.setValue({fieldId:'company',value:company});
				con.setValue({fieldId:'firstname',value:firstName});
				con.setValue({fieldId:'lastname',value:lastName});
				con.setValue({fieldId:'email',value:email});
				con.setValue({fieldId:'phone',value:phone});
				//con.setValue({fieldId:'phone',value:phone});
				con.save();
				redirect.toTaskLink({
               		id:'CARD_-29',
              	});

            }
           
              
		
	
	}

        
        return {
            onRequest: onRequest
        }
    })