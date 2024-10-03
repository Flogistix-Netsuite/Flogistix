function planningValues()
{

	var items=[];
	var itemNames=[];
	var onHandEl=[];
	var onHandPampa=[];
	var wipEl=[];
	var wipPampa=[];
	var overallTransfer=[];
	var monthElReno=[];
	var monthPampa=[];
	var twoMonthElReno=[];
	var twoMonthPampa=[];
	var threeMonthElReno=[];
	var threeMonthPampa=[];
	var itemDescriptions=[];
	var demandElReno=[];
	var demandTwoElReno=[];
	var demandThreeElReno=[];
	var demandPampa=[];
	var demandTwoPampa=[];
	var demandThreePampa=[];
	var demandElRenoWIP=[];
	var demandPampaWIP=[];
/*
	var allItems=[];
	var itemLocations=[];
	var itemsOnHand=[];
	var itemsOnOrder=[];
	var itemsInTransit=[];
	var itemsInSupply=[];
*/
	var itemsInDemand=[];
	var ignoreTheseIds=[];
	//get the items we are running here

	var itemSearch = nlapiSearchRecord("item",null,
		[
		   ["custitem_work_center_class","noneof","@NONE@"], 
		    "AND", 
      		["inventorylocation","anyof","319","337"]
		   

		], 
		[

		    new nlobjSearchColumn("itemid").setSort(false), 
		    new nlobjSearchColumn("inventorylocation"), 
		    new nlobjSearchColumn("locationquantityonhand"), 
		    new nlobjSearchColumn("locationquantityonorder"), 
		    new nlobjSearchColumn("locationquantityintransit"),
		    new nlobjSearchColumn("salesdescription"), 
		    new nlobjSearchColumn("internalid"),

		]
		);
	for(var i=0;i<itemSearch.length;i++)
	{
		var thisCurrentItem=itemSearch[i].getValue('internalid');
		var thisCurrentItemName=itemSearch[i].getValue('itemid');
		var thisLocation=itemSearch[i].getValue('inventorylocation');
		var thisQuantityOnHand=itemSearch[i].getValue('locationquantityonhand');
		var thisQuantityOnOrder=itemSearch[i].getValue('locationquantityonorder');
		var thisQuantityInTransit=itemSearch[i].getValue('locationquantityintransit');
		var thisDescription1=itemSearch[i].getValue('salesdescription');
		var thisDescription=thisDescription1.replace(/,/gi,' ');
		/*
		var items=[];
		var itemNames=[];
		var onHandEl=[];
		var onHandPampa=[];
		var wipEl=[];
		var wipPampa=[];
		var overallTransfer=[];
		var monthElReno=[];
		var monthPampa=[];
		var twoMonthElReno=[];
		var twoMonthPampa=[];
		var threeMonthPampa=[];
		var threeMonthElReno =[];
		*/
		if(thisLocation==319)//elReno
		{
			var alreadyExist=items.indexOf(thisCurrentItem);
			if(alreadyExist==-1)
			{
				items.push(thisCurrentItem);
				itemNames.push(thisCurrentItemName);
				onHandEl.push(thisQuantityOnHand);
				onHandPampa.push(0);
				overallTransfer.push(thisQuantityInTransit);
				wipEl.push(0);
				wipPampa.push(0);
				itemDescriptions.push(thisDescription);
				monthElReno.push(0)
				twoMonthElReno.push(0);
				threeMonthElReno.push(0);
				monthPampa.push(0);
				twoMonthPampa.push(0);
				threeMonthPampa.push(0);
				demandElReno.push(0);
				demandTwoElReno.push(0);
				demandThreeElReno.push(0);
				demandPampa.push(0);
				demandTwoPampa.push(0);
				demandThreePampa.push(0);
				demandElRenoWIP.push(0);
				demandPampaWIP.push(0);
			}
			else
			{
				onHandEl[alreadyExist]=thisQuantityOnHand;
				//wipEl[alreadyExist]=thisQuantityOnOrder;
				var currentTransfer=overallTransfer[alreadyExist];
					currentTransfer=Number(currentTransfer)+thisQuantityInTransit;
				overallTransfer[alreadyExist]=currentTransfer;
			}
		}
		else
		{
			var alreadyExist=items.indexOf(thisCurrentItem);
				if(alreadyExist==-1)
				{
					items.push(thisCurrentItem);
					itemNames.push(thisCurrentItemName);
					onHandEl.push(0);
					onHandPampa.push(thisQuantityOnHand);
					overallTransfer.push(thisQuantityInTransit);
					wipEl.push(0);
					wipPampa.push(0);
					itemDescriptions.push(thisDescription);
					monthPampa.push(0);
					twoMonthPampa.push(0);
					threeMonthPampa.push(0);
					monthElReno.push(0)
					twoMonthElReno.push(0);
					threeMonthElReno.push(0);
					demandElReno.push(0);
					demandTwoElReno.push(0);
					demandThreeElReno.push(0);
					demandPampa.push(0);
					demandTwoPampa.push(0);
					demandThreePampa.push(0);
					demandElRenoWIP.push(0);
					demandPampaWIP.push(0);

				}
				else
				{
					onHandPampa[alreadyExist]=thisQuantityOnHand;
					//wipPampa[alreadyExist]=thisQuantityOnOrder;
					var currentTransfer=overallTransfer[alreadyExist];
						currentTransfer=Number(currentTransfer)+thisQuantityInTransit;
					overallTransfer[alreadyExist]=currentTransfer;
				}
		}
	}
		
		
		
	//now, we need to search for workorders; if item is assembly then supply; else demand
	//for each item in the above
	var month=[];
	var wanted=[];
	var today1=new Date();
	var plusNinety1=nlapiAddDays(today1,90);
	var today=dateFixer(today1);
	var plusNinety=dateFixer(plusNinety1);
    for(var i=0;i<items.length;i++)
    {
    	var transactionSearch22 = nlapiSearchRecord("transaction",null,
		[
		   [["type","anyof","WorkOrd"],"AND",["status","noneof","WorkOrd:H","WorkOrd:C","WorkOrd:G"]], 
		   "AND", 
		   ["item.custitem_work_center_class","noneof","@NONE@"], 
		   "AND", 
		   ["location","anyof","337","319"], 
		   "AND", 
		   ["item","anyof",items[i]], 
		   "AND", 
		   ["quantity","greaterthan","0"], 
		   "AND", 
		   ["startdate","within","yearsago1","daysfromnow90"]
		], 
		[
		   new nlobjSearchColumn("item",null,"GROUP").setSort(false), 
		   new nlobjSearchColumn("quantity",null,"SUM"), 
		   new nlobjSearchColumn("mainline",null,"GROUP"), 
		   new nlobjSearchColumn("location",null,"GROUP"), 
		   new nlobjSearchColumn("startdate",null,"GROUP").setFunction('month')
		]
		);
    	
    
	
	var whatDate=new Date();
	var thisMonth=whatDate.getMonth();
		thisMonth++;
	var nextMonth=thisMonth+1;
	var twoMonth=nextMonth+1;
	var pampa=null;
	var nonPampa=null;
	//now, we need to add to this
	for(var t=0;transactionSearch22 && t<transactionSearch22.length;t++)
	{
		var columns=transactionSearch22[t].getAllColumns();
		var woLocation=transactionSearch22[t].getValue(columns[3]);
		var woDate=transactionSearch22[t].getValue(columns[4]);
		var woDateSplit=woDate.split('-');
		var useThisMonth=woDateSplit[1];
		//var woDateSplit=new Date(woDate);
		//var useThisMonth=woDateSplit.getMonth();
		//	useThisMonth++;
		var isSupply=transactionSearch22[t].getValue(columns[2]);

		var matchMonth=null;
		var matchLocation=null;

		if(useThisMonth==thisMonth)
			matchMonth=1;
		else if(useThisMonth==nextMonth)
			matchMonth=2;
		else if(useThisMonth==twoMonth)
			matchMonth=3;
		else
			matchMonth=0;
		if(woLocation==319)//elreno
			matchLocation=319;
		else if(woLocation==337)//pampa
			matchLocation=337;
		else 
			continue;

		var woQuantity=transactionSearch22[t].getValue(columns[1]);
		var woItem=transactionSearch22[t].getValue(columns[0]);
		if(woItem==57646)
			var dkdkdk=99;
	/*
		var demandElReno=[];
		var demandTwoElReno=[];
		var demandThreeElReno=[];
		var demandPampa=[];
		var demandTwoPampa=[];
		var demandThreePampa=[];
		var demandElRenoWIP=[];
		var demandPamapWIP=[];
		*/
		var woIndex=items.indexOf(woItem);
		//if(woItem==-1)
		
		if(matchLocation==319 && isSupply!='*')
			wipEl[woIndex]=Number(woQuantity)+Number(wipEl[woIndex]);
		else if(matchLocation==337 && isSupply!='*')
			wipPampa[woIndex]=Number(woQuantity)+Number(wipPampa[woIndex])
		/*
		else if(matchLocation==319 && matchMonth==2 && isSupply)
			twoMonthElReno[woIndex]=woQuantity;
		else if(matchLocation==319 && matchMonth==3 && isSupply)
			threeMonthElReno[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==1 && isSupply)
			monthPampa[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==2 && isSupply)
			twoMonthPampa[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==3 && isSupply)
			threeMonthPampa[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==0 && isSupply)
			wipPampa[woIndex]=woQuantity
		else if(matchLocation==319 && matchMonth==0 && isSupply)
			wipEl[woIndex]=woQuantity;//demand
			*/

		else if(matchLocation==319 && matchMonth==1 && isSupply=='*')
			demandElReno[woIndex]=woQuantity;
		else if(matchLocation==319 && matchMonth==2 && isSupply=='*')
			demandTwoElReno[woIndex]=woQuantity;
		else if(matchLocation==319 && matchMonth==3 && isSupply=='*')
			demandThreeElReno[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==1 && isSupply=='*')
			demandPampa[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==2 && isSupply=='*')
			demandTwoPampa[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==3 && isSupply=='*')
			demandThreePampa[woIndex]=woQuantity;
		else if(matchLocation==337 && matchMonth==0 && isSupply=='*')
			demandPampaWIP[woIndex]=woQuantity
		else if(matchLocation==319 && matchMonth==0 && isSupply=='*')
			demandElRenoWIP[woIndex]=woQuantity;





		}
	}
	
	var headers='Part,Description,On Hand El Reno,On Hand Pampa,WIP El Reno,WIP Pampa,Transfer,El Reno Needed This Month,Pampa Needed This Month,El Reno Needed in 1 Month,Pampa Needed in 1 Month,El Reno Needed in 2 Months,Pampa Needed in 2 Months\n';
	for(var i=0;i<items.length;i++)
	{
		headers=headers+itemNames[i]+','+itemDescriptions[i]+','+onHandEl[i]+','+onHandPampa[i]+','+wipEl[i]+','+wipPampa[i]+','+overallTransfer[i]+','+demandElReno[i]+',';
		headers=headers+demandPampa[i]+','+demandTwoElReno[i]+','+demandTwoPampa[i]+','+demandThreeElReno[i]+','+demandThreePampa[i]+'\n';

	}
	//var todayDate=dateFixer(today);
	var newFile=nlapiCreateFile('SupplyDemand for '+today+'.csv','CSV',headers);
	newFile.setFolder(857290);
	nlapiSubmitFile(newFile);
}




function returnStringMonth(findMe)
{
	var returnValue=null;
	switch (findMe){
	case 1:
		returnValue='Jan';
		break;
	case 2:
		returnValue='Feb';
		break;
	case 3:
		returnValue='Mar';
		break;
	case 4:
		returnValue='Apr';
		break;
	case 5:
		returnValue='May';
		break;
	case 6:
		returnValue='Jun';
		break;
	case 7:
		returnValue='Jul';
		break;
	case 8:
		returnValue='Aug';
		break;
	case 9:
		returnValue='Sep';
		break;
	case 10:
		returnValue='Oct';
		break;
	case 11:
		returnValue='Nov';
		break;
	case 12:
		returnValue='Dec';
		break;

	}
	return returnValue;
}
function dateFixer(thisDate)
		{
			var day=thisDate.getDate();
			if(day<10)
				day='0'+day;
			var month=thisDate.getMonth();
				month++
			if(month<10)
				month='0'+month;
			var year=thisDate.getFullYear();
			var rDate=month+'/'+day+'/'+year;
			return rDate;
		}