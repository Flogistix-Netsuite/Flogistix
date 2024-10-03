/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime', 'N/format'],

function (search, record, runtime, format) {
    function getInputData() {
        
    	var getID=runtime.getCurrentScript().getParameter({name:'custscript_find_id'});
    	
        return search.load({
            id: 'customsearch_transfer_to_handle'
            });
    }

    function map(context) {
        // get context value
        //log.debug('debug', JSON.stringify(context));
        
        var trsfOrder = JSON.parse(context.value);
		var toId = trsfOrder.id;
        var toDtls = trsfOrder.values;        
        var qty = toDtls.quantity * -1;
        var qtyCommitted = toDtls.quantitycommitted;
        var qtyPicked = toDtls.quantitypicked;
        var po = toDtls["statusref.purchaseOrder"].text;
        if (!po){
            po = '';
        }
        var qtys = {"Quantity": qty, "QuantityCommitted": qtyCommitted, "QuantityPicked": qtyPicked, "PurchaseOrder": po};
        //log.debug('map2', JSON.stringify(qtys));
        context.write(toId,qtys);
    }

    function reduce(context) {
        // get context value
        //log.debug('reduce1', JSON.stringify(context));
        var trsfOrder = context.key;
        var toDtls = context.values;
        // get quantities
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
        context.write(toId,qtys);
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
        summarize: summarize
    };

});