/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log'],
	function(record,search,currentRecord,log){
		
		function fieldChanged(context){
			
		}
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{

		}
		function saveRecord(context)
		{
			try
			{
				var rec=context.currentRecord;
				var howMany=rec.getLineCount({sublistId:'item'});
				for(var hm=0;hm<howMany;hm++)
				{ 
					var whatLocation=rec.getSublistValue({sublistId:'item',fieldId:'location',line:hm});

					if(!whatLocation)
					{
						var currentLine=hm+1;
						alert('Line '+currentLine+' is missing a warehouse. PO will not save until a Warehouse is selected.');
						return false;
					}
				}
				return true;
			}
			catch(err)
			{
				return true;
			}
			
		}
		return {
		//	updateSuitelet:updateSuitelet,
		//	fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			//validateLine:validateLine,
			saveRecord: saveRecord
		};
});