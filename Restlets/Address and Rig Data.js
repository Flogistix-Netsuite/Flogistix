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
        var returnData=[];

        var customrecord_ncfar_assetSearchObj = search.create({
         type: "customrecord_ncfar_asset",
         filters:
         [
            ["custrecord_assettype","anyof","2","13"], 
      "AND", 
      ["custrecord_current_location","noneof","@NONE@"]
         ],
         columns:
         [
            search.createColumn({name: "name", label: "ID"}),
            search.createColumn({name: "altname", label: "Name"}),
            search.createColumn({name: "custrecord_current_location", label: "Current Location"}),
            search.createColumn({name: "custrecord_current_customer", label: "Currenr customer id"}),
            search.createColumn({name: "custrecord_ae_at_to_status", label:"Current TO Status"}),
         ]
          });
         
          
          var resultIndex=0;
          var resultStep=1000;
          var resultSet;
          var  qq=0;
         
          do  
            {
              resultSet=customrecord_ncfar_assetSearchObj.run().getRange({start:resultIndex,end:resultStep});
              resultIndex=resultIndex+1000;
              resultStep=resultStep+1000;
              log.error({title:'resultIndex',details:resultIndex});
              log.error({title:'resultStep',details:resultStep});
              var newResults=customrecord_ncfar_assetSearchObj.run().getRange({start:resultIndex,end:resultStep});
              log.error({title:'newResults',details:newResults.length});
                    
              //SearchResults=nlapiSearchRecord('item','customsearch432',null,null)
              for(var a=0; a<resultSet.length; a++)
                {
                  qq++;
                  
                  returnData.push({
                    id:resultSet[a].getValue({name:'name'}),
                    name:resultSet[a].getValue({name:'altname'}),
                    locationId:resultSet[a].getValue({name:'custrecord_current_location'}),
                    customerId:resultSet[a].getValue({name:'custrecord_current_customer'}),
                    toStatus:resultSet[a].getValue({name:'custrecord_ae_at_to_status'})
                  });
                 // nlapiSubmitField('assemblyitem',itemId,'custitem_potential_build',maxBuild);
                }
              }while(newResults.length>0);
             // .run().each has a limit of 4,000 results
             
            // return true;
          //});
          //log.error({title:'error',details:returnData})
          //return JSON.stringify(returnData);    
          log.error({title:'total',details:qq});
          return returnData;
        
        } 
        catch (error) 
        {

            log.error({title:'error',details:error})
        }
            
        
    }
    
    function post(context)
    {
         // return 200;
      try 
      {
        
        var whatId=context.addressID;
        var whatH2S=context.h2sPpm;
        var currentH2S=null;
        var customerId=context.customerID;
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
            currentH2S=subRec.getValue({fieldId:'custrecord20'});
          }
        }

        // log.debug({title:'he',details:context});
        var hRec=record.create({type:'customrecord_h2s_changes'});
            hRec.setValue({fieldId:'custrecord_h2s_customer',value:customerId});
            hRec.setValue({fieldId:'custrecord_h2s_address',value:whatId});
            hRec.setValue({fieldId:'custrecord_h2s_reading',value:whatH2S});
            hRec.setValue({fieldId:'custrecord_h2s_current',value:currentH2S});
        hRec.save();
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