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
				for(var hm=0;hm<howMany;hm++)
				{
					var relatedAsset=rec.getSublistValue({sublistId:'item',fieldId:'custcol_far_trn_relatedasset',line:hm});
					var raFields=search.lookupFields({
						type:'customrecord_ncfar_asset',
						id:relatedAsset,
						columns:['custrecord_current_state','custrecord_ae_at_sched_a_contract_terms','custrecord10']
					});
					rec.setSublistValue({sublistId:'item',fieldId:'custcol_asset_state',value:raFields.custrecord_current_state[0].text,line:hm});
					rec.setSublistValue({sublistId:'item',fieldId:'custcol_asset_contract_terms',value:raFields.custrecord_ae_at_sched_a_contract_terms[0].text,line:hm});
					rec.setSublistValue({sublistId:'item',fieldId:'custcol_asset_contract_expiry',value:raFields.custrecord10,line:hm});
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