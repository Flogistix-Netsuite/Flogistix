/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.x
 */

define(['N/record', 'N/log'], function(record, log){

    /* Field Map from Transfer Order/ICTO to FAM - Asset Record */
    var objTransferOrderToAssetMap = {
        subsidiary: 'custrecord_assetsubsidiary',
        class: 'custrecord_assetclass',
        custbody_ae_at_account_manager: 'custrecord_ae_at_salesperson',                     //OK
        custbody_field_sales_rep: 'custrecord_ae_at_field_sales_rep',                       //Fixed - Sourced - Formed - Deleted
        custbody_ae_at_rental_unit_model: 'custrecord_ae_at_rental_unit_model',             //OK - Sourced
        custbody_ae_at_rental_unit_model_attr: 'custrecord_ae_at_rental_unit_model_attr',   //OK - Sourced
        custbody_ae_at_rental_unit_item_code: 'custrecord_ae_at_rental_unit_item_code',     //OK -
        custbody_related_asset: 'custrecord_ae_at_related_asset',                           //Fixed - Formed - Deleted
        custbody_ae_at_asset_category: 'custrecord_ae_at_asset_category',                   //OK - Sourced
        custbody_rental_unit_customer: 'custrecord_current_customer',                       //Fixed - Unsourced - Formed - Deleted
    //    custbody_rental_unit_location_dropdown: 'custrecord_current_location',              //Fixed - Unsourced - Formed - Deleted - Type is dumb and ugly and ultimately incompatible?
        custbody_rental_unit_county:'custrecord_current_county',                            //OK
        custbody_rental_unit_state:'custrecord_current_state',                              //OK
        custbody_application_type: 'custrecord_ae_at_application_type',                     //Fixed - Sourced - Formed
        custbody_sched_a_contract_terms: 'custrecord_ae_at_sched_a_contract_terms',         //Fixed - Sourced - Formed
        custbody_rental_start_date: 'custrecord_ae_at_rental_unit_set_date',
        custbody_new_rental_monthly_rate: 'custrecord_rental_rate',
        custbodyrental_unit_monthly_rate: 'custrecord_rental_rate',
        custbody_to_status: "custrecord_ae_at_to_status",
        custbody_field_service_mechanic:"custrecord_fieldservice_mechanic",
        custbody_scheduled_pm_completion_date:"custrecord_pm_completion_date",
        custbody_potential_bonus:"custrecord_potential_bonus",
        custbody_preserved:"custrecord_preserved_fam",
        custbody_rental_unit_location_dropdown:"custrecord_current_location",
        custbody32:'custrecord21',  //is standby
        custbody33:'custrecord22',  //start date
        custbody34:'custrecord23',
    };

    var COMMITTED_STATUS = '1';
    var PENDING_STATUS = '2';
    var RELEASE_STATUS = '3';
    var SET_STATUS = '4';
    var PRICE_CHANGE_STATUS = '5';
    var Misc_STATUS = '6';
    var MOVE_STATUS='11';
    var INFORMATION_UPDATE='12';


    function convertToIcto(map){
        delete map.subsidiary;
        map.tosubsidiary = 'custrecord_assetsubsidiary';
    }

    /**
     * Returns a reduce function that accepts a set of string field ids and
     * copies all the fields from the given record
     *
     * @param recNew
     * @returns {Function}
     * @private
     */
    function _reduceCopyFields(recNew){

        return function(obj, fieldId)
        {
            var mappedField = objTransferOrderToAssetMap[fieldId];
            if(!mappedField){throw "Attempt to copy from unmapped field: " + fieldId;}
            var mappedFieldId = mappedField.name ? mappedField.name : mappedField;
            if (!mappedField.type || /value/i.test(mappedField.type)) {
                obj[mappedFieldId] = recNew.getValue({fieldId: fieldId});
            }
            else {
                obj[mappedFieldId] = recNew.getText({fieldId: fieldId});
            }
            return obj;
        }
    }

    function afterSubmit(context){
        try {
            log.debug({title: 'afterSubmit', details: '<<<START>>>'});
            var recNew = record.load({type: context.newRecord.type, id: context.newRecord.id});

            // Modify field map for intercompany transfer orders
            if (context.newRecord.type === "intercompanytransferorder") {
                convertToIcto(objTransferOrderToAssetMap);
            }
            //Check form and related asset
            var intRelatedAssetId = recNew.getValue({fieldId: 'custbody_related_asset'});

            //Check Related Asset is set
            if (intRelatedAssetId) {
                var intTransferOrderStatus = recNew.getValue({fieldId: 'custbody_to_status'});

                /* Field sets to push for each Transfer Order Status */
                //1 - Rental Unit Committed Status
                var arrCommittedFields = [
                    'subsidiary',                           //Subsidiary
                    'class',                                    //Operating Area/BU.
                    'custbody_ae_at_account_manager',       //Account Manager
                    'custbody_field_sales_rep',       //Field Sales Representative
                    'custbody_rental_unit_customer',  //Customer
                    'custbody_rental_unit_county',          //County
                    'custbody_rental_unit_location_dropdown',  //Customer Location
                    'custbody_rental_unit_state',           //State
                    'custbody_sched_a_contract_terms',//Schedule A Contract Terms
                    'custbody_rental_start_date',           //Rental Start Date
                    'custbodyrental_unit_monthly_rate',     //Monthly Rate
                    'custbody_application_type',      //Application Type
                    'custbody_to_status'                    //TO Status
                ];

                //2 Rental Unit Pending Release Status
                var arrPendingReleaseFields = [
               /*     'custbody_ae_at_account_manager',           //Account Manager
                    'custbody_rental_unit_county',              //County
                    'custbody_rental_unit_customer',            //Customer
                    'custbody_rental_unit_location_dropdown',   //Customer Location
                    'custbody_field_sales_rep',                 //Field Sales Representative
                    'class',                                    //Operating Area/BU
                    'custbody_rental_unit_state',               //State
                    context.newRecord.type ===
                    "intercompanytransferorder"?
                        'tosubsidiary':'subsidiary',            //Subsidiary
                        */
                    'custbody_to_status'                        //TO Status
                ];

                //3 Rental Unit Release Status
                var arrReleaseDeleteFields = [
                    'custbody_ae_at_account_manager',           //Account Manager*
                    'custbody_application_type',                //Application Type*
                    'custbody_rental_unit_county',              //County*
                    'custbody_rental_unit_customer',            //Customer*
                    //'transferlocation'
                 //   'custbody_rental_unit_location_dropdown',   //Customer Location*
                    'custbody_field_sales_rep',                 //Field Sales Representative*
                    'custbody_rental_start_date',               //Rental Start Date*
                    'custbody_rental_unit_state',               //State*
                    'custbody_sched_a_contract_terms',  // Schedule A Contract Terms*
                ];

                var arrReleasePushFields = [
                    'custbody_to_status'                    //TO Status
                ];

                //4 - Rental Unit Set Status
                var arrSetFields = [
                    'subsidiary',                           //Subsidiary
                    'class',                                    //Operating Area/BU.
                    'custbody_ae_at_account_manager',       //Account Manager
                    'custbody_field_sales_rep',       //Field Sales Representative
                    'custbody_rental_unit_customer',  //Customer
                    'custbody_rental_unit_county',          //County
                    'custbody_rental_unit_location_dropdown',//customer location

                  
                 //   'custbody_rental_unit_location_dropdown',  //Customer Location
                    'custbody_rental_unit_state',           //State
                    'custbody_sched_a_contract_terms',//Schedule A Contract Terms
                    'custbody_rental_start_date',           //Rental Start Date
                    'custbodyrental_unit_monthly_rate',     //Monthly Rate
                    'custbody_application_type',      //Application Type
                    'custbody_to_status',                    //TO Status
                  'custbody32',//is standby
                    'custbody33',//standby start
                    'custbody34',//standby end
                ];
              var moveSetFields = [
                    'subsidiary',                           //Subsidiary
                    'class',                                    //Operating Area/BU.
                    'custbody_ae_at_account_manager',       //Account Manager
                    'custbody_field_sales_rep',       //Field Sales Representative
                    'custbody_rental_unit_customer',  //Customer
                    'custbody_rental_unit_county',          //County
                    'custbody_rental_unit_location_dropdown',  //Customer Location
                    'custbody_rental_unit_state',           //State
                    'custbody_sched_a_contract_terms',//Schedule A Contract Terms
                    'custbody_rental_start_date',           //Rental Start Date
                    'custbodyrental_unit_monthly_rate',     //Monthly Rate
                    'custbody_application_type',      //Application Type
                    //'custbody_to_status'                    //TO Status
                    'custbody32',//is standby
                    'custbody33',//standby start
                    'custbody34',//standby end
                ];

              var infoSetFields = [
                    'subsidiary',                           //Subsidiary
                    'class',                                    //Operating Area/BU.
                    'custbody_ae_at_account_manager',       //Account Manager
                    'custbody_field_sales_rep',       //Field Sales Representative
                    'custbody_rental_unit_customer',  //Customer
                    'custbody_rental_unit_county',          //County
                    'custbody_rental_unit_location_dropdown',//location
                 //   'custbody_rental_unit_location_dropdown',  //Customer Location
                    'custbody_rental_unit_state',           //State
                    'custbody_sched_a_contract_terms',//Schedule A Contract Terms
                    'custbody_rental_start_date',           //Rental Start Date
                    'custbodyrental_unit_monthly_rate',     //Monthly Rate
                   // 'custbody_application_type',      //Application Type
                    //'custbody_to_status'                    //TO Status
                ];

                //5 - Price Change Status
                var arrRentalUnitPrice = [
                    'custbody_new_rental_monthly_rate',    //Monthly Rate
                ];
                //6 - Miscellaneous Status
                var arrMisc = [
                    'custbody_field_service_mechanic',
                    'custbody_scheduled_pm_completion_date',
                    'custbody_potential_bonus',
                    'custbody_preserved',
                ];
                function _copyFields(arrFields){
                    //Gather values to set
                    var objValues = arrFields
                        .reduce(_reduceCopyFields(recNew), {});
                    log.debug({title: 'AfterSubmit - _copyFields', details: 'Submitting values: ' + JSON.stringify(objValues)});

                    record.submitFields({
                        type: 'customrecord_ncfar_asset',
                        id: intRelatedAssetId,
                        values: objValues,
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });
                }

                log.debug({
                    title: "Values are ",
                    details: "intCustomFormId is " + intTransferOrderStatus
                    + " | Pending Status is " + PENDING_STATUS
                    + " | Commit Status is " + COMMITTED_STATUS
                    + " | Set Status is " + SET_STATUS
                    + " | Release Status is " + RELEASE_STATUS
                    + " | Price Change Status is " + RELEASE_STATUS
                });

                //Pending Form
                if (intTransferOrderStatus === PENDING_STATUS) {
                    log.debug({title: 'afterSubmit - Pending', details: 'copyingFields: ' + arrPendingReleaseFields.join()});
                    _copyFields(arrPendingReleaseFields);
                }

                //MOD ADD Committed Form Logic
                if (intTransferOrderStatus === COMMITTED_STATUS) {
                    log.debug({title: 'afterSubmit - Committed', details: 'copyingFields: ' + arrCommittedFields.join()});
                    _copyFields(arrCommittedFields);
                }
                //END MOD

                //Rental Set Status
                if (intTransferOrderStatus === SET_STATUS) {
                    log.debug({title: 'afterSubmit - Set Form', details: 'copyingFields: ' + arrSetFields.join()});
                    _copyFields(arrSetFields);
                }

                //Price Change Status
                if (intTransferOrderStatus === PRICE_CHANGE_STATUS) {
                    log.debug({title: 'afterSubmit - Price Change', details: 'copyingFields: ' + arrRentalUnitPrice.join()});
                    _copyFields(arrRentalUnitPrice);
                }
                //Misc Status
                if (intTransferOrderStatus === Misc_STATUS) {
                    log.debug({title: 'afterSubmit - Misc', details: 'copyingFields: ' + arrMisc.join()});
                    _copyFields(arrMisc);
                }
                //move status
              if (intTransferOrderStatus === MOVE_STATUS) {
                    log.debug({title: 'afterSubmit - Price Change', details: 'copyingFields: ' + moveSetFields.join()});
                    _copyFields(moveSetFields);
                }
              if (intTransferOrderStatus === INFORMATION_UPDATE) {
                    log.debug({title: 'afterSubmit - Price Change', details: 'copyingFields: ' + infoSetFields.join()});
                    _copyFields(infoSetFields);
                }
              
              
                //Release Status
                if (intTransferOrderStatus === RELEASE_STATUS) {
                    log.debug({title: 'afterSubmit - Release Form', details: 'copyingFields: ' + arrReleaseDeleteFields.join()});

                    //Set some fields (i.e. Transfer Order Type)
                    _copyFields(arrReleasePushFields);

                    //Gather values to clear
                    var objValues = arrReleaseDeleteFields
                        .reduce(function (obj, fieldId) {
                            var mappedFieldId = objTransferOrderToAssetMap[fieldId];
                            mappedFieldId = mappedFieldId.type ? mappedFieldId.name : mappedFieldId;
                            obj[mappedFieldId] = null;
                            return obj;
                        }, {});
                    //add two key value pairs

                    log.debug({title: 'release form', details: 'objValues: ' + JSON.stringify(objValues)});
                    //Clear values
                    record.submitFields({
                        type: 'customrecord_ncfar_asset',
                        id: intRelatedAssetId,
                        values: objValues,
                        options: {
                            ignoreMandatoryFields: true
                        }
                           });
                          //added here 8/11
                      record.submitFields({
                        type: 'customrecord_ncfar_asset',
                        id: intRelatedAssetId,
                        values: {
                          custrecord_current_location:null
                          },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });
                }
            }
        }
        catch(e){
            log.error({title: 'afterSubmit', details: 'Error: ' + e.toString()});
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});