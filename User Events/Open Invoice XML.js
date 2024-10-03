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
                var invoiceNumber=rec.getValue({fieldId:'tranid'});
                var invoiceDate=rec.getValue({fieldId:'trandate'});
                var DUNS=rec.getValue({fieldId:''});
                var buyerName=rec.getValue({fieldId:''});
                var floDUNS=rec.getValue({fieldId:''});
                var floDUNS4=rec.getValue({fieldId:''});
                var floName=rec.getValue({fieldId:''});
                var contactEmail=rec.getValue({fieldId:''});
                var revisionNumber=rec.getValue({fieldId:''});
                var unitOfCurrency=rec.getValue({fieldId:''});
                var startDate=rec.getValue({fieldId:''});
                var endDate=rec.getValue({fieldId:''});
                var totalHoursWorked=rec.getValue({fieldId:''});
               var xml='<?xml version="1.0" encoding="UTF-8" ?>';             
                xml=xml+'<pidx:Invoice xmlns:pidx="http://www.api.org/pidXML/v1.0"';
                xml=xml+'pidx:transactionPurposeIndicator="Original" pidx:version="1.0">';
                xml=xml+'<pidx:InvoiceProperties>';
                xml=xml+'<pidx:InvoiceNumber>'+invoiceNumber+'</pidx:InvoiceNumber>';
                xml=xml+'<pidx:InvoiceDate>'+invoiceDate+'</pidx:InvoiceDate>';
                xml=xml+'<pidx:PartnerInformation partnerRoleIndicator="BillTo">';
                xml=xml+'<pidx:PartnerIdentifier partnerIdentifierIndicator="DUNSNumber">'+DUNS+'</pidx:PartnerIdentifier>';
                xml=xml+'<pidx:PartnerName>'+buyerName+'</pidx:PartnerName>';
                xml=xml+'<pidx:ContactInformation contactInformationIndicator="BuyerDepartment">';
                xml=xml+'<pidx:ContactName>Administrators</pidx:ContactName>';
                xml=xml+'</pidx:ContactInformation>';
                xml=xml+'</pidx:PartnerInformation>';
                xml=xml+'<pidx:PartnerInformation partnerRoleIndicator="SoldTo">';
                xml=xml+'<pidx:PartnerIdentifier partnerIdentifierIndicator="DUNSNumber">'+DUNS+'</pidx:PartnerIdentifier>';
                xml=xml+'<pidx:ContactInformation contactInformationIndicator="BuyerDepartment">';
                xml=xml+'<pidx:ContactName>Administrators</pidx:ContactName>';
                xml=xml+'</pidx:ContactInformation>';
                xml=xml+'</pidx:PartnerInformation>';
                xml=xml+'<pidx:PartnerInformation partnerRoleIndicator="Seller">';
                xml=xml+'<pidx:PartnerIdentifier partnerIdentifierIndicator="DUNSNumber">'+floDUNS+'</pidx:PartnerIdentifier>';
                xml=xml+'<pidx:PartnerIdentifier partnerIdentifierIndicator="DUNS+4Number">'+floDUNS4+'</pidx:PartnerIdentifier>';
                xml=xml+'<pidx:PartnerName>'+floName+'</pidx:PartnerName>';
                xml=xml+'<pidx:ContactInformation contactInformationIndicator="SalesRepresentative">';
                xml=xml+'<pidx:ContactName>'+contactEmail+'</pidx:ContactName>';
                xml=xml+'</pidx:ContactInformation>';
                xml=xml+'</pidx:PartnerInformation>';
                xml=xml+'<pidx:InvoiceTypeCode>DebitMemo</pidx:InvoiceTypeCode>';
                xml=xml+'<pidx:RevisionNumber>'+revisionNumber+'</pidx:RevisionNumber>';
                xml=xml+'<pidx:PrimaryCurrency>';
                xml=xml+'<pidx:CurrencyCode>'+unitOfCurrency+'</pidx:CurrencyCode>';
                xml=xml+'</pidx:PrimaryCurrency>';
                xml=xml+'<pidx:JobLocationInformation>';
                xml=xml+'<pidx:WellInformation>';
                xml=xml+'<pidx:WellIdentifier/>';
                xml=xml+'<pidx:WellName></pidx:WellName>';
                xml=xml+'</pidx:WellInformation>';
                xml=xml+'</pidx:JobLocationInformation>';
                xml=xml+'<pidx:ServiceDateTime dateTypeIndicator="ServicePeriodStart">'+startDate+'</pidx:ServiceDateTime>';
                xml=xml+'<pidx:ServiceDateTime dateTypeIndicator="ServicePeriodEnd">'+endDate+'</pidx:ServiceDateTime>';
                xml=xml+'<pidx:SpecialInstructions instructionIndicator="RoutingInstructions">Submit</pidx:SpecialInstructions>';
                xml=xml+'<pidx:ReferenceInformation referenceInformationIndicator="AFENumber">';
                xml=xml+'<pidx:ReferenceNumber/>';
                xml=xml+'</pidx:ReferenceInformation>';
                xml=xml+'<pidx:ReferenceInformation referenceInformationIndicator="CostCenter">';
                xml=xml+'<pidx:ReferenceNumber/>';
                xml=xml+'</pidx:ReferenceInformation>';
                xml=xml+'<pidx:ReferenceInformation referenceInformationIndicator="OperatorGeneralLedgerCode">';
                xml=xml+'<pidx:ReferenceNumber/>';
                xml=xml+'</pidx:ReferenceInformation>';
                xml=xml+'<pidx:Comment>PIDX Invoice for Automation Submission</pidx:Comment>';
                xml=xml+'</pidx:InvoiceProperties>';
                xml=xml+'<pidx:InvoiceDetails>';
                xml=xml+'<pidx:InvoiceLineItem>';
                xml=xml+'<pidx:LineItemNumber>1</pidx:LineItemNumber>';
                xml=xml+'<pidx:InvoiceQuantity>';
                var unitOfMeasure
                var lineItemId
                var lineItemDescription
                var fieldTicketLineItemNumber
                var fieldTicketNumber
                var fieldTicketDate
                var poAmount
                var currencyUnit
                xml=xml+'<pidx:Quantity>'+totalHoursWorked+'</pidx:Quantity>';
                xml=xml+'<pidx:UnitOfMeasureCode>'+unitOfMeasure+'</pidx:UnitOfMeasureCode>';
                xml=xml+'</pidx:InvoiceQuantity>';
                xml=xml+'<pidx:LineItemInformation>';
                xml=xml+'<pidx:LineItemIdentifier identifierIndicator="AssignedBySeller">'+lineItemId+'+</pidx:LineItemIdentifier>';
                xml=xml+'<pidx:LineItemDescription>'+lineItemDescription+'</pidx:LineItemDescription>';
                xml=xml+'</pidx:LineItemInformation>';
                xml=xml+'<pidx:PurchaseOrderLineItemNumber></pidx:PurchaseOrderLineItemNumber>';
                xml=xml+'<pidx:FieldTicketLineItemNumber>'+fieldTicketLineItemNumber+'</pidx:FieldTicketLineItemNumber>';
                xml=xml+'<pidx:FieldTicketInformation>';
                xml=xml+'<pidx:FieldTicketNumber>'+fieldTicketNumber+'</pidx:FieldTicketNumber>';
                xml=xml+'<pidx:FieldTicketDate>'+fieldTicketDate+'</pidx:FieldTicketDate>';
                xml=xml+'<pidx:RevisionNumber></pidx:RevisionNumber>';
                xml=xml+'</pidx:FieldTicketInformation>';
                xml=xml+'<pidx:PurchaseOrderInformation>';
                xml=xml+'<pidx:PurchaseOrderNumber></pidx:PurchaseOrderNumber>';
                xml=xml+'</pidx:PurchaseOrderInformation>';
                xml=xml+'<pidx:Pricing>';
                xml=xml+'<pidx:UnitPrice>';
                xml=xml+'<pidx:MonetaryAmount>'+poAmount+'</pidx:MonetaryAmount>';
                xml=xml+'<pidx:UnitOfMeasureCode>'+unitOfMeasure+'</pidx:UnitOfMeasureCode>';
                xml=xml+'<pidx:CurrencyCode>'+currencyUnit+'</pidx:CurrencyCode>';
                xml=xml+'</pidx:UnitPrice>';
                xml=xml+'</pidx:Pricing>';
                xml=xml+'<pidx:AllowanceOrCharge allowanceOrChargeIndicator="Allowance">';
                xml=xml+'<!-- <pidx:AllowanceOrChargePercent>15</pidx:AllowanceOrChargePercent>';
                xml=xml+'<pidx:AllowanceOrChargeTypeCode>Discount</pidx:AllowanceOrChargeTypeCode>';
                xml=xml+'-->';
                xml=xml+'<pidx:AllowanceOrChargeTotalAmount>';
                xml=xml+'<pidx:MonetaryAmount>'+1675.5674+'</pidx:MonetaryAmount>';
                xml=xml+'</pidx:AllowanceOrChargeTotalAmount>';
                xml=xml+'</pidx:AllowanceOrCharge>';
                xml=xml+'</pidx:InvoiceLineItem>';
                xml=xml+'<pidx:InvoiceLineItem>';
                xml=xml+'<pidx:LineItemNumber>'+2+'</pidx:LineItemNumber>';
                xml=xml+'<pidx:InvoiceQuantity>';
                xml=xml+'<pidx:Quantity>'+4512.775+'</pidx:Quantity>';
                xml=xml+'<pidx:UnitOfMeasureCode>'+ea+'</pidx:UnitOfMeasureCode>';
                xml=xml+'</pidx:InvoiceQuantity>';
                xml=xml+'<pidx:LineItemInformation>';
                xml=xml+'<pidx:LineItemIdentifier identifierIndicator="AssignedBySeller">'+6LGR7K+'</pidx:LineItemIdentifier>';
                xml=xml+'<pidx:LineItemDescription>'+0 - 7000 KPA+'</pidx:LineItemDescription>';
                xml=xml+'</pidx:LineItemInformation>';
                xml=xml+'<pidx:PurchaseOrderLineItemNumber></pidx:PurchaseOrderLineItemNumber>';
                xml=xml+'<pidx:FieldTicketLineItemNumber>'+001+'</pidx:FieldTicketLineItemNumber>';
                xml=xml+'<pidx:FieldTicketInformation>';
                xml=xml+'<pidx:FieldTicketNumber>'+PIDX_FT_0108_001+'</pidx:FieldTicketNumber>';
                xml=xml+'<pidx:FieldTicketDate>'+2019-05-16+'</pidx:FieldTicketDate>';
                xml=xml+'<pidx:RevisionNumber></pidx:RevisionNumber>';
                xml=xml+'</pidx:FieldTicketInformation>';
                xml=xml+'<pidx:PurchaseOrderInformation>';
                xml=xml+'<pidx:PurchaseOrderNumber></pidx:PurchaseOrderNumber>';
                xml=xml+'</pidx:PurchaseOrderInformation>';
                xml=xml+'<pidx:Pricing>';
                xml=xml+'<pidx:UnitPrice>';
                xml=xml+'<pidx:MonetaryAmount>'+23.543543+'</pidx:MonetaryAmount>';
                xml=xml+'<pidx:UnitOfMeasureCode>'+ea+'</pidx:UnitOfMeasureCode>';
                xml=xml+'<pidx:CurrencyCode>'+CAD+'</pidx:CurrencyCode>';
                xml=xml+'</pidx:UnitPrice>';
                xml=xml+'</pidx:Pricing>';
                xml=xml+'<pidx:AllowanceOrCharge allowanceOrChargeIndicator="Allowance">';
                xml=xml+'<pidx:AllowanceOrChargePercent>15.23848716</pidx:AllowanceOrChargePercent>';
                xml=xml+'<pidx:AllowanceOrChargeTypeCode>Discount</pidx:AllowanceOrChargeTypeCode>';
                xml=xml+'</pidx:AllowanceOrCharge>';
                xml=xml+'</pidx:InvoiceLineItem>';
                xml=xml+'</pidx:InvoiceDetails>';
                xml=xml+'<pidx:InvoiceSummary>';
                xml=xml+'<pidx:TotalLineItems>'+1+'</pidx:TotalLineItems>';
                xml=xml+'<pidx:InvoiceTotal>';
                xml=xml+'<pidx:MonetaryAmount>'+62.50+'</pidx:MonetaryAmount>';
                xml=xml+'<pidx:CurrencyCode>'+CAD+'</pidx:CurrencyCode>';
                xml=xml+'</pidx:InvoiceTotal>';
                xml=xml+'<pidx:SubTotalAmount subTotalIndicator="Other">';
                xml=xml+'<pidx:MonetaryAmount>'+3500.06+'</pidx:MonetaryAmount>';
                xml=xml+'</pidx:SubTotalAmount>';
                xml=xml+'</pidx:InvoiceSummary>';
                xml=xml+'</pidx:Invoice>';


                
          


  }

            
            return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
            };
});