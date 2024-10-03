/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/log','N/search','N/email'],
		function(record,log,search,email) {
			function beforeLoad(context) 
			{
				

			}
			function beforeSubmit(context) 
			{
				try
				{
					var rec=context.newRecord;
					var whatEmail=rec.getValue({fieldId:'custbody_stampli_approver_email'});
					var approver=null;
					var isFromPO=rec.getValue({fieldId:'custbody_created_from_po'});
					if(whatEmail=='rbrown@flogistix.com')
					{
						rec.setValue({fieldId:'custbody_bill_approver',value:18067});
						return true;
					}
					//check if PO exists first
					
					else if(isFromPO)
					{
						//find the related PO
						//get the approver on that
						//cycle through approvers
						//save
						//var how_many=rec.getLineCount('purchaseorders');

						po=rec.getSublistValue({sublistId:'purchaseorders',fieldId:'id',line:0});
						var poRec=record.load({type:'purchasorder',id:po});
						var whoCreated=poRec.getValue({fieldId:'requestor'});
						var poTotal=poRec.getValue({fieldId:'total'});
						var stop=false;
						var empRec=record.load({type:'employee',id:whoCreated});
						var empLimit=empRec.getValue({fieldId:'purchaseorderlimit'});
						var nextApprover=empRec.getValue({fieldId:'purchaseorderapprover'});

						if(empLimit>=poTotal)
							{
								approver=whoCreated
								stop=true;
							}

						do
						{

							var empRec=record.load({type:'employee',id:nextApprover});
							
							var empLimit=empRec.getValue({fieldId:'purchaseorderapprovallimit'});
							if(empLimit>=poTotal)
							{
								approver=nextApprover
								stop=true;
							}
							else
							{
								nextApprover=empRec.getValue({fieldId:'purchaseorderapprover'});
								if(!nextApprover)
								{
									email.send({
										author:-5,
										recipients:29250,
										subject:'Bad time on approving',
										body:rec.id

									});
									return true;
								}
							}

						}while(!stop)
						//do a loop to cycle through here

						//now we cycle

						//return true;
					}
					else if(whatEmail)
					{
						var employeeSearchObj = search.create({
						   type: "employee",
						   filters:
						   [
						      ["email","is",whatEmail]
						   ],
						   columns:
						   [
	
						      search.createColumn({name: "internalid", label: "Internal Id"}),
						     
						   ]
						});
						var searchResultCount = employeeSearchObj.runPaged().count;
						log.debug("employeeSearchObj result count",searchResultCount);
						employeeSearchObj.run().each(function(result){
						   // .run().each has a limit of 4,000 results
							approver=result.getValue({name:'internalid'});
						   return true;
						});
						
						/*
						employeeSearchObj.id="customsearch1694538286988";
						employeeSearchObj.title="Custom Employee Search 3 (copy)";
						var newSearchId = employeeSearchObj.save();
						*/
					}
					rec.setValue({fieldId:'custbody_bill_approver',value:approver});
				}
				catch(err)
				{
					
				}
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				
				
			}

			
			return {
			//beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			//afterSubmit: afterSubmit
			};
});
