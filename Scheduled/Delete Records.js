function remove()
{
	var this_file=nlapiLoadFile(1954083);
		var what_irs=this_file.getValue();
		var these_irs=what_irs.split('\r\n');
		var context=nlapiGetContext();
		for(var num=1;num<these_irs.length;num++)
			{
			if(context.getRemainingUsage()<250)
				nlapiYieldScript();
			try
				{
					var use_me=these_irs[num].split(',');
					var id=use_me[0];	
					var findMe=use_me[1];
					var newPrice=use_me[2];
					
					var rec=nlapiLoadRecord('workorder',id);
					rec.setFieldText('department',findMe);
					//nlapiDeleteRecord('plannedorder',id);
					
					nlapiSubmitRecord(rec);
					
				}
			catch(err)
				{
					nlapiLogExecution('debug','no delete',err+'; '+id);
				}
			}
}