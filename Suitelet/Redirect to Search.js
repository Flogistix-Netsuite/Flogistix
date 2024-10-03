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
        	redirect.url({
        		url:'https://3431133-sb1.app.netsuite.com/app/common/search/searchresults.nl?searchtype=Call&dle=T&style=NORMAL&sortcol=Call_CREATEDDATE_raw&sortdir=DESC&csv=HTML&OfficeXML=F&pdf=&size=150&_csrf=kYnXcAZQpmS9tbm6rPMmobTpUSb4mPiI_Y5pW1UPm_CkixdcKtolxubDhF0AoPCpe6sxy7tJgN4TJDd7XY-p_lv3viEwASf1eYQWpREuMxfFwVduEt7mNNhEJmAy63SU9UlhVfGQxgYZHFs30Kfp_HgszBe2gwQT6T9ZJ_en3O8%3D&twbx=F&report=&grid=&searchid=12364&dle=&segment='
        	})

		}
	}

        
        return {
            onRequest: onRequest
        }
    })