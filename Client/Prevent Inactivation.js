/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log','N/email'],
	function(record,search,currentRecord,log,email){
		
		function fieldChanged(context){

			var rec=context.currentRecord;
			var thisField=context.fieldId;
			var thisItemName=rec.getValue({fieldId:'itemid'});
			if(thisField!='isinactive')
				return true;
			var thisId=rec.id;
			//search for open transactions
			var itemSearchObj = search.create({
			   type: "item",
			   filters:
			   [
			      ["internalid","anyof",thisId], 
			      "AND", 
			      ["transaction.status","anyof","VendBill:A","CashSale:A","CustCred:A","CustDep:D","InvCount:C","InvCount:A","InvCount:B","CustInvc:A","CustInvc:D","ItemShip:B","ItemShip:A","Opprtnty:A","PurchOrd:D","PurchOrd:B","PurchOrd:A","PurchOrd:P","Estimate:A","Rfq:D","Rfq:F","Rfq:B","Rfq:A","PurchReq:B","PurchReq:F","PurchReq:A","RtnAuth:D","RtnAuth:A","RtnAuth:B","RtnAuth:F","RtnAuth:E","RevArrng:B","SalesOrd:A","SalesOrd:F","SalesOrd:D","SalesOrd:E","SalesOrd:B","TrnfrOrd:D","TrnfrOrd:A","TrnfrOrd:B","TrnfrOrd:F","TrnfrOrd:E","Wave:C","Wave:A","Wave:B","WorkOrd:D","WorkOrd:A","WorkOrd:B"]
			   ],
			   columns:
			   [
			      search.createColumn({
			         name: "itemid",
			         sort: search.Sort.ASC,
			         label: "Name"
			      }),
			      search.createColumn({name: "totalvalue", label: "Total Value"}),
			      search.createColumn({name: "totalquantityonhand", label: "Total Quantity On Hand"})
			   ]
			});
			var searchResultCount = itemSearchObj.runPaged().count;
			if(searchResultCount>0)
			{
				alert('This item has one or more open transactions. You cannot set this item to be inactive.');
				email.send({
					author:-5,
					recipients:['rbrown@flogistix.com','kgamblin@flogistix.com'],
					subject:'Item '+thisItemName+' cannot be inactivated ',
					body:'See subject',


				})
			}
			var itemSearchObj = search.create({
			   type: "item",
			   filters:
			   [
			      ["internalid","anyof",thisId], 
			      "AND", 
			      ["totalquantityonhand","equalto","0"], 
			      "AND", 
			      ["totalvalue","equalto","0.00"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"})
			   ]
			});
			var searchResultCount = itemSearchObj.runPaged().count;
			if(searchResultCount>0)
			{
				alert('This item has valuation greater than 0. You cannot set this item to be inactive.');
				email.send({
					author:-5,
					recipients:['rbrown@flogistix.com','kgamblin@flogistix.com'],
					subject:'Item '+thisItemName+' cannot be inactivated ',
					body:'See subject',


				})
			}

			/*
			log.debug("itemSearchObj result count",searchResultCount);
			itemSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   return true;
			});

			/*
			itemSearchObj.id="customsearch1696887590562";
			itemSearchObj.title="Custom Item Search 3 (copy)";
			var newSearchId = itemSearchObj.save();
			*/
			//now, we need ot check out total values


			//log.debug("itemSearchObj result count",searchResultCount);
			//itemSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			//   return true;
			//});

/*
itemSearchObj.id="customsearch1696884778261";
itemSearchObj.title="Custom Item Search 2 (copy)";
var newSearchId = itemSearchObj.save();
*/

			return true;
			
		}
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{

		}
		return {
		//	updateSuitelet:updateSuitelet,
			fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			//validateLine:validateLine,
		//	saveRecord: saveRec
		};
});