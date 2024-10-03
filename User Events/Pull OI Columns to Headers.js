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
				var howMany=rec.getLineCount({sublistId:'item'});
				
				var custbody_oi_po_line=rec.getSublistValue({sublistId:'item',value:'custcol_openinvoicepoline',line:0});
				var oiDescription=rec.getSublistValue({sublistId:'item',value:'custcol_oi_description',line:0});
				var oiUnit=rec.getSublistValue({sublistId:'item',value:'custcol_openinvoice_unit',line:0});
				var oiRental=rec.getSublistValue({sublistId:'item',value:'custcol_oi_rental_unit',line:0});
				var oiItem=rec.getSublistValue({sublistId:'item',value:'custcolitem_id',line:0});
				var oiCostCode=rec.getSublistValue({sublistId:'item',value:'custcolcost_code',line:0});
				var oiServiceDateFrom=rec.getSublistValue({sublistId:'item',value:'custcol_oi_service_date_from',line:0});
				var oiServiceDateTo=rec.getSublistValue({sublistId:'item',value:'custcol_oi_service_date_to',line:0});

				rec.setValue({fieldId:'custbody_oi_po_line',value:custbody_oi_po_line});
				rec.setValue({fieldId:'custbody_oi_item_id',value:oiItem});
				rec.setValue({fieldId:'custbody_oi_unit',value:oiUnit});
				rec.setValue({fieldId:'custbody_oi_cost_code',value:oiCostCode});
				rec.setValue({fieldId:'custbody_oi_service_date_from',value:oiServiceDateFrom});
				rec.setValue({fieldId:'custbody_oi_service_date_to',value:oiServiceDateTo});
				rec.setValue({fieldId:'custbody_oi_rental_unit',value:oiRental});
				rec.setValue({fieldId:'custbody_oi_line_lvl_descript',value:oiDescription});

				
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