function noFiles()
{

   try
   {

      var rec=nlapiGetRecordId();
     
      //alert('Total Files'+howManyFiles);
   //var rec=nlapiLoadRecord('journalentry',663876);
      var howManyFiles=nlapiGetLineItemCount('mediaitem');
      var grandTotal=nlapiGetFieldValue('total');
      var totalOver=false;
      if(grandTotal>10000)
         totalOver=true;
      var itemOver=false;
      var howMany=nlapiGetLineItemCount('item');
      for(var i=1;i<howMany+1;i++)
      {
         var thisLineTotal=nlapiGetLineItemValue('item','amount',i);
         if(thisLineTotal>1000)
            itemOver=true;
      }
      if(!totalOver && !itemOver)
         return true;
      //search by medit line item
      if(!rec)
      {
         var journalentrySearch = nlapiSearchRecord("journalentry",null,
         [
             
            ["count(file.internalid)","equalto","0"],
            "AND",
            ["internalid","is",rec],
         ], 
         [
            new nlobjSearchColumn("tranid",null,"GROUP"), 
            new nlobjSearchColumn("internalid","file","COUNT")
         ]
         );
         howManyFiles=journalentrySearch.getValue('internalid','file','COUNT');
      
      }
     
      
  
   if(howManyFiles>0)
   {
     nlapiSetFieldValue('custbody_no_files','F');
     return true;
   }
      
   var goodToSave=confirm('Purchase orders with items exceeding $1,000/unit or that exceed $10,000 in total cost are required to have an attached quote. Please attach a quote validating the costs included on the purchase order. Failure to attach a valid quote will trigger purchase approver notification.\n\nClick OK to Save. Click Cancel to Add a File.');
   //alert('You need to add an attachment. Failure to do so will inform your purchasing approver.');
   if(goodToSave)
   {
       nlapiSetFieldValue('custbody_no_files','T');
      return true;

   }
   else
      return false;
      
      //return false;
   //var dkdkd=99



   //return true;
   }
   catch(err)
   {
     return true;
   }


}
