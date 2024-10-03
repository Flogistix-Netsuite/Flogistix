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
			return true;
			
			try
			{
				var rec=context.currentRecord;
				var previouslyClosed=rec.getValue({fieldId:'custbody_previously_closed'});
				if(previouslyClosed)
					return true;
				//any closed?
				var goodToClose=rec.getValue({fieldId:'custbody_po_close'});
				if(!goodToClose)
					return true;

				var howMany=rec.getLineCount({sublistId:'item'});
				var lines=[];
				for(var hm=0;hm<howMany;hm++)
				{
					rec.setSublistValue({sublistId:'item',fieldId:'isclosed',line:hm,value:true});
					rec.commitLine({sublistId:'item'});
					//if(isClosed)
					//	lines.push(hm+1);
				}
				/*
				if(lines.length>0)
				{
					var prompt=confirm('You are wanting to close lines on this PO. Lines '+lines.toString());
					if(prompt)
					{
						rec.setValue({fieldId:'custbody_previously_closed',value:true});
						return true;
					}
					else
						return false;
				}*/
				return true;
				
			}
			catch(err)
			{
				return true;
			}
			
		}
		
		function close15(context)
		{
			try
			{

			
				var yayClose=confirm('You sure you want to close this PO?');
				if(yayClose)
					{
						
						var rec=currentRecord.get();
						
						rec.setValue({fieldId:'custbody_po_close',value:true});
						window.getNLMultiButtonByName('multibutton_submitter').onMainButtonClick(this);
						/*
						var howMany=rec.getLineCount({sublistId:'item'});
						var lines=[];
						for(var hm=0;hm<howMany;hm++)
						{
							rec.setSublistValue({sublistId:'item',fieldId:'isclosed',line:hm,value:true});
							rec.commitLine({sublistId:'item'});
							//if(isClosed)
							//	lines.push(hm+1);
						}
						*/

					}


			}
			catch(err)
			{
				log.debug({title:'erorr',details:err});
				var dkdkd=99;
			}


		}
		return {
		//	updateSuitelet:updateSuitelet,
		//	fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			//validateLine:validateLine,
			saveRecord: saveRecord,
			close15:close15
		};
});