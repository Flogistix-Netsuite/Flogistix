/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email'],
		function(record,search,email) {
			function beforeLoad(context) 
			{
				var rec=context.newRecord;
			}
			function beforeSubmit(context) 
			{
				var rec=context.newRecord;
			}
			function afterSubmit(context)
			{

				var rec=context.newRecord;			
				
				var today=new Date();
				var first=new Date();
					first.setDate(1);
				var month=today.getMonth();
					month++;
				var rentalUnit=rec.getValue({fieldId:'custbody_rental_unit_skid_number'});
				var year=today.getFullYear();
				var customerId=rec.getValue({fieldId:'entity'});
				var cusRec=record.load({type:'customer',id:customerId});
				var customerName=cusRec.getValue({fieldId:'companyname'});
				var purchaseOrderLines=[];
				var customerCurrency=cusRec.getValue({fieldId:'currency'});
				var currentLocation=rec.getValue({fieldId:'custbody_rental_unit_location_dropdown'});
				var howMany=rec.getLineCount({sublistId:'item'});


				var PONumber=month+year+' '+ rentalUnit
				var xml='<?xml version="1.0" encoding="UTF-8"?>';

				xml = xml +'<pidx:FieldTicket xmlns:pidx="http://www.api.org/pidXML" version="1.2" transactionPurposeIndicator="Original">';
				xml = xml +'<pidx:FieldTicketProperties>';
				xml = xml +'<pidx:FieldTicketNumber>'+rentalUnit+'</pidx:FieldTicketNumber>';
				xml = xml +'<pidx:FieldTicketDate>'+first+'</pidx:FieldTicketDate>';
				xml = xml +'<pidx:PartnerInformation partnerRoleIndicator="BillTo">';
				xml = xml +'<pidx:PartnerIdentifier partnerIdentifierIndicator="DUNSNumber">';
				xml = xml +'</pidx:PartnerIdentifier>';
				xml = xml +'<pidx:PartnerName>'+customerName+'</pidx:PartnerName>';
				xml = xml +'</pidx:PartnerInformation>';
				xml = xml +'<pidx:PurchaseOrderInformation>';
				xml = xml +'<pidx:PurchaseOrderNumber>'+PONumber+'</pidx:PurchaseOrderNumber>';
				xml = xml +'</pidx:PurchaseOrderInformation>';
				//xml = xml +'<pidx:PurchaseOrderLineItemNumber>'po_header_001'</pidx:PurchaseOrderLineItemNumber>';
				xml = xml +'<pidx:PrimaryCurrency>';
				xml = xml +'<pidx:CurrencyCode>'+customerCurrency+'</pidx:CurrencyCode>';
				xml = xml +'</pidx:PrimaryCurrency>';
				xml = xml +'<pidx:JobLocationInformation>';
				xml = xml +'<pidx:WellInformation>';
				xml = xml +'<pidx:WellIdentifier>Place where goods were delivered.</pidx:WellIdentifier>';
				xml = xml +'<pidx:WellName>'+currentLocation+'</pidx:WellName>';
				xml = xml +'</pidx:WellInformation>';
				xml = xml +'</pidx:JobLocationInformation>';
				xml = xml +'<pidx:ReferenceInformation referenceInformationIndicator="AFENumber">';
				xml = xml +'<pidx:ReferenceNumber>'+PONumber+'</pidx:ReferenceNumber>';
				xml = xml +'</pidx:ReferenceInformation>';
				xml = xml +'<pidx:Attachment>';
				xml = xml +'<pidx:AttachmentPurposeCode>Other</pidx:AttachmentPurposeCode>';
				xml = xml +'<pidx:AttachmentTitle>'File.jpg'</pidx:AttachmentTitle>';
				xml = xml +'<pidx:AttachmentDescription>'This is a file.'</pidx:AttachmentDescription>';
				xml = xml +'<pidx:AttachmentLocation>'Attachment'</pidx:AttachmentLocation>';
				xml = xml +'</pidx:Attachment>';
				xml = xml +'<pidx:Comment>This is a field ticket.</pidx:Comment>';
				xml = xml +'</pidx:FieldTicketProperties>';
				xml = xml +'<pidx:FieldTicketDetails>';
				var line=1;
				var lineItems=[];
					for(var hm=0;hm<howMany;hm++)
					{
						xml = xml +'<pidx:FieldTicketLineItem>';
						xml = xml +'<pidx:LineItemNumber>'+line+'</pidx:LineItemNumber>';
						xml = xml +'<pidx:LineItemInformation>';
						xml = xml +'<pidx:LineItemIdentifier identifierIndicator="AssignedBySeller">';
						xml = xml +'</pidx:LineItemIdentifier>';					
						xml = xml +'<pidx:LineItemName>'+rec.getSublistValue({sublist:'item',fieldId:'custcolitem_id',line:hm})+'</pidx:LineItemName>';
						xml = xml +'<pidx:LineItemDescription>'+rec.getSublistValue({sublist:'item',fieldId:'custcol_oi_description',line:hm})+'</pidx:LineItemDescription>';	
						xml = xml +'</pidx:LineItemInformation>';
						xml = xml +'<pidx:FieldTicketQuantity>';
						xml = xml +'<pidx:Quantity>'rec.getSublistValue({sublist:'item',fieldId:'quantity',line:hm})'</pidx:Quantity>';
						xml = xml +'<pidx:UnitOfMeasureCode>EA</pidx:UnitOfMeasureCode>';
						xml = xml +'</pidx:FieldTicketQuantity>';
						xml = xml +'<pidx:PurchaseOrderLineItemNumber>'po_line_001'</pidx:PurchaseOrderLineItemNumber>';
						xml = xml +'<pidx:PurchaseOrderInformation>';
						xml = xml +'<pidx:PurchaseOrderNumber>'PO_Number'</pidx:PurchaseOrderNumber>';
						xml = xml +'</pidx:PurchaseOrderInformation>';
						xml = xml +'<pidx:CommodityCode>'43899'</pidx:CommodityCode>';
						xml = xml +'<pidx:JobLocationInformation>';
						xml = xml +'<pidx:WellInformation>';
						xml = xml +'<pidx:WellIdentifier>'+currentLocation+</pidx:WellIdentifier>';
						xml = xml +'<pidx:WellName>'+currentLocation+'</pidx:WellName>';
						xml = xml +'</pidx:WellInformation>';
						xml = xml +'</pidx:JobLocationInformation>';
						xml = xml +'<pidx:Pricing>';
						xml = xml +'<pidx:UnitPrice>';
						xml = xml +'<pidx:MonetaryAmount>'+rec.getSublistValue({sublist:'item',fieldId:'rate',line:hm})+'</pidx:MonetaryAmount>';
						xml = xml +'<pidx:UnitOfMeasureCode>'+rec.getSublistValue({sublist:'item',fieldId:'custcol_openinvoice_unit',line:hm})'</pidx:UnitOfMeasureCode>';
						xml = xml +'</pidx:UnitPrice>';
						xml = xml +'</pidx:Pricing>';
						xml = xml +'<pidx:ServiceDateTime dateTypeIndicator="ServicePeriodStart">';
						xml = xml +'</pidx:ServiceDateTime>';
						xml = xml +'<pidx:ReferenceInformation referenceInformationIndicator="AFENumber">';
						xml = xml +'<pidx:ReferenceNumber>'string'</pidx:ReferenceNumber>';
						xml = xml +'</pidx:ReferenceInformation>';
						xml = xml +'</pidx:FieldTicketLineItem>';
							}
				
				xml = xml +'</pidx:FieldTicketDetails>';
				xml = xml +'<pidx:FieldTicketSummary>';
				xml = xml +'<pidx:TotalLineItems>0</pidx:TotalLineItems>';
				xml = xml +'</pidx:FieldTicketSummary>';
				xml = xml +'</pidx:FieldTicket>';

			}

			
			return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});
