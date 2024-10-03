/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url'],
    function (widget, task, runtime, search, redirect, https,url) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') {
            var user=runtime.getCurrentUser();
            var department=user.department;
            if(department==11)
            {
                redirect.redirect({
                    url:'/app/accounting/transactions/invadjst.nl?whence='
                });
            }
        	var form = widget.createForm({
                    title: 'Inventory Creation'
                });
                form.addField({id:'custpage_ia_choice',label:'Inventory Adjustment',type:'radio',source:'regular'});
                form.addField({id:'custpage_ia_choice',label:'Manufacturer Part Return',type:'radio',source:'manufacturer'});
                form.addSubmitButton({label:'Inventory Adjustment'});
                response.writePage(form);
                

		}
        else
        {
            //context.request.parameters
            var whatButton=context.request.parameters.custpage_ia_choice;
            
            var user=runtime.getCurrentUser();
            var department=user.department;
            var subsidiary=user.subsidiary;
            var operatingArea=user.class;
            if(whatButton=='regular')
            {
                redirect.redirect({
                    url:'/app/accounting/transactions/invadjst.nl?whence='
                });
            }
            if(whatButton=='manufacturer')
            {
                redirect.redirect({
                    url:'/app/accounting/transactions/invadjst.nl?whence=',
                    parameters:{
                        'cf':212,
                        'record.department':department,
                        'record.subsidiary':subsidiary,
                        'record.account':503,
                        'record.class':operatingArea

                    }
                });
            }
            log.debug({title:'pressed',details:whatButton});
        }
	}

        
        return {
            onRequest: onRequest
        }
    })