function updateContacts()
{
	var context=nlapiGetContext();
	var whatObject=context.getSetting('SCRIPT','custscript_cm_contacts');
    nlapiLogExecution('debug','whatObject',whatObject);
	//var whatObject=whatObject1.replace(/ /gi,'"');
	//var whatdoesthisdo=JSON.parse(JSON.stringify(whatObject))
	var whatEmp=context.getSetting('SCRIPT','custscript_cm_emp');
	var parseContacts=JSON.parse(whatObject);
	for(var p=0;p<parseContacts.length;p++)
	{
		if(context.getRemainingUsage()<250)
			nlapiYieldScript();
		//var dkdfdfd=99;
		var contactId=parseContacts[p].contactId;
		var companyName=parseContacts[p].companyName;
		var companyId=parseContacts[p].companyId;
		var contactFirst=parseContacts[p].contactFirst;
		var contactLast=parseContacts[p].contactLast;
		var contactPhone=parseContacts[p].contactPhone;
		var contactEmail=parseContacts[p].contactEmail;
		var contactTitle=parseContacts[p].contactTitle;
		var contactAddress1=parseContacts[p].contactAddress1;
		var contactAddress2=parseContacts[p].contactAddress2;
		var contactCity=parseContacts[p].contactCity;
		var contactState=parseContacts[p].contactState;
		var contactZip=parseContacts[p].contactZip;
		var contactCountry=parseContacts[p].contactCountry;
		var findCompany=null;
		var newCompany=null;
		var thisCompany=null;
		if(!contactId && companyId>0)
		{
			//this is creation for new contact on the company
			contact('new',companyId,contactFirst,contactLast,contactPhone,contactEmail,contactTitle,contactAddress1,contactAddress2,contactCity,contactState,contactZip,contactCountry,whatEmp,contactId);

		}
		else if(!contactId && companyId !=-3 && companyName)
		{
			//this is a creation for new contact and new company
			findCompany=searchCompany(companyName,whatEmp);
			if(!findCompany)
				thisCompany=company(companyName,whatEmp)
			else
				thisCompany=findCompany;
			contact('new',thisCompany,companyName,contactFirst,contactLast,contactPhone,contactEmail,contactTitle,contactAddress1,contactAddress2,contactCity,contactState,contactZip,contactCountry,whatEmp,contactId);

		}
		else if(!contactId && companyId==-3)
		{
			//this is creation of new contact but no assigned company
			contact('new',null,companyName,contactFirst,contactLast,contactPhone,contactEmail,contactTitle,contactAddress1,contactAddress2,contactCity,contactState,contactZip,contactCountry,whatEmp,contactId);


		}
		else if(contactId && companyId>0)
		{
			//this is an update to an existing contact to an existing company
			contact('update',companyId,companyName,contactFirst,contactLast,contactPhone,contactEmail,contactTitle,contactAddress1,contactAddress2,contactCity,contactState,contactZip,contactCountry,whatEmp,contactId);


		}
		else if(contactId && companyId==-3)
		{
			//this is an update to an existing contact to an existing company
			contact('update',companyId,companyName,contactFirst,contactLast,contactPhone,contactEmail,contactTitle,contactAddress1,contactAddress2,contactCity,contactState,contactZip,contactCountry,whatEmp,contactId);


		}
		else if(contactId && companyId!=-3)
		{
			//this is an update to an existing contact to a non existant company
			findCompany=searchCompany(companyName,whatEmp);
			if(!findCompany)
				thisCompany=company(companyName,whatEmp)
			else
				thisCompany=findCompany;
			contact('update',thisCompany,companyName,contactFirst,contactLast,contactPhone,contactEmail,contactTitle,contactAddress1,contactAddress2,contactCity,contactState,contactZip,contactCountry,whatEmp,contactId);

		}
		else if(contactId && companyId==-3)
		{
			//this is an update to an existing contact to a free form company
			findCompany=searchCompany(companyName,whatEmp);
			if(!findCompany)
				thisCompany=company(companyName,whatEmp);
			else
				thisCompany=findCompany;
			contact('update',null,companyName,contactFirst,contactLast,contactPhone,contactEmail,contactTitle,contactAddress1,contactAddress2,contactCity,contactState,contactZip,contactCountry,whatEmp,contactId);

		}
	}

}


