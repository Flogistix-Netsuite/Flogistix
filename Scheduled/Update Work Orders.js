
function fixBadSO()
{
	var this_file=nlapiLoadFile(1627302);
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
			var badId=use_me[1];
			var goodId=use_me[2];
			var rec=nlapiLoadRecord('workorder',use_me[0]);
			rec.setFieldValue('custbodyallocated_unit','T');
			nlapiSubmitRecord(rec);
			
			
			//nlapiSubmitField('itemfulfillment',5671992,'custbody_fix_date','T');
		}
		catch(err)
		{
          	//nlapiSendEmail(-5,'rodneyveach123@gmail.com','no work','no work'+err,null,null,null,null);
          	nlapiLogExecution('debug','bad',err);
			continue;
		}
		
		}
}
