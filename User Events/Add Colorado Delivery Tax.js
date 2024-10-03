	

function addColorado()
{

	try
	{


		var howMany=nlapiGetLineItemCount('item');
		var deliveryStatus=nlapiGetFieldValue('custbody25');
		var isDelivery=false;
		var isDepartment=false;
		var isState=false;
		var alreadyExist=false;

		var moveForward=false;
		if(deliveryStatus == 1 || deliveryStatus==3)
			isDelivery=true;
	
		var shipState=nlapiGetFieldValue('shipstate');
		if(shipState=='CO')
			isState=true;
		
		moveForward=false;
		var warehouse=null;
		var department=null;
		var lineExist=null;
		for(var hm=1;hm<howMany+1;hm++)
		{
			var whatDepartment=nlapiGetLineItemValue('item','department',hm)
			if(whatDepartment==13 || whatDepartment==46 || whatDepartment==57 || whatDepartment==21 || whatDepartment==20)
			{
				moveForward=true;
				warehouse=nlapiGetLineItemValue('item','location',hm);
				department=whatDepartment;
				isDepartment=true;
			}	
			//already exists?
			var thisItem=nlapiGetLineItemValue('item','item',hm);
			if(thisItem==59365)
			{
				alreadyExist=true;
				lineExist=hm;
			}
			
		}
		if((!isDepartment || !isState || !isDelivery) && !alreadyExist)
			return true;
		if(isDepartment && isState && isDelivery && !alreadyExist)
		{

			nlapiSelectNewLineItem('item');
			nlapiSetCurrentLineItemValue('item','item',59365);
			nlapiSetCurrentLineItemValue('item','quantity',1);
			nlapiSetCurrentLineItemValue('item','location',warehouse);
			nlapiSetCurrentLineItemValue('item','department',department);
			nlapiSetCurrentLineItemValue('item','price',1);
			nlapiCommitLineItem('item');
		}
		if(isDepartment && isState && isDelivery && alreadyExist)
			return true;
		if((!isDepartment || !isState || !isDelivery) && alreadyExist)
		{
			nlapiRemoveLineItem('item',lineExist)
		}
		
	}
	catch(err)
	{
		nlapiLogExecution('debug','Error',err.message)
		return true;
	}
	
	
}
	