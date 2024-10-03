/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/runtime','N/record'],
    function (serverWidget, task, runtime, search, redirect, https,url,runtime,record) {

	    function onRequest(context) {
	    var request = context.request;
	    var response = context.response;
	    var currentUser=runtime.getCurrentUser();
	    var courses=[];
	    var paths=[];
	    var completes=[];
	    var links=[];
	    var ids=[];
          var ecds=[];
          var closedCourses=[];
          var closedPaths=[];
          var closedLinks=[];
          

	    if (request.method == 'GET') {
	    	//get the list of orders
	    	var customrecord_lpaSearchObj = search.create({
			   type: "customrecord_lpa",
			   filters:
			   [
			      ["custrecord_lpa_assigned","anyof",currentUser.id],
                 //"AND",
                 // ["custrecord_lpa_completed","is","F"]
			   ],
			   columns:
			   [
			      search.createColumn({
			         name: "custrecord_lpa_learning_path",
			         sort: search.Sort.ASC,
			         label: "Learning Path"
			      }),
			      search.createColumn({
			         name: "custrecord_lpc_course_order",
			         join: "CUSTRECORD_LPA_COURSE",
			         sort: search.Sort.ASC,
			         label: "Course Order"
			      }),
			      search.createColumn({
			         name: "custrecord_lpc_link",
			         join: "CUSTRECORD_LPA_COURSE",
			         label: "Link"
			      }),
			      search.createColumn({name: "custrecord_lpa_course", label: "Course"}),
			      search.createColumn({name: "custrecord_lpa_live_session", label: "Live Session"}),
			      search.createColumn({name: "custrecord_lpa_completed", label: "Completed?"}),
                  search.createColumn({name:'custrecord_lpa_completion_date',label:'Expected Completion Date'}),
			      search.createColumn({name: 'internalid'}),
			   ]
			});
			//var searchResultCount = customrecord_lpaSearchObj.runPaged().count;
			//log.debug("customrecord_lpaSearchObj result count",searchResultCount);
			customrecord_lpaSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results

				courses.push(result.getText({name:'custrecord_lpa_course'}));
				paths.push(result.getText({name:'custrecord_lpa_learning_path'}));
				completes.push(result.getValue({name:'custrecord_lpa_completed'}));
				links.push(result.getValue({name:'custrecord_lpc_link',join:'CUSTRECORD_LPA_COURSE'}));
				ids.push(result.getValue({name:'internalid'}));
                var thisDate=result.getValue({name:'custrecord_lpa_completion_date'});
                if(!thisDate)
                  thisDate=new Date();
                ecds.push(thisDate);

			   return true;
			});

          var customrecord_lpaSearchObj_closed = search.create({
			   type: "customrecord_lpa",
			   filters:
			   [
			      ["custrecord_lpa_assigned","anyof",currentUser.id],
                 "AND",
                  ["custrecord_lpa_completed","is","T"]
			   ],
			   columns:
			   [
			      search.createColumn({
			         name: "custrecord_lpa_learning_path",
			         sort: search.Sort.ASC,
			         label: "Learning Path"
			      }),
			      search.createColumn({
			         name: "custrecord_lpc_course_order",
			         join: "CUSTRECORD_LPA_COURSE",
			         sort: search.Sort.ASC,
			         label: "Course Order"
			      }),
			      search.createColumn({
			         name: "custrecord_lpc_link",
			         join: "CUSTRECORD_LPA_COURSE",
			         label: "Link"
			      }),
			      search.createColumn({name: "custrecord_lpa_course", label: "Course"}),
			      search.createColumn({name: "custrecord_lpa_live_session", label: "Live Session"}),
			      search.createColumn({name: "custrecord_lpa_completed", label: "Completed?"}),
                  search.createColumn({name:'custrecord_lpa_completion_date',label:'Expected Completion Date'}),
			      search.createColumn({name: 'internalid'}),
			   ]
			});
			//var searchResultCount = customrecord_lpaSearchObj.runPaged().count;
			//log.debug("customrecord_lpaSearchObj result count",searchResultCount);
			customrecord_lpaSearchObj_closed.run().each(function(result){
			   // .run().each has a limit of 4,000 results
                closedCourses.push(result.getText({name:'custrecord_lpa_course'}));
              closedLinks.push(result.getValue({name:'custrecord_lpc_link',join:'CUSTRECORD_LPA_COURSE'}));
              closedPaths.push(result.getText({name:'custrecord_lpa_learning_path'}));           
				

			   return true;
			});

			/*
			customrecord_lpaSearchObj.id="customsearch1698954882686";
			customrecord_lpaSearchObj.title="Custom Learning Paths Assigned Search (copy)";
			var newSearchId = customrecord_lpaSearchObj.save();
			*/


	    	//mark complete on completed
	    	var form=serverWidget.createForm({title:'Assigned Courses TEST'});
            var completedTab=form.addTab({id:'completedcourses',label:'Completed Courses'});
            var openTab=form.addTab({id:'opencourses',label:'Open Courses'});
	    	var allCourses=form.addSublist({id:'custpage_open_courses',label:'Open Courses',type:'list'});
	    		allCourses.addField({id:'custpage_link_id',label:'ID',type:'text'}).updateDisplayType({displayType:'hidden'});
	    		allCourses.addField({id:'custpage_paths',label:'Path',type:'text'});
	    		allCourses.addField({id:'custpage_courses',label:'Course',type:'text'});
	    		allCourses.addField({id:'custpage_links',label:'Link',type:'url'});//.updateDisplayType({displayType:'disabled'});
                allCourses.addField({id:'custpage_ecds',label:'Expected Completion Date',type:'date'});
	    		allCourses.addField({id:'custpage_completes',label:'Complete',type:'checkbox'});
         
          var cCourses=form.addSublist({id:'custpage_closed_courses',label:'Closed Courses',type:'list'});
              cCourses.addField({id:'custpage_c_courses',label:'Course',type:'text'});
              cCourses.addField({id:'custpage_c_links',label:'Links',type:'url'});
              cCourses.addField({id:'custpage_c_paths',label:'Path',type:'text'});
              
          
                
	    		
	    	for(var c=0;c<courses.length;c++)
	    	{
	    		allCourses.setSublistValue({id:'custpage_paths',line:c,value:paths[c]});
	    		allCourses.setSublistValue({id:'custpage_courses',line:c,value:courses[c]});
	    		allCourses.setSublistValue({id:'custpage_links',line:c,value:links[c]});
	    		allCourses.setSublistValue({id:'custpage_link_id',line:c,value:ids[c]});
                allCourses.setSublistValue({id:'custpage_ecds',line:c,value:ecds[c]});
	    		/*
	    		var checkedOrNo=completes[c];
	    		if(checkedOrNo)
	    			allCourses.setSublistValue({id:'custpage_completes',line:c,value:true});
	    		else
	    			allCourses.setSublistValue({id:'custpage_completes',line:c,value:false});
				*/
	    	}
          
          for(var cc=0;cc<closedCourses.length;cc++)
            {
              cCourses.setSublistValue({id:'custpage_c_courses',line:cc,value:closedCourses[cc]});
               cCourses.setSublistValue({id:'custpage_c_links',line:cc,value:closedLinks[cc]});
               cCourses.setSublistValue({id:'custpage_c_paths',line:cc,value:closedPaths[cc]});
            }
           
	    	form.addSubmitButton({label:'Mark Completed'});
            //form.addSubmitButton({label:'Press Here'});
	    	response.writePage(form);
        }
		else
		{
			//var completes=context.request.parameters.custpage_open_courses;
			var completes=context.request.getLineCount({group:'custpage_open_courses'});
			for(var c=0;c<completes;c++)
			{
				var isChecked=request.getSublistValue({group:'custpage_open_courses',name:'custpage_completes',line:c});
				if(isChecked)
				{
					var thisID=request.getSublistValue({group:'custpage_open_courses',name:'custpage_link_id',line:c});
					record.submitFields({
						type:'customrecord_lpa',
						id:thisID,
						values:{
							custrecord_lpa_completed:true
						},
					});
				}

			}
				redirect.toTaskLink({
			            id:'CARD_-29',
			          })
			
		}
	}

        
        return {
            onRequest: onRequest
        }
    })