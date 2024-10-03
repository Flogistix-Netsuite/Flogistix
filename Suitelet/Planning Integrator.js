/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url'],
    function (widget, task, runtime, search, redirect, https,url) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') {
        	var form=widget.createForm({title:'Information to Gather'});
        	var whatItems=form.addField({id:'custpage_what_items',label:'Items',type:'multiselect'});
        	var theseItems=findItems();
        	for(var t=0;t<theseItems.itemsFound.length;t++)
        	{
        		var thisName=theseItems.itemsNames[t];
        		var thisId=theseItems.itemsFound[t];
        		//var thisId=theseItems[t]
        		whatItems.addSelectOption({value:thisId,text:thisName});
        	}
        	var whatLocations=form.addField({if:'custpage_what_locations',label:'Location(s)',type:'multiselect',source:'location'});
        	//get the items that match

           /* var whatStatus=form.addField({
                id:'custpage_po_status',
                label:'Any Status?',
                type:'select',
                source:'statusref'
            });*/
            //var whatTypes=form.addField({id:'custpage_what_types',label:'Types',type:'multiselect',source:'customlist_supply_types'});
              form.addSubmitButton({label:"Get numbers!"});

              response.writePage(form);


		}
		else
		{
			//submit the scheduled thing here

			/*
			things we need to get	
			on hand el reno
			on hand pampa
			wip el reno
			wip pampa
			xtransfer
			add three months to the information
			*/
			

			/*
			itemSearchObj.id="customsearch1692080497845";
			itemSearchObj.title="Item update (copy)";
			var newSearchId = itemSearchObj.save();
			*/



		}
	}
	function findItems()
	{
		var itemsFound=[];
		var itemsNames=[];
		var itemSearchObj = search.create({
		   type: "item",
		   filters:
		   [
		      ["custitem_work_center_class","noneof","@NONE@"]
		   ],
		   columns:
		   [
		      search.createColumn({name: "internalid", label: "Internal ID"}),
		      search.createColumn({name:'itemid',label:'Name'}),
		   ]
		});
		var searchResultCount = itemSearchObj.runPaged().count;
		log.debug("itemSearchObj result count",searchResultCount);
		itemSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
			itemsFound.push(result.getValue({name:'internalid'}));
			itemsNames.push(result.getValue({name:'itemid'}));
		   return true;
		});
		return {
			itemsFound:itemsFound,
			itemsNames:itemsNames,
		};

/*
itemSearchObj.id="customsearch1692035275367";
itemSearchObj.title="Custom Item Search 3 (copy)";
var newSearchId = itemSearchObj.save();
*/
	}



        
        return {
            onRequest: onRequest
        }
    })