/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record'], 
function(record){
    function onAction(scriptContext){
       try
       {


        var rec = scriptContext.newRecord;
        var howMany=rec.getLineCount({sublistId:'item'});
        var stopHere=0;
        	for(var hm=0;hm<howMany;hm++)
        	{
        		var whatLocation=rec.getSublistValue({sublistId:'item',fieldId:'location',line:hm});
        		if(whatLocation==19)
        			stopHere=1;
        	}

        return stopHere;
        }
        catch(err)
        {
            return 0;
        }
    }
    return {
        onAction: onAction
    }
});