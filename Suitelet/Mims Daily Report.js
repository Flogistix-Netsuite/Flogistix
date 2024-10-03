/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url'],
    function (serverWidget, task, runtime, search, redirect, https,url) {

        function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method == 'GET') {
            var form=serverWidget.createForm({title:'Call Report'});
            var fromDateRange=form.addField({id:'custpage_from_date_range',label:'From Range',type:'date'});
            var toDateRange=form.addField({id:'custpage_to_date_range',label:'To Range',type:'date'});
            var listTab=form.addTab({id:'calltab',label:'Calls'});
            var sub=form.addSublist({id:'custpage_calls',label:'Calls',tab:'calltab',type:'list'});
                sub.addField({id:'custpage_viewrecord',label:'View',type:'textarea'}).updateDisplayType({displayType:'INLINE'});
             //   var ulrField=sub.addField({id:'custpage_viewrecord',label:'View',type:serverWidget.FieldType.URL});
             //   ulrField.linkText='View';
               
                sub.addField({id:'custpage_subject',label:'Subject',type:'text'});
                sub.addField({id:'custpage_organizer',label:'Organizer',type:'text'});
                sub.addField({id:'custpage_company',label:'Company',type:'text'});
                sub.addField({id:'custpage_apptype',label:'App Type',type:'text'});
                sub.addField({id:'custpage_area',label:'Area',type:'text'});
                sub.addField({id:'custpage_meetingtype',label:'Meeting Type',type:'text'});
                sub.addField({id:'custpage_presented_material',label:'Material Presented',type:'text'});
                sub.addField({id:'custpage_call_result',label:'Result',type:'text'});
                //sub.addField({id:'custpage_comments',label:'Sales Comments',type:'text'});
                sub.addField({id:'custpage_notes',label:'Notes',type:'text'});
                var mNotes=sub.addField({id:'custpage_mims_notes',label:'Supervisor Comments',type:'textarea'});
                sub.addField({id:'custpage_attachments',label:'Attachments',type:'textarea'});
                mNotes.updateDisplayType({displayType:serverWidget.FieldDisplayType.ENTRY});
            //run search for first pass of values
            var foundIds=[];
           
            var s=search.load({id:'customsearch12364'});
            var sResults=s.run().getRange({
                start:0,
                end:500
            });
            for(var ss=0;ss<50;ss++)
            {
                foundIds.push(sResults[ss].getValue({name:'internalid'}));
            }
            var callIds=[];
            var callAttachments=[];
            var attaches=getAttachments(foundIds,callIds,callAttachments);
            var idsWithAttachments=attaches.uniques;
            var attachmentsFound=attaches.uniAttachments;
            for(var ss=0;ss<50;ss++)
            {
                
                var recordURL=url.resolveRecord({
                    recordType:'phonecall',
                    recordId:sResults[ss].getValue({name:'internalid'}),

                });

                var thisSubject=sResults[ss].getValue({name:'title'});
                if(!thisSubject)
                    thisSubject=' ';

                var thisOrganizer=sResults[ss].getText({name:'assigned'});
                if(!thisOrganizer)
                    thisOrganizer=' ';

                var thisCompany=sResults[ss].getText({name:'company'});
                if(!thisCompany)
                    thisCompany=' ';

                var thisApp=sResults[ss].getText({name:'custevent_application_type'});
                if(!thisApp || thisApp.length==0)
                    thisApp=' ';
                    
                var thisArea=sResults[ss].getText({name:'custevent_area_name'});
                if(!thisArea || thisArea.length==0)
                    thisArea=' ';

                var thisMeeting=sResults[ss].getText({name:'custevent_meeting_type'});
                if(!thisMeeting)
                    thisMeeting=' ';

                var thisMaterial=sResults[ss].getText({name:'custevent_presenting_material'});
                if(!thisMaterial)
                    thisMaterial=' ';

                var thisResult=sResults[ss].getText({name:'custevent_call_result'});
                if(!thisResult)
                    thisResult=' ';

                var thisComment=sResults[ss].getText({name:'message'});
                if(!thisComment)
                    thisComment=' ';

                var thisNote=sResults[ss].getValue({name:'custevent_internal_notes'});
                if(!thisNote)
                    thisNote=' ';

                var thisMim=sResults[ss].getValue({name:'custevent_follow_up_notes'});
                if(!thisMim)
                    thisMim=' ';
                var attachy=null;
                var anyAttachments=idsWithAttachments.indexOf(sResults[ss].getValue({name:'internalid'}))
                if(anyAttachments!=-1)
                    attachy=attachmentsFound[anyAttachments];

                sub.setSublistValue({id:'custpage_viewrecord',line:ss,value:'<a target="_blank" href="'+recordURL+'">'+'View'+'</a>'});
                //sub.setSublistValue({id:'custpage_viewrecord',line:ss,value:recordURL});
                //
                //sub.setSublistValue({id:'custpage_viewrecord',line:ss,value:"'https://3431133-sb1.app.netsuite.com"+recordURL});
                //sub.setSublistValue({id:'custpage_viewrecord',line:ss,value:'http://google.com'})
                sub.setSublistValue({id:'custpage_subject',line:ss,value:thisSubject});
                sub.setSublistValue({id:'custpage_organizer',line:ss,value:thisOrganizer});
                sub.setSublistValue({id:'custpage_company',line:ss,value:thisCompany});
                sub.setSublistValue({id:'custpage_apptype',line:ss,value:thisApp});
                sub.setSublistValue({id:'custpage_area',line:ss,value:thisArea});
                sub.setSublistValue({id:'custpage_meetingtype',line:ss,value:thisMeeting});
                sub.setSublistValue({id:'custpage_presented_material',line:ss,value:thisMaterial});
                sub.setSublistValue({id:'custpage_call_result',line:ss,value:thisResult});
              //  sub.setSublistValue({id:'custpage_comments',line:ss,value:thisComment});
                sub.setSublistValue({id:'custpage_notes',line:ss,value:thisNote});
                sub.setSublistValue({id:'custpage_mims_notes',line:ss,value:thisMim});
                sub.setSublistValue({id:'custpage_attachments',line:ss,value:attachy});
            }

            



            response.writePage(form);



        }
    }
    function getAttachments(ids,callIds,callAttachments)
    {
       // var findThese=ids.split(',');
        var phonecallSearchObj = search.create({
           type: "phonecall",
           filters:
           [
              ['internalid','anyof',ids],
              "AND",
              ["file.internalid","noneof","@NONE@"]
           ],
           columns:
           [
              search.createColumn({name: "internalid", label: "Internal ID"}),
              search.createColumn({name: "internalid",join: "file",label: "Internal ID"}),
              search.createColumn({name:'name',join:'file',label:'name'}),
              search.createColumn({name:'url',join:'file',label:'url'})
           ]
        });
        var crIds=[];
        var crAttachments=[];
        var crURLs=[];
        var crNames=[];
        var uniques=[];
        var uniAttachments=[];
        var searchResultCount = phonecallSearchObj.runPaged().count;
        log.debug("phonecallSearchObj result count",searchResultCount);
        phonecallSearchObj.run().each(function(result){
            crIds.push(result.getValue({name:'internalid'}));
            crAttachments.push(result.getValue({name:'internalid',join:'file'}));
            crURLs.push(result.getValue({name:'url',join:'file'}));
            crNames.push(result.getValue({name:'name',join:'file'}));
            var uniqueIndex=uniques.indexOf(result.getValue({name:'internalid'}));
            if(uniqueIndex==-1)
            {
                uniques.push(result.getValue({name:'internalid'}));
                uniAttachments.push(null);
            }
           // .run().each has a limit of 4,000 results
           return true;
        });

        //var updatedIds=[];
        
        for(var u=0;u<uniques.length;u++)
        {
            var currentLine=null;
            var findMe=uniques[u];
            for(var c=0;c<crIds.length;c++)
            {
                var thisOne=crIds[c];
                if(thisOne==findMe)
                {
                   /* var recordURL=url.resolveRecord({
                        recordType:'file',
                        recordId:crAttachments[c],
                    });
                    */
                    if(!currentLine)
                        currentLine='<a target="_blank" href="'+crURLs[c]+'">'+crNames[c]+'</a>';
                    else
                        currentLine=currentLine+' <a target="_blank" href="'+crURLs[c]+'">'+crNames[c]+'</a>';
                   
                }
            }
            uniAttachments[u]=currentLine;
        }
        return {
            uniques:uniques,
            uniAttachments:uniAttachments
        }
        
    }

        
        return {
            onRequest: onRequest
        }
    })