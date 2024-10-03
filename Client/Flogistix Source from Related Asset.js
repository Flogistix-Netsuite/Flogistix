/**
 * Module Description...
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 *
 */

define (['N/record' , 'N/search' , './aecc' , 'N/runtime'] , function ( record , search , aecc , runtime ) {

    var COMMITTED_STATUS = '1';
    var PENDING_STATUS = '2';
    var RELEASE_STATUS = '3';
    var SET_STATUS = '4';
    var PRICE_CHANGE_STATUS = '5';
    var MOVE_STATUS='11'

    function cleanValue ( value ) {
        if (util.isArray (value)) {
            value = value[0];

            if (util.isObject (value) && value.value) {
                value = value.value;
            }
        }
        return value;
    }

    function sourceFields ( srcType , srcId , recCurrent , fieldMap ) {
        console.log ('fieldMap:' , fieldMap)
        console.log ('sourcing: ' , Object.keys (fieldMap));
        var fields = search.lookupFields ({
            type: srcType ,
            id: srcId ,
            columns: Object.keys (fieldMap)
        });
        var values = Object.keys (fields).reduce (function ( values , fieldId ) {
            var value = cleanValue (fields[fieldId])

            console.log (fieldId , fieldMap[fieldId] , value)
            if (fieldMap[fieldId] == 'custbody_rental_unit_customer_location') {
                if (fields[fieldId][0]){
                    values[fieldMap[fieldId]] = fields[fieldId][0].text;
                }
                else{
                    values[fieldMap[fieldId]] = '';
                }
            } else {
                values[fieldMap[fieldId]] = value;
            }
            return values;
        } , {});
        console.log (values)
        if (values['subsidiary']) {
            console.log ('setting subsidiary');
            recCurrent.setValue ({ fieldId: 'subsidiary' , value: values['subsidiary'] , ignoreFieldChange: true });
            delete values['subsidiary']
        }

        setTimeout (function () {
            Object.keys (values).forEach (function ( fieldId ) {
                console.log ('setting fieldId: ' , fieldId)
                if (/(\d{1,2})\/(\d{1,2})\/(\d{4})/.test (values[fieldId])) {
                    values[fieldId] = new Date (values[fieldId]);
                }
                log.debug(fieldId,values[fieldId])
                recCurrent.setValue ({ fieldId: fieldId , value: values[fieldId] });
            });
            var errors = Object.keys (values).filter (function ( fieldId ) {
                var value = cleanValue (recCurrent.getValue ({ fieldId: fieldId }));
                if (/(\d{1,2})\/(\d{1,2})\/(\d{4})/.test (value)) {
                    value = new Date (values);
                }
                return values[fieldId] != value;
            });
            if (errors.length > 0) {
                console.log ('These fields have not sourced correctly: ' , errors);
            }
        } , 500)

    }

    var exports = {
        fieldChanged: function ( context ) {
            if (context.fieldId === "custbody_related_asset" || context.fieldId === "custbody_to_status") {
				try{
                var currentRecord = context.currentRecord;
                var relatedAsset = currentRecord.getValue ({ fieldId: 'custbody_related_asset' });
                var strToType = currentRecord.getValue ({ fieldId: 'custbody_to_status' });
                if (aecc.isEmpty (strToType)) {
                    alert ('Please select a TO TYPE');
                }
                else if (!aecc.isEmpty (strToType)) {
                    log.debug('related Asset:' , relatedAsset);

                    var objRentalUnitCommittedFields = {
                        custrecord_assetsubsidiary: 'subsidiary' ,
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                    }

                    var objRentalUnitPendingReleaseFields = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }

                    var objRentalUnitReleaseStatus = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }

                    var objRentalUnitSetStatus = {
                        custrecord_assetsubsidiary: 'subsidiary' ,
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord9:'custbody_fam_contract_date',//contract start
                        custrecord10:'custbody_contract_end_date',//contract expiration
                    }
                   var objRentalUnitMoveStatus = {
                        custrecord_assetsubsidiary: 'subsidiary' ,
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                      custrecord9:'custbody_fam_contract_date',//contract start
                        custrecord10:'custbody_contract_end_date',//contract expiration
                        
                    }
                    var objPriceChangeStatus = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }
                    var objMiscStatus = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }
                    var objcustOwned = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }
                    var objunavailable = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }
                    var objStandbyStart = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }
                    var objStandbyStop = {
                        custrecord_assetsubsidiary: 'subsidiary' ,                                           //Subsidiary
                        custrecord_current_county: 'custbody_rental_unit_county' ,                           //County
                        custrecord_current_customer: 'custbody_rental_unit_customer' ,                       //Customer
                        custrecord_current_location: 'custbody_rental_unit_customer_location' ,              //Customer Location
                        custrecord_current_state: 'custbody_rental_unit_state' ,                             //State
                        custrecord_ae_at_asset_category: 'custbody_ae_at_asset_category' ,                    //Asset Category
                        custrecord_ae_at_rental_unit_item_code: 'custbody_ae_at_rental_unit_item_code' ,     //Rental Unit Item Code
                        custrecord_assetclass: 'class' ,                                                    //Operating Area/BU
                        custrecordrental_unit_model: 'custbody_ae_at_rental_unit_model' ,                              //Rental Unit Model
                        custrecordae_at_rental_unit_model_attr: 'custbody_ae_at_rental_unit_model_attr' ,      //Rental Unit Model Attributes
                        custrecord_ae_at_salesperson: 'custbody_ae_at_account_manager' ,                     //Account Manager
                        custrecord_ae_at_field_sales_rep: 'custbody_field_sales_rep' ,                       //Field Sales Representative
                        custrecord_ae_at_sched_a_contract_terms: 'custbody_sched_a_contract_terms' ,            //Schedule A Contract Terms
                        custrecord_rental_rate: 'custbodyrental_unit_monthly_rate' ,                         //Monthly Rate
                        custrecord_ae_at_application_type: 'custbody_application_type' ,                     //Application Type
                        custrecord_ae_at_rental_unit_set_date: 'custbody_rental_start_date' ,                //Rental Set Date

                    }
                    var fieldSets = {
                        1: objRentalUnitCommittedFields ,
                        2: objRentalUnitPendingReleaseFields ,
                        3: objRentalUnitReleaseStatus ,
                        4: objRentalUnitSetStatus ,
                        5: objPriceChangeStatus ,
                        6: objMiscStatus ,
                      7: objcustOwned ,
                      8: objunavailable ,
                      9: objStandbyStart ,
                      10: objStandbyStop ,
                      11:objRentalUnitMoveStatus,
                    }
                    log.debug('To Type' , strToType)
                    if (!aecc.isEmpty (relatedAsset)) {
						
                        sourceFields (
                            'customrecord_ncfar_asset' ,
                            relatedAsset ,
                            currentRecord ,
                            fieldSets[strToType]
                        )
						
                    }
                }
			}
			catch(error)
		      {
			     log.debug({title:'error',details:error.message});
		      }
            }
            if (context.fieldId = 'custbody_ae_at_rental_unit_model'){
                var currentRecord = context.currentRecord;
                var relatedAsset = currentRecord.getValue ({ fieldId: 'custbody_related_asset' });
                var location = currentRecord.getValue({
                    fieldId: 'location'
                })
                if (relatedAsset &&!location){
                    var fields = search.lookupFields({
                        type: 'customrecord_ncfar_asset',
                        id: relatedAsset,
                        columns: 'custrecord_assetserialno'
                    });
                    if (fields.custrecord_assetserialno){
                       var invNumSearch = search.load({
                            id: 'customsearch_inventory_num'
                        });

                        var lotFilter = search.createFilter({
                            name: 'inventorynumber',
                            operator: search.Operator.IS,
                            values: fields.custrecord_assetserialno
                        });

                        var availableFilter = search.createFilter({
                            name: 'quantityavailable',
                            operator: search.Operator.GREATERTHAN,
                            values: 0
                        });

                        invNumSearch.filters = [lotFilter, availableFilter];
                        invNumSearch.run().each(function(result) {

                            var warehouse = result.getValue({
                                    name: 'location'
                            });
                            log.debug(warehouse)
                            currentRecord.setValue({
                                fieldId: 'location',
                                value: warehouse
                            });
                            return true;
                        });
                    }
                }
            }
        } ,
        saveRecord: function ( context ) {

            var currentRecord = context.currentRecord;
            var poType = currentRecord.getValue ({ fieldId: 'custbody_to_status' });
            log.debug({
                title:'To Status',
                details: poType
            })
            var arrayRequiredFields = [];
            //Rental Unit Committed
            if (poType == '1') {
                var requiredFields = runtime.getCurrentScript ().getParameter ({ name: 'custscript_rental_unit_commit_req_field' });
                arrayRequiredFields = requiredFields.split (",").map (function ( item ) {
                    return item.trim ();
                });

            }//Rental Unit Pending Release
            else if (poType == '2') {
                var requiredFields = runtime.getCurrentScript ().getParameter ({ name: 'custscript_rental_unit_pending_req_field' });
                arrayRequiredFields = requiredFields.split (",").map (function ( item ) {
                    return item.trim ();
                });
            }//Rental Unit Release
            else if (poType == '3') {
                var requiredFields = runtime.getCurrentScript ().getParameter ({ name: 'custscript_rental_unit_release_req_field' });
                arrayRequiredFields = requiredFields.split (",").map (function ( item ) {
                    return item.trim ();
                });
            }//Rental Unit Set
            else if (poType == '4') {
                var requiredFields = runtime.getCurrentScript ().getParameter ({ name: 'custscript_rental_unit_set_req_field' });
                arrayRequiredFields = requiredFields.split (",").map (function ( item ) {
                    return item.trim ();
                });
            } //Rental Unit Price Change
            else if (poType == '5') {
                var requiredFields = runtime.getCurrentScript ().getParameter ({ name: 'custscript_rental_unit_p_chang_req_field' });
                arrayRequiredFields = requiredFields.split (",").map (function ( item ) {
                    return item.trim ();
                });
            } else if (poType == '6') {
                var requiredFields = runtime.getCurrentScript ().getParameter ({ name: 'custscript_rental_misc_commit_req_field' });
                arrayRequiredFields = requiredFields.split (",").map (function ( item ) {
                    return item.trim ();
                });
            }
            if (!aecc.isEmpty (arrayRequiredFields)) {
                log.debug({
                    title: 'arrayFields',
                    details: arrayRequiredFields
                })
                var emptyFieldsLabel = [];
                for ( var i in arrayRequiredFields ) {
                    var fieldName = arrayRequiredFields[i];
                    log.debug({
                        title: ' Debugging field',
                        details: fieldName
                    })
                    var fieldValue = currentRecord.getValue ({ fieldId: arrayRequiredFields[i] });

                    if (aecc.isEmpty (fieldValue)) {
                        var fieldObj = currentRecord.getField ({ fieldId: arrayRequiredFields[i] });
                        emptyFieldsLabel.push (fieldObj.label)
                    }

                }
                if (!aecc.isEmpty (emptyFieldsLabel)) {
                    alert ('Please enter value(s) for: ' + emptyFieldsLabel.join (', '));
                    return false;
                }
            }
            return true;
        }

    };

    return exports;
});