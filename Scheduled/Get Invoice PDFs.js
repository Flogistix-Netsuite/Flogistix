function getInvoices()
{
	var context=nlapiGetContext();
	
	var pos=[];
	var bills=[];

	var this_file=nlapiLoadFile(1521358);
		var what_irs=this_file.getValue();
		var these_irs=what_irs.split('\r\n');
		var context=nlapiGetContext();
		var useFolder=null;
		var folderId=null;
		for(var num=1;num<these_irs.length;num++)
			{
				if(context.getRemainingUsage()<250)
					nlapiYieldScript();
				try
				{
					var newFile=nlapiPrintRecord('TRANSACTION',these_irs[num],'PDF');
						newFile.setFolder(835990);
					nlapiSubmitFile(newFile);
				}
				catch(err)
				{
					nlapiLogExecution('debug','find me',err.message);
				}
			}
}