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
			}
			function afterSubmit(context)
			{
				var rec=context.newRecord;
				var oldRec=context.oldRecord;
				var var howMany=rec.getLineCount({sublistId:'item'});
				for(var hm=0;hm<howMany;hm++)
				{
					
				}
				var oldLat=oldRec.getValue({fieldId:'custrecord_lat'});
				var oldLon=oldRec.getValue({fieldId:'custrecord_lon'});
				var newLat=rec.getValue({fieldId:'custrecord_lat'});
				var newLon=rec.getValue({fieldId:'custrecord_lon'});
				var sendEmail=false;
				if(oldLat!=newLat)
					sendEmail=true;
				if(oldLon!=newLon)
					sendEmail=true;
				if(sendEmail)
					email.send({author:-5,recipients:'rodneyveach123@gmail.com',body:'Lat/Long Changed',subject:'Lat Long Changed'});
				
			}

			
			return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
			};
});