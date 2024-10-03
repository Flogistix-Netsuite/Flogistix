/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime','N/email'], 
	function(file, record, search,runtime,email) {
		function execute(options){  
			var items=[];
			var itemDescriptions=[];
			var documentNumbers=[];
			var closeds=[];
			var actualRunTimes=[];
			var quantities=[];
			var startDates=[];
			var endDates=[];
			var thisSearch=search.load({id:'customsearch3754'});
			thisSearch.run().each(function(result){
			   // .run().each has a limit of 4,000 results
				var thisItem=result.getText({name:'item'});
				var thisItemDescription1=result.getValue({name:'salesdescription',join:'item'});

				var thisItemDescription=thisItemDescription1.replace(/,/gi,'');
				if(!thisItemDescription)
					thisItemDescription=' ';
				var documentNumber=result.getValue({name:'tranid'});
				var closed=result.getValue({name:'closed'});
				var runTime=result.getValue({name:'actualruntime',join:'manufacturingoperationtask'});
				var thisInternalId=result.getValue({name:'internalid'});
				if(runTime==0)
				{
					var convertedHours=0;
					try
					{
						//find wo close and grab the values from 10610
						var workordercloseSearchObj = search.create({
						   type: "workorderclose",
						   filters:
						   [
						      ["type","anyof","WOClose"], 
						      "AND", 
						      ["createdfrom","anyof",thisInternalId], 
						      "AND", 
						      ["formulanumeric: case when {item} like '%Labor%' then 1 else 0 end","equalto","1"]
						   ],
						   columns:
						   [
						      search.createColumn({name: "item", label: "Item"}),
						      search.createColumn({name: "quantity", label: "Quantity"})
						   ]
						});
						var searchResultCount = workordercloseSearchObj.runPaged().count;
						log.debug("workordercloseSearchObj result count",searchResultCount);
						workordercloseSearchObj.run().each(function(result){
						   // .run().each has a limit of 4,000 results
							var thisHours=result.getValue({name:'quantity'});
							thisHours=Math.abs(thisHours);
							var theseMinutes=thisHours*60;
							convertedHours=convertedHours+theseMinutes;
						   return true;
						});
						runTime=convertedHours;

						/*
						workordercloseSearchObj.id="customsearch1686952361353";
						workordercloseSearchObj.title="find closes (copy)";
						var newSearchId = workordercloseSearchObj.save();
						*/
						/*
						if(documentNumber==6052101)
							var djdjdkd=99;
						var manuRouteId=result.getValue({name:'manufacturingrouting'});
						var manuRouteRec=record.load({type:'manufacturingrouting',id:manuRouteId});

						var howMany=manuRouteRec.getLineCount({sublistId:'routingcomponent'});
						for(var hm=0;hm<howMany;hm++)
						{
							var whatItemName=manuRouteRec.getSublistValue({sublistId:'routingcomponent',fieldId:'item',line:hm});
							if(whatItemName==10610)
								{
									runTime=manuRouteRec.getSublistValue({sublistId:'routingcomponent',fieldId:'quantity',line:hm});
									break;
								}
						}*/

					}
					catch(err)
					{
						return true;
					}
					

					
					//open the WO
					//open the 
				}
				var quantity=result.getValue({name:'quantity'});
				var startDate=result.getValue({name:'startdate'});
				var endDate=result.getValue({name:'enddate'});
				items.push(thisItem);
				itemDescriptions.push(thisItemDescription);
				documentNumbers.push(documentNumber);
				closeds.push(closed);
				actualRunTimes.push(runTime);
				quantities.push(quantity);
				startDates.push(startDate);
				endDates.push(endDate);

			    return true;
			    });
			//make a quick solution
			var contents='Item,Description,Document Number,Closed,Actual Run Time,Quantity,Start Date,End Date\n';
			for(var i=0;i<items.length;i++)
			{
				contents=contents+items[i]+','+itemDescriptions[i]+','+documentNumbers[i]+','+closeds[i]+','+actualRunTimes[i]+','+quantities[i]+','+startDates[i]+','+endDates[i]+'\n';
			}
			var newFile=file.create({
				name:'Actual WO Time to Complete.csv',
				fileType:'CSV',
				contents:contents
				});
			var attachments=[];
				attachments.push(newFile);

			email.send({
				author:-5,
				recipients:'rodneyveach123@gmail.com',
				subject:'WO Time To Complete',
				body:'Check it',
				attachments:attachments,



			})
		}	
	return {
		execute  : execute
	};
})