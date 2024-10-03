/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log','N/runtime','N/url','N/https'],
	function(record,search,currentRecord,log,runtime,url,https){
		
		function fieldChanged(context){
			
		}
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{
			try
			{


				var rec=context.currentRecord;
				var scriptObj=runtime.getCurrentScript();
				var thisEmployee=rec.getValue({fieldId:'employee'});
				var complete=false;
				var suiteletURL= url.resolveScript({
                    scriptId: 'customscript_find_emp_department',
                    deploymentId: 'customdeploy_find_emp_department',
                    returnExternalUrl: false,
                    params: {
                        'this_employee': thisEmployee,
                    }
                });
                var departmentIndex=null;
                https.get.promise({
                    url: suiteletURL
                }).then(function (response) {
                	log.debug({
		            title: 'Response',
		            details: response
		        });
                    departmentIndex=response;
                }).catch(function (reason) {
                    log.error("failed to send email", reason)
                    
                });
				/*
				var empDepartment=search.lookupFields({
					type:'employee',
					id:thisEmployee,
					columns:['department']
				});
				*/
				var theseDepartments=scriptObj.getParameter({name:'custscript_erd_required_departments'});
				var departmentSplits=theseDepartments.split(',');
				var departmentIndex=departmentSplits.indexOf(empDepartment.department[0].value);
				
				if(departmentIndex==-1)
					return true;
				var erd=rec.getCurrentSublistValue({sublistId:'item',fieldId:'custcol_custom_erd'});
				if(!erd)
				{
					alert('You must enter an Expected Receipt Date. \nLine will not save until this is filled out for every line item.');
					return false;
				}


				return true;
			}
			catch(err)
			{
				log.error({title:'Error on ERD Verification',details:err.message});
				return true;
			}

		}
		function saveRec(context)
		{
			try
			{


			var rec=context.currentRecord;
			var scriptObj=runtime.getCurrentScript();

			var thisEmployee=rec.getValue({fieldId:'employee'});
			var empDepartment=search.lookupFields({
				type:'employee',
				id:thisEmployee,
				columns:['department']
			});
			var theseDepartments=scriptObj.getParameter({name:'custscript_erd_required_departments'});
			var departmentSplits=theseDepartments.split(',');
			var departmentIndex=departmentSplits.indexOf(empDepartment.department[0].value);
			if(departmentIndex==-1)
				return true;
			var howMany=rec.getLineCount({sublistId:'item'});
				for(var hm=0;hm<howMany;hm++)
				{
					var erd=rec.getSublistValue({sublistId:'item',fieldId:'custcol_custom_erd',line:hm});
					if(!erd)
					{
						alert('You must enter an Expected Receipt Date. \nPO will not save until this is filled out for every line item.');
						return false;
					}
				}
			return true;
			}
			catch(err)
			{
				log.error({title:'Error on ERD Verification',details:err.message});
				return true;
			}
		}

		return {
		//	updateSuitelet:updateSuitelet,
		//	fieldChanged:fieldChanged,

		//	postSourcing:validateField,
			validateLine:validateLine,
			saveRecord: saveRec
		};
});