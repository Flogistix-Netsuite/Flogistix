/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log'],
	function(record,search,currentRecord,log){
		
		function fieldChanged(context){
			try
			{	
				var rec=context.currentRecord;
				var rec1=currentRecord.get();
				var thisField=rec1.fieldId;
				if(context.fieldId=='custpage_new_company')
				{
					var customerId=rec1.getValue({fieldId:'custpage_new_company'});
					var cusRec=record.load({type:'customer',id:customerId});
					var howMany=cusRec.getLineCount({sublistId:'addressbook'});

					for(var h=0;h<howMany;h++)
					{

					
					var oldAddress=rec1.getField({fieldId:'custpage_new_site_legal'});
					oldAddress.insertSelectOption({
						value:cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h}),
						text:cusRec.getSublistValue({sublistId:'addressbook',fieldId:'label',line:h}),
					});
					}
				}
				
				if(context.fieldId=='custpage_new_site_legal')
				{
					var customerId=rec1.getValue({fieldId:'custpage_new_company'});
					var cusRec=record.load({type:'customer',id:customerId});
					var howMany=cusRec.getLineCount({sublistId:'addressbook'});
					var addressId=rec1.getValue({fieldId:'custpage_new_site_legal'});
					for(var h=0;h<howMany;h++)
					{					
						var thisAddress=cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h});
						if(thisAddress==addressId)
						{
							var subRec=cusRec.getSublistSubrecord({sublistId:'addressbook',fieldId:'addressbookaddress',line:h});
							rec1.setValue({fieldId:'custpage_new_county',value:subRec.getValue({fieldId:'addr3'}),ignoreFieldChange:true});
							var getState=findStateValue(subRec.getValue({fieldId:'state'}))
							rec1.setValue({fieldId:'custpage_new_state',value:getState,ignoreFieldChange:true});
						}
					
					}
				}
				if(context.fieldId=='custpage_asset')
				{
					var thisAssetId=rec1.getValue('custpage_asset');
					var assetFields=search.lookupFields({
						type:'customrecord_ncfar_asset',
						id:thisAssetId,
						columns:['custrecord_current_county','custrecord_current_state','custrecord_current_customer','custrecord_current_location']
						
					})
					var thisSite=null;
					var thisCompany=null;
					var thisCounty=null;
					var thisState=null;
					try
					{
						thisCompany=assetFields.custrecord_current_customer[0].value;
					}
					catch(err)
					{

					}
					try
					{
						thisSite=assetFields.custrecord_current_location[0].value;					
					}
					catch(err)
					{

					}
					try
					{
						thisCounty=assetFields.custrecord_current_county;					
					}
					catch(err)
					{

					}
					try
					{
						thisState=assetFields.custrecord_current_state[0].value;
					}
					catch(err)
					{

					}
					
					var cusRec=record.load({type:'customer',id:thisCompany});
					var howMany=cusRec.getLineCount({sublistId:'addressbook'});


					for(var h=0;h<howMany;h++)
					{

					
					var oldAddress=rec1.getField({fieldId:'custpage_old_site_legal'});
					oldAddress.insertSelectOption({
						value:cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h}),
						text:cusRec.getSublistValue({sublistId:'addressbook',fieldId:'label',line:h}),
					});
					}
					if(thisCompany)
						rec1.setValue({fieldId:'custpage_old_company',value:thisCompany,ignoreFieldChange:true});
					if(thisSite)
						rec1.setValue({fieldId:'custpage_old_site_legal',value:thisSite,ignoreFieldChange:true});
					if(thisCounty)
						rec1.setValue({fieldId:'custpage_old_county',value:thisCounty,ignoreFieldChange:true});
					if(thisState)
						rec1.setValue({fieldId:'custpage_old_state',value:thisState,ignoreFieldChange:true});

					
				}

			}
			catch(err)
			{
				log.debug({title:'err',details:err});
			}
		}

		function findStateValue(findMe)
		{
			var returnValue=null;
			var states = "AL;Alabama,AK;Alaska,AZ;Arizona,AR;Arkansas,AA;Armed Forces Americas,AE;Armed Forces Europe,AP;Armed Forces Pacific,CA;California,CO;Colorado,CT;Connecticut,DE;Delaware,DC;District of Columbia,FL;Florida,GA;Georgia,HI;Hawaii,ID;Idaho,IL;Illinois,IN;Indiana,IA;Iowa,KS;Kansas,KY;Kentucky,LA;Louisiana,ME;Maine,MD;Maryland,MA;Massachusetts,MI;Michigan,MN;Minnesota,MS;Mississippi,MO;Missouri,MT;Montana,NE;Nebraska,NV;Nevada,NH;New Hampshire,NJ;New Jersey,NM;New Mexico,NY;New York,NC;North Carolina,ND;North Dakota,OH;Ohio,OK;Oklahoma,OR;Oregon,PA;Pennsylvania,PR;Puerto Rico,RI;Rhode Island,SC;South Carolina,SD;South Dakota,TN;Tennessee,TX;Texas,UT;Utah,VT;Vermont,VA;Virginia,WA;Washington,WV;West Virginia,WI;Wisconsin,WY;Wyoming";

			var checkThese=states.split(',');
			for(var c=0;checkThese.length;c++)
			{
				var splitUp=checkThese[c].split(';');
				if(splitUp[0]==findMe)
				{
					returnValue=splitUp[1];
					return returnValue;
					break;
				}
			}

			return returnValue;
		}
		
		
		function validateLine(context)
		{

		}
		return {
		
			fieldChanged:fieldChanged,
		
		};
});