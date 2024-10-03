	

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
		if(shipState!='CO')
			moveForward=false;
		if(!moveForward)
			return true;
		moveForward=false;
		var warehouse=null;
		var department=null;
		for(var hm=1;hm<howMany+1;hm++)
		{
			var whatDepartment=nlapiGetLineItemValue('item','department',hm)
			if(whatDepartment==13 || whatDepartment==46 || whatDepartment==57 || whatDepartment==21 || whatDepartment==20)
			{
				moveForward=true;
				warehouse=nlapiGetLineItemValue('item','location',hm);
				department=whatDepartment;
			}	
			
		}
		if(!moveForward)
			return true;
		nlapiSelectNewLineItem('item');
		nlapiSetCurrentLineItemValue('item','item',59365);
		nlapiSetCurrentLineItemValue('item','quantity',1);
		nlapiSetCurrentLineItemValue('item','location',warehouse);
		nlapiSetCurrentLineItemValue('item','department',department);
		nlapiSetCurrentLineItemValue('item','price',1);
		nlapiCommitLineItem('item');
		return true;
	}
	catch(err)
	{
		return true;
	}
	
	
}
	