/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record'], 
function(record){
    function onAction(scriptContext){
       
        var rec = scriptContext.newRecord;
        var howMany=rec.getLineCount({sublistId:'item'});
        var stopHere=0;
        	for(var hm=0;hm<howMany;hm++)
        	{
        		var hasErd=rec.getSublistValue({sublistId:'item',fieldId:'custcol_custom_erd',line:hm});
        		if(!hasErd)
        			stopHere=1;
        	}

        return stopHere;
    }
    return {
        onAction: onAction
    }
});