function contact(updateNew,companyId,companyName,firstName,lastName,phone,email,title,address1,address2,city,state,zip,country,emp,contactId)
{
	var contactRec=null;
	var empRec=nlapiLoadRecord('employee',emp);
	var empInitials=empRec.getFieldValue('initials');
	if(updateNew=='new')
		contactRec=nlapiCreateRecord('contact');
	else
		contactRec=nlapiLoadRecord('contact',contactId);
	if(companyId==-3)
		contactRec.setFieldValue('entityid',firstName+' '+lastName+ '-'+empInitials);
		contactRec.setFieldValue('firstname',firstName);
		contactRec.setFieldValue('lastname',lastName);
	if(companyId!=-3)
		contactRec.setFieldValue('company',companyId);
		contactRec.setFieldValue('phone',phone);
		contactRec.setFieldValue('email',email);
		contactRec.setFieldValue('title',title);			
		contactRec.setFieldValue('custentity_sr',emp);
		contactRec.setFieldValue('subsidiary',4);
		//now, address
		
		if(updateNew=='new')
		{
			if(country)
				contactAddress(contactRec,-1,address1,country,firstName,lastName,phone,address2,city,state,zip)
		}
		else
		{
			var addressLines=contactRec.getLineItemCount('addressbook');
			for(var a=1;a<addressLines+1;a++)
			{
				var isBilling=contactRec.getLineItemValue('addressbook','defaultbilling',a);
				var isShipping=contactRec.getLineItemValue('addressbook','defaultshipping',a);
				if(isBilling=='T' && isShipping=='T')
					contactAddress(contactRec,a,address1,country,firstName,lastName,phone,address2,city,state,zip);
				else if(isBilling=='T' && isShipping=='F')
					contactAddress(contactRec,a,address1,country,firstName,lastName,phone,address2,city,state,zip);
				else if(isShipping=='T' && isBilling=='F')
					contactAddress(contactRec,a,address1,country,firstName,lastName,phone,address2,city,state,zip);
			}
			
		}
		
		
	nlapiSubmitRecord(contactRec);


	
}
function company(companyName,whatEmp)
{
	var companyRec=nlapiCreateRecord('prospect',{recordmode:'dynamic'});
		companyRec.setFieldValue('customform',-8)
		companyRec.setFieldValue('companyname',companyName);
		companyRec.setFieldValue('entitystatus',8);
		companyRec.setFieldValue('salesrep',whatEmp);
		companyRec.setFieldValue('subsidiary',4);
	var companyRecId=nlapiSubmitRecord(companyRec);
	return companyRecId;
}
function contactAddress(contactRec,line,address1,country,firstName,lastName,phone,address2,city,state,zip)
{
	var addressRec=null;
	if(line==-1)
	{
		contactRec.selectNewLineItem('addressbook');
		contactRec.setCurrentLineItemValue('addressbook','label',address1);
		contactRec.setCurrentLineItemValue('addressbook','defaultshipping','T');
		contactRec.setCurrentLineItemValue('addressbook','defaultbilling','T');
		addressRec=contactRec.createCurrentLineItemSubrecord('addressbook','addressbookaddress');
	}
	else
	{
		contactRec.selectLineItem('addressbook',line);
		contactRec.setCurrentLineItemValue('addressbook','label',address1);
		//do we have a subrecord
		var srExist=contactRec.viewCurrentLineItemSubrecord('addressbook','addressbookaddress');
		if(srExist)
			addressRec=contactRec.editCurrentLineItemSubrecord('addressbook','addressbookaddress');
		else
			addressRec=contactRec.createCurrentLineItemSubrecord('addressbook','addressbookaddress');
	}
		if(country)
			addressRec.setFieldValue('country',country);
		else
			addressRec.setFieldValue('country','US');
		addressRec.setFieldValue('addressee',firstName+' '+lastName);
		addressRec.setFieldValue('addphone',phone);
		addressRec.setFieldValue('addr1',address1);
		addressRec.setFieldValue('addr2',address2);
		if(city)
			addressRec.setFieldValue('city',city);
		if(state)
			addressRec.setFieldValue('state',state);
		if(zip)
			addressRec.setFieldValue('zip',zip);
		addressRec.commit();
	contactRec.commitLineItem('addressbook');
	
}
function searchCompany(companyName,whatEmp)
{
	var returnValue=null;
	var customerSearch = nlapiSearchRecord("customer",null,
	[
	   ["companyname","contains",companyName], 
	   "AND", 
	   ["salesrep","anyof",whatEmp]
	], 
	[
	   new nlobjSearchColumn("internalid")
	]
	);
	if(customerSearch)
		returnValue=customerSearch[0].getValue('internalid')
	else
	{
		var customerSearch = nlapiSearchRecord("customer",null,
		[
		   ["companyname","contains",companyName]
		], 
		[
		   new nlobjSearchColumn("internalid")
		]
		);
		if(customerSearch)
			returnValue=customerSearch[0].getValue('internalid')


	}
	return returnValue;

	
}