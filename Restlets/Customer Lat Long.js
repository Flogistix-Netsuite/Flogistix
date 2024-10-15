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
      try 
      {
        
      
       
        var whatId=context.addressID;
        var customerId=context.customerID;
        var lat=context.lat;
        var lon=context.lon;
        var cusRec=record.load({type:'customer',id:customerId,isDynamic:true});
        var howMany=cusRec.getLineCount({sublistId:'addressbook'});
        for(var h=0;h<howMany;h++)
        {
          var thisID=cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h});
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
            returnValue.h2s=subRec.getValue({fieldId:'custrecord20'});
            
            return returnValue;
          }
        }
        
        } 
        catch (error) 
        {

            log.debug({title:'error',details:error})
        }
            
        
    }
    
    function post(context)
    {
         // return 200;
      try 
      {
        
        var whatId=context.addressID;
        var customerId=context.customerID;
        var newLat=context.lon;
        var newLon=context.lat;
        var cusRec=record.load({type:'customer',id:customerId,isDynamic:true});
        //return 200;
        var howMany=cusRec.getLineCount({sublistId:'addressbook'});
        for(var h=0;h<howMany;h++)
        {
          var thisID=cusRec.getSublistValue({sublistId:'addressbook',fieldId:'internalid',line:h});
           log.debug({title:'thisID',details:thisID});
          if(thisID==whatId)
          {
            
            cusRec.selectLine({sublistId:'addressbook',line:h});
            var subRec= cusRec.getCurrentSublistSubrecord({sublistId: 'addressbook',fieldId: 'addressbookaddress'});
            subRec.setValue({fieldId:'custrecord_lat',value:newLat});
            subRec.setValue({fieldId:'custrecord_lon',value:newLon});
            cusRec.commitLine({sublistId:'addressbook'});
            break;
            //currentH2S=subRec.getValue({fieldId:'custrecord20'});

          }

        }
        cusRec.save()
        /*

        // log.debug({title:'he',details:context});
        var hRec=record.create({type:'customrecord_h2s_changes'});
            hRec.setValue({fieldId:'custrecord_h2s_customer',value:customerId});
            hRec.setValue({fieldId:'custrecord_h2s_address',value:whatId});
            hRec.setValue({fieldId:'custrecord_h2s_reading',value:whatH2S});
            hRec.setValue({fieldId:'custrecord_h2s_current',value:currentH2S});
        hRec.save();
        */
        return 200;
        
          
        } 
        catch (error) 
        {
            log.debug({title:'error',details:error})
        }
            
        

    }  
    
  
    return {
        'get': get,
        'post':post
    };
    
});