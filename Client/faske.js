/**
 * @NApiVersion 2.1
 * @NAmdConfig /SuiteScripts/configuration.json
 */
define(['N/log', 'N/https', 'N/search', 'N/record', 'N/encode', 'N/runtime', 'goexpedi-common-module'], (log, https, search, record, encode, runtime, common) => {

  const cloudApiUrl = {
        PRODUCTION: {
            CREATE_ASSET: 'https://pou-service.k8s.us-east-1.prod.app.goexpedi.com/createAsset/',
            GET_EPC: 'https://pou-service.k8s.us-east-1.prod.app.goexpedi.com/generateEPC/',
            POU_ACTIVITY: ''
        },
        STAGING: {
            CREATE_ASSET: '',
            GET_EPC: '',
            POU_ACTIVITY: ''
        },
        DEV: {
            CREATE_ASSET: 'https://pou-service.k8s.us-east-1.dev.app.goexpedi.com/createAsset/',
            GET_EPC: 'https://pou-service.k8s.us-east-1.dev.app.goexpedi.com/generateEPC/',
            POU_ACTIVITY: ''
        }
    };
    
    const wmAuth = {
        PRODUCTION: {
            username: 'netsuite.pou',
            password: '@oExped!2021'
        },
        STAGING: {
            username: 'gregory.dodd',
            password: 'FEGw!o7PU@e^TV'
        },
        DEV: {
            username: 'gregory.dodd',
            password: 'i#njv3cFqkdxLS'
        }
    };
    //const pulsarAuthToken = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJneHBkLXN0YWdpbmctY2xpZW50LTVmYmQ1ZDhlM2RjZTcifQ.TucL8j3e5tNu0U-H4rSvnvdqf34onn1QajdR5-PSq7KlkZl_fwyht_zLvgZFrLtraSwVLddTh9zzmg0LxUM4Gpg0beOyYKgMpQ_Qt5DtnQimHtbYfrxt9ZN0WSC3WERxh_Ywtx4aaASUXhWAk_4yaQ7i5nA54vHkB5rua8ktNnuVXYfSPuuJ59CJsRJ1QyEOc3OHhzUm48Pwo7RsCufpm-Z5L4aBA9cdu45h3lp-9Ybi3RdNXN-C-KHBmlm_c0mAG3JMzVErwUgsmKD0gWzQ8cZZzhlBzMZ-NTut--h3uUtdI1rvCDe6oWS-wBGesl_VgHJe2iwTiMFaAd0FdxfJtg';
    const rainVueApiBaseUrl = 'https://goexpedi.rainvue.com/api';
    const RAINVUE_USERNAME = 'it@goexpedi.com';
    const RAINVUE_PASSWORD = 'Expedi*171*!';

    function getRainVueAuthToken() {
        log.debug('setRainVueAuthToken()');
        let existingTokenOrFalse = doesValidRainVueTokenExist();
        log.debug('setRainVuewAuthToken() existingTokenOrFalse', existingTokenOrFalse);
        if(!existingTokenOrFalse) {
            log.debug('existingTokenOrFalse() Existing Token does NOT exist');
            return generateRainVueAuthToken();
        }
        log.debug('existingTokenOrFalse() Existing Token exists');
        return existingTokenOrFalse;
    }

    function doesValidRainVueTokenExist() {
        var customrecord_rainvue_auth_tokenSearchObj = search.create({
            type: "customrecord_rainvue_auth_token",
            filters:
            [
                ["formulanumeric: CASE WHEN ({now} - {created}) * 24 <=  2 THEN 1 ELSE 0 END","equalto","1"]
            ],
            columns:
            [
               "custrecord_rainvue_auth_token"
            ]
         });
         var searchResultCount = customrecord_rainvue_auth_tokenSearchObj.runPaged().count;
         log.debug("customrecord_rainvue_auth_tokenSearchObj result count",searchResultCount);
         if(searchResultCount < 1) {
             return false;
         }
         var searchResults = customrecord_rainvue_auth_tokenSearchObj.run().getRange({start: 0, end: 1});
         log.debug('customrecord_rainvue_auth_tokenSearchObj searchResults', searchResults);
         var searchResultToken = searchResults[0].getValue({
            name: 'custrecord_rainvue_auth_token'
          });
          log.debug('searchResultToken', searchResultToken);
          return searchResultToken;
    }

    function generateRainVueAuthToken() {
        log.debug('generateRainVueAuthToken() started')
        const rainVueBodyObj = {
            userName: RAINVUE_USERNAME,
            password: RAINVUE_PASSWORD
        }
        log.debug('generateRainVueAuthToken() rainVueBodyObj', rainVueBodyObj);
        let headers = [];
        headers['Content-Type'] = 'application/json';
        const rainVueResponse = https.request({
            url: rainVueApiBaseUrl + '/Auth/login',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(rainVueBodyObj)
        });
        log.debug('generateRainVueAuthToken() rainVueResponse', rainVueResponse);
        if(rainVueResponse.code === 200) {
            const responseBodyObj = JSON.parse(rainVueResponse.body);
            const rainVueAuthTokenRecId = createRainVueAuthTokenRecord(responseBodyObj.auth_token);
            log.debug('rainVueAuthTokenRecId', rainVueAuthTokenRecId);
            return responseBodyObj.auth_token;
        }

        return null;
    }

    function createRainVueAuthTokenRecord(token) {
        let rainVueTokenRec = record.create({
            type: 'customrecord_rainvue_auth_token',
            isDynamic: true
        });

        rainVueTokenRec.setValue({
            fieldId: 'custrecord_rainvue_auth_token',
            value: token
        });
        log.debug('createRainVueAuthTokenRecord() token', token);
        return rainVueTokenRec.save();
    }

    function createPouAsset(dataObj) {
        const wmAuthObj = getWebMethodsAuth();
        const currentEnvironment = common.isProduction() ? 'PRODUCTION' : 'STAGING';
        const apiUrl = getWebMethodsUrl('CREATE_ASSET', currentEnvironment);
        var base64AuthString = encode.convert({
            string: wmAuthObj.username + ':' + wmAuthObj.password,
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64_URL_SAFE
        });
        log.debug('postToPulsar() dataObj', dataObj);
        let headers = [];
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = 'Basic ' + base64AuthString;
        headers['Accept'] = '*/*';

        return https.request.promise({
            url: apiUrl,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dataObj)
        });
    }

    function requestEPCCodesFromCloud(dataObj) {
        const wmAuthObj = getWebMethodsAuth();
        const currentEnvironment = common.isProduction() ? 'PRODUCTION' : 'STAGING';
        const apiUrl = getWebMethodsUrl('GET_EPC', currentEnvironment);
        
        var base64AuthString = encode.convert({
            string: wmAuthObj.username + ':' + wmAuthObj.password,
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64_URL_SAFE
        });
        log.debug('requestEPCCodesFromCloud() dataObj', dataObj);
        let headers = [];
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = 'Basic ' + base64AuthString;
        headers['Accept'] = '*/*';

        return https.request.promise({
            url: apiUrl,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dataObj)
        });
    }


    function getPouActivity(dateString, locationCode = '00002', activityDetail = 'item') {
        /*
            * Additional parameters are available: sublocationCode, consumableActivity, employeeActivity, durableActivity
            * Removed as we are not using them and they are causing complications for the calling scripts.
         */
        let headers = [];
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = 'Bearer ' + getRainVueAuthToken();
        const rainVueResponse = https.request({
            url: `${rainVueApiBaseUrl}/PouActivity/GetSince?startDateTime=${dateString}&locationCode=${locationCode}&activityDetail=${activityDetail}`,
            method: 'GET',
            headers: headers
        });
        log.debug('getPouActivity() rainVueResponse', rainVueResponse);
        if(rainVueResponse.code === 200) {
            log.debug('typeof rainVueResponse.body', typeof JSON.parse(rainVueResponse.body));
            let rainVueResponseContent = JSON.parse(rainVueResponse.body);
            if(typeof JSON.parse(rainVueResponse.body) === 'object') {
                log.debug('pouActivity length', `Received ${rainVueResponseContent.length} POU Activities from RainVue.`)
            }
            log.debug('rainVueResponseContent', rainVueResponseContent);
            return JSON.stringify(rainVueResponseContent);
        }
        log.error('Error when getting RainVue POU Activity', error);
    }

    function getEpcCodes(location, quantity) {
        log.debug('getEpcCodes() started');
        if(runtime.envType === runtime.EnvType.SANDBOX) {
            location = '00001';
        }
        const rainVueBodyObj = {
            locationCode: location,
            number: quantity
        }
        log.debug('getEpcCodes() rainVueBodyObj', rainVueBodyObj);
        let headers = [];
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = 'Bearer ' + getRainVueAuthToken();
        const rainVueResponse = https.request({
            url: `${rainVueApiBaseUrl}/epc/requestcodesasync`,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(rainVueBodyObj)
        });
        if(rainVueResponse.code === 200) {
            const responseBody = rainVueResponse.body;
            log.debug('typeof responseBody', typeof responseBody);
            log.debug('responseBody', responseBody);
            const decodedString = getDecodedEpcString(JSON.parse(responseBody));
            return getEpcsFromDecodedString(decodedString);
        }

        return null;


    }

    function getDecodedEpcString(epcString) {
        log.debug('getDecodedEpcString start', epcString);
        return encode.convert({
            string: epcString,
            inputEncoding: encode.Encoding.BASE_64_URL_SAFE,
            outputEncoding: encode.Encoding.UTF_8
        });
    }

    function getEpcsFromDecodedString(decodedString) {
        log.debug('getEpcsFromDecodedString() started');
        let responseStringArray = decodedString.split('\r\n');
        let listOfEpcs = responseStringArray.map((x) => {
            let epcArray = x.split('\t');
            return {
                epc_hex: epcArray[0],
                epc: epcArray[1],
                creation_datetime: epcArray[2]
            }
        });
        log.debug('listOfEpcs', listOfEpcs);
        return listOfEpcs;
    }

    function convertStringToEPC(epcString) {
        log.debug('convertStringToEPC() started');
        const decodedEPCString = getDecodedEpcString(epcString);
        let epcCodes = getEpcsFromDecodedString(decodedEPCString);
        epcCodes.pop();
        return epcCodes;
    }

    function getWebMethodsUrl(type, environment) {
        return cloudApiUrl[environment][type];
    }

    function getWebMethodsAuth() {
        if(!common.isProduction()) {
            return wmAuth.STAGING
        }
        return wmAuth.PRODUCTION;
    }

    return {
        convertStringToEPC,
        createPouAsset,
        getPouActivity,
        getRainVueAuthToken,
        getEpcCodes,
        requestEPCCodesFromCloud
    }
});
Copied