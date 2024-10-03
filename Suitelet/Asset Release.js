/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/format','N/record'],
    function (serverWidget, task, runtime, search, redirect, https,url,format,record) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') {

            var form=serverWidget.createForm({title:'Asset Release'});
                form.clientScriptFileId=1655512;
           var generalInformation=form.addFieldGroup({id:'generalinformation',label:'General Information'});
           var releaseInformation=form.addFieldGroup({id:'releaseinformation',label:'Release Information'})
            var currentLocation=form.addFieldGroup({id:'currentlocation',label:'Current Location'});
                form.addField({id:'custpage_asset',label:'Asset',type:'select',source:'customrecord_ncfar_asset',container:'generalinformation'});
               //form.addField({id:'custpage_lease',label:'Lease',type:'text'});//
                form.addField({id:'custpage_lease',label:'Lease',type:'select',source:'addressbook',container:'generalinformation'}).updateDisplayType({displayType:'inline'});//
               
                form.addField({id:'custpage_company',label:'Company',type:'select',source:'customer',container:'generalinformation'}).updateDisplayType({displayType:'inline'});//;//
                form.addField({id:'custpage_county',label:'County',type:'text',container:'generalinformation'}).updateDisplayType({displayType:'inline'});//;//
                form.addField({id:'custpage_state',label:'State',type:'select',source:'state',container:'generalinformation'}).updateDisplayType({displayType:'inline'});//;//
                form.addField({id:'custpage_release',label:'Release Date',type:'date',container:'releaseinformation'});
                form.addField({id:'custpage_billing',label:'Billing End Date',type:'date',container:'releaseinformation'});
                form.addField({id:'custpage_release_reason',label:'Release Reason',type:'select',source:'customlist_rental_release_reasons',container:'releaseinformation'});
                form.addField({id:'custpage_notes',label:'Notes',type:'textarea',container:'releaseinformation'});
                form.addSubmitButton('Create Pending Release');
                response.writePage(form);
                //form.addSubmitButton({})


        }
        else
        {

            var thisAsset=context.request.parameters.custpage_asset;
            var findItem=search.lookupFields({type:'customrecord_ncfar_asset',id:thisAsset,columns:['custrecord_ae_at_rental_unit_item_code','custrecord_ae_at_asset_category','custrecordrental_unit_model','custrecordae_at_rental_unit_model_attr','custrecord_assetpurchasedate','custrecord_assetcost','custrecordhorse_power','custrecord_preserved_fam','custrecord_fieldservice_mechanic','custrecord_pm_completion_date','custrecord_potential_bonus']})
            var getItem=findItem.custrecord_ae_at_rental_unit_item_code;
            var findItemID=findID(getItem);
            var thisCompany=context.request.parameters.custpage_new_company;
            var thisSite=context.request.parameters.custpage_new_site_legal;
            var thisCounty=context.request.parameters.custpage_new_county;
            var thisState=context.request.parameters.custpage_new_state;
            var billingDate=context.request.parameters.custpage_billing;
/*
            var rec=record.create({type:'transferorder',isDynamic:true});
                rec.setValue({fieldId:'customform',value:191});
                rec.setValue({fieldId:'custbody_to_status',value:3});
                rec.setValue({fieldId:'location',value:418});
                rec.setValue({fieldId:'transferlocation',value:423});
                rec.setValue({fieldId:'custbody_related_asset',value:thisAsset});
                rec.setValue({fieldId:'custbody_rental_unit_customer',value:thisCompany});
               // rec.setValue({fieldId:'custbody_rental_unit_location_dropdown',value:thisSite});
                //rec.setValue({fieldId:'custbody_rental_release_transfer',value:true});
                //rec.setValue({fieldId:'custbody19',value:1});
                var thisItem=rec.getValue({fieldId:'custbody_ae_at_rental_unit_item_code'});
                rec.selectNewLine({sublistId:'item'});
                rec.setCurrentSublistValue({sublistId:'item',fieldId:'item',value:findItemID});
                rec.setCurrentSublistValue({sublistId:'item',fieldId:'quantity',value:1});
                rec.commitLine({sublistId:'item'});
                rec.save();
                //rec.setValue({fieldId:'',value:});
                //rec.setValue({fieldId:'',value:});
            */
            var thisAsset=context.request.parameters.custpage_asset;
            var thisReason=context.request.parameters.custpage_release_reason;
            var thisBillingDate=context.request.parameters.custpage_billing;
            var thisReleaseDate=context.request.parameters.custpage_release;
            var thisNote=context.request.parameters.custpage_notes;
            var rec=record.create({
                type:'transferorder',
                isDynamic:true,
                //defaultValues:{
                 //   customform:'191',
                   // custbody_to_status:'2',
                   // custbody_related_asset:'1039'
                //}
            });
            rec.setValue({fieldId:'customform',value:191});
            rec.setValue({fieldId:'custbody_to_status',value:2});
            rec.setValue({fieldId:'custbody_related_asset',value:thisAsset});
            rec.setValue({fieldId:'transferlocation',value:418});

            rec.setValue({fieldId:'location',value:423});
            //var thisAssetId=rec.getValue('custpage_asset');
                    var assetFields=search.lookupFields({
                        type:'customrecord_ncfar_asset',
                        id:thisAsset,
                        columns:['custrecord_assetsubsidiary',
                        'custrecord_current_county',
                        'custrecord_current_customer',
                        'custrecord_current_location',
                        'custrecord_current_state',
                        'custrecord_ae_at_asset_category',
                        'custrecord_ae_at_rental_unit_item_code',
                        'custrecord_assetclass',
                        'custrecordrental_unit_model',
                        'custrecordae_at_rental_unit_model_attr',
                        'custrecord_ae_at_salesperson',
                        'custrecord_ae_at_field_sales_rep',
                        'custrecord_ae_at_sched_a_contract_terms',
                        'custrecord_rental_rate',
                        'custrecord_ae_at_application_type',
                        'custrecord_ae_at_rental_unit_set_date']
                    })
            //var assetFields=
                    var thisSubsidiary=assetFields.custrecord_assetsubsidiary[0].value;
                    var thisCounty=assetFields.custrecord_current_county
                    var thisCustomer=assetFields.custrecord_current_customer[0].value;
                    var thisLocation=assetFields.custrecord_current_location[0].value;
                    var thisState=assetFields.custrecord_current_state[0].value;
                    var thisCategory=assetFields.custrecord_ae_at_asset_category[0].value;
                    var thisItem=assetFields.custrecord_ae_at_rental_unit_item_code;
                    
                    
                    
                    var thisAssetClass=assetFields.custrecord_assetclass[0].value;
                    var thisUnitRentalModel=assetFields.custrecordrental_unit_model[0].value;
                    var thisUnitRentalModelAttr=assetFields.custrecordae_at_rental_unit_model_attr;
                    var thisSalesPerson=assetFields.custrecord_ae_at_salesperson[0].value;
                    var thisFieldRep=assetFields.custrecord_ae_at_field_sales_rep[0].value;
                    var thisATerms=assetFields.custrecord_ae_at_sched_a_contract_terms[0].value;
                    var thisRentalRate=assetFields.custrecord_rental_rate;
                    var thisApplicationType=assetFields.custrecord_ae_at_application_type[0].value;
                    var thisSetDate=assetFields.custrecord_ae_at_rental_unit_set_date;
            
            rec.setValue({fieldId:'custbody_rental_release_reason',value:thisReason});
            rec.setValue({fieldId:'custbody_notice_of_release_date',value:new Date(thisReleaseDate)});
            //rec.setValue({fieldId:'custbody_billing_end_date',value:new Date(thisBillingDate)});
            rec.setValue({fieldId:'custrecord_assetsubsidiary',value:thisSubsidiary});
            rec.setValue({fieldId:'custrecord_current_county',value:thisCounty});
            rec.setValue({fieldId:'custrecord_current_customer',value:thisCustomer});
            rec.setValue({fieldId:'custrecord_current_location',value:thisLocation});
            rec.setValue({fieldId:'custrecord_current_state',value:thisState});
            rec.setValue({fieldId:'custrecord_ae_at_asset_category',value:thisCategory});
            rec.setValue({fieldId:'custrecord_ae_at_rental_unit_item_code',value:thisItem});
            rec.setValue({fieldId:'custrecord_assetclass',value:thisAssetClass});
            rec.setValue({fieldId:'custrecordrental_unit_model',value:thisUnitRentalModel});
            rec.setValue({fieldId:'custrecordae_at_rental_unit_model_attr',value:thisUnitRentalModelAttr});
            rec.setValue({fieldId:'custrecord_ae_at_salesperson',value:thisSalesPerson});
            rec.setValue({fieldId:'custrecord_ae_at_field_sales_rep',value:thisFieldRep});
            rec.setValue({fieldId:'custrecord_ae_at_sched_a_contract_terms',value:thisATerms});
            rec.setValue({fieldId:'custrecord_rental_rate',value:thisRentalRate});
            rec.setValue({fieldId:'custrecord_ae_at_application_type',value:thisApplicationType});
            rec.setValue({fieldId:'custrecord_ae_at_rental_unit_set_date',value:thisSetDate});
            rec.setValue({fieldId:'custbody_billing_end_date',value:new Date(thisBillingDate)})

            rec.selectNewLine({sublistId:'item'});
            rec.setCurrentSublistValue({sublistId:'item',fieldId:'item',value:findItemID});
            rec.setCurrentSublistValue({sublistId:'item',fieldId:'rate',value:0});
            rec.commitLine({sublistId:'item'});
            var thisCurrentMemo=rec.getValue({fieldId:'memo'});
            var addDate=new Date();
            var newMemo=format.format({value:addDate,type:'date'})+'\n'+thisNote+'\n'+thisCurrentMemo;
            rec.setValue({fieldId:'memo',value:newMemo});
            rec.save();
            
            redirect.toTaskLink({
                id:'CARD_-29',
            });

        }
    }
    function findID(itemId)
    {
        var returnValue=null;
        var itemSearchObj = search.create({
           type: "item",
           filters:
           [
              ["name","is",itemId]
           ],
           columns:
           [
              search.createColumn({name: "internalid", label: "Internal ID"})
           ]
        });
        var searchResultCount = itemSearchObj.runPaged().count;
        log.debug("itemSearchObj result count",searchResultCount);
        itemSearchObj.run().each(function(result){
           // .run().each has a limit of 4,000 results
            returnValue=result.getValue({name:'internalid'});
           return true;
        });

        return returnValue;

        /*
        itemSearchObj.id="customsearch1706203536047";
        itemSearchObj.title="Custom Item Search 5 (copy)";
        var newSearchId = itemSearchObj.save();
        */
    }

        
        return {
            onRequest: onRequest
        }
    })