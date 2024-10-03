function fixMemories(request,response)
{
    if(request.getMethod()=='GET')
    {

    var form=nlapiCreateForm('Memorized Transactions');
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
    /*
    var invoiceSearch = nlapiSearchRecord("invoice",null,
        [
           ["type","anyof","CustInvc"], 
           "AND", 
           ["memorized","is","T"], 
           "AND", 
           ["account","anyof","398"]
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
    
    var filters=[];
    var columns=[];

    filters[0]=new nlobjSearchFilter('type',null,'anyof','Assembly');
    filters[0]=new nlobjSearchFilter('type',null,'anyof','Assembly');
    filters[0]=new nlobjSearchFilter('type',null,'anyof','Assembly');
    columns[0]=new nlobjSearchColumn("internalid");
    columns[1]=new nlobjSearchColumn("internalid");
    columns[2]=new nlobjSearchColumn("internalid");
    columns[3]=new nlobjSearchColumn("internalid");
    columns[4]=new nlobjSearchColumn("internalid");
    columns[5]=new nlobjSearchColumn("internalid");
    columns[6]=new nlobjSearchColumn("internalid");
    columns[7]=new nlobjSearchColumn("internalid");
    columns[8]=new nlobjSearchColumn("internalid");
   
    var search=nlapiCreateSearch("invoice",filters,columns);/*
        [
           ["type","anyof","Assembly"]
        ], 
        [
           new nlobjSearchColumn("internalid",null,"GROUP"), 
           new nlobjSearchColumn("itemid",null,"GROUP"), 
           new nlobjSearchColumn("formulanumeric",null,"MIN").setFormula("nvl({memberitem.quantityavailable},0)/nvl({memberquantity}/1)")
        ]
        );
        */
/*
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
    
    /*


    var searchResults=search.runSearch();
    do    
        {
            resultSet=searchResults.getResults(resultIndex, resultIndex+resultStep);
            resultIndex=resultIndex+resultStep;
            
          //SearchResults=nlapiSearchRecord('item','customsearch432',null,null)
            for(var a=0; a<resultSet.length; a++)
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

        }while(resultSet.length>0);
*/
        var invoiceSearch = nlapiSearchRecord("invoice",null,
            [
               ["type","anyof","CustInvc"], 
               "AND", 
               ["memorized","is","T"], 
               "AND", 
               ["account","anyof","398"]
            ], 
            [
               new nlobjSearchColumn("entity",null,"GROUP"),
               new nlobjSearchColumn('internalid',null,'MAX')
            ]
            );
            var theseCustomers=[];
            var theseCustomerIds=[];
        for(var i=0;i<invoiceSearch.length;i++)
        {
            theseCustomers.push(invoiceSearch[i].getText('entity',null,'GROUP'));
            theseCustomerIds.push(invoiceSearch[i].getValue('entity',null,'GROUP'));

        }


   

/*
invoiceSearchObj.id="customsearch1688539214194";
invoiceSearchObj.title="find memories (copy)";
var newSearchId = invoiceSearchObj.save();
*/
var form=nlapiCreateForm('Memorized Transactions');
form.setScript('customscript_memorized_transaction_clien');
var customerName=form.addField('custpage_customers','multiselect','What Customer?');
for(var tc=0;tc<theseCustomers.length;tc++)
{
    //customerName.addSelectOption('custpage_customers',tc+1,theseCustomers[tc]);
    customerName.addSelectOption(theseCustomerIds[tc],theseCustomers[tc]);
}
//var afterDateInput=form.addField('custpage_after_date','date','Transactions after');
//var beforeDateInput=form.addField('custpage_before_date','date','Transactions before');
form.addButton('custom_update_customer','Get Invoices','updateCustomer()');
form.addButton('custom_update_percents','Update Percents','updatePercents()');
form.addButton('custom_mark_these','Mark All','markAll()');
form.addButton('custom_unmark_these','Unmark All','unmarkAll()');
//form.addButton('custom_all_customers','All Invoices','allCustomers()');
form.addField('custom_percent_increase','percent','Percent Increase');
var sublist=form.addSubList('invoices','inlineeditor','Invoices');

sublist.addField('custpage_update','checkbox','Update/Create Invoice');
sublist.addField('custpage_dates','date','Dates');
sublist.addField('custpage_invoices','select','Invoice','transaction');
sublist.addField('custpage_names','select','Customer','customer');

//cNames.setLineValues(names);

sublist.addField('custpage_quantities','integer','Quantities');
sublist.addField('custpage_items','select','Items','item');
sublist.addField('custpage_description','textarea','Description');
sublist.addField('custpage_rates','float','Rates');
sublist.addField('custpage_memos','text','Memo');
sublist.addField('custpage_assets','select','Related Asset','customrecord_ncfar_asset');
sublist.addField('custpage_ids','text','Invoice ID');
sublist.addField('custpage_percent_increase','percent','Percent Increase');
form.addSubmitButton('Create Invoices with Percent Increases');
//sublist.addMarkAllButtons();
/*
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
}
var form=nlapiCreateForm('Memorized Transactions');
form.setScript('customscript_memorized_transaction_clien');
var customerName=form.addField('custpage_customers','select','What Customer?','customer');
form.addButton('custom_update_customer','Update Customer','updateCustomer()');
var sublist=form.addSubList('invoices','inlineeditor','Invoices');

sublist.addField('custpage_dates','date','Dates');
sublist.addField('custpage_names','select','Customer','customer');

//cNames.setLineValues(names);
sublist.addField('custpage_quantities','integer','Quantities');
sublist.addField('custpage_items','select','Items','item');
sublist.addField('custpage_description','textarea','Description');
sublist.addField('custpage_rates','float','Rates');
sublist.addField('custpage_memos','text','Memo');
sublist.addField('custpage_assets','select','Related Asset','customrecord_ncfar_asset');
sublist.addField('custpage_ids','text','Invoice ID');
*/
response.writePage(form);
}




}

