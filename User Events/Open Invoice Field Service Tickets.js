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
				
			

<?xml version="1.0" encoding="UTF-8"?>
<pidx:FieldTicket xmlns:pidx="http://www.api.org/pidXML" version="1.2" transactionPurposeIndicator="Original">
	<pidx:FieldTicketProperties>
		<pidx:FieldTicketNumber>FT_20160919001</pidx:FieldTicketNumber>
		<pidx:FieldTicketDate>string</pidx:FieldTicketDate>
		<pidx:PartnerInformation partnerRoleIndicator="BillTo">
			<pidx:PartnerIdentifier partnerIdentifierIndicator="DUNSNumber">
			</pidx:PartnerIdentifier>
			<pidx:PartnerName>Company Name</pidx:PartnerName>
		</pidx:PartnerInformation>
		<pidx:PurchaseOrderInformation>
			<pidx:PurchaseOrderNumber>PO_Number</pidx:PurchaseOrderNumber>
		</pidx:PurchaseOrderInformation>
		<pidx:PurchaseOrderLineItemNumber>po_header_001</pidx:PurchaseOrderLineItemNumber>
		<pidx:PrimaryCurrency>
			<pidx:CurrencyCode>CAD</pidx:CurrencyCode>
		</pidx:PrimaryCurrency>
		<pidx:JobLocationInformation>
			<pidx:WellInformation>
				<pidx:WellIdentifier>Place where goods were delivered.</pidx:WellIdentifier>
				<pidx:WellName>string</pidx:WellName>
			</pidx:WellInformation>
		</pidx:JobLocationInformation>
		<pidx:ReferenceInformation referenceInformationIndicator="AFENumber">
			<pidx:ReferenceNumber>string</pidx:ReferenceNumber>
		</pidx:ReferenceInformation>
		<pidx:Attachment>
			<pidx:AttachmentPurposeCode>Other</pidx:AttachmentPurposeCode>
			<pidx:AttachmentTitle>File.jpg</pidx:AttachmentTitle>
			<pidx:AttachmentDescription>This is a file.</pidx:AttachmentDescription>
			<pidx:AttachmentLocation>Attachment</pidx:AttachmentLocation>
		</pidx:Attachment>
		<pidx:Comment>This is a field ticket.</pidx:Comment>
	</pidx:FieldTicketProperties>
	<pidx:FieldTicketDetails>
		<pidx:FieldTicketLineItem>
			<pidx:LineItemNumber>1</pidx:LineItemNumber>
			<pidx:LineItemInformation>
				<pidx:LineItemIdentifier identifierIndicator="AssignedBySeller">
				</pidx:LineItemIdentifier>
				<pidx:LineItemName>string</pidx:LineItemName>
				<pidx:LineItemDescription>Product/Service description.</pidx:LineItemDescription>
			</pidx:LineItemInformation>
			<pidx:FieldTicketQuantity>
				<pidx:Quantity>0</pidx:Quantity>
				<pidx:UnitOfMeasureCode>EA</pidx:UnitOfMeasureCode>
			</pidx:FieldTicketQuantity>
			<pidx:PurchaseOrderLineItemNumber>po_line_001</pidx:PurchaseOrderLineItemNumber>
			<pidx:PurchaseOrderInformation>
				<pidx:PurchaseOrderNumber>PO_Number</pidx:PurchaseOrderNumber>
			</pidx:PurchaseOrderInformation>
			<pidx:CommodityCode>43899</pidx:CommodityCode>
			<pidx:JobLocationInformation>
				<pidx:WellInformation>
					<pidx:WellIdentifier>Place where goods were delivered.</pidx:WellIdentifier>
					<pidx:WellName>string</pidx:WellName>
				</pidx:WellInformation>
			</pidx:JobLocationInformation>
			<pidx:Pricing>
				<pidx:UnitPrice>
					<pidx:MonetaryAmount>0</pidx:MonetaryAmount>
					<pidx:UnitOfMeasureCode>EA</pidx:UnitOfMeasureCode>
				</pidx:UnitPrice>
			</pidx:Pricing>
			<pidx:ServiceDateTime dateTypeIndicator="ServicePeriodStart">
			</pidx:ServiceDateTime>
			<pidx:ReferenceInformation referenceInformationIndicator="AFENumber">
				<pidx:ReferenceNumber>string</pidx:ReferenceNumber>
			</pidx:ReferenceInformation>
		</pidx:FieldTicketLineItem>
	</pidx:FieldTicketDetails>
	<pidx:FieldTicketSummary>
		<pidx:TotalLineItems>0</pidx:TotalLineItems>
	</pidx:FieldTicketSummary>
</pidx:FieldTicket>

}

			
			return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});
