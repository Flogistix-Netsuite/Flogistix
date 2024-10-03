function updateCustomer()
{
    
    var getThisCustomer1=nlapiGetFieldValue('custpage_customers');
    var getThisCustomer=getThisCustomer1.split('\x05');
    //alert('Here it is'+getThisCustomer);
     var dates=[];
    var names=[];
    var quantities=[];
    var items=[];
    var descriptions=[];
    var rates=[];
    var headerMemos=[];
    var relatedAssets=[];
    var internalIds=[];
    var invoices=[];
    var resultIndex=0;
    var resultStep=1000;
    var resultSet;
    var context=nlapiGetContext();
    /*
    var invoiceSearch = nlapiSearchRecord("invoice",null,
        [
           ["type","anyof","CustInvc"], 
           "AND", 
           ["memorized","is","T"], 
           "AND", 
           ["account","anyof","398"], 
           "AND", 
           ["name","anyof",getThisCustomer]
        ], 
        [
           new nlobjSearchColumn("trandate"), 
           new nlobjSearchColumn("entity"), 
           new nlobjSearchColumn("quantity"), 
           new nlobjSearchColumn("item"), 
           new nlobjSearchColumn("memo"), 
           new nlobjSearchColumn("rate"), 
           new nlobjSearchColumn("memomain"), 
           new nlobjSearchColumn("custcol_far_trn_relatedasset"), 
           new nlobjSearchColumn("internalid")
        ]
        );
    */
    var filters=[];
    var columns=[];

    filters[0]=new nlobjSearchFilter('type',null,'anyof','CustInvc');
    filters[1]=new nlobjSearchFilter('memorized',null,'is','T');
    filters[2]=new nlobjSearchFilter('account',null,'anyof','398');
    filters[3]=new nlobjSearchFilter('name',null,'anyof',getThisCustomer);
    columns[0]=new nlobjSearchColumn("trandate");
    columns[1]=new nlobjSearchColumn("entity");
    columns[2]=new nlobjSearchColumn("quantity");
    columns[3]=new nlobjSearchColumn("item");
    columns[4]=new nlobjSearchColumn("memo");
    columns[5]=new nlobjSearchColumn("rate");
    columns[6]=new nlobjSearchColumn("memomain");
    columns[7]=new nlobjSearchColumn("custcol_far_trn_relatedasset");
    columns[8]=new nlobjSearchColumn("internalid");
    columns[9]=new nlobjSearchColumn("tranid");
   
    var search=nlapiCreateSearch("invoice",filters,columns);
    var searchResults=search.runSearch();
    resultSet=searchResults.getResults(resultIndex, resultIndex+resultStep);
    clearLists();

    if(resultSet.length>=1000)
    {
    do    
        {
            resultSet=searchResults.getResults(resultIndex, resultIndex+resultStep);
            resultIndex=resultIndex+resultStep;
            
          //SearchResults=nlapiSearchRecord('item','customsearch432',null,null)
            for(var a=0; resultSet && a<resultSet.length; a++)
                {
                if(context.getRemainingUsage()<200)
                    nlapiYieldScript();
                var columns=resultSet[a].getAllColumns();
                 
                var thisDate=resultSet[a].getValue(columns[0]);
                var thisName=resultSet[a].getValue(columns[1]);
                var thisQuantity=resultSet[a].getValue(columns[2]);
                var thisItem=resultSet[a].getValue(columns[3]);
                var thisDescription=resultSet[a].getValue(columns[4]);
                var thisRate=resultSet[a].getValue(columns[5]);
                var thisMemo=resultSet[a].getValue(columns[6]);
                var thisAsset=resultSet[a].getValue(columns[7]);
                var thisId=resultSet[a].getValue(columns[8]);
                var thisInvoice=resultSet[a].getValue(columns[9]);
                dates.push(thisDate);
                names.push(thisName);
                quantities.push(thisQuantity);
                items.push(thisItem);
                descriptions.push(thisDescription);
                rates.push(thisRate);
                headerMemos.push(thisMemo);
                relatedAssets.push(thisAsset);
                internalIds.push(thisId);
                invoices.push(thisInvoice);
                }

        }while(resultSet.length>0);
        for(var n=0;n<names.length;n++)
        {
            
            sublist.setLineItemValue('custpage_dates',n+1,dates[n]);
            sublist.setLineItemValue('custpage_names',n+1,names[n]);
            sublist.setLineItemValue('custpage_quantities',n+1,quantities[n]);
            sublist.setLineItemValue('custpage_items',n+1,items[n]);
            sublist.setLineItemValue('custpage_description',n+1,descriptions[n]);
            sublist.setLineItemValue('custpage_rates',n+1,rates[n]);
            sublist.setLineItemValue('custpage_memos',n+1,headerMemos[n]);
            sublist.setLineItemValue('custpage_assets',n+1,relatedAssets[n]);
            sublist.setLineItemValue('custpage_ids',n+1,internalIds[n]);
            sublist.setLineItemValue('custpage_invoices',n+1,internalIds[n]);
        }

    }
    else
    {
        var searchResults=nlapiSearchRecord('invoice',null,filters,columns);

        for(var n=0; searchResults && n<searchResults.length; n++)
        { 
            var columns=searchResults[n].getAllColumns();
            nlapiSelectNewLineItem('invoices');
            nlapiSetCurrentLineItemValue('invoices','custpage_dates',searchResults[n].getValue(columns[0]));
            nlapiSetCurrentLineItemValue('invoices','custpage_names',searchResults[n].getValue(columns[1]));
            nlapiSetCurrentLineItemValue('invoices','custpage_quantities',searchResults[n].getValue(columns[2]));
            nlapiSetCurrentLineItemValue('invoices','custpage_items',searchResults[n].getValue(columns[3]));
            nlapiSetCurrentLineItemValue('invoices','custpage_description',searchResults[n].getValue(columns[4]));
            nlapiSetCurrentLineItemValue('invoices','custpage_rates',searchResults[n].getValue(columns[5]));
            nlapiSetCurrentLineItemValue('invoices','custpage_memos',searchResults[n].getValue(columns[6]));
            nlapiSetCurrentLineItemValue('invoices','custpage_assets',searchResults[n].getValue(columns[7]));
            nlapiSetCurrentLineItemValue('invoices','custpage_ids',searchResults[n].getValue(columns[8]));
            nlapiSetCurrentLineItemValue('invoices','custpage_invoices',searchResults[n].getValue(columns[8]));
            nlapiCommitLineItem('invoices');

            /*
            nlapiSetLineItemValue('invoices','custpage_dates',n+1,searchResults[n].getValue(columns[0]));
            nlapiSetLineItemValue('invoices','custpage_names',n+1,searchResults[n].getValue(columns[1]));
            nlapiSetLineItemValue('invoices','custpage_quantities',n+1,searchResults[n].getValue(columns[2]));
            nlapiSetLineItemValue('invoices','custpage_items',n+1,searchResults[n].getValue(columns[3]));
            nlapiSetLineItemValue('invoices','custpage_description',n+1,searchResults[n].getValue(columns[4]));
            nlapiSetLineItemValue('invoices','custpage_rates',n+1,searchResults[n].getValue(columns[5]));
            nlapiSetLineItemValue('invoices','custpage_memos',n+1,searchResults[n].getValue(columns[6]));
            nlapiSetLineItemValue('invoices','custpage_assets',n+1,searchResults[n].getValue(columns[7]));
            nlapiSetLineItemValue('invoices','custpage_ids',n+1,searchResults[n].getValue(columns[8]));

            sublist.setLineItemValue('custpage_dates',n+1,searchResults[n].getValue(columns[0]));
            sublist.setLineItemValue('custpage_names',n+1,searchResults[n].getValue(columns[1]));
            sublist.setLineItemValue('custpage_quantities',n+1,searchResults[n].getValue(columns[2]));
            sublist.setLineItemValue('custpage_items',n+1,searchResults[n].getValue(columns[3]));
            sublist.setLineItemValue('custpage_description',n+1,searchResults[n].getValue(columns[4]));
            sublist.setLineItemValue('custpage_rates',n+1,searchResults[n].getValue(columns[5]));
            sublist.setLineItemValue('custpage_memos',n+1,searchResults[n].getValue(columns[6]));
            sublist.setLineItemValue('custpage_assets',n+1,searchResults[n].getValue(columns[7]));
            sublist.setLineItemValue('custpage_ids',n+1,searchResults[n].getValue(columns[8]));*/
        }
    }

       
   


    

        
}

