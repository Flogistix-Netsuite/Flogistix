/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email','N/ui/serverWidget'],
		function(record,search,email,widget) {
			function beforeLoad(context) 
			{
				var rec=context.newRecord;
				rec.setValue({fieldId:'searchid',value:8});
				var thisField=rec.getField({fieldId:'searchid'});

				thisField.isDisplay=false;
				//var form=context.form;
				//var thisField=form.getField({id:'terms'});

				//thisField.updateDisplayType({displayType:widget.FieldDisplayType.DISABLED});



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
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});