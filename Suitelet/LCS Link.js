/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

//define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', './GEX_Common_Library', 'N/redirect','N/https','N/url'],
//    function (serverWidget, task, runtime, search, commonLibrary, redirect, https,url) {
define(['N/ui/serverWidget', 'N/task', 'N/runtime', 'N/search', 'N/redirect','N/https','N/url','N/runtime','N/record'],
    function (widget, task, runtime, search, redirect, https,url,runtime,record) {

	    function onRequest(context) {
	    var request = context.request;
	    var response = context.response;
	    var currentUser=runtime.getCurrentUser();
	    var courses=[];
	    var paths=[];
	    var completes=[];
	    var links=[];
	    var ids=[];

	    if (request.method == 'GET') {
	    	//get the list of orders
	    	var customrecord_lpaSearchObj = search.create({
			   type: "customrecord_lpa",
			   filters:
			   [
			      ["custrecord_lpa_assigned","anyof",currentUser.id]
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

			   return true;
			});

			/*
			customrecord_lpaSearchObj.id="customsearch1698954882686";
			customrecord_lpaSearchObj.title="Custom Learning Paths Assigned Search (copy)";
			var newSearchId = customrecord_lpaSearchObj.save();
			*/


	    	//mark complete on completed
	    	var form=widget.createForm({title:'Open Courses'});
	    	var allCourses=form.addSublist({id:'custpage_open_courses',label:'Assigned Courses',type:'list'});
	    		allCourses.addField({id:'custpage_link_id',label:'ID',type:'text'}).updateDisplayType({displayType:'hidden'});
	    		allCourses.addField({id:'custpage_paths',label:'Path',type:'text'});
	    		allCourses.addField({id:'custpage_courses',label:'Course',type:'text'});
	    		allCourses.addField({id:'custpage_links',label:'Link',type:'url'});//.updateDisplayType({displayType:'disabled'});
	    		allCourses.addField({id:'custpage_completes',label:'Complete',type:'checkbox'});
	    		
	    	for(var c=0;c<courses.length;c++)
	    	{
	    		allCourses.setSublistValue({id:'custpage_paths',line:c,value:paths[c]});
	    		allCourses.setSublistValue({id:'custpage_courses',line:c,value:courses[c]});
	    		allCourses.setSublistValue({id:'custpage_links',line:c,value:links[c]});
	    		allCourses.setSublistValue({id:'custpage_link_id',line:c,value:ids[c]});
	    		/*
	    		var checkedOrNo=completes[c];
	    		if(checkedOrNo)
	    			allCourses.setSublistValue({id:'custpage_completes',line:c,value:true});
	    		else
	    			allCourses.setSublistValue({id:'custpage_completes',line:c,value:false});
				*/
	    	}
	    	
	    	form.addSubmitButton('Mark Completed');
	    	response.writePage(form);
	    	//show next in line
	    	//yay
	    	/*
	    	redirect.redirect({
			url:'https://mylearn.oracle.com/netsuite/onboarding',
			parameters:{
				
			}
		});
		*/


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
			//var eDate=context.request.parameters.cust_end_date;
			//var delegate=context.request.parameters.cust_delegate;
			//var parameters=context.request.parameters
		}
	}

        
        return {
            onRequest: onRequest
        }
    })