/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
	define(['N/record','N/search','N/email','N/ui/serverWidget'],
		function(record,search,email,widget) {
			function beforeLoad(context) 
			{
				try
				{


				var form=context.form;

				var rec=context.newRecord;
				var allFields=rec.getFields();
				for(var f=0;f<allFields.length;f++)
				{
					try
					{


					var thisField=form.getField({id:allFields[f]});
					thisField.updateDisplayType({displayType:widget.FieldDisplayType.DISABLED});
					}
					catch(err)
					{
						
					}
				}
				}
				catch(err)
				{

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
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});