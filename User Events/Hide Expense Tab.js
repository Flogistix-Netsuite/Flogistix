/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email','N/ui/serverWidget'],
		function(record,search,email,serverWidget) {
			function beforeLoad(context) 
			{
				try
				{


				var rec=context.newRecord;
				var type = context.type;

				if (type == 'edit' || type == 'create') 
				{
					var expenseForm = context.newRecord.getValue({fieldId:'customform'})
				} 
				
				if (expenseForm == 209) 
				{//change this to an internal id of the custom form you want to hide the expense subtab.
					var expenseSublist = context.form.getSublist({id:'expense'})
					expenseSublist.setDisplayType = 'hidden';
					expenseSublist.displayType=serverWidget.SublistDisplayType.HIDDEN;
					var vendorField=context.form.getField({id:'entity'});
					vendorField.displayType=serverWidget.FieldDisplayType.HIDDEN;
					var taxLine=context.form.getSublist({id:'item'}).getField({id:'tax'});
					taxLine.displayType=serverWidget.FieldDisplayType.HIDDEN;
					expenseSublist.isDisplay=false;
					var dfdfd=909;
				}
				}
				catch(err)
				{
					log.debug('issues',err.message);
				}

			}
			function beforeSubmit(context) 
			{
				var rec=context.newRecord;
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				
			}

			
			return {
			beforeLoad: beforeLoad,
			//beforeSubmit: beforeSubmit,
			//afterSubmit: afterSubmit
			};
});

