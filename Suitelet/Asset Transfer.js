/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/record'],
    function (serverWidget, task, runtime, search, redirect, https,url,record) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') {

            var form=serverWidget.createForm({title:'Asset Transfer'});
                form.clientScriptFileId=1655502;
                var generalInformation=form.addFieldGroup({id:'generalinformation',label:'General Information'});
                var currentLocation=form.addFieldGroup({id:'currentlocation',label:'Current Location'});
                var newLocation=form.addFieldGroup({id:'newlocation',label:'New Location'});
                //var transferDate=form.addFieldGroup({id:'transferdate',label:'Transfer Date'});

                form.addField({id:'custpage_asset',label:'Asset',type:'select',source:'customrecord_ncfar_asset',container:'generalinformation'});
                form.addField({id:'transferdate',label:'Transfer Date',type:'date',container:'generalinformation'});
                form.addField({id:'transferrequestor',label:'Requestor',type:'select',source:'customlist_tr_requestor',container:'generalinformation'});
                //old
                form.addField({id:'custpage_old_company',label:'Company',type:'select',source:'customer',container:'currentlocation'}).updateDisplayType({displayType:'inline'});//
                form.addField({id:'custpage_old_site_legal',label:'Lease',type:'select',source:'addressbook',container:'currentlocation'});//.updateDisplayType({displayType:'inline'});//
                form.addField({id:'custpage_old_county',label:'County',type:'text',container:'currentlocation'}).updateDisplayType({displayType:'inline'});//
                form.addField({id:'custpage_old_state',label:'State',type:'select',source:'state',container:'currentlocation'}).updateDisplayType({displayType:'inline'});//
                //form.addField({id:'custpage_lease',label:'Lease Name',type:'text'});//
                

                //new
                form.addField({id:'custpage_new_company',label:'Company',type:'select',source:'customer',container:'newlocation'});//
                form.addField({id:'custpage_new_site_legal',label:'Lease',type:'select',source:'addressbook',container:'newlocation'});
                form.addField({id:'custpage_new_county',label:'County',type:'text',container:'newlocation'});//
                form.addField({id:'custpage_new_state',label:'State',type:'select',source:'state',container:'newlocation'});//
                 //form.addField({id:'custpage_lease',label:'Lease Name',type:'text'});//



                //form.addField({id:'custpage_transfer_date',label:'Transfer Date',type:'date',container:'generalinformation'});
                //form.addField({id:'custpage_billing',label:'Billing End Date',type:'date'});
                //form.addField({id:'custpage_release_reason',label:'Release Reason',type:'select',source:'customlist_rental_release_reasons',container:'generalinformation'});
                form.addField({id:'custpage_comments',label:'Comments',type:'textarea',container:'generalinformation'});
                form.addSubmitButton({label:'Create Transfer'});
                response.writePage(form);
                //form.addSubmitButton({})


        }
        else
        {
            var thisAsset=context.request.parameters.custpage_asset;
            var findItem=search.lookupFields({type:'customrecord_ncfar_asset',id:thisAsset,columns:['custrecord_ae_at_rental_unit_item_code','custrecord_ae_at_asset_category','custrecordrental_unit_model','custrecordae_at_rental_unit_model_attr','custrecord_assetpurchasedate','custrecord_assetcost','custrecordhorse_power','custrecord_preserved_fam','custrecord_fieldservice_mechanic','custrecord_pm_completion_date','custrecord_potential_bonus']})
            var getItem=findItem.custrecord_ae_at_rental_unit_item_code;
            var findItemID=findID(getItem);
            var transferDate=context.request.parameters.transferdate;
            var thisCompany=context.request.parameters.custpage_new_company;
            var thisSite=context.request.parameters.custpage_new_site_legal;
            //var thisSite=findLabel(thisSite1);
            var thisSiteLabel=findLabel(thisCompany,thisSite);
            var requestor=context.request.parameters.transferrequestor;

            var thisCounty=context.request.parameters.custpage_new_county;
            var thisState=context.request.parameters.custpage_new_state_display;
            
            var thisNote=context.request.parameters.custpage_comments;
            log.debug({title:'state',details:thisState});
            var rec=record.create({type:'transferorder',isDynamic:true});
                rec.setValue({fieldId:'customform',value:191});
                rec.setValue({fieldId:'memo',value:thisNote});
                rec.setValue({fieldId:'custbody_to_status',value:11});
                rec.setValue({fieldId:'location',value:418});
                rec.setValue({fieldId:'transferlocation',value:423});
                rec.setValue({fieldId:'custbody_related_asset',value:thisAsset});
                rec.setValue({fieldId:'custbody_rental_unit_customer',value:thisCompany});
                rec.setValue({fieldId:'custbody_req_transfer_date',value:new Date(transferDate)});
                rec.setValue({fieldId:'custbody_transfer_requestor',value:requestor});
                if(thisSite)
                    {
                        rec.setValue({fieldId:'custbody_rental_unit_location_dropdown',value:thisSite});
                        rec.setValue({fieldId:'custbody_rental_unit_customer_location',value:thisSiteLabel})
                    }
                else
                    rec.setValue({fieldId:'custbody_rental_unit_customer_location',value:'kkl'});
                rec.setValue({fieldId:'custbody_rental_release_transfer',value:true});
                rec.setValue({fieldId:'custbody19',value:1});
                rec.setValue({fieldId:'custbody_rental_unit_county',value:thisCounty});
                rec.setText({fieldId:'custbody_rental_unit_state',text:thisState});
                //var thisItem=rec.getValue({fieldId:'custbody_ae_at_rental_unit_item_code'});
                rec.selectNewLine({sublistId:'item'});
                rec.setCurrentSublistValue({sublistId:'item',fieldId:'item',value:findItemID});
                rec.setCurrentSublistValue({sublistId:'item',fieldId:'quantity',value:1});
                rec.commitLine({sublistId:'item'});
                rec.save();
                //rec.setValue({fieldId:'',value:});
                //rec.setValue({fieldId:'',value:});

           
            /*
            var rec=record.load({type:'customrecord_ncfar_asset',id:thisAsset});
            //now, we set up each valuation
            rec.setValue({fieldId:'custrecord_current_customer',value:});
            rec.setValue({fieldId:'custrecord_current_county',value:});
            rec.setValue({fieldId:'custrecord_current_state',value:});
            rec.setValue({fieldId:'',value:});
            rec.setValue({fieldId:'',value:});
            rec.save();
    */
        }
    }
    function findLabel(thisCompany,thisSite)
    {
        var returnValue=null;
        
        var customerSearchObj = search.create({
           type: "customer",
           filters:
           [
              ["internalid","anyof",thisCompany]
           ],
           columns:
           [
              search.createColumn({name: "addressinternalid", label: "Address Internal ID"}),
              search.createColumn({name: "addresslabel", label: "Address Label"})
           ]
        });
        var searchResultCount = customerSearchObj.runPaged().count;
        log.debug("customerSearchObj result count",searchResultCount);
        customerSearchObj.run().each(function(result){
           // .run().each has a limit of 4,000 results
            var whatId=result.getValue({name:'addressinternalid'});
            if(whatId==thisSite)
                returnValue=result.getValue({name:'addresslabel'});
           return true;
        });
        return returnValue;

        /*
        customerSearchObj.id="customsearch1713300679823";
        customerSearchObj.title="find mdd dfdl (copy)";
        var newSearchId = customerSearchObj.save();
        */

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