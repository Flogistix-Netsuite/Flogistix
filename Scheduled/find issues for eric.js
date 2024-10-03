/**
* @NApiVersion 2.x
* @NScriptType Suitelet
*/

define(['N/https', 'N/record', 'N/email', 'N/search', 'N/ui/serverWidget', 'N/runtime', 'N/format','N/render','N/file', 'N/xml', 'N/log'],
    function callbackFunction(https, record, email, search, serverWidget, runtime, format,render, file, xml, log) {
        function getFunction(context) {
            
			var html = ''
			
			var param_userid = runtime.getCurrentUser().id;			
			var param_username = runtime.getCurrentUser().name;
			
			var requestparam = context.request.parameters;
			
			for(var property in requestparam){
				if (requestparam.hasOwnProperty(property)) {
					//html += property + ' ' + requestparam[property] + '<br>'
				}
			}
			
			var param_tranrecid = pnvl(requestparam.tranrecid)			
			var param_rectypeid = pnvl(requestparam.rectypeid)			
			var param_genpdf = pnvl(requestparam.hidden_genpdf)			
			var param_itemids = pnvl(requestparam.allitemids)			
			var itemids_array = new Array();
			itemids_array = param_itemids.split('---')
			
			if(param_userid == '2154'){
				//html += 'param_rectypeid: ' + param_rectypeid + '<br><br><br><br><br>'
			}
			
			var dt = new Date();
			var today = new Date();
				today = format.format({value: today, type: format.Type.DATE})
			
			var fulfillment_details = new Array()
			var item_details = new Array()
			
			//html += 'param_genpdf: ' + param_genpdf + '<br>'
			
			var searchcolumns = [
				search.createColumn({
					name: 'internalid',
					sort: search.Sort.ASC
				}),
				'trandate',
				'number',
				'datecreated',
				'status',
				'location',
				'item',
				'createdfrom',
				'quantity',
				'custcol_pct_ge_supplier_sku',
				'memo',
				'unit',
				search.createColumn({
					name: 'trandate',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'status',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'memo',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'otherrefnum',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'custitem_pct_ge_image_link',
					join: 'item'
				}),
				search.createColumn({
					name: 'type',
					join: 'item'
				}),
				search.createColumn({
					name: 'description',
					join: 'item'
				}),
				search.createColumn({
					name: 'custitem_item_coe',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_eccn',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_hts_code',
					join: 'item',
				}),
			];
			var searchfilters = [
				search.createFilter({
					name: 'type',
					operator: search.Operator.ANYOF,
					values: ['ItemShip']
				}),
				search.createFilter({
					name: 'status',
					operator: search.Operator.ANYOF,
					values: ['ItemShip:B']
				}),
				search.createFilter({
					name: 'createdfrom',
					operator: search.Operator.ANYOF,
					values: param_tranrecid
				}),
				search.createFilter({
					name: 'accounttype',
					operator: search.Operator.ANYOF,
					values: ['@NONE@']
				}),				
				search.createFilter({
					name: 'item',
					operator: search.Operator.NONEOF,
					values: '@NONE@'
				}),
				
				/*
				search.createFilter({
					name: 'type',
					join: 'item',
					operator: search.Operator.NONEOF,
					values: ['TaxGroup','ShipItem']
				}),
				*/
				
				search.createFilter({
					name: 'type',
					join: 'item',
					operator: search.Operator.ANYOF,
					values: ['InvtPart','NonInvtPart','Assembly','Kit']
				}),	
				
			];				
			
			var dataResultSet = search.create({
				type: search.Type.TRANSACTION,
				filters: searchfilters,
				columns: searchcolumns
			}).run();
			
			var searchresults = [];
			var startRange = 0;
			do{
				var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
				if (results && results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						searchresults.push(results[i]);
					}
					startRange += 1000;
				}
			}while (results && results.length == 1000);
			
			for(i = 0; searchresults != null && i < searchresults.length; i++){
				var internalid = searchresults[i].getValue({
					name: 'internalid'
				});
				var number = searchresults[i].getValue({
					name: 'number'
				});
				var trandate = searchresults[i].getValue({
					name: 'trandate'
				});
				var statusid = searchresults[i].getValue({
					name: 'status'
				});
				var statustext = searchresults[i].getText({
					name: 'status'
				});
				var locationid = searchresults[i].getValue({
					name: 'location'
				});
				var locationtext = searchresults[i].getText({
					name: 'location'
				});
				var createdfromid = searchresults[i].getValue({
					name: 'createdfrom'
				});
				var createdfromtext = searchresults[i].getText({
					name: 'createdfrom'
				});
				var createdfrom_trandate = searchresults[i].getValue({
					name: 'trandate',
					join: 'createdfrom'
				});				
				var createdfromstatusid = searchresults[i].getValue({
					name: 'status',
					join: 'createdfrom'
				});
				var createdfromstatustext = searchresults[i].getText({
					name: 'status',
					join: 'createdfrom'
				});
				var createdfrommemo = searchresults[i].getValue({
					name: 'memo',
					join: 'createdfrom'
				});
				var createdfromotherrefnum = searchresults[i].getValue({
					name: 'otherrefnum',
					join: 'createdfrom'
				});
				var createdfromtrandate = searchresults[i].getValue({
					name: 'trandate',
					join: 'createdfrom'
				});
				var itemid = searchresults[i].getValue({
					name: 'item'
				});
				var itemtext = searchresults[i].getText({
					name: 'item'
				});
				var quantity = pnvl(searchresults[i].getValue({
					name: 'quantity'
				}),true);
				var memo = searchresults[i].getValue({
					name: 'memo'
				});
				var manusku = searchresults[i].getValue({
					name: 'custcol_pct_ge_supplier_sku'
				});
				var itempicurl = searchresults[i].getValue({
					name: 'custitem_pct_ge_image_link',
					join: 'item'
				});
				var itemtypeid = searchresults[i].getValue({
					name: 'type',
					join: 'item'
				});
				var itemtypetext = searchresults[i].getText({
					name: 'type',
					join: 'item'
				});
				var itemdesc = searchresults[i].getValue({
					name: 'description',
					join: 'item'
				});
				var unit = searchresults[i].getValue({
					name: 'unit'
				});
				var itemECCN='';
				var itemCOO='';
				var itemHTS='';
				/*
				var itemECCN=searchresults[i].getValue({
						name: 'custitem_item_eccn',
						join: 'item'
					});
					var itemCOO=searchresults[i].getValue({
						name: 'custitem_item_coe',
						join: 'item'
					});
					var itemHTS=searchresults[i].getValue({
						name: 'custitem_item_hts_code',
						join: 'item'
					});
					*/
				
				//html += number + ' ' + itemtext + ' ' + quantity + ' ' + itempicurl + ' [' + manusku + ']' + ' ' + itemtypeid + '<br>'
				
				fulfillment_details.push({
					'internalid': internalid,
					'trandate': trandate,
					'number': number,
					'locationid': locationid,
					'locationtext': locationtext,
					'statusid': statusid,
					'statustext': statustext,
					'createdfromid': createdfromid,
					'createdfromtext': createdfromtext,
					'createdfrom_trandate': createdfrom_trandate,
					'createdfromstatusid': createdfromstatusid,
					'createdfromstatustext': createdfromstatustext,
					'itemid': itemid,
					'itemtext': itemtext,
					'quantity': quantity,
					'memo': memo,
					'manusku': manusku,
					'itempicurl': itempicurl,
					'itemdesc': itemdesc,
					'createdfrommemo': createdfrommemo,
					'createdfromotherrefnum': createdfromotherrefnum,
					'createdfromtrandate': createdfromtrandate,
					'unit': unit,
					'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
				})
				
				var foundmatch = -1
				for(k = 0; item_details != null && k < item_details.length; k++){
					if(item_details[k].itemid == itemid){
						foundmatch = k
						break;
					}
				}
				if(foundmatch == -1){
					item_details.push({
						'itemid': itemid,
						'itemtext': itemtext,
						'quantity': quantity,
						'memo': memo,
						'manusku': manusku,
						'itempicurl': itempicurl,
						'itemdesc': itemdesc,
						'createdfrommemo': createdfrommemo,
						'createdfromotherrefnum': createdfromotherrefnum,
						'createdfromtrandate': createdfromtrandate,
						'unit': unit,
						'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
					})
				}else{
					item_details[foundmatch].quantity += quantity
				}
			}
			
			var so_details = new Array();
			var to_details = new Array();
			
			if(param_rectypeid == 0){			
				var searchcolumns = [
					'internalid',					
					'lineuniquekey',
					'number',
					'trandate',
					'name',
					'salesrep',
					'amount',
					'costestimate',
					'datecreated',
					'item',
					'memo',
					'quantity',
					'status',
					'quantityshiprecv',
					'quantitypicked',
					'quantitypacked',
					'quantitycommitted',
					'effectiverate',
					'otherrefnum',
					'location',
					'memomain',
					'custcol_pct_ge_supplier_sku',
					'shipaddress',
					'custbody_so_requestor',
					'custbody_order_comments',
					'custbody_afe_no',
					'unit',
					'custcol_customer_sku',
					

					search.createColumn({
						name: 'type',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_pct_ge_image_link',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_item_coe',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_item_eccn',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_item_hts_code',
						join: 'item',
					}),

				];
				var searchfilters = [
					search.createFilter({
						name: 'internalid',
						operator: search.Operator.ANYOF,
						values: param_tranrecid
					}),
					search.createFilter({
						name: 'accounttype',
						operator: search.Operator.ANYOF,
						values: ['Income','OthCurrLiab']
					}),
					
					/*
					search.createFilter({
						name: 'type',
						join: 'item',
						operator: search.Operator.NONEOF,
						values: ['TaxGroup','ShipItem']
					}),
					*/
					
					search.createFilter({
						name: 'type',
						join: 'item',
						operator: search.Operator.ANYOF,
						values: ['InvtPart','NonInvtPart','Assembly','Kit']
					}),	

					search.createFilter({
						name: 'closed',
						operator: search.Operator.IS,
						values: 'F'
					})
				];
				
				var dataResultSet = search.create({
					type: search.Type.TRANSACTION,
					filters: searchfilters,
					columns: searchcolumns
				}).run();
				
				var searchresults = [];
				var startRange = 0;
				do{
					var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
					if (results && results.length > 0) {
						for (var i = 0; i < results.length; i++) {
							searchresults.push(results[i]);
						}
						startRange += 1000;
					}
				}while (results && results.length == 1000);
				
				//html += 'searchresults len: ' + searchresults.length + '<br>'
				
				for(i = 0; searchresults != null && i < searchresults.length; i++){
					var internalid = searchresults[i].getValue({
						name: 'internalid'
					});
					var lineuniquekey = searchresults[i].getValue({
						name: 'lineuniquekey'
					});
					var nameid = searchresults[i].getValue({
						name: 'name'
					});
					var nametext = searchresults[i].getText({
						name: 'name'
					});
					var salesrepid = searchresults[i].getValue({
						name: 'salesrep'
					});
					var salesreptext = searchresults[i].getText({
						name: 'salesrep'
					});
					var amount = searchresults[i].getValue({
						name: 'amount'
					});
					var number = searchresults[i].getValue({
						name: 'number'
					});
					var otherrefnum = searchresults[i].getValue({
						name: 'otherrefnum'
					});
					var trandate = searchresults[i].getValue({
						name: 'trandate'
					});
					var datecreated = searchresults[i].getValue({
						name: 'datecreated'
					});
					var itemid = searchresults[i].getValue({
						name: 'item'
					});
					var itemtext = searchresults[i].getText({
						name: 'item'
					});
					var quantity = pnvl(searchresults[i].getValue({
						name: 'quantity'
					}),true);
					var quantitypicked = pnvl(searchresults[i].getValue({
						name: 'quantitypicked'
					}),true);
					var quantitypacked = pnvl(searchresults[i].getValue({
						name: 'quantitypacked'
					}),true);
					var quantityshiprecv = pnvl(searchresults[i].getValue({
						name: 'quantityshiprecv'
					}),true);
					var quantitycommitted = pnvl(searchresults[i].getValue({
						name: 'quantitycommitted'
					}),true);
					var rate = pnvl(searchresults[i].getValue({
						name: 'effectiverate'
					}),true);
					var costestimate = pnvl(searchresults[i].getValue({
						name: 'costestimate'
					}),true);
					var itemtypeid = searchresults[i].getValue({
						name: 'type',
						join: 'item'
					});
					var itemtypetext = searchresults[i].getText({
						name: 'type',
						join: 'item'
					});
					var statusid = searchresults[i].getValue({
						name: 'status'
					});
					var statustext = searchresults[i].getText({
						name: 'status'
					});
					var locationid = searchresults[i].getValue({
						name: 'location'
					});
					var locationtext = searchresults[i].getText({
						name: 'location'
					});
					var memo = searchresults[i].getValue({
						name: 'memo'
					});
					var memomain = searchresults[i].getValue({
						name: 'memomain'
					});
					var itempicurl = searchresults[i].getValue({
						name: 'custitem_pct_ge_image_link',
						join: 'item'
					});
					var manusku = searchresults[i].getValue({
						name: 'custcol_pct_ge_supplier_sku'
					});
					var shipaddress = searchresults[i].getValue({
						name: 'shipaddress'
					});
					var requestor = searchresults[i].getValue({
						name: 'custbody_so_requestor'
					});
					var afe = searchresults[i].getValue({
						name: 'custbody_afe_no'
					});
					var unit = searchresults[i].getValue({
						name: 'unit'
					});
					var ordercomments = searchresults[i].getValue({
						name: 'custbody_order_comments'
					});
					var customersku = searchresults[i].getValue({
						name: 'custcol_customer_sku'
					});
					
					var itemECCN=searchresults[i].getValue({
						name: 'custitem_item_eccn',
						join: 'item'
					});
					var itemCOO=searchresults[i].getValue({
						name: 'custitem_item_coe',
						join: 'item'
					});
					var itemHTS=searchresults[i].getValue({
						name: 'custitem_item_hts_code',
						join: 'item'
					});
					
					
					//ordercomments = xml.escape({
						//xmlText : ordercomments
					//});
					
					
					var quantitybackordered = quantity - quantityshiprecv - quantitycommitted
					//(quantitypicked - quantityshiprecv)
					if(quantitybackordered < 0){
						quantitybackordered = 0
					}
					
					var openqty = quantity - quantityshiprecv
					
					var daysopen = 0;
					var dt = new Date();
					var temp_trandate = new Date(trandate)
					daysopen = dt.valueOf() - temp_trandate.valueOf()
					daysopen = daysopen / (1000 * 3600 * 24)
					daysopen = daysopen.toFixed(0)
					
					//html += internalid + ' ' + rate + ' ' + itemtext + ' ' + quantitypacked + '<br>'							
					
					so_details.push({
						'internalid': internalid,
						'trandate': trandate,
						'nameid': nameid,
						'nametext': nametext,
						'salesrepid': salesrepid,
						'salesreptext': salesreptext,
						'amount': amount,
						'number': number,
						'datecreated': datecreated,
						'itemid': itemid,
						'itemtext': itemtext,
						'quantity': quantity,
						'quantityshiprecv': quantityshiprecv,
						'quantitycommitted': quantitycommitted,
						'quantitybackordered': quantitybackordered,
						'rate': rate,
						'itemtypeid': itemtypeid,
						'itemtypetext': itemtypetext,
						'otherrefnum': otherrefnum,
						'costestimate': costestimate,
						'statusid': statusid,
						'statustext': statustext,
						'daysopen': daysopen,
						'locationid': locationid,
						'locationtext': locationtext,
						'memo': memo,
						'quantitypicked': quantitypicked,
						'quantitypacked': quantitypacked,
						'openqty': openqty,
						'itempicurl': itempicurl,
						'manusku': manusku,
						'shipaddress': shipaddress,
						'requestor': requestor,
						'afe': afe,
						'unit': unit,
						'ordercomments': ordercomments,
						'customersku': customersku,
						'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
					})
				}
			}else{
				var searchcolumns = [
					'internalid',					
					'lineuniquekey',
					'number',
					'trandate',
					'datecreated',
					'item',
					'memo',
					'quantity',
					'status',
					'quantityshiprecv',
					'quantitypicked',
					'quantitypacked',
					'quantitycommitted',
					'location',
					'memomain',
					'shipaddress',
					'custcol_pct_ge_supplier_sku',
					'unit',
					search.createColumn({
						name: 'type',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_pct_ge_image_link',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_item_coe',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_item_eccn',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_item_hts_code',
						join: 'item',
					}),
				];
				var searchfilters = [
					search.createFilter({
						name: 'internalid',
						operator: search.Operator.ANYOF,
						values: param_tranrecid
					}),
					search.createFilter({
						name: 'transactionlinetype',
						operator: search.Operator.ANYOF,
						values: ['SHIPPING']
					}),
					/*
					search.createFilter({
						name: 'accounttype',
						operator: search.Operator.ANYOF,
						values: ['Income','OthCurrLiab']
					}),
					search.createFilter({
						name: 'type',
						join: 'item',
						operator: search.Operator.NONEOF,
						values: ['TaxGroup','ShipItem']
					}),
					*/
				];
				
				var dataResultSet = search.create({
					type: search.Type.TRANSACTION,
					filters: searchfilters,
					columns: searchcolumns
				}).run();
				
				var searchresults = [];
				var startRange = 0;
				do{
					var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
					if (results && results.length > 0) {
						for (var i = 0; i < results.length; i++) {
							searchresults.push(results[i]);
						}
						startRange += 1000;
					}
				}while (results && results.length == 1000);
				
				//html += 'searchresults len: ' + searchresults.length + '<br>'
				
				for(i = 0; searchresults != null && i < searchresults.length; i++){
					var internalid = searchresults[i].getValue({
						name: 'internalid'
					});
					var lineuniquekey = searchresults[i].getValue({
						name: 'lineuniquekey'
					});
					
					var number = searchresults[i].getValue({
						name: 'number'
					});
					
					var trandate = searchresults[i].getValue({
						name: 'trandate'
					});
					var datecreated = searchresults[i].getValue({
						name: 'datecreated'
					});
					var itemid = searchresults[i].getValue({
						name: 'item'
					});
					var itemtext = searchresults[i].getText({
						name: 'item'
					});
					var quantity = Math.abs(pnvl(searchresults[i].getValue({
						name: 'quantity'
					}),true));
					var quantitypicked = pnvl(searchresults[i].getValue({
						name: 'quantitypicked'
					}),true);
					var quantitypacked = pnvl(searchresults[i].getValue({
						name: 'quantitypacked'
					}),true);
					var quantityshiprecv = pnvl(searchresults[i].getValue({
						name: 'quantityshiprecv'
					}),true);
					var quantitycommitted = pnvl(searchresults[i].getValue({
						name: 'quantitycommitted'
					}),true);
					var rate = pnvl(searchresults[i].getValue({
						name: 'effectiverate'
					}),true);
					var costestimate = pnvl(searchresults[i].getValue({
						name: 'costestimate'
					}),true);
					var itemtypeid = searchresults[i].getValue({
						name: 'type',
						join: 'item'
					});
					var itemtypetext = searchresults[i].getText({
						name: 'type',
						join: 'item'
					});
					var itemECCN=searchresults[i].getValue({
						name: 'custitem_item_eccn',
						join: 'item'
					});
					var itemCOO=searchresults[i].getValue({
						name: 'custitem_item_coe',
						join: 'item'
					});
					var itemHTS=searchresults[i].getValue({
						name: 'custitem_item_hts_code',
						join: 'item'
					});
					var statusid = searchresults[i].getValue({
						name: 'status'
					});
					var statustext = searchresults[i].getText({
						name: 'status'
					});
					var locationid = searchresults[i].getValue({
						name: 'location'
					});
					var locationtext = searchresults[i].getText({
						name: 'location'
					});
					var memo = searchresults[i].getValue({
						name: 'memo'
					});
					var memomain = searchresults[i].getValue({
						name: 'memomain'
					});
					var itempicurl = searchresults[i].getValue({
						name: 'custitem_pct_ge_image_link',
						join: 'item'
					});
					var manusku = searchresults[i].getValue({
						name: 'custcol_pct_ge_supplier_sku'
					});
					var shipaddress = searchresults[i].getValue({
						name: 'shipaddress'
					});
					var unit = searchresults[i].getValue({
						name: 'unit'
					});					
					
					
					var quantitybackordered = quantity - quantityshiprecv - quantitycommitted
					//(quantitypicked - quantityshiprecv)
					if(quantitybackordered < 0){
						quantitybackordered = 0
					}
					
					var openqty = quantity - quantityshiprecv
					
					var daysopen = 0;
					var dt = new Date();
					var temp_trandate = new Date(trandate)
					daysopen = dt.valueOf() - temp_trandate.valueOf()
					daysopen = daysopen / (1000 * 3600 * 24)
					daysopen = daysopen.toFixed(0)
					
					//html += 'TO: ' + internalid + ' ' + itemtext + ' ' + quantitypacked + ' quantity: ' + quantity + ' quantityshiprecv: ' + quantityshiprecv + '<br><br><br><br><br><br>'							
					
					to_details.push({
						'internalid': internalid,
						'trandate': trandate,
						'number': number,
						'datecreated': datecreated,
						'itemid': itemid,
						'itemtext': itemtext,
						'quantity': quantity,
						'quantityshiprecv': quantityshiprecv,
						'quantitycommitted': quantitycommitted,
						'quantitybackordered': quantitybackordered,
						'itemtypeid': itemtypeid,
						'itemtypetext': itemtypetext,
						'statusid': statusid,
						'statustext': statustext,
						'daysopen': daysopen,
						'locationid': locationid,
						'locationtext': locationtext,
						'memo': memo,
						'quantitypicked': quantitypicked,
						'quantitypacked': quantitypacked,
						'openqty': openqty,
						'itempicurl': itempicurl,
						'shipaddress': shipaddress,
						'manusku': manusku,
						'unit': unit,
						'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
					})
				}
			}
			
			var units_details = new Array();
			
			var searchcolumns = [
				'internalid',
				'unitname',
				'conversionrate',
				'abbreviation',
			];
			var searchfilters = [
				
			];
	
			var dataResultSet = search.create({
				type: 'unitstype',
				filters: searchfilters,
				columns: searchcolumns
			}).run();
			
			var searchresults = [];
			var startRange = 0;
			do{
				var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
				if (results && results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						searchresults.push(results[i]);
					}
					startRange += 1000;
				}
			}while (results && results.length == 1000);				
			
			for(i = 0; searchresults != null && i < searchresults.length; i++){
				var internalid = searchresults[i].getValue({
					name: 'internalid'
				});
				var conversionrate = searchresults[i].getValue({
					name: 'conversionrate'
				});
				var unitname = searchresults[i].getValue({
					name: 'unitname'
				});	
				var abbreviation = searchresults[i].getValue({
					name: 'abbreviation'
				});
				
				units_details.push({
					'internalid': internalid,
					'conversionrate': conversionrate,
					'unitname': unitname,
					'abbreviation': abbreviation,
				})
				
				//html += unitname + ' ' + conversionrate + ' ' + abbreviation + '<br>'				
			}
						
			html += '<head>'
				html += '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">'
				html += '<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>'
				html += '<link href="https://fonts.googleapis.com/css?family=Coiny" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Spicy+Rice" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Righteous" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Gloria+Hallelujah" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Fredoka+One" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Gochi+Hand" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Paytone+One" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Chewy" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Staatliches" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Work+Sans" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Questrial" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Philosopher" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Righteous" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Rock+Salt&display=swap" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Mukta&display=swap" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Anton|Julius+Sans+One&display=swap" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Luckiest+Guy" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Love+Ya+Like+A+Sister&display=swap" rel="stylesheet">'
				html += '<link href="https://fonts.googleapis.com/css?family=Crete+Round&display=swap" rel="stylesheet">'
			html += '</head>'
			
			html += '<style>'
				html += '.report-tr:hover {background-color: #c8ecfb}'
				html += '.report-td:hover {background-color: #ffffcc}'
			html += '</style>'
			
			
			html += '<div style="margin-top:-35px;">'
				html += '<table cellspacing="0" cellpadding="0" border="0" style="" width="100%">'
					html += '<tr valign="top">'
						html += '<td valign="top">'
							html += '<span style="font-size:35px;font-family: Staatliches;color:#737373;">Custom Packing List</span>'
							html += '<span id="filespan" style="font-size:25px;margin-left:20px;"></span>'
						html += '</td>'
					html += '</tr>'
				html += '</table>'
			html += '</div>'
			
			/*
			html += '<div id="filtersdiv" style="background-color:#b3bccb;padding:10px;max-width:100%;margin-top:10px;">'
				//;update_main_to();update_main_intransit();
				html += '<select id="location" name="location" onchange="update_main()" style="margin-left:0px;background-color:#ffffff;padding:3px;max-width:350px;font-size:13px;box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);">'			
					if(param_locationid != ''){
						html += '<option value="' + param_locationid + '">' + param_locationtext + '</option>'
					}
					html += '<option value="">Location Filter</option>'
					for(g=0; location_details != null && g < location_details.length; g++){	
						html += '<option value="' + location_details[g].internalid + '">' + location_details[g].name + '</option>'
					}
				html += '</select>'
				
				html += '<div id="hiddenfilter_opensalesorders" style="display:none;"></div>'
				html += '<div id="hiddenfilter_opentransferorders" style="display:none;"></div>'
				html += '<div id="hiddenfilter_linestoreceive" style="display:none;"></div>'
				html += '<div id="hiddenfilter_linestopick" style="display:none;"></div>'
				html += '<div id="hiddenfilter_linestoship" style="display:none;"></div>'
				html += '<div id="hiddenfilter_linesbackordered" style="display:none;"></div>'
			html += '</div>'
			*/
			
			html += '<table cellspacing="0" cellpadding="7" border="0" style="margin-top:0px;font-size:14px;" width="">'
				html += '<tr valign="top" style="">'
					html += '<td align="left">'			
						//html += '<div class="submit-button" onclick="genpdf();" style="cursor:pointer;margin-top:0px;margin-left:0px;border: none;color: white;text-align: center;text-decoration: none;display:inline-block;border-radius: 5px;background-color:#4CAF50;font-size:14px;padding:8px;">Generate PDF</div>'
						html += '<input type="submit" value="Generate PDF" style="cursor:pointer;margin-top:0px;margin-left:0px;border: none;color: white;text-align: center;text-decoration: none;display:inline-block;border-radius: 5px;background-color:#4CAF50;font-size:14px;padding:8px;">'
					html += '</td>'
					html += '<td align="right" colspan="5" valign="bottom">'			
						html += '<div style="margin:0px;color:blue;cursor:pointer;font-size:14px;">'			
							html += '<input type="checkbox" name="hideBackorderItems" /><span style="color: #000">Hide Backorder Items</span>'
						html += '</div>'
					html += '</td>'
					html += '<td align="right" colspan="5" valign="bottom">'			
						html += '<div style="margin:0px;color:blue;cursor:pointer;font-size:14px;" onclick="clearall()">'			
							html += 'Clear All'
						html += '</div>'
					html += '</td>'
				html += '</tr>'
				html += '<tr valign="top" style="background-color:#eeeeee;">'
					html += '<td align="center">'			
						html += 'Image'
					html += '</td>'
					html += '<td>'			
						html += 'SKU'
					html += '</td>'
					html += '<td>'			
						html += 'Manufact. SKU'
					html += '</td>'
					html += '<td>'			
						html += 'Item Description'
					html += '</td>'
					html += '<td>'			
						html += 'UOM'
					html += '</td>'
					html += '<td align="right">'			
						html += 'Total NS Qty Packed'
					html += '</td>'
					html += '<td align="right">'			
						html += 'Packing List Qty'
					html += '</td>'
				html += '</tr>'
				for(g=0; item_details != null && g < item_details.length; g++){
					html += '<tr valign="middle">'
						html += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
							if(item_details[g].itempicurl != ''){
								html += '<img src="' + escapeXML(item_details[g].itempicurl) + '" border="0" style="width:70px;">'
							}
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemtext
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].manusku
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemdesc
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].unit
						html += '</td>'
						/*
						'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
						*/

						
						
						
						var paramqty = 0
						var foundparam = -1
						for(var property in requestparam){
							if (requestparam.hasOwnProperty(property)) {
								//html += property + ' =' + 'qtyinput' + item_details[g].itemid + '<br>'
								if(property == 'qtyinput' + item_details[g].itemid){
									paramqty = pnvl(requestparam[property],true)
									foundparam = 1
								}
							}
						}
						
						var qty = 0
						for(h=0; fulfillment_details != null && h < fulfillment_details.length; h++){
							if(fulfillment_details[h].itemid != item_details[g].itemid){
								continue;
							}
							
							qty += fulfillment_details[h].quantity
						}
						if(foundparam == -1){
							paramqty = qty
						}
						
						var uomnumber = 0
						for(h=0; units_details != null && h < units_details.length; h++){
							if(param_userid == '2154'){
								//html += units_details[h].unitname + '==' + item_details[g].unit + '<br>'
							}
							if(units_details[h].unitname == item_details[g].unit){
								uomnumber = units_details[h].conversionrate
								break;
							}
						}
						if(uomnumber == 0){
							uomnumber = 1
						}
						
						paramqty = paramqty / uomnumber
						qty = qty / uomnumber
						
						html += '<td align="right" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += qty
						html += '</td>'

						html += '<td align="right" style="border-right:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += '<input type="text" id="' + item_details[g].itemid + '" name="qtyinput' + item_details[g].itemid + '" class="qtyinput" value="' + paramqty + '" style="width:50px;text-align:center;">'
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemECCN
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemHTS
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemCOO
						html += '</td>'
					html += '</tr>'
				}
			html += '</table>'
			
			if(param_rectypeid == 0){
				html += '<div style="font-weight:bold;font-size:15px;font-family:helvetica;color:#737373;margin-top:15px;">Items Backordered</div>'	
				html += '<table cellspacing="0" cellpadding="7" border="0" style="margin-top:0px;font-size:14px;" width="">'
					html += '<tr valign="top" style="background-color:#eeeeee;">'
						html += '<td align="center">'			
							html += 'Image'
						html += '</td>'
						html += '<td>'			
							html += 'SKU'
						html += '</td>'
						html += '<td>'			
							html += 'Manufact. SKU'
						html += '</td>'
						html += '<td>'			
							html += 'Item Description'
						html += '</td>'
						html += '<td>'			
							html += 'UOM'
						html += '</td>'
						html += '<td align="right">'			
							html += 'Qty Backordered'
						html += '</td>'
					html += '</tr>'
					if(param_rectypeid == 0){
						for(g=0; so_details != null && g < so_details.length; g++){
							var boqty = so_details[g].quantity - so_details[g].quantitypacked
							if(boqty <= 0){
								continue;
							}
							
							var uomnumber = 0
							for(h=0; units_details != null && h < units_details.length; h++){
								if(param_userid == '2154'){
									//html += units_details[h].unitname + '==' + so_details[g].unit + '<br>'
								}
								if(units_details[h].unitname == so_details[g].unit){
									uomnumber = units_details[h].conversionrate
									break;
								}
							}
							if(uomnumber == 0){
								uomnumber = 1
							}
							
							boqty = boqty / uomnumber
							
							html += '<tr valign="middle">'
								html += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
									if(so_details[g].itempicurl != ''){
										html += '<img src="' + escapeXML(so_details[g].itempicurl) + '" border="0" style="width:70px;">'
									}
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += so_details[g].itemtext
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += so_details[g].manusku
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += so_details[g].memo
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += so_details[g].unit
								html += '</td>'							
															
								html += '<td align="right" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += boqty
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
						}
					}else{
						for(g=0; to_details != null && g < to_details.length; g++){						
							var boqty = to_details[g].quantity - to_details[g].quantitypacked
							if(boqty <= 0){
								continue;
							}
							
							var uomnumber = 0
							for(h=0; units_details != null && h < units_details.length; h++){
								if(param_userid == '2154'){
									//html += units_details[h].unitname + '==' + to_details[g].unit + '<br>'
								}
								if(units_details[h].unitname == to_details[g].unit){
									uomnumber = units_details[h].conversionrate
									break;
								}
							}
							if(uomnumber == 0){
								uomnumber = 1
							}
							
							boqty = boqty / uomnumber
							
							html += '<tr valign="middle">'
								html += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
									if(to_details[g].itempicurl != ''){
										html += '<img src="' + escapeXML(to_details[g].itempicurl) + '" border="0" style="width:70px;">'
									}
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += to_details[g].itemtext
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += to_details[g].manusku
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += to_details[g].memo
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += to_details[g].unit
								html += '</td>'							
								html += '<td align="right" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									html += boqty
								html += '</td>'
								html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemECCN
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemHTS
						html += '</td>'
						html += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							html += item_details[g].itemCOO
						html += '</td>'
							html += '</tr>'
						}
					}
				html += '</table>'
			}
			
			html += '<input type="hidden" id="hidden_genpdf" name="hidden_genpdf" value="Yes">'
			html += '<input type="hidden" id="tranrecid" name="tranrecid" value="' + param_tranrecid + '">'
			html += '<input type="hidden" id="rectypeid" name="rectypeid" value="' + param_rectypeid + '">'
			html += '<input type="hidden" id="allitemids" name="allitemids" value="">'
						
			var form = serverWidget.createForm({title: ' '})

			form.clientScriptModulePath = 'SuiteScripts/packinglist generator functions.js'

			form.addField({
					id: 'html',
					label: 'Custom Packing List',
					type: serverWidget.FieldType.INLINEHTML
				})
				.defaultValue = html

			context.response.writePage({ pageObject: form })
        }

        function postFunction(context) {            
            //var contentDocument = '';
            //context.response.write(contentDocument);
			
			
			var param_userid = runtime.getCurrentUser().id;			
			var param_username = runtime.getCurrentUser().name;
			
			var requestparam = context.request.parameters;
			log.debug('requestparam', requestparam);
			var param_tranrecid = pnvl(requestparam.tranrecid)			
			var param_rectypeid = pnvl(requestparam.rectypeid)
			var param_hideBackorderItems = pnvl(requestparam.hideBackorderItems);
			
			var dt = new Date();
			var today = new Date();
				today = format.format({value: today, type: format.Type.DATE})
			
			var fulfillment_details = new Array()
			var item_details = new Array()
			
			//html += 'param_genpdf: ' + param_genpdf + '<br>'
			
			var searchcolumns = [
				search.createColumn({
					name: 'internalid',
					sort: search.Sort.ASC
				}),
				'tranid',
				'trandate',
				'number',
				'datecreated',
				'status',
				'location',
				'item',
				'createdfrom',
				'quantity',
				'custcol_pct_ge_supplier_sku',
				'memo',
				'unit',
				'custcol_customer_sku',
				search.createColumn({
					name: 'trandate',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'status',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'memo',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'otherrefnum',
					join: 'createdfrom'
				}),
				search.createColumn({
					name: 'custitem_pct_ge_image_link',
					join: 'item'
				}),
				search.createColumn({
					name: 'type',
					join: 'item'
				}),
				search.createColumn({
					name: 'description',
					join: 'item'
				}),
				search.createColumn({
					name: 'custitem_item_coe',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_eccn',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_hts_code',
					join: 'item',
				}),
			];
			var searchfilters = [
				search.createFilter({
					name: 'type',
					operator: search.Operator.ANYOF,
					values: ['ItemShip']
				}),
				search.createFilter({
					name: 'status',
					operator: search.Operator.ANYOF,
					values: ['ItemShip:B']
				}),
				search.createFilter({
					name: 'createdfrom',
					operator: search.Operator.ANYOF,
					values: param_tranrecid
				}),
				search.createFilter({
					name: 'accounttype',
					operator: search.Operator.ANYOF,
					values: ['@NONE@']
				}),				
				search.createFilter({
					name: 'item',
					operator: search.Operator.NONEOF,
					values: '@NONE@'
				}),
				
				/*
				search.createFilter({
					name: 'type',
					join: 'item',
					operator: search.Operator.NONEOF,
					values: ['TaxGroup','ShipItem']
				}),	
				*/
				search.createFilter({
					name: 'type',
					join: 'item',
					operator: search.Operator.ANYOF,
					values: ['InvtPart','NonInvtPart','Assembly','Kit']
				}),
			];				
			
			var dataResultSet = search.create({
				type: search.Type.TRANSACTION,
				filters: searchfilters,
				columns: searchcolumns
			}).run();
			
			var searchresults = [];
			var startRange = 0;
			do{
				var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
				if (results && results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						searchresults.push(results[i]);
					}
					startRange += 1000;
				}
			}while (results && results.length == 1000);
			
			for(i = 0; searchresults != null && i < searchresults.length; i++){
				var internalid = searchresults[i].getValue({
					name: 'internalid'
				});
				var tranid = searchresults[i].getValue({
					name: 'tranid'
				});
				var number = searchresults[i].getValue({
					name: 'number'
				});
				var trandate = searchresults[i].getValue({
					name: 'trandate'
				});
				var statusid = searchresults[i].getValue({
					name: 'status'
				});
				var statustext = searchresults[i].getText({
					name: 'status'
				});
				var locationid = searchresults[i].getValue({
					name: 'location'
				});
				var locationtext = searchresults[i].getText({
					name: 'location'
				});
				var createdfromid = searchresults[i].getValue({
					name: 'createdfrom'
				});
				var createdfromtext = searchresults[i].getText({
					name: 'createdfrom'
				});
				var createdfrom_trandate = searchresults[i].getValue({
					name: 'trandate',
					join: 'createdfrom'
				});				
				var createdfromstatusid = searchresults[i].getValue({
					name: 'status',
					join: 'createdfrom'
				});
				var createdfromstatustext = searchresults[i].getText({
					name: 'status',
					join: 'createdfrom'
				});
				var createdfrommemo = searchresults[i].getValue({
					name: 'memo',
					join: 'createdfrom'
				});
				var createdfromotherrefnum = searchresults[i].getValue({
					name: 'otherrefnum',
					join: 'createdfrom'
				});
				var createdfromtrandate = searchresults[i].getValue({
					name: 'trandate',
					join: 'createdfrom'
				});
				var itemid = searchresults[i].getValue({
					name: 'item'
				});
				var itemtext = searchresults[i].getText({
					name: 'item'
				});
				var quantity = pnvl(searchresults[i].getValue({
					name: 'quantity'
				}),true);
				var memo = searchresults[i].getValue({
					name: 'memo'
				});
				var manusku = searchresults[i].getValue({
					name: 'custcol_pct_ge_supplier_sku'
				});
				var itempicurl = searchresults[i].getValue({
					name: 'custitem_pct_ge_image_link',
					join: 'item'
				});
				var itemtypeid = searchresults[i].getValue({
					name: 'type',
					join: 'item'
				});
				var itemtypetext = searchresults[i].getText({
					name: 'type',
					join: 'item'
				});
				var itemdesc = searchresults[i].getValue({
					name: 'description',
					join: 'item'
				});
				var unit = searchresults[i].getValue({
					name: 'unit'
				});
				var customersku = searchresults[i].getValue({
					name: 'custcol_customer_sku'
				});
				var itemECCN=searchresults[i].getValue({
						name: 'custitem_item_eccn',
						join: 'item'
					});
					var itemCOO=searchresults[i].getValue({
						name: 'custitem_item_coe',
						join: 'item'
					});
					var itemHTS=searchresults[i].getValue({
						name: 'custitem_item_hts_code',
						join: 'item'
					});
				
				
				//html += number + ' ' + itemtext + ' ' + quantity + ' ' + itempicurl + ' [' + manusku + ']' + ' ' + itemtypeid + '<br>'
				
				fulfillment_details.push({
					'internalid': internalid,
					'tranid': tranid,
					'trandate': trandate,
					'number': number,
					'locationid': locationid,
					'locationtext': locationtext,
					'statusid': statusid,
					'statustext': statustext,
					'createdfromid': createdfromid,
					'createdfromtext': createdfromtext,
					'createdfrom_trandate': createdfrom_trandate,
					'createdfromstatusid': createdfromstatusid,
					'createdfromstatustext': createdfromstatustext,
					'itemid': itemid,
					'itemtext': itemtext,
					'quantity': quantity,
					'memo': memo,
					'manusku': manusku,
					'itempicurl': itempicurl,
					'itemdesc': itemdesc,
					'createdfrommemo': createdfrommemo,
					'createdfromotherrefnum': createdfromotherrefnum,
					'createdfromtrandate': createdfromtrandate,
					'unit': unit,
					'customersku': customersku,
					'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
				})
				
				var foundmatch = -1
				for(k = 0; item_details != null && k < item_details.length; k++){
					if(item_details[k].itemid == itemid){
						foundmatch = k
						break;
					}
				}
				if(foundmatch == -1){
					item_details.push({
						'itemid': itemid,
						'itemtext': itemtext,
						'quantity': quantity,
						'memo': memo,
						'manusku': manusku,
						'itempicurl': itempicurl,
						'itemdesc': itemdesc,
						'createdfrommemo': createdfrommemo,
						'createdfromotherrefnum': createdfromotherrefnum,
						'createdfromtrandate': createdfromtrandate,
						'unit': unit,
						'customersku': customersku,
						'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
					})
				}else{
					item_details[foundmatch].quantity += quantity
				}
			}
			
			var so_details = new Array();
			var to_details = new Array();
			
			if(param_rectypeid == 0){			
				var searchcolumns = [
					'internalid',					
					'lineuniquekey',
					'number',
					'trandate',
					'name',
					'salesrep',
					'amount',
					'costestimate',
					'datecreated',
					'item',
					'memo',
					'quantity',
					'status',
					'quantityshiprecv',
					'quantitypicked',
					'quantitypacked',
					'quantitycommitted',
					'effectiverate',
					'otherrefnum',
					'location',
					'memomain',
					'custcol_pct_ge_supplier_sku',
					'shipaddress',
					'custbody_so_requestor',
					'custbody_afe_no',
					'unit',
					'custbody_order_comments',
					'custcol_customer_sku',
					'custbody_ordered_by',
					'custbody_customer_ref_label1',
					'custbody_customer_ref_value1',
					'custbody_customer_ref_label2',
					'custbody_customer_ref_value2',
					'custbody_customer_ref_label3',
					'custbody_customer_ref_value3',
					'custbody_customer_ref_label4',
					'custbody_customer_ref_value4',
					'custbody_customer_ref_label5',
					'custbody_customer_ref_value5',
					'custbody_customer_ref_label6',
					'custbody_customer_ref_value6',
					search.createColumn({
						name: 'type',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_pct_ge_image_link',
						join: 'item',
					}),
					search.createColumn({
					name: 'custitem_item_coe',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_eccn',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_hts_code',
					join: 'item',
				}),
				];
				var searchfilters = [
					search.createFilter({
						name: 'internalid',
						operator: search.Operator.ANYOF,
						values: param_tranrecid
					}),
					search.createFilter({
						name: 'accounttype',
						operator: search.Operator.ANYOF,
						values: ['Income','OthCurrLiab']
					}),
					
					/*
					search.createFilter({
						name: 'type',
						join: 'item',
						operator: search.Operator.NONEOF,
						values: ['TaxGroup','ShipItem']
					}),
					*/
					
					search.createFilter({
						name: 'type',
						join: 'item',
						operator: search.Operator.ANYOF,
						values: ['InvtPart','NonInvtPart','Assembly','Kit']
					}),

					search.createFilter({
						name: 'closed',
						operator: search.Operator.IS,
						values: 'F'
					})
				];
				
				var dataResultSet = search.create({
					type: search.Type.TRANSACTION,
					filters: searchfilters,
					columns: searchcolumns
				}).run();
				
				var searchresults = [];
				var startRange = 0;
				do{
					var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
					if (results && results.length > 0) {
						for (var i = 0; i < results.length; i++) {
							searchresults.push(results[i]);
						}
						startRange += 1000;
					}
				}while (results && results.length == 1000);
				
				//html += 'searchresults len: ' + searchresults.length + '<br>'
				
				for(i = 0; searchresults != null && i < searchresults.length; i++){
					var internalid = searchresults[i].getValue({
						name: 'internalid'
					});
					var lineuniquekey = searchresults[i].getValue({
						name: 'lineuniquekey'
					});
					var nameid = searchresults[i].getValue({
						name: 'name'
					});
					var nametext = searchresults[i].getText({
						name: 'name'
					});
					var salesrepid = searchresults[i].getValue({
						name: 'salesrep'
					});
					var salesreptext = searchresults[i].getText({
						name: 'salesrep'
					});
					var amount = searchresults[i].getValue({
						name: 'amount'
					});
					var number = searchresults[i].getValue({
						name: 'number'
					});
					var otherrefnum = searchresults[i].getValue({
						name: 'otherrefnum'
					});
					var trandate = searchresults[i].getValue({
						name: 'trandate'
					});
					var datecreated = searchresults[i].getValue({
						name: 'datecreated'
					});
					var itemid = searchresults[i].getValue({
						name: 'item'
					});
					var itemtext = searchresults[i].getText({
						name: 'item'
					});
					var quantity = pnvl(searchresults[i].getValue({
						name: 'quantity'
					}),true);
					var quantitypicked = pnvl(searchresults[i].getValue({
						name: 'quantitypicked'
					}),true);
					var quantitypacked = pnvl(searchresults[i].getValue({
						name: 'quantitypacked'
					}),true);
					var quantityshiprecv = pnvl(searchresults[i].getValue({
						name: 'quantityshiprecv'
					}),true);
					var quantitycommitted = pnvl(searchresults[i].getValue({
						name: 'quantitycommitted'
					}),true);
					var rate = pnvl(searchresults[i].getValue({
						name: 'effectiverate'
					}),true);
					var costestimate = pnvl(searchresults[i].getValue({
						name: 'costestimate'
					}),true);
					var itemtypeid = searchresults[i].getValue({
						name: 'type',
						join: 'item'
					});
					var itemtypetext = searchresults[i].getText({
						name: 'type',
						join: 'item'
					});
					var statusid = searchresults[i].getValue({
						name: 'status'
					});
					var statustext = searchresults[i].getText({
						name: 'status'
					});
					var locationid = searchresults[i].getValue({
						name: 'location'
					});
					var locationtext = searchresults[i].getText({
						name: 'location'
					});
					var memo = searchresults[i].getValue({
						name: 'memo'
					});
					var memomain = searchresults[i].getValue({
						name: 'memomain'
					});
					var itempicurl = searchresults[i].getValue({
						name: 'custitem_pct_ge_image_link',
						join: 'item'
					});
					var manusku = searchresults[i].getValue({
						name: 'custcol_pct_ge_supplier_sku'
					});
					var shipaddress = searchresults[i].getValue({
						name: 'shipaddress'
					});
					var requestor = searchresults[i].getValue({
						name: 'custbody_so_requestor'
					});
					var afe = searchresults[i].getValue({
						name: 'custbody_afe_no'
					});
					var unit = searchresults[i].getValue({
						name: 'unit'
					});
					var ordercomments = searchresults[i].getValue({
						name: 'custbody_order_comments'
					});
					var customersku = searchresults[i].getValue({
						name: 'custcol_customer_sku'
					});			

					var orderedby = searchresults[i].getValue({
						name: 'custbody_ordered_by'
					});

					var customerreflabel1 = searchresults[i].getValue({
						name: 'custbody_customer_ref_label1'
					});

					var customerrefvalue1 = searchresults[i].getValue({
						name: 'custbody_customer_ref_value1'
					});

					var customerreflabel2 = searchresults[i].getValue({
						name: 'custbody_customer_ref_label2'
					});

					var customerrefvalue2 = searchresults[i].getValue({
						name: 'custbody_customer_ref_value2'
					});

					var customerreflabel3 = searchresults[i].getValue({
						name: 'custbody_customer_ref_label3'
					});

					var customerrefvalue3 = searchresults[i].getValue({
						name: 'custbody_customer_ref_value3'
					});

					var customerreflabel4 = searchresults[i].getValue({
						name: 'custbody_customer_ref_label4'
					});

					var customerrefvalue4 = searchresults[i].getValue({
						name: 'custbody_customer_ref_value4'
					});

					var customerreflabel5 = searchresults[i].getValue({
						name: 'custbody_customer_ref_label5'
					});

					var customerrefvalue5 = searchresults[i].getValue({
						name: 'custbody_customer_ref_value5'
					});

					var customerreflabel6 = searchresults[i].getValue({
						name: 'custbody_customer_ref_label6'
					});

					var customerrefvalue6 = searchresults[i].getValue({
						name: 'custbody_customer_ref_value6'
					});
					var itemECCN=searchresults[i].getValue({
						name: 'custitem_item_eccn',
						join: 'item'
					});
					var itemCOO=searchresults[i].getValue({
						name: 'custitem_item_coe',
						join: 'item'
					});
					var itemHTS=searchresults[i].getValue({
						name: 'custitem_item_hts_code',
						join: 'item'
					});
					
					var quantitybackordered = quantity - quantityshiprecv - quantitycommitted
					//(quantitypicked - quantityshiprecv)
					if(quantitybackordered < 0){
						quantitybackordered = 0
					}
					
					var openqty = quantity - quantityshiprecv
					
					var daysopen = 0;
					var dt = new Date();
					var temp_trandate = new Date(trandate)
					daysopen = dt.valueOf() - temp_trandate.valueOf()
					daysopen = daysopen / (1000 * 3600 * 24)
					daysopen = daysopen.toFixed(0)
					
					//html += internalid + ' ' + rate + ' ' + itemtext + ' ' + quantitypacked + '<br>'							
					
					so_details.push({
						'internalid': internalid,
						'trandate': trandate,
						'nameid': nameid,
						'nametext': nametext,
						'salesrepid': salesrepid,
						'salesreptext': salesreptext,
						'amount': amount,
						'number': number,
						'datecreated': datecreated,
						'itemid': itemid,
						'itemtext': itemtext,
						'quantity': quantity,
						'quantityshiprecv': quantityshiprecv,
						'quantitycommitted': quantitycommitted,
						'quantitybackordered': quantitybackordered,
						'rate': rate,
						'itemtypeid': itemtypeid,
						'itemtypetext': itemtypetext,
						'otherrefnum': otherrefnum,
						'costestimate': costestimate,
						'statusid': statusid,
						'statustext': statustext,
						'daysopen': daysopen,
						'locationid': locationid,
						'locationtext': locationtext,
						'memo': memo,
						'quantitypicked': quantitypicked,
						'quantitypacked': quantitypacked,
						'openqty': openqty,
						'itempicurl': itempicurl,
						'manusku': manusku,
						'shipaddress': shipaddress,
						'requestor': requestor,
						'afe': afe,
						'unit': unit,
						'ordercomments': ordercomments,
						'customersku': customersku,
						'orderedby': orderedby,
						'customerreflabel1': customerreflabel1,
						'customerrefvalue1': customerrefvalue1,
						'customerreflabel2': customerreflabel2,
						'customerrefvalue2': customerrefvalue2,
						'customerreflabel3': customerreflabel3,
						'customerrefvalue3': customerrefvalue3,
						'customerreflabel4': customerreflabel4,
						'customerrefvalue4': customerrefvalue4,
						'customerreflabel5': customerreflabel5,
						'customerrefvalue5': customerrefvalue5,
						'customerreflabel6': customerreflabel6,
						'customerrefvalue6': customerrefvalue6,
						'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
					})
				}
			}else{
				var searchcolumns = [
					'internalid',					
					'lineuniquekey',
					'number',
					'trandate',
					'datecreated',
					'item',
					'memo',
					'quantity',
					'status',
					'quantityshiprecv',
					'quantitypicked',
					'quantitypacked',
					'quantitycommitted',
					'location',
					'memomain',
					'shipaddress',
					'custcol_pct_ge_supplier_sku',
					'unit',
					search.createColumn({
						name: 'type',
						join: 'item',
					}),
					search.createColumn({
						name: 'custitem_pct_ge_image_link',
						join: 'item',
					}),
					search.createColumn({
					name: 'custitem_item_coe',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_eccn',
					join: 'item',
				}),
				search.createColumn({
					name: 'custitem_item_hts_code',
					join: 'item',
				}),
				];
				var searchfilters = [
					search.createFilter({
						name: 'internalid',
						operator: search.Operator.ANYOF,
						values: param_tranrecid
					}),
					search.createFilter({
						name: 'transactionlinetype',
						operator: search.Operator.ANYOF,
						values: ['SHIPPING']
					}),
					/*
					search.createFilter({
						name: 'accounttype',
						operator: search.Operator.ANYOF,
						values: ['Income','OthCurrLiab']
					}),
					search.createFilter({
						name: 'type',
						join: 'item',
						operator: search.Operator.NONEOF,
						values: ['TaxGroup','ShipItem']
					}),
					*/
				];
				
				var dataResultSet = search.create({
					type: search.Type.TRANSACTION,
					filters: searchfilters,
					columns: searchcolumns
				}).run();
				
				var searchresults = [];
				var startRange = 0;
				do{
					var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
					if (results && results.length > 0) {
						for (var i = 0; i < results.length; i++) {
							searchresults.push(results[i]);
						}
						startRange += 1000;
					}
				}while (results && results.length == 1000);
				
				//html += 'searchresults len: ' + searchresults.length + '<br>'
				
				for(i = 0; searchresults != null && i < searchresults.length; i++){
					var internalid = searchresults[i].getValue({
						name: 'internalid'
					});
					var lineuniquekey = searchresults[i].getValue({
						name: 'lineuniquekey'
					});
					
					var number = searchresults[i].getValue({
						name: 'number'
					});
					
					var trandate = searchresults[i].getValue({
						name: 'trandate'
					});
					var datecreated = searchresults[i].getValue({
						name: 'datecreated'
					});
					var itemid = searchresults[i].getValue({
						name: 'item'
					});
					var itemtext = searchresults[i].getText({
						name: 'item'
					});
					var quantity = Math.abs(pnvl(searchresults[i].getValue({
						name: 'quantity'
					}),true));
					var quantitypicked = pnvl(searchresults[i].getValue({
						name: 'quantitypicked'
					}),true);
					var quantitypacked = pnvl(searchresults[i].getValue({
						name: 'quantitypacked'
					}),true);
					var quantityshiprecv = pnvl(searchresults[i].getValue({
						name: 'quantityshiprecv'
					}),true);
					var quantitycommitted = pnvl(searchresults[i].getValue({
						name: 'quantitycommitted'
					}),true);
					var rate = pnvl(searchresults[i].getValue({
						name: 'effectiverate'
					}),true);
					var costestimate = pnvl(searchresults[i].getValue({
						name: 'costestimate'
					}),true);
					var itemtypeid = searchresults[i].getValue({
						name: 'type',
						join: 'item'
					});
					var itemtypetext = searchresults[i].getText({
						name: 'type',
						join: 'item'
					});
					var statusid = searchresults[i].getValue({
						name: 'status'
					});
					var statustext = searchresults[i].getText({
						name: 'status'
					});
					var locationid = searchresults[i].getValue({
						name: 'location'
					});
					var locationtext = searchresults[i].getText({
						name: 'location'
					});
					var memo = searchresults[i].getValue({
						name: 'memo'
					});
					var memomain = searchresults[i].getValue({
						name: 'memomain'
					});
					var itempicurl = searchresults[i].getValue({
						name: 'custitem_pct_ge_image_link',
						join: 'item'
					});
					var manusku = searchresults[i].getValue({
						name: 'custcol_pct_ge_supplier_sku'
					});
					var shipaddress = searchresults[i].getValue({
						name: 'shipaddress'
					});					
					var unit = searchresults[i].getValue({
						name: 'unit'
					});
					var itemECCN=searchresults[i].getValue({
						name: 'custitem_item_eccn',
						join: 'item'
					});
					var itemCOO=searchresults[i].getValue({
						name: 'custitem_item_coe',
						join: 'item'
					});
					var itemHTS=searchresults[i].getValue({
						name: 'custitem_item_hts_code',
						join: 'item'
					});
					
					var quantitybackordered = quantity - quantityshiprecv - quantitycommitted
					//(quantitypicked - quantityshiprecv)
					if(quantitybackordered < 0){
						quantitybackordered = 0
					}
					
					var openqty = quantity - quantityshiprecv
					
					var daysopen = 0;
					var dt = new Date();
					var temp_trandate = new Date(trandate)
					daysopen = dt.valueOf() - temp_trandate.valueOf()
					daysopen = daysopen / (1000 * 3600 * 24)
					daysopen = daysopen.toFixed(0)
					
					//html += 'TO: ' + internalid + ' ' + itemtext + ' ' + quantitypacked + ' quantity: ' + quantity + ' quantityshiprecv: ' + quantityshiprecv + '<br><br><br><br><br><br>'							
					
					to_details.push({
						'internalid': internalid,
						'trandate': trandate,
						'number': number,
						'datecreated': datecreated,
						'itemid': itemid,
						'itemtext': itemtext,
						'quantity': quantity,
						'quantityshiprecv': quantityshiprecv,
						'quantitycommitted': quantitycommitted,
						'quantitybackordered': quantitybackordered,
						'itemtypeid': itemtypeid,
						'itemtypetext': itemtypetext,
						'statusid': statusid,
						'statustext': statustext,
						'daysopen': daysopen,
						'locationid': locationid,
						'locationtext': locationtext,
						'memo': memo,
						'quantitypicked': quantitypicked,
						'quantitypacked': quantitypacked,
						'openqty': openqty,
						'itempicurl': itempicurl,
						'shipaddress': shipaddress,
						'manusku': manusku,
						'memomain': memomain,
						'unit': unit,
						'itemECCN':itemECCN,
						'itemHTS':itemHTS,
						'itemCOO':itemCOO,
					})
				}
			}

			// for (key in so_details[0]) {
			// 	log.debug(key, so_details[0][key]);
			// }
			
			var units_details = new Array();
			
			var searchcolumns = [
				'internalid',
				'unitname',
				'conversionrate',
				'abbreviation',
			];
			var searchfilters = [
				
			];
	
			var dataResultSet = search.create({
				type: 'unitstype',
				filters: searchfilters,
				columns: searchcolumns
			}).run();
			
			var searchresults = [];
			var startRange = 0;
			do{
				var results = dataResultSet.getRange({ start: startRange, end: startRange + 1000 });
				if (results && results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						searchresults.push(results[i]);
					}
					startRange += 1000;
				}
			}while (results && results.length == 1000);				
			
			for(i = 0; searchresults != null && i < searchresults.length; i++){
				var internalid = searchresults[i].getValue({
					name: 'internalid'
				});
				var conversionrate = searchresults[i].getValue({
					name: 'conversionrate'
				});
				var unitname = searchresults[i].getValue({
					name: 'unitname'
				});	
				var abbreviation = searchresults[i].getValue({
					name: 'abbreviation'
				});
				
				units_details.push({
					'internalid': internalid,
					'conversionrate': conversionrate,
					'unitname': unitname,
					'abbreviation': abbreviation,
				})
				
				//html += unitname + ' ' + conversionrate + ' ' + abbreviation + '<br>'				
			}
			
			if(fulfillment_details != null && fulfillment_details.length > 0){
				//good
			}else{
				var html = 'There are no items ready to ship.'
				var form = serverWidget.createForm({title: ' '})

				form.clientScriptModulePath = 'SuiteScripts/packinglist generator functions.js'

				form.addField({
						id: 'html',
						label: 'Custom Packing List',
						type: serverWidget.FieldType.INLINEHTML
					})
					.defaultValue = html

				context.response.writePage({ pageObject: form })
				
				return true;
			}
			
			if(param_rectypeid == 0){
				var xmlhtml = ''
				xmlhtml += "<pdf>";
				xmlhtml += "<head>";
				
				xmlhtml += "<style>";	
					xmlhtml += '.regtd {border: 1px solid #cccccc;font-size:11;white-space:nowrap;}'
					xmlhtml += '.big_header {font-size:15;font-weight:bold;}'
					xmlhtml += '#watermarkbody { font-size:180; font:Helvetica; color:#F0F0F0; z-index:999; }'
					xmlhtml += 'thead {'
					xmlhtml += 'display:table-header-group;'
					xmlhtml += '}'
					xmlhtml += 'tbody {'
					xmlhtml += 'display:table-row-group;'
					xmlhtml += '}'
					//xmlhtml += '#page1 {footer:myfooter;footer-height:3mm;}'
				xmlhtml += "</style>";
				
				var dt = new Date();
				var max = 10000;
				var min = 100;
				var randomid = Math.floor(Math.random() * (max - min)) + min;
				var plnumber = so_details[0].number.replace('SO','') + '-' + randomid
				
				xmlhtml += '<macrolist>'
					xmlhtml += '<macro id="myfooter">'
						xmlhtml += '<table style="border:0px solid #cccccc;width:100%;color:#828282;font-size:9px;" align="center">'
							xmlhtml += '<tr align="center">'
								xmlhtml += '<td align="center">Page <pagenumber/> of <totalpages/></td>'
								xmlhtml += '<td align="center">Packing List #' + plnumber + '</td>'
								xmlhtml += '<td align="center">Generated on ' + format.format({value: dt, type: format.Type.DATE}) + '</td>'
							xmlhtml += '</tr>'
						xmlhtml += '</table>'
					xmlhtml += '</macro>'		
				xmlhtml += '</macrolist>'
				xmlhtml += "</head>";
				xmlhtml += '<body footer="myfooter" footer-height="3mm">';			
					
					var imgsrc = 'https://5691377.app.netsuite.com/core/media/media.nl?id=2763&c=5691377&h=c0456f58c3d32a33e93e'
					imgsrc = imgsrc.replace(/&/g,'&amp;');
					
					xmlhtml += '<table border="0" width="100%" style="font-family:helvetica;">'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="font-size:12px;">'
						xmlhtml += '<img src="' + imgsrc + '"></img>'
						xmlhtml += '8844 North Sam Houston Pkwy W<br></br>'
						xmlhtml += 'Ste 210<br></br>'
						xmlhtml += 'Houston TX 77064<br></br>'
					xmlhtml += '</td>'
					xmlhtml += '<td align="right" valign="top" border="0">'
					
						xmlhtml += '<table>'
						xmlhtml += '<tr>'
						xmlhtml += '<td style="border: 0px solid #cccccc;font-size:34px;">Packing List</td>'
						xmlhtml += '</tr>'
						xmlhtml += '</table>'
					
						xmlhtml += '<table >'
						xmlhtml += '<tr>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">Date</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">PL #</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">IF #</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">QC Auditor</td>'
						xmlhtml += '</tr>'
						xmlhtml += '<tr>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">' + format.format({value: dt, type: format.Type.DATE}) + '</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">' + plnumber + '</td>'
              //added 1/3/2023 for ticket 4847
              var rvName=null;
              var rvIFs=[];
              for(var rv=0;rv<fulfillment_details.length;rv++)
                {
                  var rvThisIF=fulfillment_details[rv].tranid;
                  var rvIndex=rvIFs.indexOf(rvThisIF);
                  if(rvIndex==-1)
                    rvIFs.push(rvThisIF);
                }
              
              
						//xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">' + fulfillment_details[0].tranid + '</td>'
            			 xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;"><p text-align="left">' + rvIFs.toString() + '</p></td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">' + param_username + '</td>'
						xmlhtml += '</tr>'
						xmlhtml += '</table>'
					xmlhtml += '</td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<p />'
						
					xmlhtml += '<table border="0" width="100%" style="font-family:helvetica;" cellpadding="0" cellspacing="0">'
					xmlhtml += '<tr>'
						xmlhtml += '<td width="30%">'
							xmlhtml += '<table width="100%">'
							xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">Ship To</td>'
							xmlhtml += '</tr>'
							xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;" height="75">'
								if(so_details[0].requestor != ''){
									xmlhtml += '<b>Contact: ' + escapeXML(so_details[0].requestor) + '</b><br/>'
								}
								xmlhtml += escapeXML(so_details[0].shipaddress).replace(/(?:\ r\n|\r|\n)/g, '<br/>');
							xmlhtml += '</td>'
							xmlhtml += '</tr>'
							xmlhtml += '</table>'
						xmlhtml += '</td>'
						xmlhtml += '<td width="70%">'
							xmlhtml += '<table border="0" width="100%" style="font-family:helvetica;margin-left:20px;" cellpadding="2" cellspacing="0">'
								xmlhtml += '<tr>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += 'Sales Order #'
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += 'Order #'
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += 'Customer PO #'
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += 'AFE'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">'
										xmlhtml += fulfillment_details[0].createdfromtext.replace('Sales Order #','')
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">'
										xmlhtml += escapeXML(fulfillment_details[0].createdfrommemo)
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">'
										xmlhtml += escapeXML(fulfillment_details[0].createdfromotherrefnum)
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;width:120px;">'
										xmlhtml += escapeXML(so_details[0].afe)
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr>'
									xmlhtml += '<td style="border: 0px solid #cccccc;font-size:12px;" colspan="4" align="left">'
										xmlhtml += '<table border="0" width="100%" style="background-color:#eeeeee;font-family:helvetica;margin-top:15px;">'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;" colspan="6" align="center">'
													xmlhtml += '<span style="font-weight:bold;">*** GoExpedi Internal Delivery Only ***</span>'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;" colspan="6">'
													xmlhtml += '<div style="height:20px;">&nbsp;</div>'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Driver Name'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '_____________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Signature'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '__________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Date'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '___________'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;" colspan="6">'
													xmlhtml += '<div style="height:25px;">&nbsp;</div>'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Received By'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '_____________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Signature'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '__________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Date'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '___________'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;" colspan="6">'
													xmlhtml += '<div style="height:10px;">&nbsp;</div>'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
										xmlhtml += '</table>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</table>'
						xmlhtml += '</td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="10"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'

					/********************************************************************************************************************/

					var requestedByValue = null;
					
					if (so_details && so_details.length > 0) {
						if (so_details[0].customerreflabel1 === "Requested By") {
							requestedByValue = so_details[0].customerrefvalue1;
						}
						else if (so_details[0].customerreflabel2 === "Requested By") {
							requestedByValue = so_details[0].customerrefvalue2;
						}
						else if (so_details[0].customerreflabel3 === "Requested By") {
							requestedByValue = so_details[0].customerrefvalue3;
						}
						else if (so_details[0].customerreflabel4 === "Requested By") {
							requestedByValue = so_details[0].customerrefvalue4;
						}
						else if (so_details[0].customerreflabel5 === "Requested By") {
							requestedByValue = so_details[0].customerrefvalue5;
						}
						else if (so_details[0].customerreflabel6 === "Requested By") {
							requestedByValue = so_details[0].customerrefvalue6;
						}
					}
					
					if (so_details[0].orderedby || requestedByValue) {
						xmlhtml += '<table style="font-family:helvetica;width:100%;">'
							xmlhtml += '<tr>'
								if (so_details[0].orderedby) {
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += '<p text-align="left">Ordered By</p>'
									xmlhtml += '</td>'
								}
								if (requestedByValue) {
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += '<p text-align="left">Requested By</p>'
									xmlhtml += '</td>'
								}
							xmlhtml += '</tr>'
							xmlhtml += '<tr>'
								if (so_details[0].orderedby) {
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#ffffff;">'
										xmlhtml += '<p text-align="left">' + escapeXML(so_details[0].orderedby) + '</p>'
									xmlhtml += '</td>'
								}
								if (requestedByValue) {
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#ffffff;">'
										xmlhtml += '<p text-align="left">' + escapeXML(requestedByValue) + '</p>'
									xmlhtml += '</td>'
								}
							xmlhtml += '</tr>'
						xmlhtml += '</table>'
						
						xmlhtml += '<table>'
						xmlhtml += '<tr>'
						xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="10"></td>'
						xmlhtml += '</tr>'
						xmlhtml += '</table>'
					}

					/********************************************************************************************************************/
					
					xmlhtml += '<table style="font-family:helvetica;width:100%;">'
						xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
								xmlhtml += '<p text-align="left">SO Notes</p>'
							xmlhtml += '</td>'
						xmlhtml += '</tr>'
						xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#ffffff;">'
								if(so_details[0].ordercomments != ''){
									xmlhtml += '<p text-align="left">' + escapeXML(so_details[0].ordercomments.replace(/(?:\ r\n|\r|\n)/g, '<br/>')) + '</p>'
								}else{
									xmlhtml += '<p text-align="left">[None]</p>'
								}
							xmlhtml += '</td>'
						xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="10"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<table style="font-family:helvetica;width:100%;">'
						xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
								xmlhtml += '<p text-align="left">Final Inspection</p>'
							xmlhtml += '</td>'
						xmlhtml += '</tr>'
						xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#ffffff;">'
								xmlhtml += '<table style="font-family:helvetica;" cellpadding="3">'
									xmlhtml += '<tr>'
										xmlhtml += '<td>'
											xmlhtml += '<input type="checkbox" name="inspection1" id="inspection1" style="height:12px;width:12px;" />'
										xmlhtml += '</td>'
										xmlhtml += '<td>'
											xmlhtml += '<p text-align="left">Verified item shipped quantities are correct</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
									xmlhtml += '<tr>'
										xmlhtml += '<td>'
											xmlhtml += '<input type="checkbox" name="inspection2" id="inspection2" style="height:12px;width:12px;" />'
										xmlhtml += '</td>'
										xmlhtml += '<td>'
											xmlhtml += '<p text-align="left">Checked for visible damage to items or packaging</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
									xmlhtml += '<tr>'
										xmlhtml += '<td>'
											xmlhtml += '<input type="checkbox" name="inspection3" id="inspection3" style="height:12px;width:12px;" />'
										xmlhtml += '</td>'
										xmlhtml += '<td>'
											xmlhtml += '<p text-align="left">Checked pallet/crate for structural soundness</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
									xmlhtml += '<tr>'
										xmlhtml += '<td>'
											xmlhtml += '<input type="checkbox" name="inspection4" id="inspection4" style="height:12px;width:12px;" />'
										xmlhtml += '</td>'
										xmlhtml += '<td>'
											xmlhtml += '<p text-align="left">Verified items are securely attached</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
									xmlhtml += '<tr>'
										xmlhtml += '<td>'
											xmlhtml += '<input type="checkbox" name="inspection5" id="inspection5" style="height:12px;width:12px;" />'
										xmlhtml += '</td>'
										xmlhtml += '<td>'
											xmlhtml += '<p text-align="left">Verified Certification Package requirements (if any)</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
									xmlhtml += '<tr>'
										xmlhtml += '<td>'
											xmlhtml += '<input type="checkbox" name="inspection6" id="inspection6" style="height:12px;width:12px;" />'
										xmlhtml += '</td>'
										xmlhtml += '<td>'
											xmlhtml += '<p text-align="left">Incorporated special customer requirements (if any)</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
								xmlhtml += '</table>'
							xmlhtml += '</td>'
						xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="10"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:#07afe3">Items Shipped</span>'					
					xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;font-size:12px;">'					
						xmlhtml += '<thead>'
							xmlhtml += '<tr valign="top" style="background-color:#5acef2;">'
								xmlhtml += '<td align="center">'			
									xmlhtml += 'Image'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += 'SKU'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += '<p text-align="left">Manufact. SKU</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += '<p text-align="left">Item Description</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += '<p text-align="left">UOM</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td align="right" style="width:100px;">'			
									xmlhtml += '<p text-align="right">Qty Shipped</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td align="right">'			
												xmlhtml += 'ECCN'
											xmlhtml += '</td>'
						          xmlhtml += '<td align="right">'			
												xmlhtml += 'HTS'
											xmlhtml += '</td>'
						          xmlhtml += '<td align="right">'			
												xmlhtml += 'COO'
											xmlhtml += '</td>'
							xmlhtml += '</tr>'
						xmlhtml += '</thead>'						
							for(g=0; item_details != null && g < item_details.length; g++){								
								var paramqty = 0
								var foundparam = -1
								for(var property in requestparam){
									if (requestparam.hasOwnProperty(property)) {
										if(property == 'qtyinput' + item_details[g].itemid){
											paramqty = pnvl(requestparam[property],true)
											foundparam = 1
										}
									}
								}
								if(paramqty == 0){
									continue;
								}
								
								var uomnumber = 0
								for(h=0; units_details != null && h < units_details.length; h++){
									if(param_userid == '2154'){
										//html += units_details[h].unitname + '==' + item_details[g].unit + '<br>'
									}
									if(units_details[h].unitname == item_details[g].unit){
										uomnumber = units_details[h].conversionrate
										break;
									}
								}
								if(uomnumber == 0){
									uomnumber = 1
								}
								
								//paramqty = paramqty / uomnumber
								
								xmlhtml += '<tr valign="middle">'
									xmlhtml += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
										if(item_details[g].itempicurl != ''){
											xmlhtml += '<img src="' + escapeXML(item_details[g].itempicurl) + '" border="0" style="width:70px;height:70px;" />'
										}
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += item_details[g].itemtext
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += escapeXML(item_details[g].manusku)
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += escapeXML(item_details[g].itemdesc)
										
										if(item_details[g].customersku != ''){
											xmlhtml += '<br /><span style="font-weight:normal;">Customer SKU: </span><span style="font-weight:bold;">' + escapeXML(item_details[g].customersku) + '</span>'
										}
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += '<p text-align="left">' + escapeXML(item_details[g].unit) + '</p>'
									xmlhtml += '</td>'									
									xmlhtml += '<td align="right" style="border-right:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += '<p text-align="right">' + addCommas(paramqty) + '</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							xmlhtml += item_details[g].itemECCN
						xmlhtml += '</td>'
						xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							xmlhtml += item_details[g].itemHTS
						xmlhtml += '</td>'
						xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
							xmlhtml += item_details[g].itemCOO
						xmlhtml += '</td>'
								xmlhtml += '</tr>'
							}						
					xmlhtml += '</table>'
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="15"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					//backordered items
					var hasbo = ''
					for(g=0; so_details != null && g < so_details.length; g++){
						var paramqty = 0
						for(var property in requestparam){
							if (requestparam.hasOwnProperty(property)) {
								if(property == 'qtyinput' + so_details[g].itemid){
									paramqty = pnvl(requestparam[property],true)
								}
							}
						}
						
						var uomnumber = 0
						for(h=0; units_details != null && h < units_details.length; h++){
							if(units_details[h].unitname == so_details[g].unit){
								uomnumber = units_details[h].conversionrate
								break;
							}
						}
						if(uomnumber == 0){
							uomnumber = 1
						}
						
						var boqty = (so_details[g].quantity/uomnumber) - (so_details[g].quantityshiprecv/uomnumber) - paramqty
						if(boqty <= 0){
							continue;
						}
						
						hasbo = 'Yes'
						break;
					}
					
					if(hasbo == 'Yes' && !param_hideBackorderItems){
						xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;font-size:12px;">'					
							xmlhtml += '<thead>'
								xmlhtml += '<tr valign="top">'
									xmlhtml += '<td align="" colspan="5">'			
										xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:#737373;">Items Backordered</span>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr valign="top" style="background-color:#eeeeee;">'
									xmlhtml += '<td align="center">'			
										xmlhtml += 'Image'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += 'SKU'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Manufact. SKU</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Item Description</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += 'UOM'
									xmlhtml += '</td>'
									xmlhtml += '<td align="right" style="width:100px;border:0px solid #000000;">'			
										xmlhtml += '<p text-align="right">Qty Backordered</p>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</thead>'						
								for(g=0; so_details != null && g < so_details.length; g++){
									var paramqty = 0
									for(var property in requestparam){
										if (requestparam.hasOwnProperty(property)) {
											if(property == 'qtyinput' + so_details[g].itemid){
												paramqty = pnvl(requestparam[property],true)
											}
										}
									}
									
									var uomnumber = 0
									for(h=0; units_details != null && h < units_details.length; h++){
										if(units_details[h].unitname == so_details[g].unit){
											uomnumber = units_details[h].conversionrate
											break;
										}
									}
									if(uomnumber == 0){
										uomnumber = 1
									}
									
									var boqty = (so_details[g].quantity/uomnumber) - (so_details[g].quantityshiprecv/uomnumber) - paramqty
									if(boqty <= 0){
										continue;
									}
									
									boqty = boqty / uomnumber
																	
									xmlhtml += '<tr valign="middle">'
										xmlhtml += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
											if(so_details[g].itempicurl != ''){
												xmlhtml += '<img src="' + escapeXML(so_details[g].itempicurl) + '" border="0" style="width:70px;height:70px;" />'
											}
										xmlhtml += '</td>'
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += so_details[g].itemtext
										xmlhtml += '</td>'
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += escapeXML(so_details[g].manusku)
										xmlhtml += '</td>'
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += escapeXML(so_details[g].memo)
										xmlhtml += '</td>'						
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += '<p text-align="left">' + escapeXML(so_details[g].unit) + '</p>'
										xmlhtml += '</td>'	
										xmlhtml += '<td align="right" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;border-right:1px solid #eeeeee;">'			
											xmlhtml += '<p text-align="right">' + addCommas(boqty) + '</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
								}			
						xmlhtml += '</table>'
					} else if(hasbo == '') {
						xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;">'					
							xmlhtml += '<thead>'
								xmlhtml += '<tr valign="top" style="background-color:#eeeeee;">'
									xmlhtml += '<td align="center">'			
										xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:green;">*** Order Complete - No Items Backordered ***</span>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</thead>'						
						xmlhtml += '</table>'
					} else 
					{				

					}
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="15"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					//previously shipped items
					var hasprevshipped = ''
					for(g=0; so_details != null && g < so_details.length; g++){
						if(so_details[g].quantityshiprecv > 0){
							hasprevshipped = 'Yes'
							break;
						}
					}
					
					if(hasprevshipped == 'Yes'){
						xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;font-size:12px;">'					
							xmlhtml += '<thead>'
								xmlhtml += '<tr valign="top">'
									xmlhtml += '<td align="" colspan="5">'			
										xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:#737373;">Items Previously Shipped</span>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr valign="top" style="background-color:#eeeeee;">'
									xmlhtml += '<td align="center">'			
										xmlhtml += 'Image'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += 'SKU'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Manufact. SKU</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Item Description</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += 'UOM'
									xmlhtml += '</td>'
									xmlhtml += '<td align="right" style="width:100px;">'			
										xmlhtml += '<p text-align="right">Qty Shipped</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td align="right">'			
						xmlhtml += 'ECCN'
					xmlhtml += '</td>'
          xmlhtml += '<td align="right">'			
						xmlhtml += 'HTS'
					xmlhtml += '</td>'
          xmlhtml += '<td align="right">'			
						xmlhtml += 'COO'
					xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</thead>'						
								for(g=0; so_details != null && g < so_details.length; g++){
									if(so_details[g].quantityshiprecv > 0){																	
										
										var uomnumber = 0
										for(h=0; units_details != null && h < units_details.length; h++){
											if(param_userid == '2154'){
												//html += units_details[h].unitname + '==' + so_details[g].unit + '<br>'
											}
											if(units_details[h].unitname == so_details[g].unit){
												uomnumber = units_details[h].conversionrate
												break;
											}
										}
										if(uomnumber == 0){
											uomnumber = 1
										}										
										
										var shippedqty = so_details[g].quantityshiprecv / uomnumber
										
										xmlhtml += '<tr valign="middle">'
											xmlhtml += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
												if(so_details[g].itempicurl != ''){
													xmlhtml += '<img src="' + escapeXML(so_details[g].itempicurl) + '" border="0" style="width:70px;height:70px;" />'
												}
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += so_details[g].itemtext
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += escapeXML(so_details[g].manusku)
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += escapeXML(so_details[g].memo)
											xmlhtml += '</td>'						
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += '<p text-align="left">' + escapeXML(so_details[g].unit) + '</p>'
											xmlhtml += '</td>'
											xmlhtml += '<td align="right" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;border-right:1px solid #eeeeee;">'			
												xmlhtml += '<p text-align="right">' + addCommas(shippedqty) + '</p>'
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += item_details[g].itemECCN
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += item_details[g].itemHTS
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += item_details[g].itemCOO
											xmlhtml += '</td>'
											xmlhtml += '</tr>'
									}
								}			
						xmlhtml += '</table>'
					}
				xmlhtml += "</body>";
				xmlhtml += "</pdf>";
				var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n"+xmlhtml+"\n";
				
				var pdffile = render.xmlToPdf({
					xmlString: xml
				});
			}else{
				//transfer order
				var xmlhtml = ''
				xmlhtml += "<pdf>";
				xmlhtml += "<head>";
				
				xmlhtml += "<style>";	
					xmlhtml += '.regtd {border: 1px solid #cccccc;font-size:11;white-space:nowrap;}'
					xmlhtml += '.big_header {font-size:15;font-weight:bold;}'
					xmlhtml += '#watermarkbody { font-size:180; font:Helvetica; color:#F0F0F0; z-index:999; }'
					xmlhtml += 'thead {'
					xmlhtml += 'display:table-header-group;'
					xmlhtml += '}'
					xmlhtml += 'tbody {'
					xmlhtml += 'display:table-row-group;'
					xmlhtml += '}'
					//xmlhtml += '#page1 {footer:myfooter;footer-height:3mm;}'
				xmlhtml += "</style>";
				
				var dt = new Date();
				var max = 10000;
				var min = 100;
				var randomid = Math.floor(Math.random() * (max - min)) + min;
				var plnumber = to_details[0].number.replace('Transfer Order #','') + '-' + randomid
				
				xmlhtml += '<macrolist>'
					xmlhtml += '<macro id="myfooter">'
						xmlhtml += '<table style="border:0px solid #cccccc;width:100%;color:#828282;font-size:9px;" align="center">'
							xmlhtml += '<tr align="center">'
								xmlhtml += '<td align="center">Page <pagenumber/> of <totalpages/></td>'
								xmlhtml += '<td align="center">Packing List #' + plnumber + '</td>'
								xmlhtml += '<td align="center">Generated on ' + format.format({value: dt, type: format.Type.DATE}) + '</td>'
							xmlhtml += '</tr>'
						xmlhtml += '</table>'
					xmlhtml += '</macro>'		
				xmlhtml += '</macrolist>'
				xmlhtml += "</head>";
				xmlhtml += '<body footer="myfooter" footer-height="3mm">';			
					
					var imgsrc = 'https://5691377.app.netsuite.com/core/media/media.nl?id=2763&c=5691377&h=c0456f58c3d32a33e93e'
					imgsrc = imgsrc.replace(/&/g,'&amp;');
					
					xmlhtml += '<table border="0" width="100%" style="font-family:helvetica;">'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="font-size:12px;">'
						xmlhtml += '<img src="' + imgsrc + '"></img>'
						xmlhtml += '8844 North Sam Houston Pkwy W<br></br>'
						xmlhtml += 'Ste 210<br></br>'
						xmlhtml += 'Houston TX 77064<br></br>'
					xmlhtml += '</td>'
					xmlhtml += '<td align="right" valign="top" border="0">'
					
						xmlhtml += '<table>'
						xmlhtml += '<tr>'
						xmlhtml += '<td style="border: 0px solid #cccccc;font-size:34px;">Packing List</td>'
						xmlhtml += '</tr>'
						xmlhtml += '</table>'
					
						xmlhtml += '<table width="230">'
						xmlhtml += '<tr>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">Date</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">PL #</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">QC Auditor</td>'
						xmlhtml += '</tr>'
						xmlhtml += '<tr>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">' + format.format({value: dt, type: format.Type.DATE}) + '</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">' + plnumber + '</td>'
						xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">' + param_username + '</td>'
						xmlhtml += '</tr>'
						xmlhtml += '</table>'
					xmlhtml += '</td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<p />'
						
					xmlhtml += '<table border="0" width="100%" style="font-family:helvetica;" cellpadding="0" cellspacing="0">'
					xmlhtml += '<tr>'
						xmlhtml += '<td width="30%">'
							xmlhtml += '<table width="100%">'
							xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">Ship To</td>'
							xmlhtml += '</tr>'
							xmlhtml += '<tr>'
							xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;" height="75">'
								xmlhtml += escapeXML(to_details[0].shipaddress).replace(/(?:\ r\n|\r|\n)/g, '<br/>');
							xmlhtml += '</td>'
							xmlhtml += '</tr>'
							xmlhtml += '</table>'
						xmlhtml += '</td>'
						xmlhtml += '<td width="70%">'
							xmlhtml += '<table border="0" width="100%" style="font-family:helvetica;margin-left:20px;" cellpadding="2" cellspacing="0">'
								xmlhtml += '<tr>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += 'Transfer Order #'
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += 'Item Fulfillment #'
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;background-color:#dddddd;">'
										xmlhtml += 'Memo'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">'
										xmlhtml += to_details[0].number.replace('Sales Order #','')
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">'
										xmlhtml += fulfillment_details[0].tranid
									xmlhtml += '</td>'
									xmlhtml += '<td style="border: 1px solid #cccccc;font-size:12px;">'
										xmlhtml += escapeXML(to_details[0].memomain)
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr>'
									xmlhtml += '<td style="border: 0px solid #cccccc;font-size:12px;" colspan="4" align="left">'
										xmlhtml += '<table border="0" width="100%" style="background-color:#eeeeee;font-family:helvetica;margin-top:15px;">'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;" colspan="6">'
													xmlhtml += '<div style="height:20px;">&nbsp;</div>'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Driver Name'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '_____________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Signature'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '__________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Date'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '___________'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;" colspan="6">'
													xmlhtml += '<div style="height:25px;">&nbsp;</div>'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Received By'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '_____________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Signature'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '__________________'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += 'Date'
												xmlhtml += '</td>'
												xmlhtml += '<td style="font-size:10px;">'
													xmlhtml += '___________'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
											xmlhtml += '<tr>'
												xmlhtml += '<td style="font-size:10px;" colspan="6">'
													xmlhtml += '<div style="height:10px;">&nbsp;</div>'
												xmlhtml += '</td>'
											xmlhtml += '</tr>'
										xmlhtml += '</table>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</table>'
						xmlhtml += '</td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'

					xmlhtml += '<table  align=\"left\">'
					xmlhtml += '<tr>'
					// xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="15"></td>'
					xmlhtml += '<td align=\"center\"  style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;align:center;">'
					xmlhtml += "<barcode codetype=\"code128\" showtext=\"true\" value=\"";
					xmlhtml += to_details[0].number
					xmlhtml += "\"/>";
					xmlhtml += '</td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="10"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:#07afe3">Items Shipped</span>'					
					xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;font-size:12px;">'					
						xmlhtml += '<thead>'
							xmlhtml += '<tr valign="top" style="background-color:#5acef2;">'
								xmlhtml += '<td align="center">'			
									xmlhtml += 'Image'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += 'SKU'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += '<p text-align="left">Manufact. SKU</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += '<p text-align="left">Item Description</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td>'			
									xmlhtml += '<p text-align="left">UOM</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td align="right">'			
									xmlhtml += '<p text-align="right">Qty Shipped</p>'
								xmlhtml += '</td>'
								xmlhtml += '<td align="right">'			
						xmlhtml += 'Packing List Qty'
					xmlhtml += '</td>'
          xmlhtml += '<td align="right">'			
						xmlhtml += 'ECCN'
					xmlhtml += '</td>'
          xmlhtml += '<td align="right">'			
						xmlhtml += 'HTS'
					xmlhtml += '</td>'
          xmlhtml += '<td align="right">'			
						xmlhtml += 'COO'
					xmlhtml += '</td>'
							xmlhtml += '</tr>'
						xmlhtml += '</thead>'						
							for(g=0; item_details != null && g < item_details.length; g++){
								var paramqty = 0
								var foundparam = -1
								for(var property in requestparam){
									if (requestparam.hasOwnProperty(property)) {
										if(property == 'qtyinput' + item_details[g].itemid){
											paramqty = pnvl(requestparam[property],true)
											foundparam = 1
										}
									}
								}
								if(paramqty == 0){
									continue;
								}
								
								var uomnumber = 0
								for(h=0; units_details != null && h < units_details.length; h++){
									if(units_details[h].unitname == item_details[g].unit){
										uomnumber = units_details[h].conversionrate
										break;
									}
								}
								if(uomnumber == 0){
									uomnumber = 1
								}
								
								//paramqty = paramqty / uomnumber
								
								xmlhtml += '<tr valign="middle">'
									xmlhtml += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
										if(item_details[g].itempicurl != ''){
											xmlhtml += '<img src="' + escapeXML(item_details[g].itempicurl) + '" border="0" style="width:70px;height:70px;" />'
										}
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'		
										xmlhtml += "<barcode codetype=\"code128\" showtext=\"true\" value=\"";
										xmlhtml += item_details[g].itemtext
										xmlhtml += "\"/>";
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += escapeXML(item_details[g].manusku)
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += escapeXML(item_details[g].itemdesc)
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += '<p text-align="left">' + escapeXML(item_details[g].unit) + '</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td align="right" style="border-right:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += '<p text-align="right">' + addCommas(paramqty) + '</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
									xmlhtml += item_details[g].itemECCN
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += item_details[g].itemHTS
									xmlhtml += '</td>'
									xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
										xmlhtml += item_details[g].itemCOO
									xmlhtml += '</td>'
										xmlhtml += '</tr>'
							}						
					xmlhtml += '</table>'
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="15"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					//backordered items
					var hasbo = ''
					for(g=0; to_details != null && g < to_details.length; g++){
						var paramqty = 0
						for(var property in requestparam){
							if (requestparam.hasOwnProperty(property)) {
								if(property == 'qtyinput' + to_details[g].itemid){
									paramqty = pnvl(requestparam[property],true)
								}
							}
						}
						
						var uomnumber = 0
						for(h=0; units_details != null && h < units_details.length; h++){
							if(units_details[h].unitname == to_details[g].unit){
								uomnumber = units_details[h].conversionrate
								break;
							}
						}
						if(uomnumber == 0){
							uomnumber = 1
						}
						
						var boqty = (to_details[g].quantity/uomnumber) - (to_details[g].quantityshiprecv/uomnumber) - paramqty
						if(boqty <= 0){
							continue;
						}

						hasbo = 'Yes'
						break;
					}
					
					/*
					if(hasbo == 'Yes'){
						xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;font-size:12px;">'					
							xmlhtml += '<thead>'
								xmlhtml += '<tr valign="top" >'
									xmlhtml += '<td align="" colspan="5">'			
										xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:#737373;">Items Backordered</span>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr valign="top" style="background-color:#eeeeee;">'
									xmlhtml += '<td align="center">'			
										xmlhtml += 'Image'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += 'SKU'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Manufact. SKU</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Item Description</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">UOM</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td align="right">'			
										xmlhtml += '<p text-align="right">Qty Backordered</p>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</thead>'						
								for(g=0; to_details != null && g < to_details.length; g++){
									var paramqty = 0
									for(var property in requestparam){
										if (requestparam.hasOwnProperty(property)) {
											if(property == 'qtyinput' + to_details[g].itemid){
												paramqty = pnvl(requestparam[property],true)
											}
										}
									}
									
									var uomnumber = 0
									for(h=0; units_details != null && h < units_details.length; h++){
										if(param_userid == '2154'){
											//html += units_details[h].unitname + '==' + so_details[g].unit + '<br>'
										}
										if(units_details[h].unitname == to_details[g].unit){
											uomnumber = units_details[h].conversionrate
											break;
										}
									}
									if(uomnumber == 0){
										uomnumber = 1
									}
									
									var boqty = (to_details[g].quantity/uomnumber) - (to_details[g].quantityshiprecv/uomnumber) - paramqty
									if(boqty <= 0){
										continue;
									}
							
									xmlhtml += '<tr valign="middle">'
										xmlhtml += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
											if(to_details[g].itempicurl != ''){
												xmlhtml += '<img src="' + escapeXML(to_details[g].itempicurl) + '" border="0" style="width:70px;height:70px;" />'
											}
										xmlhtml += '</td>'
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += to_details[g].itemtext
										xmlhtml += '</td>'
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += escapeXML(to_details[g].manusku)
											xmlhtml += '</td>'
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += escapeXML(to_details[g].memo)
										xmlhtml += '</td>'						
										xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
											xmlhtml += '<p text-align="left">' + escapeXML(to_details[g].unit) + '</p>'
										xmlhtml += '</td>'
										xmlhtml += '<td align="right" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;border-right:1px solid #eeeeee;">'			
											xmlhtml += '<p text-align="right">' + addCommas(boqty) + '</p>'
										xmlhtml += '</td>'
									xmlhtml += '</tr>'
								}			
						xmlhtml += '</table>'
					}else{
						xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;">'					
							xmlhtml += '<thead>'
								xmlhtml += '<tr valign="top" style="background-color:#eeeeee;">'
									xmlhtml += '<td align="center">'			
										xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:green;">*** Order Complete - No Items Backordered ***</span>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</thead>'						
						xmlhtml += '</table>'
					}
					*/
					
					xmlhtml += '<table>'
					xmlhtml += '<tr>'
					xmlhtml += '<td style="border: 0px solid #cccccc;font-size:16px;" height="15"></td>'
					xmlhtml += '</tr>'
					xmlhtml += '</table>'
					
					//previously shipped items
					var hasprevshipped = ''
					for(g=0; to_details != null && g < to_details.length; g++){
						if(to_details[g].quantityshiprecv > 0){
							hasprevshipped = 'Yes'
							break;
						}
					}
					
					/*
					if(hasprevshipped == 'Yes'){
						xmlhtml += '<table border="0" width="100%" cellpadding="4" style="font-family:helvetica;font-size:12px;">'					
							xmlhtml += '<thead>'
								xmlhtml += '<tr valign="top" style="">'
									xmlhtml += '<td align="" colspan="5">'			
										xmlhtml += '<span style="font-weight:bold;font-size:15px;font-family:helvetica;color:#737373;">Items Previously Shipped</span>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
								xmlhtml += '<tr valign="top" style="background-color:#eeeeee;">'
									xmlhtml += '<td align="center">'			
										xmlhtml += 'Image'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += 'SKU'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Manufact. SKU</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">Item Description</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td>'			
										xmlhtml += '<p text-align="left">UOM</p>'
									xmlhtml += '</td>'
									xmlhtml += '<td align="right">'			
										xmlhtml += '<p text-align="right">Qty Shipped</p>'
									xmlhtml += '</td>'
								xmlhtml += '</tr>'
							xmlhtml += '</thead>'						
								for(g=0; to_details != null && g < to_details.length; g++){
									if(to_details[g].quantityshiprecv > 0){																	
										var uomnumber = 0
										for(h=0; units_details != null && h < units_details.length; h++){
											if(units_details[h].unitname == to_details[g].unit){
												uomnumber = units_details[h].conversionrate
												break;
											}
										}
										if(uomnumber == 0){
											uomnumber = 1
										}
										
										var shippedqty = to_details[g].quantityshiprecv / uomnumber
										
										xmlhtml += '<tr valign="middle">'
											xmlhtml += '<td style="border-left:1px solid #eeeeee;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'
												if(to_details[g].itempicurl != ''){
													xmlhtml += '<img src="' + escapeXML(to_details[g].itempicurl) + '" border="0" style="width:70px;height:70px;" />'
												}
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += to_details[g].itemtext
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += escapeXML(to_details[g].manusku)
											xmlhtml += '</td>'
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += escapeXML(to_details[g].memo)
											xmlhtml += '</td>'						
											xmlhtml += '<td style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">'			
												xmlhtml += '<p text-align="left">' + escapeXML(to_details[g].unit) + '</p>'
											xmlhtml += '</td>'
											xmlhtml += '<td align="right" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;border-right:1px solid #eeeeee;">'			
												xmlhtml += '<p text-align="right">' + addCommas(shippedqty) + '</p>'
											xmlhtml += '</td>'
										xmlhtml += '</tr>'
									}
								}			
						xmlhtml += '</table>'
					}
					*/
				xmlhtml += "</body>";
				xmlhtml += "</pdf>";
				var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n"+xmlhtml+"\n";
				
				var pdffile = render.xmlToPdf({
					xmlString: xml
				});
				
				var max = 100;
				var min = 1;
				var randomid = Math.floor(Math.random() * (max - min)) + min;
				pdffile.name = 'PL#' + plnumber + '.PDF'
				pdffile.folder = 256625
				
			}
			
			var response = context.response
			response.writeFile(pdffile, true)
        }
        function onRequestFxn(context) {
            if (context.request.method === "GET") {
                getFunction(context)
            }
            else {
                postFunction(context)
            }

        }
        return {
            onRequest: onRequestFxn
        };
});

function escapeXML(str){
    								
	// Fix issue with < and > not displaying properly in text fields
	str = str.replace(/&/g,'&#038;');
	str = str.replace(/&lt;/ig,'REPLACELT').replace(/&gt;/ig,'REPLACEGT');
	str = str.replace(/REPLACELT/ig,'&lt;').replace(/REPLACEGT/ig,'&gt;');
	//str = str.replace(/'/g,"'");
	str = str.replace(/"/g,'');
	return str;
}

function pnvl(value, number){
    if(number){
        if(isNaN(parseFloat(value))) return 0;
        return parseFloat(value);
    }
    if(value == null) return '';
    return value;
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}