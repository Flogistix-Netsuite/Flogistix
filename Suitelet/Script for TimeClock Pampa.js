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

        	              /**
			 *@NApiVersion 2.x
			 *@NScriptType Suitelet
			*/
			/*
			define(['N/ui/serverWidget'],
			    function(serverWidget) {
			        function onRequest(context){
			            if(context.request.method === 'GET'){
			                // Section One - List - See 'Steps for Creating a List', Step Five
			                // Section Two - Columns  - See 'Steps for Creating a List', Step Seven
			                context.response.writePage(list); 
			            }else{
			            }
			        }
			    return {
			        onRequest: onRequest 
			    }

			}); 
			              var list = serverWidget.createList({
    title: 'Purchase History'
});
list.style = serverWidget.ListStyle.REPORT; 
                          var datecol = list.addColumn({
               id : 'column1',
               type : serverWidget.FieldType.DATE,
               label : 'Date',
               align : serverWidget.LayoutJustification.RIGHT
            });
            
               list.addColumn({
               id : 'column2',
               type : serverWidget.FieldType.TEXT,
               label : 'Product',
               align : serverWidget.LayoutJustification.RIGHT
            });   
               
               list.addColumn({
               id : 'column3',
               type : serverWidget.FieldType.INTEGER,
               label : 'Quantity',
               align : serverWidget.LayoutJustification.RIGHT
            });   
            
               list.addColumn({
               id : 'column4',
               type : serverWidget.FieldType.CURRENCY,
               label : 'Unit Cost',
               align : serverWidget.LayoutJustification.RIGHT
            }); 
              list.addRow({
    row : { column1 : '02/12/2018', column2 : 'Widget', column3: '4', column4:'4.50' }
}); 
                            list.addRows({
    rows :[{column1 : '02/12/2018', column2 : 'Widget', column3: '4', column4:'4.50'},
        {column1 : '02/14/2018', column2 : 'Sprocket', column3: '6', column4:'11.50'},
        {column1 : '02/16/2018', column2 : 'Gizmo', column3: '9', column4:'1.25'}]
}); 

            
            /**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
        	/*
define(['N/ui/serverWidget'], function(serverWidget) {
    function onRequest(context){
        if(context.request.method === 'GET'){
            // Section One - List - See 'Steps for Creating a Custom List Page', Step Five
            var list = serverWidget.createList({
                title: 'Purchase History'
            });

            list.style = serverWidget.ListStyle.REPORT;

            list.addButton({
                id: 'buttonid',
                label: 'Test',
                functionName: '' // the function called when the button is pressed
            });

            // Section Two - Columns  - See 'Steps for Creating a Custom List Page', Step Seven
            var datecol = list.addColumn({
                id: 'column1',
                type: serverWidget.FieldType.DATE,
                label: 'Date',
                align: serverWidget.LayoutJustification.RIGHT
            });

            list.addColumn({
                id: 'column2',
                type: serverWidget.FieldType.TEXT,
                label: 'Product',
                align: serverWidget.LayoutJustification.RIGHT
            });

            list.addColumn({
                id: 'column3',
                type: serverWidget.FieldType.INTEGER,
                label: 'Quantity',
                align: serverWidget.LayoutJustification.RIGHT
            });

            list.addColumn({
                id: 'column4',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Unit Cost',
                align: serverWidget.LayoutJustification.RIGHT
            });

            list.addRows({
                rows: [{column1: '05/30/2018', column2: 'Widget', column3: '4', column4: '4.50'},
                    {column1: '05/30/2018', column2: 'Sprocket', column3: '6', column4: '11.50'},
                    {column1: '05/30/2018', column2: 'Gizmo', column3: '9', column4: '1.25'}]
            });
            context.response.writePage(list);
        }
    }

    return {
        onRequest: onRequest
    }
}); 

          
            


            */

            






        	var suiteletURL='https://3431133.app.netsuite.com/app/common/search/searchresults.nl?searchid=53885&whence=';     //var suiteletURL = 'https://debugger.na0.netsuite.com/'+nlapiResolveURL('SUITELET', 'customscript_print_bo_pdf_suitelet', 'customdeploy_print_bo_pdf')+'&custparam_ifid='+theseItems+'&custparam_bos='+backOrderItems;
           // $window.open(suiteletURL, "_self");

        	
        	var form=serverWidget.createForm('Time Clock');
        	/*
        	var list=serverWidget.createList({title:"Current Employees Clocked In"});
        	 /*var datecol = list.addColumn({
                id: 'empimage',
                type: serverWidget.FieldType.IMAGE,
                label: '',
                align: serverWidget.LayoutJustification.RIGHT
            });
*/
        	
        	/*
            list.addColumn({
                id: 'emprfsmart',
                type: serverWidget.FieldType.TEXT,
                label: 'Product',
                align: serverWidget.LayoutJustification.RIGHT
            });

            list.addColumn({
                id: 'workorder',
                type: serverWidget.FieldType.TEXT,
                label: 'Quantity',
                align: serverWidget.LayoutJustification.RIGHT
            });

            list.addColumn({
                id: 'task',
                type: serverWidget.FieldType.TEXT,
                label: 'Unit Cost',
                align: serverWidget.LayoutJustification.RIGHT
            });
             list.addColumn({
                id: 'item',
                type: serverWidget.FieldType.TEXT,
                label: 'Unit Cost',
                align: serverWidget.LayoutJustification.RIGHT
            });
              list.addColumn({
                id: 'start',
                type: serverWidget.FieldType.DATE,
                label: 'Unit Cost',
                align: serverWidget.LayoutJustification.RIGHT
            });
               list.addColumn({
                id: 'end',
                type: serverWidget.FieldType.DATE,
                label: 'Unit Cost',
                align: serverWidget.LayoutJustification.RIGHT
            });
                list.addColumn({
                id: 'department',
                type: serverWidget.FieldType.TEXT,
                label: 'Unit Cost',
                align: serverWidget.LayoutJustification.RIGHT
            });
                list.addRows({
                rows: [{column1: '05/30/2018 06:06:06', column2: 'Widget', column3: '4', column4: '4.50'},
                    {column1: '05/30/2018', column2: 'Sprocket', column3: '6', column4: '11.50'},
                    {column1: '05/30/2018', column2: 'Gizmo', column3: '9', column4: '1.25'}]
            });
        	*/
        	var sublist=form.addSublist({id:'punches',label:'Current Clocked In',type:'list'});
            sublist.addField({id:'empimage',label:'Employee Image',type:'image'});
            sublist.addField({id:'empemp',label:'RF-Smart Employee',type:'select',source:'employee'});
            sublist.addField({id:'opwo',label:'Operation Task:Work Order',type:'select',source:'transaction'});
            sublist.addField({id:'op',label:'Operation Task',type:'select',source:'select'});
            sublist.addField({id:'assitem',label:'Assembly Item',type:'select',source:'item'});
            sublist.addField({id:'start',label:'Start Time',type:'datetimetz'});
            sublist.addField({id:'end',label:'End Time',type:'datetimetz'});
            sublist.addField({id:'dept',label:'Department',type:'select',source:'department'});

        	var customrecord_rfs_operation_sessionSearchObj = search.create({
		   type: "customrecord_rfs_operation_session",
		   filters:
		   [
		      [["custrecord_rfs_op_session_end_standard","isempty",""],"OR",["custrecord_rfs_op_session_end_time","isempty",""]], 
		      "AND", 
		      ["custrecord_rfs_op_session_department","anyof","10","17","16","18","62","15","19","20"]
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
		      search.createColumn({
		         name: "custrecord_rfs_op_session_start_standard",
		         sort: search.Sort.ASC,
		         label: "Start Time (standard)"
		      }),
		      search.createColumn({name: "custrecord_rfs_op_session_end_standard", label: "End Time (standard)"}),
		      search.createColumn({name: "custrecord_rfs_op_session_department", label: "Department"})
		   ]
		});
		var searchResultCount = customrecord_rfs_operation_sessionSearchObj.runPaged().count;
		log.debug("customrecord_rfs_operation_sessionSearchObj result count",searchResultCount);
		var counter=0;
		customrecord_rfs_operation_sessionSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
			var column=result.columns;
			sublist.setSublistValue({id:'empimage',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[0]),line:counter});
			sublist.setSublistValue({id:'empemp',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[1]),line:counter});
			sublist.setSublistValue({id:'opwo',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[2]),line:counter});
			sublist.setSublistValue({id:'op',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[3]),line:counter});
			sublist.setSublistValue({id:'assitem',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[4]),line:counter});
			sublist.setSublistValue({id:'start',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[5]),line:counter});
			sublist.setSublistValue({id:'end',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[6]),line:counter});
			sublist.setSublistValue({id:'dept',value:result.getValue(customrecord_rfs_operation_sessionSearchObj.columns[7]),line:counter});
			//sublist.setSublistValue({id:'empimage',value:urlrld1,line:counter});


			return true;
		});
	
		/*
		customrecord_rfs_operation_sessionSearchObj.id="customsearch1711514079501";
		customrecord_rfs_operation_sessionSearchObj.title="Open RF Smart Session - Pampa (copy)";
		var newSearchId = customrecord_rfs_operation_sessionSearchObj.save();
		*/
        	

        	

//response.write('<html><body><script>window.opener.addItemButtonCallback("' + data + '"); window.close();</script></body></html>');

    		  context.response.writePage(form);
		}
	}

        
        return {
            onRequest: onRequest
        }
    })