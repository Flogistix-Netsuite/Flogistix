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
      
        return 200;
       
        
    }
    
    function post(context)
    {
         
      try 
      {
        
          var whatId=context.addressID;
          var customerId=context.customerID;
          var newLat=context.lat;
          var newLon=context.lon;
          var found=false;
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
              found=true;
              break;
              //currentH2S=subRec.getValue({fieldId:'custrecord20'});

            }


          }
          if(found)
          {
            cusRec.save();
            return 200;
          }
          else
          {
            return 401;
          }
          
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