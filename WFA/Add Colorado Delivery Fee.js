	

function addColorado()
{

	try
	{


		var howMany=nlapiGetLineItemCount('item');
		var deliveryStatus=nlapiGetFieldValue('custbody25');
		var moveForward=false;
		if(deliveryStatus == 1 || deliveryStatus==3)
			moveForward=true;
		if(!moveForward)
			return true;
		var shipState=nlapiGetFieldValue('shipstate');
		if(shipState=='CO')
			moveForward=true;
		if(!moveForward)
			return true;
		nlapiSelectNewLineItem('item');
		nlapiSetCurrentLineItemValue('item','item',59365);
		nlapiSetCurrentLineItemValue('item','quantity',1);
		nlapiCommitLineItem('item');
		return true;
	}
	catch(err)
	{
		return true;
	}
	
	
}
	