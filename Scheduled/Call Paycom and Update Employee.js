/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime','N/https','N/email'], 
	function(file, record, search,runtime,https,email) {
		function execute(options){  

			//get field
			var scriptObj=runtime.getCurrentScript();
			var empId=scriptObj.getParameter({name:'custscript_pc_emp'});
			var thisEmp=findEmp(empId);
				if(!thisEmp)
				{
					email.send({author:-5,recipients:'rodneyveach123@gmail.com',subject:'No ID Found',body:empId});
					return;
				}
			//var fieldToFind=scriptObj.getParameter({name:'custscript_pc_field'});
			//get code
			//url
			//get informatin
			//save and move on
			var headers={
				'Authorization': 'Basic MDU2MDdhNTMzNzFhYjNhZGZkY2VlMTI0Y2NhMTJiNjViZDdkMDExOWRhMzhjZGY0NWM5NTk2ZjMyYTlmY2FmODpkNjkwZGRmNjAzMTZiODk2ZWU0MGVlNDRjNGEyM2MyMjc5NTE0MzNiNTdmYzA4MmIyNTk4YWJhNmUzODQwZjMz',
			}
			var url='https://api.paycomonline.net/v4/rest/index.php/api/v1/employee/'+empId;
			var response=https.get({
				url:url,
				headers:headers
			});
			var dataIn=response.body;
			
			var ugh=JSON.parse(dataIn);
			var results=ugh.data.length;
			var findDepartment=ugh.data[0].department_code;
			var findJobCode=ugh.data[0].cat2;
			var stopNow=false;
			var fieldToUpdate=null;
			var newArea=null;
			var newAreaName=null;
			var newDepartment=null;
			var newDepartmentName=null;
			
			var classificationSearchObj = search.create({
			   type: "classification",
			   filters:
			   [
			      ["custrecord_paycom_code","is",findJobCode.toString()]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal"})
			   ]
			});
			var searchResultCount = classificationSearchObj.runPaged().count;
			log.debug("classificationSearchObj result count",searchResultCount);
			classificationSearchObj.run().each(function(result){
				newArea=result.getValue({name:'internalid'});
				newAreaName=result.getValue({name:'name'});
			   // .run().each has a limit of 4,000 results
			   return true;
			});
			var departmentSearchObj = search.create({
					   type: "department",
					   filters:
					   [
					      ["custrecord_paycom_dept_id","is",findDepartment]
					   ],
					   columns:
					   [
					      search.createColumn({name: "internalid", label: "Internal ID"}),
					       search.createColumn({name: "name", label:"name"})
					   ]
					});
					var searchResultCount = departmentSearchObj.runPaged().count;
					log.debug("departmentSearchObj result count",searchResultCount);
					departmentSearchObj.run().each(function(result){
						newDepartment=result.getValue({name:'internalid'});
						newDepartmentName=result.getValue({name:'name'});
					   // .run().each has a limit of 4,000 results
					   return false;
					});
					var empRec=record.load({type:'employee',id:thisEmp});
					var currentDept=empRec.getValue({fieldId:'department'});
					var currentDeptName=empRec.getText({fieldId:'department'});
					var currentClass=empRec.getValue({fieldId:'class'});
					var currentClassName=empRec.getText({fieldId:'class'});
					var empName=empRec.getValue({fieldId:'entityid'});
					var changes='The following have changed for '+empName+'\n';
					if(currentDept!=newDepartment)
					{
						empRec.setValue({fieldId:'department',value:newDepartment});
						changes=changes +'Department is now '+newDepartmentName+ 'from '+currentDeptName+'\n';
					}
					if(currentClass!=newArea)
					{
						changes=changes +'Op Area is now '+newAreaName+ 'from '+currentClassName+'\n';
						empRec.setValue({fieldId:'class',value:newArea});
					}
				
				//record.submitFields({type:'employee',id:thisEmp,values:{'department':newDepartment,'class':newArea}});
				empRec.save();
                email.send({author:18067,recipients:[18067,2375,29250],subject:'Employee Record updated for Paycom ID '+empId,body:'Employee Record changed!'});
				
			}

			

			function findEmp(thisId)
			{
			var returnValue=null;
			var employeeSearchObj = search.create({
			   type: "employee",
			   filters:
			   [
			      ["custentity_paycom_id","is",thisId]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"}),

			   ]
			});
			var searchResultCount = employeeSearchObj.runPaged().count;
			log.debug("employeeSearchObj result count",searchResultCount);
			employeeSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				returnValue=result.getValue({name:'internalid'});
			   return true;
			});
			return returnValue;
			}

	return {
		execute  : execute
	};
})