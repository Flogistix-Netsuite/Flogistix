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
        	var form=serverWidget.createForm({title:'Dunning Setups'});
        	//i need letters for three days
              var oa=form.addFieldGroup({id:'oa',label:'Applies to All'});
                var tFG=form.addFieldGroup({id:'thirtyday',label:'30 Day'});
                var sFG=form.addFieldGroup({id:'sixtyday',label:'60 Day'});
                var nFG=form.addFieldGroup({id:'ninetyday',label:'90 Day'});
                
        		var thirty=form.addField({id:'custpage_letter_under_thirty',label:'0-30 Day Letter',type:'url',container:'thirtyday'}).updateDisplayType({displayType:'inline'});
        		var sixty=form.addField({id:'custpage_letter_under_sixty',label:'60-90 Day Letter',type:'url',container:'sixtyday'}).updateDisplayType({displayType:'inline'});
        		var ninety=form.addField({id:'custpage_letter_over_ninety',label:'90 Day+ Letter',type:'url',container:'ninetyday'}).updateDisplayType({displayType:'inline'});
        		//overdue balance folks
        		var overdue=form.addField({id:'custpage_amount_overdue',label:'Amount to start emailing letters',type:'integer',container:'oa'});
        		form.addSubmitButton({label:'Update System'});
                //now we need to add sublist
                var thirtyFreq=form.addField({id:'custpage_thirty_freq',label:'30 Day Frequency',type:'select',source:'customlist_email_frequency',container:'thirtyday'});
                var sixtyFreq=form.addField({id:'custpage_sixty_freq',label:'60 Day Frequency',type:'select',source:'customlist_email_frequency',container:'sixtyday'});
                var ninetyFreq=form.addField({id:'custpage_ninety_freq',label:'90 Day Frequency',type:'select',source:'customlist_email_frequency',container:'ninetyday'});
                var dRec=record.load({type:'customrecord_dunning',id:2});
                var tDay=dRec.getValue({fieldId:'custrecord_d_30'});
                var sDay=dRec.getValue({fieldId:'custrecord_d_60'});
                var nDay=dRec.getValue({fieldId:'custrecord_d_90'});
                var oAmount=dRec.getValue({fieldId:'custrecord_d_amount'});
                var tFre=dRec.getValue({fieldId:'custrecord_d_30_freq'});
                var sFre=dRec.getValue({fieldId:'custrecord_d_60_freq'});
                var nFre=dRec.getValue({fieldId:'custrecord_d_90_freq'});

                thirty.defaultValue=tDay;
                sixty.defaultValue=sDay;
                ninety.defaultValue=nDay;
                overdue.defaultValue=oAmount;
                thirtyFreq.defaultValue=tFre;
                sixtyFreq.defaultValue=sFre;
                ninetyFreq.defaultValue=nFre;

                context.response.writePage(form);

		}
        else
        {
            var newAmount=request.parameters.custpage_amount_overdue;
            var thirtyFreq=request.parameters.custpage_thirty_freq;
            var sixtyFreq=request.parameters.custpage_sixty_freq;
            var ninetyFreq=request.parameters.custpage_ninety_freq;
            var dRec=record.load({type:'customrecord_dunning',id:2});

                dRec.setValue({fieldId:'custrecord_d_amount',value:newAmount});
                dRec.setValue({fieldId:'custrecord_d_30_freq',value:thirtyFreq});
                dRec.setValue({fieldId:'custrecord_d_60_freq',value:sixtyFreq});
                dRec.setValue({fieldId:'custrecord_d_90_freq',value:ninetyFreq});
                dRec.save();
                    redirect.toTaskLink({
                            id:'CARD_-29',
                          })

        }
	}

        
        return {
            onRequest: onRequest
        }
    })