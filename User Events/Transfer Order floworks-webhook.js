/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record","N/log","N/https","N/crypto","N/encode", "N/runtime"],
	function(record, log, https, crypto, encode, runtime) {
  	var exports = {};
    var secretToken ="da0228fe1182d047cd05ceb9845381ea7fc4034e";
    var webhookURL = 'https://dsd.flogistix.com/v1/netsuite/webhook';
  	var metadata = {};

  	// function generateSignature(payload) {
//       var encodedPayload = Base64.encode(JSON.stringify(payload))
//       var signature = CryptoJS.HmacSHA512(encodedPayload, secretToken);
//     }
	
    var customerTransferOrderStatusMap = {
      "1" : "Rental Unit Committed",
      "2" : "Rental Unit Pending Release",
      "3" : "Rental Unit Release",
      "4" : "Rental Unit Set",
      "5" : "Rental Unit Price Change",
      "6" : "Miscellaneous",
      "7" : "Customer Owned",
      "8" : "Unavailable",
      "9" : "Information Update"
    };
    
    function isEmpty(obj) {
      return obj === undefined || obj === null || obj === "";
    }
    
    // This is borrowed from `preview NS_UE_Upd_FAM_Asset (1).js`
    // we need to mimic what is happening to the asset record
    // without actually saving it.
    function updatedAssetRecord(context) {
      var asset;
      var transferOrderRec = context.newRecord;
      var relatedAsset = transferOrderRec.getValue({
        fieldId: 'custbody_related_asset'
      });
      var transferOrderRec = context.newRecord;
      var preservedVal = transferOrderRec.getValue({
        fieldId: 'custbody_preserved'
      });
      var customerLocation = transferOrderRec.getValue({
        fieldId: 'custbody_rental_unit_customer_location'
      });
      var fieldServiceMechVal = transferOrderRec.getValue({
        fieldId: 'custbody_field_service_mechanic'
      });
      var pmCompletionVal = transferOrderRec.getValue({
        fieldId: 'custbody_scheduled_pm_completion_date'
      });
      var potBonusVal = transferOrderRec.getValue({
        fieldId: 'custbody_potential_bonus'
      });
      var relatedAsset = transferOrderRec.getValue({
        fieldId: 'custbody_related_asset'
      });
      var scheduleATerms = transferOrderRec.getValue({
        fieldId: 'custbody_sched_a_contract_terms'
      });
      var fieldSalesRep = transferOrderRec.getValue({
        fieldId: 'custbody_field_sales_rep'
      });
      var accountManager = transferOrderRec.getValue({
        fieldId: 'custbody_ae_at_account_manager'
      });
      var applicationType = transferOrderRec.getValue({
        fieldId: 'custbody_application_type'
      });
      var rentalStartDate = transferOrderRec.getValue({
        fieldId: 'custbody_rental_start_date'
      });
      var toStatus = transferOrderRec.getValue({
        fieldId: 'custbody_to_status'
      });
      var rentalRate = transferOrderRec.getValue({
        fieldId: 'custbodyrental_unit_monthly_rate'
      });
      var newRentalRate = transferOrderRec.getValue({
        fieldId: 'custbody_new_rental_monthly_rate'
      });

      if (relatedAsset) {
        asset = record.load({ 
          type: "customrecord_ncfar_asset", 
          id: relatedAsset, 
          isDynamic: false, 
          defaultValues: null 
        });
        
        if (toStatus == 3) {
          asset.setValue({ fieldId: 'custrecord_preserved_fam', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_current_state', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_current_county', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_current_location', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_sched_a_contract_terms', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_field_sales_rep', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_salesperson', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_application_type', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_rental_unit_set_date', value: '', ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_to_status', value: toStatus, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_current_customer', value: '', ignoreFieldChange: true });
        } else if (toStatus == 5) {
          asset.setValue({ fieldId: 'custrecord_rental_rate', value: newRentalRate, ignoreFieldChange: true });
        } else if (toStatus == 6) {
          asset.setValue({ fieldId: 'custrecord_preserved_fam', value: preservedVal, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_fieldservice_mechanic', value: fieldServiceMechVal, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_pm_completion_date', value: pmCompletionVal, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_potential_bonus', value: potBonusVal, ignoreFieldChange: true });
        } else if (toStatus == 2) {
          asset.setValue({ fieldId: 'custrecord_ae_at_to_status', value: toStatus, ignoreFieldChange: true });
        } else {
          asset.setValue({ fieldId: 'custrecord_preserved_fam', value: preservedVal, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_fieldservice_mechanic', value: fieldServiceMechVal, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_pm_completion_date', value: pmCompletionVal, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_potential_bonus', value: potBonusVal, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_sched_a_contract_terms', value: scheduleATerms, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_field_sales_rep', value: fieldSalesRep, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_salesperson', value: accountManager, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_application_type', value: applicationType, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_ae_at_to_status', value: toStatus, ignoreFieldChange: true });
          asset.setValue({ fieldId: 'custrecord_rental_rate', value: rentalRate, ignoreFieldChange: true });
        }
        
      }
      return asset;
  }

	
  	function loadAsset(assetId) {
      asset = record.load({ 
          type: "customrecord_ncfar_asset", 
          id: assetId, 
          isDynamic: false, 
          defaultValues: null 
        });
      return asset;
    }
  
	function loadLocation(locationId) {
      location = record.load({ 
          type: "custrecord_current_location", 
          id: locationId, 
          isDynamic: false, 
          defaultValues: null 
        });
      return location;
    }
  
    function beforeSubmit(scriptContext) {
      log.debug({
        "title" : "Before Submit",
        "details" : "action="+ scriptContext.type
      });
    }

    function afterSubmit(scriptContext) {
      try{
        var recordType = scriptContext.oldRecord.type;
        var internalId = scriptContext.oldRecord.id;
        var oldRecord = scriptContext.oldRecord;
        var newRecord = scriptContext.newRecord;
        var changedAssetRecord = newRecord;
        var asset;

		if(recordType == "transferorder") {
          var transferOrderRec = scriptContext.oldRecord;
          var relatedAsset = transferOrderRec.getValue({
            fieldId: 'custbody_related_asset'
          });
          oldRecord = loadAsset(relatedAsset);
          var asset = updatedAssetRecord(scriptContext);
            if(asset != null) {
              newRecord = asset;
              var transferToStatus = scriptContext.newRecord.getValue({ fieldId: 'custbody_to_status' });
              if (asset['fields']['custrecord_current_location'] != null) {
                var newLocation = loadLocation(asset['fields']['custrecord_current_location']);
                metadata["new_location"] = newLocation;
              }
              var newLocation = loadLocation(locationId);
              metadata["transfer_to_status"] = customerTransferOrderStatusMap[transferToStatus];
            }
          }


        var payload = {
          "event" : "record_modified",
          "record" : {
            "record_type" : recordType,
            "internal_id" : internalId,
            "old_record" : oldRecord,
            "new_record" : newRecord,
            "metadata" : metadata
          },
         }

        var postData = JSON.stringify(payload);

        var header = [];
        header['Content-Type']='application/json';
        // header['X-SUITESCRIPT-SIGNATURE'] = generateSignature(payload);
        header['x-api-key'] = 'feccd098ba50a61121def7faf7a6a412';

        var response=https.post({
          url: webhookURL,
          headers: header,
          body: postData
        });
        
        log.debug({"title": payload.action, "details": payload});
      } catch(e){
        log.error('scriptContext',JSON.stringify(scriptContext));
        log.error('ERROR',JSON.stringify(e));
      }
    }
    exports.beforeSubmit = beforeSubmit;
    exports.afterSubmit = afterSubmit;

    return exports;
});
