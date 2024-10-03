/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime', 'N/format'],

function (search, record, runtime, format) {
    function getInputData() {
        return search.load({
            id: 'customsearch51061'
            });
    }

    function map(context) {
        // get context value
        //log.debug('debug', JSON.stringify(context));
        
        var dataInputs = JSON.parse(context.value);
         //log.debug('reduce reduce1', context);

		var woID = dataInputs.values.custrecord26.value;
        var laborTimes = dataInputs.values.formulanumeric;        
        //var qty = toDtls.quantity * -1;
        //var qtyCommitted = toDtls.quantitycommitted;
        //var qtyPicked = toDtls.quantitypicked;
        //var po = toDtls["statusref.purchaseOrder"].text;
        //if (!po){
        //    po = '';
       // }
        //var qtys = {"Quantity": qty, "QuantityCommitted": qtyCommitted, "QuantityPicked": qtyPicked, "PurchaseOrder": po};
        //log.debug('map2', woID);
        //log.debug('map3',laborTimes);
        context.write(woID,laborTimes);
    }

    function reduce(context) {
        // get context value
       // log.debug('reduce reduce1', context);

        var workOrders = context.key;
        var labors=0;
        for(var l=0;l<context.values.length;l++)
        {
            labors+=(Number(context.values[l]));
        }

        log.debug('WO', workOrders);
        log.debug('labros',labors.toFixed(2));
        //var labors = context.values;
        // get quantities
        var laborRec=null;
        var laborRecID=null;
        log.debug('Here is LR-1',laborRec);
        var customrecord_labor_costsSearchObj = search.create({
           type: "customrecord_labor_costs",
           filters:
           [
              ["custrecord_lc_work_order","anyof",workOrders]
           ],
           columns:
           [
              search.createColumn({name: "internalid", label: "Internal ID"})
           ]
        });
        log.debug('Here is sRC',searchResultCount);
        var searchResultCount = customrecord_labor_costsSearchObj.runPaged().count;

        if(searchResultCount)
        {
            log.debug("customrecord_labor_costsSearchObj result count",searchResultCount);
            customrecord_labor_costsSearchObj.run().each(function(result){
               // .run().each has a limit of 4,000 results
                laborRecID=result.getValue({name:'internalid'});
               return true;
            });
        }
        log.debug('Here is LR-2',laborRec);
        if(!laborRecID)
        {
            laborRec=record.create({type:'customrecord_labor_costs'});
            laborRec.setValue({fieldId:'custrecord_lc_work_order',value:workOrders});
        }
        else
            laborRec=record.load({type:'customrecord_labor_costs',id:laborRecID});
        laborRec.setValue({fieldId:'custrecord_lc_labor_minutes',value:labors.toFixed(2)});
        laborRec.save();

        //log.debug('Here is LR',laborRec);
        /*
        customrecord_labor_costsSearchObj.id="customsearch1708634722112";
        customrecord_labor_costsSearchObj.title="Custom Labor Costs Search (copy)";
        var newSearchId = customrecord_labor_costsSearchObj.save();
        */
            /*
        var qty = 0; var qtyCommitted = 0; var qtyPicked = 0; var pendingPO = false;
        for (i = 0; i < toDtls.length; i++) {  //loop through the array
            var toDtlJSON = JSON.parse(toDtls[i]);
            qty += isNaN(parseFloat(toDtlJSON.Quantity)) ? 0 : parseFloat(toDtlJSON.Quantity);
            qtyCommitted += isNaN(parseFloat(toDtlJSON.QuantityCommitted)) ? 0 : parseFloat(toDtlJSON.QuantityCommitted);
            qtyPicked += isNaN(parseFloat(toDtlJSON.QuantityPicked)) ? 0 : parseFloat(toDtlJSON.QuantityPicked);
            if (!pendingPO){
                if (toDtlJSON.PurchaseOrder === 'Pending Receipt' || toDtlJSON.PurchaseOrder === 'Pending Billing/Partially Received'){
                    pendingPO = true;
                }
            }
        }
        var qtys = {"TO" : trsfOrder, "Quantity": qty, "QuantityCommitted": qtyCommitted, "QuantityPicked": qtyPicked, "PurchaseOrder": pendingPO};

        var qtyPickRemaining = qty - qtyPicked;
        var qtyCommitRemaining = qtyCommitted - qtyPicked;
        if (qtyCommitRemaining < 0){
            qtyCommitRemaining = 0;
        }
        var toCommitPct = 0;
        if (qtyPickRemaining > 0 ) {
            toCommitPct = (qtyCommitRemaining / qtyPickRemaining) * 100;
            if (toCommitPct > 100){
                toCommitPct = 100;
            }
            toCommitPct = toCommitPct.toFixed(2);
        } else {
            toCommitPct = null;
        }
        //get previous SO commit percent
        var origTOValues = search.lookupFields({
                type: search.Type.TRANSFER_ORDER,
                id: trsfOrder,
                columns: ['custbody_ge_sale_committed_pct', 'custbody_ge_pending_po_flag']
        });
        
        var origCommitPct = origTOValues.custbody_ge_sale_committed_pct;
        var origPendingPOFlag = origTOValues.custbody_ge_pending_po_flag;
        var origCommitPctS = origCommitPct.split('%');
        var origCommitPctN = isNaN(parseFloat(origCommitPctS[0])) ? null : parseFloat(origCommitPctS[0]).toFixed(2);
        //debug
        //if (trsfOrder == 117227){
        //    log.debug('reduce', 'pick remaining: ' + qtyPickRemaining + ', quantity: ' + qty + ', committed: ' + qtyCommitted + ', committed remaining: ' + qtyCommitRemaining);
        //    log.debug('reduce1', 'orig pct: ' + origCommitPctN + ', new pct: ' + toCommitPct + ', orig flag: ' + origPendingPOFlag + ', new flag: ' + pendingPO);            
        //}
        
        try{
            if (toCommitPct !== origCommitPctN || pendingPO !== origPendingPOFlag) {
                record.submitFields({
                    type: record.Type.TRANSFER_ORDER,
                    id: trsfOrder,
                    values: {
                        custbody_ge_sale_committed_pct: toCommitPct,
                        custbody_ge_pending_po_flag: pendingPO
                    }
                });
            }
        } catch (e){
            log.debug({title:'Error', details: 'Error when saving ' + trsfOrder + '. Error: ' + e.message});
        }
        //log.debug('reduce3', 'reduce succes');    
        */    
       // context.write(toId,qtys);
    }
    
    function summarize(summary) {
        
	  	log.debug('Summary', JSON.stringify(summary));        
	  	//log.debug('Summary Time','Total Seconds: '+summary.seconds);
    	//log.debug('Summary Usage', 'Total Usage: '+summary.usage);
    	//log.debug('Summary Yields', 'Total Yields: '+summary.yields);

    	//log.debug('Input Summary: ', JSON.stringify(summary.inputSummary));
    	//log.debug('Map Summary: ', JSON.stringify(summary.mapSummary));
    	//log.debug('Reduce Summary: ', JSON.stringify(summary.reduceSummary));

    	//Grab Map errors
    	summary.mapSummary.errors.iterator().each(function(key, value) {
			log.error(key, 'ERROR String: '+value);
			return true;
		});
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
     //   summarize: summarize
    };

});