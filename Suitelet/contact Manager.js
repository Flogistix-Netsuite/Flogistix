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
        //var currentUser=runtime.getUser();
        if (request.method == 'GET') 
        {
        	var currentUser=runtime.getCurrentUser();

    		var countries = [{"value":"AF","text":"Afghanistan"},{"value":"AX","text":"Aland Islands"},{"value":"AL","text":"Albania"},{"value":"DZ","text":"Algeria"},{"value":"AS","text":"American Samoa"},{"value":"AD","text":"Andorra"},{"value":"AO","text":"Angola"},{"value":"AI","text":"Anguilla"},{"value":"AQ","text":"Antarctica"},{"value":"AG","text":"Antigua and Barbuda"},{"value":"AR","text":"Argentina"},{"value":"AM","text":"Armenia"},{"value":"AW","text":"Aruba"},{"value":"AU","text":"Australia"},{"value":"AT","text":"Austria"},{"value":"AZ","text":"Azerbaijan"},{"value":"BS","text":"Bahamas"},{"value":"BH","text":"Bahrain"},{"value":"BD","text":"Bangladesh"},{"value":"BB","text":"Barbados"},{"value":"BY","text":"Belarus"},{"value":"BE","text":"Belgium"},{"value":"BZ","text":"Belize"},{"value":"BJ","text":"Benin"},{"value":"BM","text":"Bermuda"},{"value":"BT","text":"Bhutan"},{"value":"BO","text":"Bolivia"},{"value":"BQ","text":"Bonaire, Saint Eustatius and Saba"},{"value":"BA","text":"Bosnia and Herzegovina"},{"value":"BW","text":"Botswana"},{"value":"BV","text":"Bouvet Island"},{"value":"BR","text":"Brazil"},{"value":"IO","text":"British Indian Ocean Territory"},{"value":"BN","text":"Brunei Darussalam"},{"value":"BG","text":"Bulgaria"},{"value":"BF","text":"Burkina Faso"},{"value":"BI","text":"Burundi"},{"value":"KH","text":"Cambodia"},{"value":"CM","text":"Cameroon"},{"value":"CA","text":"Canada"},{"value":"IC","text":"Canary Islands"},{"value":"CV","text":"Cape Verde"},{"value":"KY","text":"Cayman Islands"},{"value":"CF","text":"Central African Republic"},{"value":"EA","text":"Ceuta and Melilla"},{"value":"TD","text":"Chad"},{"value":"CL","text":"Chile"},{"value":"CN","text":"China"},{"value":"CX","text":"Christmas Island"},{"value":"CC","text":"Cocos (Keeling) Islands"},{"value":"CO","text":"Colombia"},{"value":"KM","text":"Comoros"},{"value":"CD","text":"Congo, Democratic Republic of"},{"value":"CG","text":"Congo, Republic of"},{"value":"CK","text":"Cook Islands"},{"value":"CR","text":"Costa Rica"},{"value":"CI","text":"Cote d'Ivoire"},{"value":"HR","text":"Croatia/Hrvatska"},{"value":"CU","text":"Cuba"},{"value":"CW","text":"CuraÃ§ao"},{"value":"CY","text":"Cyprus"},{"value":"CZ","text":"Czech Republic"},{"value":"DK","text":"Denmark"},{"value":"DJ","text":"Djibouti"},{"value":"DM","text":"Dominica"},{"value":"DO","text":"Dominican Republic"},{"value":"TL","text":"East Timor"},{"value":"EC","text":"Ecuador"},{"value":"EG","text":"Egypt"},{"value":"SV","text":"El Salvador"},{"value":"GQ","text":"Equatorial Guinea"},{"value":"ER","text":"Eritrea"},{"value":"EE","text":"Estonia"},{"value":"ET","text":"Ethiopia"},{"value":"FK","text":"Falkland Islands"},{"value":"FO","text":"Faroe Islands"},{"value":"FJ","text":"Fiji"},{"value":"FI","text":"Finland"},{"value":"FR","text":"France"},{"value":"GF","text":"French Guiana"},{"value":"PF","text":"French Polynesia"},{"value":"TF","text":"French Southern Territories"},{"value":"GA","text":"Gabon"},{"value":"GM","text":"Gambia"},{"value":"GE","text":"Georgia"},{"value":"DE","text":"Germany"},{"value":"GH","text":"Ghana"},{"value":"GI","text":"Gibraltar"},{"value":"GR","text":"Greece"},{"value":"GL","text":"Greenland"},{"value":"GD","text":"Grenada"},{"value":"GP","text":"Guadeloupe"},{"value":"GU","text":"Guam"},{"value":"GT","text":"Guatemala"},{"value":"GG","text":"Guernsey"},{"value":"GN","text":"Guinea"},{"value":"GW","text":"Guinea-Bissau"},{"value":"GY","text":"Guyana"},{"value":"HT","text":"Haiti"},{"value":"HM","text":"Heard and McDonald Islands"},{"value":"VA","text":"Holy See (City Vatican State)"},{"value":"HN","text":"Honduras"},{"value":"HK","text":"Hong Kong"},{"value":"HU","text":"Hungary"},{"value":"IS","text":"Iceland"},{"value":"IN","text":"India"},{"value":"ID","text":"Indonesia"},{"value":"IR","text":"Iran (Islamic Republic of)"},{"value":"IQ","text":"Iraq"},{"value":"IE","text":"Ireland"},{"value":"IM","text":"Isle of Man"},{"value":"IL","text":"Israel"},{"value":"IT","text":"Italy"},{"value":"JM","text":"Jamaica"},{"value":"JP","text":"Japan"},{"value":"JE","text":"Jersey"},{"value":"JO","text":"Jordan"},{"value":"KZ","text":"Kazakhstan"},{"value":"KE","text":"Kenya"},{"value":"KI","text":"Kiribati"},{"value":"KP","text":"Korea, Democratic People's Republic"},{"value":"KR","text":"Korea, Republic of"},{"value":"XK","text":"Kosovo"},{"value":"KW","text":"Kuwait"},{"value":"KG","text":"Kyrgyzstan"},{"value":"LA","text":"Lao People's Democratic Republic"},{"value":"LV","text":"Latvia"},{"value":"LB","text":"Lebanon"},{"value":"LS","text":"Lesotho"},{"value":"LR","text":"Liberia"},{"value":"LY","text":"Libya"},{"value":"LI","text":"Liechtenstein"},{"value":"LT","text":"Lithuania"},{"value":"LU","text":"Luxembourg"},{"value":"MO","text":"Macau"},{"value":"MK","text":"Macedonia"},{"value":"MG","text":"Madagascar"},{"value":"MW","text":"Malawi"},{"value":"MY","text":"Malaysia"},{"value":"MV","text":"Maldives"},{"value":"ML","text":"Mali"},{"value":"MT","text":"Malta"},{"value":"MH","text":"Marshall Islands"},{"value":"MQ","text":"Martinique"},{"value":"MR","text":"Mauritania"},{"value":"MU","text":"Mauritius"},{"value":"YT","text":"Mayotte"},{"value":"MX","text":"Mexico"},{"value":"FM","text":"Micronesia, Federal State of"},{"value":"MD","text":"Moldova, Republic of"},{"value":"MC","text":"Monaco"},{"value":"MN","text":"Mongolia"},{"value":"ME","text":"Montenegro"},{"value":"MS","text":"Montserrat"},{"value":"MA","text":"Morocco"},{"value":"MZ","text":"Mozambique"},{"value":"MM","text":"Myanmar (Burma)"},{"value":"NA","text":"Namibia"},{"value":"NR","text":"Nauru"},{"value":"NP","text":"Nepal"},{"value":"NL","text":"Netherlands"},{"value":"AN","text":"Netherlands Antilles (Deprecated)"},{"value":"NC","text":"New Caledonia"},{"value":"NZ","text":"New Zealand"},{"value":"NI","text":"Nicaragua"},{"value":"NE","text":"Niger"},{"value":"NG","text":"Nigeria"},{"value":"NU","text":"Niue"},{"value":"NF","text":"Norfolk Island"},{"value":"MP","text":"Northern Mariana Islands"},{"value":"NO","text":"Norway"},{"value":"OM","text":"Oman"},{"value":"PK","text":"Pakistan"},{"value":"PW","text":"Palau"},{"value":"PS","text":"Palestinian Territories"},{"value":"PA","text":"Panama"},{"value":"PG","text":"Papua New Guinea"},{"value":"PY","text":"Paraguay"},{"value":"PE","text":"Peru"},{"value":"PH","text":"Philippines"},{"value":"PN","text":"Pitcairn Island"},{"value":"PL","text":"Poland"},{"value":"PT","text":"Portugal"},{"value":"PR","text":"Puerto Rico"},{"value":"QA","text":"Qatar"},{"value":"RE","text":"Reunion Island"},{"value":"RO","text":"Romania"},{"value":"RU","text":"Russian Federation"},{"value":"RW","text":"Rwanda"},{"value":"BL","text":"Saint BarthÃ©lemy"},{"value":"SH","text":"Saint Helena"},{"value":"KN","text":"Saint Kitts and Nevis"},{"value":"LC","text":"Saint Lucia"},{"value":"MF","text":"Saint Martin"},{"value":"VC","text":"Saint Vincent and the Grenadines"},{"value":"WS","text":"Samoa"},{"value":"SM","text":"San Marino"},{"value":"ST","text":"Sao Tome and Principe"},{"value":"SA","text":"Saudi Arabia"},{"value":"SN","text":"Senegal"},{"value":"RS","text":"Serbia"},{"value":"CS","text":"Serbia and Montenegro (Deprecated)"},{"value":"SC","text":"Seychelles"},{"value":"SL","text":"Sierra Leone"},{"value":"SG","text":"Singapore"},{"value":"SX","text":"Sint Maarten"},{"value":"SK","text":"Slovak Republic"},{"value":"SI","text":"Slovenia"},{"value":"SB","text":"Solomon Islands"},{"value":"SO","text":"Somalia"},{"value":"ZA","text":"South Africa"},{"value":"GS","text":"South Georgia"},{"value":"SS","text":"South Sudan"},{"value":"ES","text":"Spain"},{"value":"LK","text":"Sri Lanka"},{"value":"PM","text":"St. Pierre and Miquelon"},{"value":"SD","text":"Sudan"},{"value":"SR","text":"Suriname"},{"value":"SJ","text":"Svalbard and Jan Mayen Islands"},{"value":"SZ","text":"Swaziland"},{"value":"SE","text":"Sweden"},{"value":"CH","text":"Switzerland"},{"value":"SY","text":"Syrian Arab Republic"},{"value":"TW","text":"Taiwan"},{"value":"TJ","text":"Tajikistan"},{"value":"TZ","text":"Tanzania"},{"value":"TH","text":"Thailand"},{"value":"TG","text":"Togo"},{"value":"TK","text":"Tokelau"},{"value":"TO","text":"Tonga"},{"value":"TT","text":"Trinidad and Tobago"},{"value":"TN","text":"Tunisia"},{"value":"TR","text":"Turkey"},{"value":"TM","text":"Turkmenistan"},{"value":"TC","text":"Turks and Caicos Islands"},{"value":"TV","text":"Tuvalu"},{"value":"UG","text":"Uganda"},{"value":"UA","text":"Ukraine"},{"value":"AE","text":"United Arab Emirates"},{"value":"GB","text":"United Kingdom (GB)"},{"value":"US","text":"United States"},{"value":"UY","text":"Uruguay"},{"value":"UM","text":"US Minor Outlying Islands"},{"value":"UZ","text":"Uzbekistan"},{"value":"VU","text":"Vanuatu"},{"value":"VE","text":"Venezuela"},{"value":"VN","text":"Vietnam"},{"value":"VG","text":"Virgin Islands (British)"},{"value":"VI","text":"Virgin Islands (USA)"},{"value":"WF","text":"Wallis and Futuna"},{"value":"EH","text":"Western Sahara"},{"value":"YE","text":"Yemen"},{"value":"ZM","text":"Zambia"},{"value":"ZW","text":"Zimbabwe"}]

			var states = [{"value":"AL","text":"Alabama"},{"value":"AK","text":"Alaska"},{"value":"AZ","text":"Arizona"},{"value":"AR","text":"Arkansas"},{"value":"AA","text":"Armed Forces Americas"},{"value":"AE","text":"Armed Forces Europe"},{"value":"AP","text":"Armed Forces Pacific"},{"value":"CA","text":"California"},{"value":"CO","text":"Colorado"},{"value":"CT","text":"Connecticut"},{"value":"DE","text":"Delaware"},{"value":"DC","text":"District of Columbia"},{"value":"FL","text":"Florida"},{"value":"GA","text":"Georgia"},{"value":"HI","text":"Hawaii"},{"value":"ID","text":"Idaho"},{"value":"IL","text":"Illinois"},{"value":"IN","text":"Indiana"},{"value":"IA","text":"Iowa"},{"value":"KS","text":"Kansas"},{"value":"KY","text":"Kentucky"},{"value":"LA","text":"Louisiana"},{"value":"ME","text":"Maine"},{"value":"MD","text":"Maryland"},{"value":"MA","text":"Massachusetts"},{"value":"MI","text":"Michigan"},{"value":"MN","text":"Minnesota"},{"value":"MS","text":"Mississippi"},{"value":"MO","text":"Missouri"},{"value":"MT","text":"Montana"},{"value":"NE","text":"Nebraska"},{"value":"NV","text":"Nevada"},{"value":"NH","text":"New Hampshire"},{"value":"NJ","text":"New Jersey"},{"value":"NM","text":"New Mexico"},{"value":"NY","text":"New York"},{"value":"NC","text":"North Carolina"},{"value":"ND","text":"North Dakota"},{"value":"OH","text":"Ohio"},{"value":"OK","text":"Oklahoma"},{"value":"OR","text":"Oregon"},{"value":"PA","text":"Pennsylvania"},{"value":"PR","text":"Puerto Rico"},{"value":"RI","text":"Rhode Island"},{"value":"SC","text":"South Carolina"},{"value":"SD","text":"South Dakota"},{"value":"TN","text":"Tennessee"},{"value":"TX","text":"Texas"},{"value":"UT","text":"Utah"},{"value":"VT","text":"Vermont"},{"value":"VA","text":"Virginia"},{"value":"WA","text":"Washington"},{"value":"WV","text":"West Virginia"},{"value":"WI","text":"Wisconsin"},{"value":"WY","text":"Wyoming"}]

			var cStates = [{"value":"AB","text":"Alberta"},{"value":"BC","text":"British Columbia"},{"value":"MB","text":"Manitoba"},{"value":"NB","text":"New Brunswick"},{"value":"NL","text":"Newfoundland"},{"value":"NT","text":"Northwest Territories"},{"value":"NS","text":"Nova Scotia"},{"value":"NU","text":"Nunavut"},{"value":"ON","text":"Ontario"},{"value":"PE","text":"Prince Edward Island"},{"value":"QC","text":"Quebec"},{"value":"SK","text":"Saskatchewan"},{"value":"YT","text":"Yukon"}]

        	var balances=[];
        	var emails=[];
        	var statements=[];
        	var invoices=[];
        	var customers=[];
        	var form=widget.createForm({title:'Contact/Prospect Manager'});		
        	form.clientScriptFileId=1655514;
        	form.addButton({id:'custpage_get_all_contacts',label:'Get All Contacts',functionName:'getallcontacts'});
            form.addButton({id:'custpage_get_non_company_contacts',label:'Get Non Company Contacts',functionName:'getnoncompany'});

        		var contactsFG=form.addFieldGroup({id:'contactsfg',label:'Contacts'});
        		var contactPI=form.addFieldGroup({id:'pifg',label:'Primary Information'})
        	    var addressFG=form.addFieldGroup({id:'addresstab',label:'Address'})
        		var prospectsFG=form.addFieldGroup({id:'prospectsfg',label:'Prospects'});
        		var contactList=form.addTab({id:'contactlist',label:'Current Contacts'});
        	    var customerField=form.addField({id:'contact_company',label:'Company',type:'select',container:'contactsfg'});
        	    form.addField({id:'contact_new_company',label:'New Company Name',type:'text',container:'contactsfg'});
        	    var theseCustomers=getCustomers(currentUser.id);
        	    customerField.addSelectOption({
        	    		value:-1,
        	    		text:''
        	    	});
        	     customerField.addSelectOption({
        	    		value:-2,
        	    		text:'-New Company-'
        	    	});
        	      customerField.addSelectOption({
        	    		value:-3,
        	    		text:'-No Company-'
        	    	});
        	    for(key in theseCustomers)
        	    {
        	    	var obj=theseCustomers[key];
        	    	var customerId=obj.value;
        	    	var customerName=obj.text;
        	    	customerField.addSelectOption({
        	    		value:customerId,
        	    		text:customerName
        	    	});
        	    }
        		
        		/*
        		form.addField({id:'contact_firstname',label:'First Name',type:'text',container:'pifg'});
        		
        		form.addField({id:'contact_phone',label:'Phone Number',type:'phone',container:'pifg'});
        		form.addField({id:'contact_lastname',label:'Last Name',type:'text',container:'pifg'});
        		form.addField({id:'contact_email',label:'Email',type:'email',container:'pifg'});

				form.addField({id:'customer_address',label:'Address 1',type:'text',container:'addresstab'});
        		form.addField({id:'customer_address2',label:'Address 2',type:'text',container:'addresstab'});
        		form.addField({id:'customer_city',label:'City',type:'text',container:'addresstab'});
        		*/
        		

        		//var stateField=form.addField({id:'customer_state',label:'State',type:'select',container:'addresstab'});
        		
        		//form.addField({id:'customer_zip',label:'Zip',type:'text',container:'addresstab'});
        		
        		var sublist=form.addSublist({id:'ccontacts',label:'Current Contacts',tab:'contactlist',type:'inlineeditor'});
        		var contactID=sublist.addField({id:'contact_id',type:'text',label:'ID'}).updateDisplayType({displayType:'hidden'});

        		sublist.addField({id:'contact_company_name',type:'text',label:'Company'});
                var companyID=sublist.addField({id:'contact_company_id',type:'text',label:'Company IID'}).updateDisplayType({displayType:'hidden'});
        		sublist.addField({id:'contact_fname',type:'text',label:'First Name'});
        		sublist.addField({id:'contact_lname',type:'text',label:'Last Name'});
        		sublist.addField({id:'contact_phone',type:'phone',label:'Phone'});
        		sublist.addField({id:'contact_email',type:'email',label:'Email'});
        		sublist.addField({id:'contact_title',type:'text',label:'Title'});
        		sublist.addField({id:'contact_address1',type:'text',label:'Address 1'});
        		sublist.addField({id:'contact_address2',type:'text',label:'Address 2'});
        		sublist.addField({id:'contact_city',type:'text',label:'City'});
        		
        		sublist.addField({id:'contact_state',type:'text',label:'State'});
        		sublist.addField({id:'contact_zip',type:'text',label:'Zip'});
        		sublist.addField({id:'contact_country',type:'text',label:'Country'});
	

        		//var countryField=form.addField({id:'customer_country',label:'Country',type:'select',container:'addresstab'});
/*
        		for(var key in countries)
        		{
        			var obj=countries[key];
        			var countryID=obj.value;
        			var stateId=obj.text;
        			if(countryID=='US')
	        			countryField.addSelectOption({
	        				value:countryID,
	        				text:stateId,
	        				isSelected:true
	        			});        	
	        		else
	        			countryField.addSelectOption({
	        				value:countryID,
	        				text:stateId
	        			});   

        		}
        		for(var key in states)
        		{
        			
        			var obj=states[key];
        			var countryID=obj.value;
        			var stateId=obj.text;
        			stateField.addSelectOption({
        				value:countryID,
        				text:stateId,
        				//isSelected:true
        			});        			
        		}
        		for(var key in cStates)
        		{
        			
        			var obj=cStates[key];
        			var countryID=obj.value;
        			var stateId=obj.text;
        			stateField.addSelectOption({
        				value:countryID,
        				text:stateId
        			});        			
        		}
        		
        		*/
        		//form.addField({id:'contact_address',label:'Address',type:'text'});
        		


			form.addSubmitButton({label:'Add/Updates Contact!'})
        	context.response.writePage(form);
         
		}
		else
		{
            var updateValues=[];
           

            var itemsLength=context.request.getLineCount({group:'ccontacts'});
            var currentUser=runtime.getCurrentUser();
            var contacts={};
            for(var i=0;i<itemsLength;i++)
            {
                var objRec={};
                var contactId=request.getSublistValue({group:'ccontacts',name:'contact_id',line:i});
                var companyName=request.getSublistValue({group:'ccontacts',name:'contact_company_name',line:i});
                var companyId=request.getSublistValue({group:'ccontacts',name:'contact_company_id',line:i});
                var contactFirst=request.getSublistValue({group:'ccontacts',name:'contact_fname',line:i});
                var contactLast=request.getSublistValue({group:'ccontacts',name:'contact_lname',line:i});
                var contactPhone=request.getSublistValue({group:'ccontacts',name:'contact_phone',line:i});
                var contactEmail=request.getSublistValue({group:'ccontacts',name:'contact_email',line:i});
                var contactTitle=request.getSublistValue({group:'ccontacts',name:'contact_title',line:i});
                var contactAddress1=request.getSublistValue({group:'ccontacts',name:'contact_address1',line:i});
                var contactAddress2=request.getSublistValue({group:'ccontacts',name:'contact_address2',line:i});
                var contactCity=request.getSublistValue({group:'ccontacts',name:'contact_city',line:i});
                var contactState=request.getSublistValue({group:'ccontacts',name:'contact_state',line:i});
                var contactZip=request.getSublistValue({group:'ccontacts',name:'contact_zip',line:i});
                var contactCountry=request.getSublistValue({group:'ccontacts',name:'contact_country',line:i});
                /*
                objRec.contactId=contactId;
                objRec.companyName=companyName;
                objRec.companyId=companyId;
                objRec.contactFirst=contactFirst;
                objRec.contactLast=contactLast;
                objRec.contactPhone=contactPhone;
                objRec.contactEmail=contactEmail;
                objRec.contactTitle=contactTitle;
                objRec.contactAddress1=contactAddress1;
                objRec.contactAddress2=contactAddress2;
                objRec.contactCity=contactCity;
                objRec.contactState=contactState;
                objRec.contactZip=contactZip;
                objRec.contactCountry=contactCountry;
                updateValues.push(objRec);
                */


                updateValues.push({
                    'contactId':contactId,
                    'companyName':companyName,
                    'companyId':companyId,
                    'contactFirst':contactFirst,
                    'contactLast':contactLast,
                    'contactPhone':contactPhone,
                    'contactEmail':contactEmail,
                    'contactTitle':contactTitle,
                    'contactAddress1':contactAddress1,
                    'contactAddress2':contactAddress2,
                    'contactCity':contactCity,
                    'contactState':contactState,
                    'contactZip':contactZip,
                    'contactCountry':contactCountry
                });
            }
            log.debug({title:'files',details:JSON.stringify(updateValues)});
            log.debug({title:'fildff',details:updateValues})
            var submittedTask;
            for(var s=1;s<11;s++)
            {
                try
                {
                    
                    ssTask = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: 'customscript_cm_update_contacts',
                    deploymentId: 'customdeploy_cm_update_contacts'+s,
                    params: {
                        'custscript_cm_contacts': JSON.stringify(updateValues),
                        'custscript_cm_emp':currentUser.id,
                        //'custscript2':JSON.stringify(updateValues)
                        }
                        });
                    submittedTask = ssTask.submit();
                    break;
                  }
                  catch(err)
                  {
                    continue;
                  }
            }
            redirect.toSuitelet({
                scriptId:'customscript_contact_manager',
                deploymentId:'customdeploy_contact_manager'
            })
				//redirect.toTaskLink({
               	//	id:'CARD_-29',
              	//});

            }
           
              
		
	
	}
	function getCustomers(empId)
	{
		var returnValues=[];
		var customerSearchObj = search.create({
		   type: "customer",
		   filters:
		   [
		      ["salesrep","anyof",empId]
		   ],
		   columns:
		   [
		      search.createColumn({name: "internalid", label: "Internal ID"}),
		      search.createColumn({name:'altname',label:'Name'})
		   ]
		});
		var searchResultCount = customerSearchObj.runPaged().count;
		log.debug("customerSearchObj result count",searchResultCount);
		customerSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
			var thisID=result.getValue({name:'internalid'});
			var thisName=result.getValue({name:'altname'});
			returnValues.push({'value':thisID,'text':thisName});
		   return true;
		});
		return returnValues;		
	}

	function getContacts(empId)
	{
		//earch for customers to update here; filtered by id
		var contactSearchObj = search.create({
		   type: "contact",
		   filters:
		   [
		      ["customerprimary.salesrep","anyof",empId]
		   ],
		   columns:
		   [
		      
		      search.createColumn({name: "email", label: "Email"}),
		      search.createColumn({name: "phone", label: "Phone"}),
		      search.createColumn({name: "altphone", label: "Office Phone"}),
		      search.createColumn({name: "fax", label: "Fax"}),
		      search.createColumn({name: "company", label: "Company"}),
		      search.createColumn({name: "altemail", label: "Alt. Email"}),
		     
		   ]
		});
		var searchResultCount = contactSearchObj.runPaged().count;
		log.debug("contactSearchObj result count",searchResultCount);
		contactSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
		   return true;
		});

		/*
		contactSearchObj.id="customsearch1707423999058";
		contactSearchObj.title="Custom Contact Search (copy)";
		var newSearchId = contactSearchObj.save();
		*/
	}

        
        return {
            onRequest: onRequest
        }
    })