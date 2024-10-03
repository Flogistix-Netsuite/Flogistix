/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
    define(['N/record','N/search','N/email'],
        function(record,search,email) {
            function beforeLoad(context) 
            {
                var rec=context.newRecord;
            }
            function beforeSubmit(context) 
            {
                var rec=context.newRecord;
            }
            function afterSubmit(context)
            {
                var rec=context.newRecord;
                
            }

            
            return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
            };
});


/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define(['N/search','N/record'],

function(search,record) {
   
    /**
     * Function called upon sending a GET request to the RESTlet.
     *
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.1
     */
    function get(context) {
      try {
        
      
        //log.debug({title:'context',details:context});
        //var whatCode=context.acode;
        //var whatCustomer=context.acustomer;
        var whatId=context.addressID;
        //log.debug({title:'whatId',details:whatId});
        var whatH2S=context.h2sPpm;
        //log.debug({title:'whatH2S',details:whatH2S});
        var customerId=context.customerID;
        // log.debug({title:'he',details:context});
        var cusRec=record.load({type:'customer',id:customerId,isDynamic:true});
        //return 200;
        var howMany=cusRec.getLineCount({sublistId:'addressbook'});
        for(var h=0;h<howMany;h++)
        {
          var thisID=cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h});
           //log.debug({title:'thisID',details:thisID});
          if(thisID==whatId)
          {
            //log.debug({title:'found',details:'found'});
            cusRec.selectLine({sublistId:'addressbook',line:h});
            var subRec= cusRec.getCurrentSublistSubrecord({sublistId: 'addressbook',fieldId: 'addressbookaddress'});
            var returnValue={};
            returnValue.city=subRec.getValue({fieldId:'city'});
            returnValue.address1=subRec.getValue({fieldId:'addr1'});
            returnValue.address2=subRec.getValue({fieldId:'addr2'});
            returnValue.state=subRec.getValue({fieldId:'state'});
            returnValue.zip=subRec.getValue({fieldId:'zip'});
            //returnValue.address1=subRec.getValue({fieldId:'addr1'});
            returnValue.h2s=subRec.getValue({fieldId:'custrecord20'});
            //subRec.setValue({fieldId:'custrecordh2s_location',value:true});
            //subRec.setValue({fieldId:'custrecord20',value:whatH2S});
            //cusRec.commitLine({sublistId: 'addressbook'});
            //subRec.save();
            //cusRec.save();
            //return 200;
            return returnValue;
          }
        }
        /*
        var addrRec=record.load({type:'addressbook',id:whatId});
            addrRec.setValue({fieldId:'custrecordh2s_location',value:true});
            addrRec.setValue({fieldId:'custrecord20',value:whatH2S});
            addrRec.save();
            return 200;*/
        } catch (error) {
        log.debug({title:'error',details:error})
      }
            
        /*
        var codeAndExpiry=whatSearchSO(whatCode);
        
        salesorderSearchObj=codeAndExpiry;
        
        var expiryDate=null;
        var thisCustomer=null;
        var thisID=null;
        if(!salesorderSearchObj)
            return{'code':400}
        
        salesorderSearchObj.run().each(function(result){
          // .run().each has a limit of 4,000 results
            var columns=result.columns;
            expiryDate=result.getValue({name:'custrecord_pba_date_expiry'});
            thisCustomer=result.getValue({name:'custrecord_pba_redeemed_customer'});
            thisID=result.getValue({name:'internalid'});
            return false;
        });

        if(!expiryDate || thisCustomer)
            return{'code':400}
        else
        {

            var today=new Date();
            var threeYears=today+1095;
            var rec=record.load({type:'customrecord_pba_codes',id:thisID});
                rec.setValue({fieldId:'custrecord_pba_redeemed_customer',value:whatCustomer});
                rec.setValue({fieldId:'custrecord_pba_date_expiry',value:threeYears});
                rec.save();


        }     */
    }
    
    function post(context)
    {
         // return 200;
      try {
        
      
        log.debug({title:'context',details:context});
        //var whatCode=context.acode;
        //var whatCustomer=context.acustomer;
        var whatId=context.addressID;
        log.debug({title:'whatId',details:whatId});
        var whatH2S=context.h2sPpm;
        log.debug({title:'whatH2S',details:whatH2S});
        var customerId=context.customerID;
        // log.debug({title:'he',details:context});
        var hRec=record.create({type:'customrecord_h2s_changes'});
            hRec.setValue({fieldId:'custrecord_h2s_customer',value:customerId});
            hRec.setValue({fieldId:'custrecord_h2s_address',value:whatId});
            hRec.setValue({fieldId:'custrecord_h2s_reading',value:whatH2S});
        hRec.save();
        return 200;
        /*
            var cusRec=record.load({type:'customer',id:customerId,isDynamic:true});
        //return 200;
        var howMany=cusRec.getLineCount({sublistId:'addressbook'});
        for(var h=0;h<howMany;h++)
        {
          var thisID=cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h});
           log.debug({title:'thisID',details:thisID});
          if(thisID==whatId)
          {
            log.debug({title:'found',details:'found'});
            cusRec.selectLine({sublistId:'addressbook',line:h});
            var subRec= cusRec.getCurrentSublistSubrecord({sublistId: 'addressbook',fieldId: 'addressbookaddress'});
            var returnValue={};
            returnValue.city=subRec.getValue({fieldId:'city'});
            returnValue.address1=subRec.getValue({fieldId:'addr1'});
                        returnValue.address2=subRec.getValue({fieldId:'addr2'});
                      returnValue.state=subRec.getValue({fieldId:'state'});
            returnValue.zip=subRec.getValue({fieldId:'zip'});
            //returnValue.address1=subRec.getValue({fieldId:'addr1'});
            returnValue.h2s=whatH2S;
            subRec.setValue({fieldId:'custrecordh2s_location',value:true});
            subRec.setValue({fieldId:'custrecord20',value:whatH2S});
            cusRec.commitLine({sublistId: 'addressbook'});
            //subRec.save();
            cusRec.save();
            //return 200;
            */
            return returnValue;
          //}
        //}
        /*
        var addrRec=record.load({type:'addressbook',id:whatId});
            addrRec.setValue({fieldId:'custrecordh2s_location',value:true});
            addrRec.setValue({fieldId:'custrecord20',value:whatH2S});
            addrRec.save();
            return 200;*/
        } catch (error) {
        log.debug({title:'error',details:error})
      }
            
        /*
        var codeAndExpiry=whatSearchSO(whatCode);
        
        salesorderSearchObj=codeAndExpiry;
        
        var expiryDate=null;
        var thisCustomer=null;
        var thisID=null;
        if(!salesorderSearchObj)
            return{'code':400}
        
        salesorderSearchObj.run().each(function(result){
          // .run().each has a limit of 4,000 results
            var columns=result.columns;
            expiryDate=result.getValue({name:'custrecord_pba_date_expiry'});
            thisCustomer=result.getValue({name:'custrecord_pba_redeemed_customer'});
            thisID=result.getValue({name:'internalid'});
            return false;
        });

        if(!expiryDate || thisCustomer)
            return{'code':400}
        else
        {

            var today=new Date();
            var threeYears=today+1095;
            var rec=record.load({type:'customrecord_pba_codes',id:thisID});
                rec.setValue({fieldId:'custrecord_pba_redeemed_customer',value:whatCustomer});
                rec.setValue({fieldId:'custrecord_pba_date_expiry',value:threeYears});
                rec.save();


        }     */

    }
    function verification(whatCode,whatCustomer,desiredAction)
    {

    }
    function whatSearchSO(whatCode)
    {
        var salesorderSearchObj = search.create({
           type: "customrecord_pba_codes",
           filters:
           [
              ["name","is",whatCode], 
              //"AND",
             //["custrecord_pba_redeemed_customer","is",whatCustomer]
             
           ],
           columns:
           [
             
            search.createColumn({name: "custrecord_pba_date_expiry",label: "Status"}), 
            search.createColumn({name: "custrecord_pba_redeemed_customer",label: "Status"}),   
            search.createColumn({name: "internalid",label:'Internal ID'})


  
           ]
        });
        var searchResultCount = salesorderSearchObj.runPaged().count;
        log.error({title:'4th--',details:salesorderSearchObj});
        
        if(!searchResultCount)
            return false
        else
            return salesorderSearchObj;
        
        
    }
  
    return {
        'get': get,
        'post':post
    };
    
});