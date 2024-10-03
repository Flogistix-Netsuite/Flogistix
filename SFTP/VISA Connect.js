/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
*/
// This example creates a saved search on the salesorder record
define(['N/file','N/record', 'N/search','N/runtime','N/sftp'], 
	function(file, record, search,runtime,sftp) {
		function execute(options){  

			//var FILE_ID = '2462161'; 
            var SEARCH_ID = 89493;
            var newFile=file.create({name:'VISA SFTP '+fileDate+'.csv',fileType:'CSV',contents:headers,folder:936805});
            var newFileId=newFile.save();

            var searchTask = task.create({
                  taskType: task.TaskType.SEARCH
               });
               searchTask.savedSearchId = SEARCH_ID;
               searchTask.fileId = newFileId;
            var newFile=searchTask.submit();

            var loadNewFile=file.load({id:newFileId});
			var myHostKey='AAAAB3NzaC1yc2EAAAADAQABAAABgQC66UG8NTaBizby6XrnNsK3F0SxF7Ru4x8QNDPGqQQA/SWpuNEX7o8B3imOTQP4yRgaQNcyoiNyxMKYy6WhnLqPt/LbjHVMqvsaJXH/WwoaKYEPafQWCNXro578duhIllQnNTDaBmaF5ZXlERu/C7cXrYWlzkXHlvcML+uvtqSbNY+gwg7aiqatm6OS1pVSb5VB4Mnj1QKNEOpwiQSm2xKq9rG17cnD+awzFUyY14cbHlZ5fSnxASX9LcakjLYlQh+KOzNUtxT9Mrkl74B+FtMATHhjesBo0McFX+C4iDZ5YE53zXPs6psEObNu2Wmkv/Q1mYD2dgggHESnl8VhZcnpOc1jHZx/xoU3UNa57Ta0c8sxp0JcCUJsdZFaknqTvehku6Qd1crduYzNsUTrvb8pp801l7IW9xsY5bCtEO7COI5/n6GYIUCrVELQ3HjpoBLjdEA9q0erWvpdt1EC4EsTrcwO63767AKb7F7vdp2QpAsgI0TS/fKSQaP/jwRECIU=';
	        var objConnection = sftp.createConnection({
                   username: 'ns-sftp',
                   //passwordGuid: '477678ef5d1e44ab9e313dac024f57c8',
                   keyId:'custkey_visa_sftp',
                    url: 'asftp.flogistix.com',
                    port:22,
                    directory:'/',
                    hostKey: myHostKey,
                   // hostKeyType:'rsa'
                });
	        var dfdfd=99;

	           
	                objConnection.upload({
	                   // directory: '/pick',
	                    //filename:waveNumber+'.TXT',
	                    file: loadNewFile,
	                    replaceExisting: true
	                });

	        loadNewFile.folder=936806;
	        loadNewFile.save();

	                 
				
		}
	return {
		execute  : execute
	};
})