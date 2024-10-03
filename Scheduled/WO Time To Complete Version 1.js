function woTime()
{

		var items=[];
		var itemDescriptions=[];
		var documentNumbers=[];
		var closeds=[];
		var actualRunTimes=[];
		var quantities=[];
		var startDates=[];
		var endDates=[];
		var internalIds=[];
		var context=nlapiGetContext();
		var whoToEmail=context.getSetting('SCRIPT','custscript_who_to_email');
		var itemsToFind=context.getSetting('SCRIPT','custscript_items_to_find');
		var workorderSearch = nlapiSearchRecord("workorder",null,
		[
		   ["type","anyof","WorkOrd"], 
		   "AND", 
		   ["trandate","within","daysago365","daysago0"], 
		   "AND", 
		   ["mainline","is","T"], 
		   "AND", 
		   ["item","anyof","57421","57434","59440","57442","57444","57448","57449","59046","57456","57461","58921","57475","59345","57490","57492","57497","57499","59048","57505","57520","57523","57532","57540","57543","57549","59061","59072","57847","57963","59047","57861","57965","57971","59114","59034","59028","59044","59347","56513","56829","59348","59059","59051","59060","59038","57967"], 
		   "AND", 
		   ["location","anyof","352","660","337"]
		], 
		[
		   new nlobjSearchColumn("item"), 
		   new nlobjSearchColumn("salesdescription","item",null), 
		   new nlobjSearchColumn("tranid"), 
		   new nlobjSearchColumn("closed"), 
		   new nlobjSearchColumn("actualruntime","manufacturingOperationTask",null), 
		   new nlobjSearchColumn("quantity"), 
		   new nlobjSearchColumn("startdate"), 
		   new nlobjSearchColumn("enddate"), 
		   new nlobjSearchColumn("internalid"), 
		   new nlobjSearchColumn("manufacturingrouting")
		]
		);

		
		
		var resultIndex=0;
		var resultStep=1000;
		var resultSet;
		
		
		var thisSearch=nlapiLoadSearch('transaction','customsearch3754');
		var searchResults=thisSearch.runSearch();
		do	
	        {
	        	resultSet=searchResults.getResults(resultIndex, resultIndex+resultStep);
	        	resultIndex=resultIndex+resultStep;
	        	
			  //SearchResults=nlapiSearchRecord('item','customsearch432',null,null)
				for(var a=0; a<resultSet.length; a++)
					{
			          if(context.getRemainingUsage()<200)
			            nlapiYieldScript();
					//var columns=resultSet[a].getAllColumns()
					
					var thisItem=resultSet[a].getText('item');
					var thisItemDescription1=resultSet[a].getValue('salesdescription','item');

					var thisItemDescription=thisItemDescription1.replace(/[,\r\n]/gi,'');
					if(!thisItemDescription)
						thisItemDescription=' ';
					var documentNumber=resultSet[a].getValue('tranid');
					var closed=resultSet[a].getValue('closed');
					var runTime=resultSet[a].getValue('actualruntime','manufacturingoperationtask');
					var thisInternalId=resultSet[a].getValue('internalid');
					var quantity=resultSet[a].getValue('quantity');
					var startDate=resultSet[a].getValue('startdate');
					var endDate=resultSet[a].getValue('enddate');
					items.push(thisItem);
					itemDescriptions.push(thisItemDescription);
					documentNumbers.push(documentNumber);
					closeds.push(closed);
					actualRunTimes.push(runTime);
					quantities.push(quantity);
					startDates.push(startDate);
					endDates.push(endDate);
					internalIds.push(thisInternalId);

					}
			}while(resultSet.length>0);
			//now, we need to check this out
			for(var t=0;t<items.length;t++)
			{
				if(context.getRemainingUsage()<250)
					nlapiYieldScript();
				var isZero=actualRunTimes[t];
				if(isZero==0)
				{
					var convertedHours=0;
					var workOrderId=internalIds[t];
					if(workOrderId==14775539)
						var dfdfdfddfdfdfd=98;
					var workordercloseSearch = nlapiSearchRecord("workorderclose",null,
					[
					   ["type","anyof","WOClose"], 
					   "AND", 
					   ["createdfrom","anyof",workOrderId], 
					   "AND", 
					   ["formulanumeric: case when {item} like '%Labor%' then 1 else 0 end","equalto","1"]
					], 
					[
					   new nlobjSearchColumn("item"), 
					   new nlobjSearchColumn("quantity")
					]
					);
					
					for(var w=0;workordercloseSearch && w<workordercloseSearch.length;w++)
					{
						var thisHours=workordercloseSearch[w].getValue('quantity');
							thisHours=Math.abs(thisHours);
						var theseMinutes=thisHours*60;
						convertedHours=convertedHours+theseMinutes;

					}
					
					actualRunTimes[t]=convertedHours;
				}
			}
			var contents='Item,Description,Document Number,Closed,Actual Run Time,Quantity,Start Date,End Date\n';
			for(var i=0;i<items.length;i++)
			{
				contents=contents+items[i]+','+itemDescriptions[i]+','+documentNumbers[i]+','+closeds[i]+','+actualRunTimes[i]+','+quantities[i]+','+startDates[i]+','+endDates[i]+'\n';
			}
			var newFile=nlapiCreateFile('Actual WO Time to Complete.csv','CSV',contents);
			nlapiSendEmail(-5,whoToEmail,'WO Time to Complete','Check It',null,null,null,newFile);



}