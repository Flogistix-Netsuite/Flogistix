/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime','N/sftp','N/format'], 
	function(file, record, search,runtime,sftp,format) {
		function execute(options){ 
				var FILE_ID = 20; 
				var SEARCH_ID = 19;
				function execute(scriptContext) {
				var searchTask = task.create({
				taskType: task.TaskType.SEARCH
				});
				searchTask.savedSearchId = SEARCH_ID;
				searchTask.fileId = FILE_ID;
				var searchTaskId = searchTask.submit();
				/*
          var thisDate=null;
          var  fileDate=null;
          var scriptObj=runtime.getCurrentScript();

         // var savedSearch=scriptObj.getParameter({name:''});
         // var savedTitle=scriptObj.getParameter({name:''});
          var thisSearch=search.load('customsearch_tcc_payments_2');
          var headers=null;
          var thisSearchColumns=thisSearch.columns;
          for(var t=0;t<thisSearchColumns.length;t++)
          {
          	if(!headers)
          		headers=thisSearchColumns[t].label
          	else
          		headers=headers+','+thisSearchColumns[t].label
          }
          headers=headers+'\n';

          thisSearch.run().each(function(result){
          	var line=result.columns;
          	for(var l=0;l<line.length;l++)
          	{
          		var breakLine=line[l];
          		headers=headers+line[l]+'\n';
          		/*
          		var breakSplit=breakLine.split(',');
          		for(var b=0;b<breakSplit.length;b++)
          		{
          			if(b==0)
          				headers=headers+breakSplit[b];
          			else
          				headers=headers+','+breakSplit
          		}
          		*/
        //  	}
         // 	return true;
         // })

      /*    var newFile=file.create({
				name:'VISA SFTP '+fileDate+'.csv',
				fileType:'CSV',
				contents:headers,
				folder:936805,

			});

          var newFile1=newFile.save();
	*/

          //var headers='PO,Flow,Date,ItemDescription,Sku,SerialNumber,Carrier,ShipmentTrackingNumber,ShipDate\n';

			//var headers='P._O._#;Date;SHIP_FIRST_NAME;SHIP_LAST_NAME;SHIP_TO_ADDRESS_1;SHIP_TO_ADDRESS_2;SHIP_TO_CITY;SHIP_TO_STATE;SHIP_ZIP;SHIP_COUNTRY;PHONE;ITEM_DESCRIPTION;SKU;QTY\n'
		/*	var salesorderSearchObj = search.create({
			   type: "salesorder",
			   filters:
			   [
			      ["customer.custentitycustomer_flow","isnotempty",""], 
			      "AND", 
			      ["item.class","anyof","7","8","3"], 
			      "AND", 
			      ["type","anyof","SalesOrd"], 
			      "AND", 
			      ["location","anyof","1"], 
			      "AND", 
			      ["status","anyof","SalesOrd:B"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "otherrefnum", label: "PO/Check Number"}),
			      search.createColumn({name: "datecreated", label: "Date"}),
			      search.createColumn({name: "shipaddressee", label: "Shipping Attention"}),
			      search.createColumn({name: "shipaddress1", label: "Shipping Address 1"}),
			      search.createColumn({name: "shipaddress2", label: "Shipping Address 2"}),
			      search.createColumn({name: "shipcity", label: "Shipping City"}),
			      search.createColumn({name: "shipstate", label: "Shipping State/Province"}),
			      search.createColumn({name: "shipzip", label: "Shipping Zip"}),
			      search.createColumn({name: "shipcountry", label: "Shipping Country"}),
			      //search.createColumn({name: "shipphone", label: "Shipping Phone"}),
                 search.createColumn({
         name: "formulatext",
         formula: "nvl({shipphone},{customer.phone})",
         label: "Formula (Text)"
      }),
			      search.createColumn({name: "memo", label: "Memo"}),
			      search.createColumn({name: "item", label: "Item"}),
			      search.createColumn({name: "quantity", label: "Quantity"})
			   ]
			});
			var searchResultCount = salesorderSearchObj.runPaged().count;
          
			log.debug("salesorderSearchObj result count",searchResultCount);
			salesorderSearchObj.run().each(function(result){
                var columns=result.columns;
				var thisPO=result.getValue({name:'otherrefnum'});
              if(!thisPO)
                return true;
				var thisDateaa=result.getValue({name:'datecreated'});
              var thisDatea=new Date(thisDateaa)
              thisDate=thisDatea.getFullYear()+'-'+addZeros(thisDatea.getMonth()+1,2)+'-'+addZeros(thisDatea.getDate(),2)+' '+addZeros(thisDatea.getHours(),2)+':'+addZeros(thisDatea.getMinutes(),2)+':'+addZeros(thisDatea.getSeconds(),2);
              fileDate=thisDatea.getFullYear()+'-'+addZeros(thisDatea.getMonth()+1,2)+'-'+addZeros(thisDatea.getDate(),2)+' '+addZeros(thisDatea.getHours(),2)+addZeros(thisDatea.getMinutes(),2)+addZeros(thisDatea.getSeconds(),2);
   
                //var thisDate=format.format({value:thisDatea,type:'date'})
				var thisAttention=result.getValue({name:'shipaddressee'});
                var names=thisAttention.split(' ');
                var fName=names[0];
                var lNames=null;
                for(var l=1;l<names.length;l++)
                  {
                    if(!lNames)
                      lNames=names[l];
                    else
                      lNames=lNames+' ' +names[l];
                  }
                if(!lNames)
                  lNames=fName;
				var thisAddress1=result.getValue({name:'shipaddress1'});
				var thisAddress2=result.getValue({name:'shipaddress2'});
				var thisAddressCity=result.getValue({name:'shipcity'});
				var thisAddressState=result.getValue({name:'shipstate'});
				var thisAddressZip=result.getValue({name:'shipzip'});
				var thisAddressCountry=result.getValue({name:'shipcountry'});
				var thisAddressPhone1=result.getValue(columns[9]);
                var thisAddressPhone=thisAddressPhone1.replace(/[^0-9]/gi,'');
				var thisItemDescription1=result.getValue({name:'memo'});
              var thisItemDescription=thisItemDescription1.replace(/,/gi,'');
				var thisItem=result.getText({name:'item'});
                var isItemNumber=isNaN(thisItem)
              if(isItemNumber)
                return true;
              //var isItemNumber=Number(thisItem)
                if(Number(thisItem))
				var thisQuantity=result.getValue({name:'quantity'});
				headers=headers+thisPO.toString()+';'+thisDate+';'+fName+';'+lNames+';"'+thisAddress1+'";"'+thisAddress2+'";'+thisAddressCity+';'+thisAddressState+';'+thisAddressZip+';'+thisAddressCountry+';'+thisAddressPhone+';"'+thisItemDescription+';"'+thisItem+';'+thisQuantity+'\n'
			   // .run().each has a limit of 4,000 results
			   return true;
			});

			var newFile=file.create({
				name:'VISA SFTP '+fileDate+'.csv',
				fileType:'CSV',
				contents:headers,
				folder:936805,

			});
          var newFile1=newFile.save();

			/*
			salesorderSearchObj.id="customsearch1702582943713";
			salesorderSearchObj.title="royaltek orders to send do not erase (copy)";
			var newSearchId = salesorderSearchObj.save();
			*/


/*
			 //var myHostKey='AAAAB3NzaC1yc2EAAAADAQABAAACAQCUEhUh36B4/TMCCNjZ+SdFOeBmYOTK97vFXd7tGKmi5NoJ/iIwfkvS7jyW36RfY92cp3O0sjXtT2df+aUCEIuL/k/4WvwDoWhGuMMQYEd7YnlN3x/KXPQSf/2i4ee9zhe7DkprN08jy0bDGxEOTcAp18j2p6sAfZD1dBDsqXTyNfyGD5Rf/lpBWoW49CTB/l6QZPLN8upEA7yIFMGu/52MqcOK3b2W7+5zQdh4cZkb0kUzitFTGMTfijkZYhdexcErxrVZirAx77NHZ5SrmjRuV6iqqMtMmxSXS1S6SgSTOVCFxofk47quylygcgh59Rsm9rE+m1w3UksRslbCXxNG0TBKWt5l1rPT8Zditlg8BQI3Wayer6Hnt4EKKUrIp5IpbTbLxsCh572RsBufoRsqHdvFDOgmFVkA1K8awugCiOoHcNXfLYcDzDqEePsq5pgQNM52kFRvFjOi5rF5iBxAP0VDHM1lq0KXtq4zZiQfs/uwht5P50odIuzKfhCLlsRlGiZoEZQBMHeOLKFYdr34r8aIYm4Yn8ThfkLaSBV0yHyrBrWLYe81pZ7HKqeKtMK9QP43HtGiHLWgp8oLxJc4qk3aRevxQaCgEdTnokhKUZ4m80APRQqMpteLI++CMns4LcZqD21X/Rl2pB2KeK8t7YscsoAkc9wKlGQvtjWYUQ=='
      		var myHostKey='AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBNrdcVT12fftnDcjYL8K3zLX3bdMwYLjNu2ZJ1kUZwpVHSjNc+1KWB2CGHca+cMLuPSao4TxjIX0drn9/o+GHMQ='
		   var objConnection = sftp.createConnection({
	        username: 'halostorageforftp.test-larry.rodney',
	        passwordGuid: 'e05ed245474747b1a160547271e40d9f',// e1256915382348f1b552815a41a3916c
	        //keyId:'custkey_key',
	        url: 'halostorageforftp.blob.core.windows.net',
	        port:22,
	        directory:'orders/input',//orders-royaltek-export
	        hostKey: myHostKey,
            hostKeyType: 'rsa'
	    	}); 
		   //var thisFile=file.load({id:18});
		   var dfdfd=99;
		   objConnection.upload({
		   	file:newFile
		   });

		   //objConnection.makeDirectory({
		   //	path:'processed'
		   //});
		   /*
		   var listy=objConnection.list({});
		   for(var l=0;l<listy.length;l++)
		   {
		   	var thisFile=objConnection.download({
		   		filename:listy[l].name,
		   	})
		   	thisFile.folder=1699;
		   thisFile.save();
		   objConnection.move({
		   	from:'orders',
		   	to:'processed'
		   });
		   
		   }
		   */

		   var dkdkdk=99;

		}
      function addZeros(num,len){
  var str=num.toString();
  while(str.length<len){str='0'+str;}
  return str;
}

	return {//36c093ad88354bb8996b405270775ae6
		execute  : execute
	};
})