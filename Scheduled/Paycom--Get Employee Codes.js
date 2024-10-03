/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime','N/https','N/email'], 
	function(file, record, search,runtime,https,email) {
		function execute(options){  


			var headers={
					'Content-Type':'application/json',
					'Authorization':'Basic MDU2MDdhNTMzNzFhYjNhZGZkY2VlMTI0Y2NhMTJiNjViZDdkMDExOWRhMzhjZGY0NWM5NTk2ZjMyYTlmY2FmODpjZDAyMjc5MGQxNzk0NzY5NGE3YTRmZTVmMjBiMzhlZGI5MzJkZWEwMmRhYjJiNmEwNjkwOWQzZjkyOTczYjg1'
					//'Accept':'application/json',
					//'Authorization':'Basic MDU2MDdhNTMzNzFhYjNhZGZkY2VlMTI0Y2NhMTJiNjViZDdkMDExOWRhMzhjZGY0NWM5NTk2ZjMyYTlmY2FmOA==:Y2QwMjI3OTBkMTc5NDc2OTRhN2E0ZmU1ZjIwYjM4ZWRiOTMyZGVhMDJkYWIyYjZhMDY5MDlkM2Y5Mjk3M2I4NQ==',
					//'Revision':'2023-09-15'
				}
				var content='Emp Code,Badge\n';
				var response=https.get({
					url:'https://api.paycomonline.net/v4/rest/index.php/api/v1/employeeid?pagesize=500',
					//body:JSON.stringify(postData),
					headers:headers
				});
				
				do
				{
					var totalLinks=response.headers.link;
					var splitTotalLinks=totalLinks.split(',');
					var nextURL=null;
					for(var s=0;s<splitTotalLinks.length;s++)
					{
						try
						{
							var findNext=splitTotalLinks[s].split(';');
							var nextIndex=findNext[1].indexOf('next');
							if(nextIndex!=-1)
							{
								nextURL=findNext[0].replace("<","");
								nextURL=nextURL.replace(">","");
								break;
							}
						}
						catch(err)
						{
							break;
						}
					}
						try
						{


						//now we get the information yay!
						//var thisData=response.data.split(',');
						var thisData=JSON.parse(response.body);

						//var billingAddress1=orders.order.billing_address.address1;
						var totalLength=thisData.data.length;
						for(var t=0;t<totalLength;t++)
						{

						
							var thisECode=thisData.data[t].eecode;

							var thisFloCode=thisData.data[t].eebadge;
							//var getInformation="https://api.paycomonline.net/v4/rest/index.php/api/v1/employee/"+thisECode;
							/*
							var empResponse=https.get({
								url:getInformation,
								//body:JSON.stringify(postData),
								headers:headers
							});
							var empData=JSON.parse(empResponse.body)
							var eeCode=empData.data[0].eecode;
							var eeBadge=empData.data[0].eebadge;	
							*/					
							
							content=content+','+thisECode+','+thisFloCode+'\n';
							var dkdkfld=99;
						}
						}
						catch(err)
						{

						}
					if(nextURL)
					{
						response=https.get({
							url:nextURL,
							//body:JSON.stringify(postData),
							headers:headers
						});
					}
					


				}while(nextURL)
				var newFile=file.create({name:'PaycomEmployeeInfo.csv',fileType:'CSV',contents:content,folder:835991});
				newFile.save()
				//email.send({author:-5,recipients:'rodneyveach123@gmail.com',subject:'Emp Codes',body:'see subject',attachments:newFile});
				
		}
		function removeCommas(fieldId)
		{
			var newField=fieldId.replace(/,/gi,' ');
			return newField;

		}
	return {
		execute  : execute
	};
})