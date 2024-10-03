/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*@NModuleScope Public
*/
define(['N/record','N/search','N/currentRecord','N/log','N/runtime'],
	function(record,search,currentRecord,log,runtime){
		
		function fieldChanged(context){
			if(context.fieldId === "custbody_related_asset" || context.fieldId === "custbody_to_status")
			{
			        var currentRecord = context.currentRecord;
                                var relatedAsset = currentRecord.getValue ({ fieldId: 'custbody_related_asset' });
                                var strToType = currentRecord.getValue ({ fieldId: 'custbody_to_status' });
                                var scriptObj=runtime.getCurrentScript()
                                var allFields=scriptObj.getParameter({name:'custscript_to_fam_all_fields'});
                                hideFields(allFields,'hide',currentRecord);
                                var theseFields=null;
                                /*
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

                                      */
                                if(strToType==1)
                                	theseFields=scriptObj.getParameter({name:'custscript_to_fam_committed'});                                        
                                else if(strToType==2)
                                        theseFields=scriptObj.getParameter({name:'custscript_to_fam_pending_release'});                                       
                                else if(strToType==3)
                                        theseFields=scriptObj.getParameter({name:'custscript_to_fam_release'});
                                else if(strToType==4)
                                        theseFields=scriptObj.getParameter({name:'custscript_to_fam_set'});                                        
                                else if(strToType==5)
                                        theseFields=scriptObj.getParameter({name:'custscript_to_fam_rental_price'});                                        
                                else if(strToType==6)
                                        theseFields=scriptObj.getParameter({name:'custscript_to_fam_misc'});    
                                else if(strToType==7)
                                	theseFields=scriptObj.getParameter({name:'custscript_to_fam_cust_owned'});
                                else if(strToType==8)
                                        theseFields=scriptObj.getParameter({name:'custscript_to_fam_unavailable'});                                        
                                else if(strToType==9)
                                	theseFields=scriptObj.getParameter({name:'custscript_to_fam_standby_start'});
                                else if(strToType==10)                                
                                	theseFields=scriptObj.getParameter({name:'custscript_to_fam_standby_stop'});                                
                                else if(strToType==11)                                
                                	theseFields=scriptObj.getParameter({name:'custscript_to_fam_move'});
                                
                                hideFields(theseFields,'show',currentRecord);
			}
			
		}
                function hideFields(fieldList,hs,rec)
                {

                    var splitFields=fieldList.split(',');
                    for(var s=0;s<splitFields.length;s++)
                    {
                        var thisField=rec.getField(splitFields[s]);
                        if(!thisField)
                                continue;
                        if(hs=='show')
                            thisField.isDisabled=false;
                        else
                            thisField.isDisabled=true;
                    }
                }
		function updateSuitelet(context){
			
			
		}
		function validateLine(context)
		{

		}
		return {
			updateSuitelet:updateSuitelet,
			fieldChanged:fieldChanged,
		//	postSourcing:validateField,
			//validateLine:validateLine,
		//	saveRecord: saveRec
		};
});