function clearLists()
{
    //var rec1=currentRecord.get();
    var howMany=nlapiGetLineItemCount('invoices');
    for(var hm=howMany;hm>0;hm--)
    {
        try
        {
            nlapiRemoveLineItem('invoices',1);
            howMany=nlapiGetLineItemCount('invoices');
        }
        catch(err)
        {
            alert(err)
        }
        
    }
    
    
}

function allCustomers()
{
     var dates=[];
    var names=[];
    var quantities=[];
    var items=[];
    var descriptions=[];
    var rates=[];
    var headerMemos=[];
    var relatedAssets=[];
    var internalIds=[];
    var resultIndex=0;
    var resultStep=1000;
    var resultSet;
    var context=nlapiGetContext();
    var search=nlapiLoadSearch('transaction','customsearch3820');
    /*
    date
    name
    quantity
    item
    item description
    rate
    header memo
    related asset
    */
    
    


    var searchResults=search.runSearch();
    do    
        {
            resultSet=searchResults.getResults(resultIndex, resultIndex+resultStep);
            resultIndex=resultIndex+resultStep;
            
          //SearchResults=nlapiSearchRecord('item','customsearch432',null,null)
            for(var a=0; resultSet && a<resultSet.length; a++)
                {
                  if(context.getRemainingUsage()<200)
                    nlapiYieldScript();
                var columns=resultSet[a].getAllColumns();
                 
                var thisDate=resultSet[a].getValue(columns[0]);
                var thisName=resultSet[a].getValue(columns[1]);
                var thisQuantity=resultSet[a].getValue(columns[2]);
                var thisItem=resultSet[a].getValue(columns[3]);
                var thisDescription=resultSet[a].getValue(columns[4]);
                var thisRate=resultSet[a].getValue(columns[5]);
                var thisMemo=resultSet[a].getValue(columns[6]);
                var thisAsset=resultSet[a].getValue(columns[7]);
                var thisId=resultSet[a].getValue(columns[8]);
                dates.push(thisDate);
                names.push(thisName);
                quantities.push(thisQuantity);
                items.push(thisItem);
                descriptions.push(thisDescription);
                rates.push(thisRate);
                headerMemos.push(thisMemo);
                relatedAssets.push(thisAsset);
                internalIds.push(thisId);
                }

        }while(resultSet && resultSet.length>0);



for(var n=0;n<names.length;n++)
{
    
    //var columns=searchResults[n].getAllColumns();
    nlapiSelectNewLineItem('invoices');
    nlapiSetCurrentLineItemValue('invoices','custpage_dates',dates[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_names',names[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_quantities',quantities[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_items',items[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_description',descriptions[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_rates',rates[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_memos',headerMemos[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_assets',relatedAssets[n]);
    nlapiSetCurrentLineItemValue('invoices','custpage_ids',internalIds[n]);
    nlapiCommitLineItem('invoices');
}
}
function updatePercents()
{
    var whatPercent=nlapiGetFieldValue('custom_percent_increase');
    if(!whatPercent)
    {
        alert('Missing a percent to increase.');
        return false;
    }
    var howMany=nlapiGetLineItemCount('invoices');
    for(var hm=1;hm<howMany+1;hm++)
    {
        nlapiSelectLineItem('invoices',hm);
        nlapiSetCurrentLineItemValue('invoices','custpage_percent_increase',whatPercent);
        nlapiCommitLineItem('invoices')
    }

}
function markAll()
{
    var howMany=nlapiGetLineItemCount('invoices');
    for(var hm=1;hm<howMany+1;hm++)
    {
        nlapiSelectLineItem('invoices',hm);
        nlapiSetCurrentLineItemValue('invoices','custpage_update','T');
        nlapiCommitLineItem('invoices')
    }
}
function unmarkAll()
{
    var howMany=nlapiGetLineItemCount('invoices');
    for(var hm=1;hm<howMany+1;hm++)
    {
        nlapiSelectLineItem('invoices',hm);
        nlapiSetCurrentLineItemValue('invoices','custpage_update','F');
        nlapiCommitLineItem('invoices')
    }
}