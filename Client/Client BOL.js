function buttonPrint()
{
              //URL of the Suitelet
      
 
  var rec1=nlapiLoadRecord('itemfulfillment',nlapiGetRecordId());
    var thisForm=rec1.getFieldValue('customform');
  nlapiLogExecution('debug',thisForm);
  /*alert(thisForm);
  var howMany=nlapiGetLineItemCount('item');
  if(howMany==0)
    return;
   var whatLocation=nlapiGetLineItemValue('item','location',1);
  alert(nlapiGetRecordId());
  alert(whatLocation);
  if(whatLocation==19)
    thisForm=190;
  if(whatLocation==21)
    thisForm=189*/
   //alert(thisForm);
		var suiteletURL='https://4948152.app.netsuite.com/app/site/hosting/scriptlet.nl?script=664&deploy=1&custpage_ID='+nlapiGetRecordId()+'&custpage_form='+thisForm;
		window.open(suiteletURL);
  

}
function invoicePrint()
{
  var rId=nlapiGetFieldValue('createdfrom');
  var foundId=null
  var invoiceSearch = nlapiSearchRecord("invoice",null,
[
   ["createdfrom","anyof",rId], 
   "AND", 
   ["type","anyof","CustInvc"], 
   "AND", 
   ["mainline","is","T"]
], 
[
   new nlobjSearchColumn("internalid")
]
);
  if(invoiceSearch)
    foundId=invoiceSearch[0].getValue('internalid');
  if(!foundId)
    return;
  var suiteletURL='https://4948152.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1148&deploy=1&custpage_ID='+foundId;
		window.open(suiteletURL);
}

function LLPrint()
{
  var rec1=nlapiLoadRecord('itemfulfillment',nlapiGetRecordId());
    var thisForm=rec1.getFieldValue('customform');
  /*alert(thisForm);
  var howMany=nlapiGetLineItemCount('item');
  if(howMany==0)
    return;
   var whatLocation=nlapiGetLineItemValue('item','location',1);
  alert(nlapiGetRecordId());
  alert(whatLocation);
  if(whatLocation==19)
    thisForm=190;
  if(whatLocation==21)
    thisForm=189*/
   //alert(thisForm);
		var suiteletURL='https://4948152.app.netsuite.com/app/site/hosting/scriptlet.nl?script=664&deploy=1&custpage_ID='+nlapiGetRecordId()+'&custpage_form=-2';
		window.open(suiteletURL);
}
function AOPrint()
{
  var rec1=nlapiLoadRecord('itemfulfillment',nlapiGetRecordId());
    var thisForm=rec1.getFieldValue('customform');
  /*alert(thisForm);
  var howMany=nlapiGetLineItemCount('item');
  if(howMany==0)
    return;
   var whatLocation=nlapiGetLineItemValue('item','location',1);
  alert(nlapiGetRecordId());
  alert(whatLocation);
  if(whatLocation==19)
    thisForm=190;
  if(whatLocation==21)
    thisForm=189*/
   //alert(thisForm);
		var suiteletURL='https://4948152.app.netsuite.com/app/site/hosting/scriptlet.nl?script=664&deploy=1&custpage_ID='+nlapiGetRecordId()+'&custpage_form=186';
		window.open(suiteletURL);
}