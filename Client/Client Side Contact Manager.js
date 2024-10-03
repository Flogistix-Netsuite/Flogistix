/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log','N/runtime'],
	function(record,search,currentRecord,log,runtime){
		
		function pageInit(context)
		{
			var rec1=currentRecord.get();
			var showField=rec1.getField({fieldId:'contact_new_company'});
				showField.isDisplay=false;

		}
		function getallcontacts(context)
		{
			var rec1=currentRecord.get();
				var empId=runtime.getCurrentUser().id;
				var rec1=currentRecord.get();
				var thisField=rec1.fieldId;
				var companyId=rec1.getValue({fieldId:'contact_company'});
				removeContacts(context);
				findContacts(context,'both',empId,companyId);
		}
		function fieldChanged(context){
			try
			{	
				var rec=context.currentRecord;
				var rec1=currentRecord.get();
				var thisField=rec1.fieldId;
				var companyId=rec1.getValue({fieldId:'contact_company'});
				var empId=runtime.getCurrentUser().id;		

				if(context.fieldId=='contact_company')
				{
					var companyId=rec1.getValue({fieldId:'contact_company'});
					if(companyId==-2)
					{
						var showField=rec1.getField({fieldId:'contact_new_company'});
						showField.isDisplay=true;
						//showField.isVisible=true;

						return;
					}
					else if(companyId==-3)
					{
						var showField=rec1.getField({fieldId:'contact_new_company'});
						showField.isDisplay=false;
					}
					//have to do a search for the values of the sublist
					else
					{

						var showField=rec1.getField({fieldId:'contact_new_company'});
						showField.isDisplay=false;
						removeContacts(context);
						//filloutContacts(context,empId,companyId,'company');
						findContacts(context,'company',empId,companyId)
						/*
						var empId=runtime.getCurrentUser().id;						
						var contactSearchObj = search.create({
						   type: "contact",
						   filters:
						   [
						      ["company","anyof",companyId]
						   ],
						   columns:
						   [
						      
						    search.createColumn({name: "internalid", label: "Internal ID"}),
						    search.createColumn({name: "entityid",label:'Entity'}),
						    search.createColumn({name: "email", label: "Email"}),
						    search.createColumn({name: "phone", label: "Phone"}),
						    search.createColumn({name: "address1", label: "Address 1"}),
						    search.createColumn({name: "address2", label: "Address 2"}),
						    search.createColumn({name: "city", label: "City"}),
						    search.createColumn({name: "state", label: "State/Province"}),
						    search.createColumn({name: "zipcode", label: "Zip Code"}),
						    search.createColumn({name: "country", label: "Country"}),
						    search.createColumn({name: "title", label: "Job Title"}),
						    search.createColumn({name: "isdefaultshipping", label: "Default Shipping Address"}),
						    search.createColumn({name: "firstname", label: "First Name"}),
	 						search.createColumn({name: "lastname", label: "Last Name"}),
	 						search.createColumn({name: "company", label: "Company"}),

						   ]
						});
						var searchResultCount = contactSearchObj.runPaged().count;
						log.debug("contactSearchObj result count",searchResultCount);
						contactSearchObj.run().each(function(result){
							var isDefault=result.getValue({name:'isdefaultshipping'});
							if(!isDefault)
								return true;
							var noName=result.getValue({name:'lastname'})
							if(!noName)
								return true;

							rec.selectNewLine({sublistId:'ccontacts'});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_fname',value:result.getValue({name:'firstname'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_lname',value:result.getValue({name:'lastname'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_phone',value:result.getValue({name:'phone'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_email',value:result.getValue({name:'email'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_title',value:result.getValue({name:'title'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_address1',value:result.getValue({name:'address1'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_address2',value:result.getValue({name:'address2'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_city',value:result.getValue({name:'city'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_state',value:result.getValue({name:'state'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_zip',value:result.getValue({name:'zip'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_country',value:result.getValue({name:'country'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_id',value:result.getValue({name:'internalid'})});
							rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_name',value:result.getValue({name:'company'})});
							rec.commitLine({sublistId:'ccontacts'});
						   // .run().each has a limit of 4,000 results
						   return true;
						});
						/*
						rec.selectNewLine({sublistId:'ccontacts'});
						rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_fname',value:'Rodney'});
						rec.commitLine({sublistId:'ccontacts'});
						*/
						//rec1.sublist.setSublistValue({id:'contact_fname',line:0,value:'Rodney'});

					}
				}
				

			}
			catch(err)
			{
				log.debug({title:'err',details:err});
			}
		}
		function filloutContacts(context,srep,company,whichone)
		{
			var rec=context.currentRecord;
			//var rec1=currentRecord.get();

			var contactSearchObj = search.create({
			   type: "contact",
			   filters:
			   [
			      ["company","anyof",company]
			   ],
			   columns:
			   [
			      
			    search.createColumn({name: "internalid", label: "Internal ID"}),
			    search.createColumn({name: "entityid",label:'Entity'}),
			    search.createColumn({name: "email", label: "Email"}),
			    search.createColumn({name: "phone", label: "Phone"}),
			    search.createColumn({name: "address1", label: "Address 1"}),
			    search.createColumn({name: "address2", label: "Address 2"}),
			    search.createColumn({name: "city", label: "City"}),
			    search.createColumn({name: "state", label: "State/Province"}),
			    search.createColumn({name: "zipcode", label: "Zip Code"}),
			    search.createColumn({name: "country", label: "Country"}),
			    search.createColumn({name: "title", label: "Job Title"}),
			    search.createColumn({name: "isdefaultshipping", label: "Default Shipping Address"}),
			    search.createColumn({name: "firstname", label: "First Name"}),
				search.createColumn({name: "lastname", label: "Last Name"}),
				search.createColumn({name: "company", label: "Company"}),

			   ]
			});
			var searchResultCount = contactSearchObj.runPaged().count;
			log.debug("contactSearchObj result count",searchResultCount);
			contactSearchObj.run().each(function(result){
				var isDefault=result.getValue({name:'isdefaultshipping'});
				if(!isDefault)
					return true;
				var noName=result.getValue({name:'lastname'})
				if(!noName)
					return true;

				rec.selectNewLine({sublistId:'ccontacts'});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_fname',value:result.getValue({name:'firstname'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_lname',value:result.getValue({name:'lastname'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_phone',value:result.getValue({name:'phone'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_email',value:result.getValue({name:'email'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_title',value:result.getValue({name:'title'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_address1',value:result.getValue({name:'address1'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_address2',value:result.getValue({name:'address2'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_city',value:result.getValue({name:'city'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_state',value:result.getValue({name:'state'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_zip',value:result.getValue({name:'zip'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_country',value:result.getValue({name:'country'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_id',value:result.getValue({name:'internalid'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_name',value:result.getText({name:'company'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_id',value:result.getValue({name:'company'})});
				rec.commitLine({sublistId:'ccontacts'});
			   // .run().each has a limit of 4,000 results
			   return true;
			});
		}
		function removeContacts(context)
		{
			
			var rec=null;
			try
			{
				rec=context.currentRecord;
			}
			catch(err)
			{
				rec=currentRecord.get();
			}
			var howMany=rec.getLineCount({sublistId:'ccontacts'});
			for(var hm=0;hm<howMany;hm++)
			{
				rec.removeLine({sublistId:'ccontacts',line:hm});
				howMany=rec.getLineCount({sublistId:'ccontacts'});
				hm--;
			}

		}
		function getnoncompany(context)
		{
			var rec1=currentRecord.get();
				var empId=runtime.getCurrentUser().id;
				var rec1=currentRecord.get();
				var thisField=rec1.fieldId;
				var companyId=rec1.getValue({fieldId:'contact_company'});
				removeContacts(context);
				findContacts(context,'emp',empId,companyId);
		}
		function findContacts(context,kind,emp,company)
		{
			var rec=null;
			try
			{
				rec=context.currentRecord;
			}
			catch(err)
			{
				rec=currentRecord.get();
			}
			var contactSearchObj=null;
			var filters=null;
			var columns=null;
			columns=
			   [
			      
			    search.createColumn({name: "internalid", label: "Internal ID"}),
			    search.createColumn({name: "entityid",label:'Entity'}),
			    search.createColumn({name: "email", label: "Email"}),
			    search.createColumn({name: "phone", label: "Phone"}),
			    search.createColumn({name: "address1", label: "Address 1"}),
			    search.createColumn({name: "address2", label: "Address 2"}),
			    search.createColumn({name: "city", label: "City"}),
			    search.createColumn({name: "state", label: "State/Province"}),
			    search.createColumn({name: "zipcode", label: "Zip Code"}),
			    search.createColumn({name: "country", label: "Country"}),
			    search.createColumn({name: "title", label: "Job Title"}),
			    search.createColumn({name: "isdefaultshipping", label: "Default Shipping Address"}),
			    search.createColumn({name: "firstname", label: "First Name"}),
				search.createColumn({name: "lastname", label: "Last Name"}),
				search.createColumn({name: "company", label: "Company"}),

			   ]
			
			if(kind=='both')
			{
				   filters=
				   [
				      ["custentity_sr","anyof",emp], 
				      "OR", 
				      ["company","anyof",company]
				   ]
			}
			else if(kind=='company')
			{
				filters=
				   [
				      ["company","anyof",company]
				   ]
			}
			else if(kind=='emp')
			{
				filters=
				   [
				      ["custentity_sr","anyof",emp],
				       "AND", 
      				  ["company","anyof","@NONE@"]
				   ]
			}
			var contactSearchObj=search.create({type:'contact',filters:filters,columns:columns});
			contactSearchObj.run().each(function(result){
				var isDefault=result.getValue({name:'isdefaultshipping'});
				var noName=result.getValue({name:'lastname'})
				if(!noName)
					return true;

				rec.selectNewLine({sublistId:'ccontacts'});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_fname',value:result.getValue({name:'firstname'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_lname',value:result.getValue({name:'lastname'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_phone',value:result.getValue({name:'phone'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_email',value:result.getValue({name:'email'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_title',value:result.getValue({name:'title'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_address1',value:result.getValue({name:'address1'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_address2',value:result.getValue({name:'address2'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_city',value:result.getValue({name:'city'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_state',value:result.getValue({name:'state'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_zip',value:result.getValue({name:'zip'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_country',value:result.getValue({name:'country'})});
				rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_id',value:result.getValue({name:'internalid'})});
				var anyCompany=result.getText({name:'company'});
				if(result.getText({name:'company'}))
				{
					rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_name',value:result.getText({name:'company'})});
					rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_id',value:result.getValue({name:'company'})});
				}
				else
				{
					rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_name',value:result.getValue({name:'entityid'})});
					rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_id',value:-3});
				
				}
				rec.commitLine({sublistId:'ccontacts'});
			   // .run().each has a limit of 4,000 results
			   return true;
			});
		}
		function validateLine(context)
		{
			var rec=context.currentRecord;
			var rec1=currentRecord.get();
			var whatSublist=context.sublistId;
			if(whatSublist=='ccontacts')
				{//alert('Works');
					var companyId=rec1.getValue({fieldId:'contact_company'});
					if(companyId>0)
						return true;
					if(companyId==-2)
					{
						var useMe=rec1.getValue({fieldId:'contact_new_company'});
						rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_name',value:useMe});
						rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_id',value:-2})
					}
					if(companyId==-3)
					{
						var useMe=rec1.getValue({fieldId:'contact_new_company'});
						rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_name',value:useMe});
						rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_id',value:-3})
					}
					/*if(companyId>0)
					{
						var useMe=rec1.getText({fieldId:'contact_company'});
						var useMeValue=rec1.getValue({fieldId:'contact_company'});
						rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_name',value:useMe});
						rec.setCurrentSublistValue({sublistId:'ccontacts',fieldId:'contact_company_id',value:useMeValue});
					
					}
					*/

				}

			return true;

		}
		
		
		
		return {
			pageInit:pageInit,
			fieldChanged:fieldChanged,
			filloutContacts:filloutContacts,
			validateLine:validateLine,
			getallcontacts:getallcontacts,
			getnoncompany:getnoncompany

		
		};
});