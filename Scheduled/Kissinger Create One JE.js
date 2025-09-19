/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */

define(["N/https", "N/record", "N/log", "N/runtime", "N/search"], (
  https,
  record,
  log,
  runtime,
  search
) => {
  

  const managerPlusGet = (endpoint, params = "") => {
    try {
       var API_KEY=null;
  var BASE_URL=null;
        if (runtime.envType== "SANDBOX") {
				API_KEY = "f2d1dc5133ef4244b00c66fb2eba0131-11";
                BASE_URL = "https://estiscompressionsb.managerpluscloud.com/api2/";
				}
			if(runtime.envType== "PRODUCTION"){		
				API_KEY = "94719d6024a9476bb6d2e98dddc97f38-5";
                BASE_URL = "https://estiscompression.managerpluscloud.com/api2/";                 
			}
      const url = `${BASE_URL}/${endpoint}?${params}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      };

      let response = https.get({
        url: url,
        headers: headers,
      });

      if (response.code === 200) {
        return JSON.parse(response.body);
      } else {
        log.error(
          "MP API Error",
          `Endpoint: ${endpoint}, Response Code: ${response.code}, Body: ${response.body}`
        );
        return null;
      }
    } catch (e) {
      log.error("MP API Error Exception", e.message);
      return null;
    }
  };

  const managerPlusPatch = (endpoint, data = "") => {
    try {
       var API_KEY=null;
  var BASE_URL=null;
        if (runtime.envType== "SANDBOX") {
				API_KEY = "f2d1dc5133ef4244b00c66fb2eba0131-11";
                BASE_URL = "https://estiscompressionsb.managerpluscloud.com/api2/";
				}
			if(runtime.envType== "PRODUCTION"){		
				API_KEY = "94719d6024a9476bb6d2e98dddc97f38-5";
                BASE_URL = "https://estiscompression.managerpluscloud.com/api2/";                 
			}
      const intermediaryUrl =
        "https://pennsupport.pairsite.com/forward_patch_ns_to_mp.php";
      const targetUrl = `${BASE_URL}/${endpoint}`;
      log.debug("Intermediary Pennsupport url: ", intermediaryUrl);
      log.debug("update mp url: ", targetUrl);
      log.debug("data: ", JSON.stringify(data));
      const requestBody = {
        targetUrl: targetUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        data: data,
      };

      log.debug(
        "Intermediary Pennsupport Request Body",
        JSON.stringify(requestBody)
      );

      // Send request to the PHP script
      const response = https.request({
        method: https.Method.POST,
        url: intermediaryUrl,
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      log.debug("MP API Response Code: ", response.code);
      log.debug("MP API Response Body: ", response.body);

      if (response.code >= 200 && response.code < 300) {
        return JSON.parse(response.body);
      } else {
        log.error(
          "MP API Post Error",
          `Endpoint: ${endpoint}, Response Code: ${response.code}, Body: ${response.body}`
        );
        return null;
      }
    } catch (e) {
      log.error("MP API Post Error Exception", e.message);
      return null;
    }
  };

  function getAccountInternalId(accountName) {
    var accountId = null;
    var accountSearch = search.create({
      type: search.Type.ACCOUNT,
      filters: [["name", "is", accountName+' - Estis']],
      columns: ["internalid"],
    });

    accountSearch.run().each(function (result) {
      accountId = parseInt(result.getValue({ name: "internalid" }));
      log.debug("Account Internal ID", accountId);

      return true;
    });
    return accountId;
  }

  function getAccountInternalIdForDebit(accountNumber) {
    var accountId = null;
    var accountSearch = search.create({
      type: search.Type.ACCOUNT,
      filters: [["number", "is", accountNumber+ ' - Estis']],
      columns: ["internalid"],
    });

    accountSearch.run().each(function (result) {
      accountId = parseInt(result.getValue({ name: "internalid" }));
      log.debug("Account Internal ID", accountId);

      return true;
    });
    return accountId;
  }

  function getJournalEntryTranId(journalEntryId) {
    const journalEntryRecord = record.load({
      type: record.Type.JOURNAL_ENTRY,
      id: journalEntryId,
    });

    const tranid = journalEntryRecord.getValue({
      fieldId: "tranid",
    });
    log.debug("TranID: " + tranid);

    return tranid;
  }

  // function getSubsidiaryInternalId(subsidiaryName) {
  //     var accountId = null;
  //     var accountSearch = search.create({
  //       type: search.Type.SUBSIDIARY,
  //       filters: [["name", "is", subsidiaryName]],
  //       columns: ["internalid"],
  //     });

  //     accountSearch.run().each(function (result) {
  //       accountId = parseInt(result.getValue({ name: "internalid" }));
  //       log.debug("Account Internal ID", accountId);

  //       return true;
  //     });
  //     return accountId;
  //   }

  function getAreaInternalId(areaName) {
    var areaId = null;
    log.debug("Area name", areaName);

    var areaSearch = search.create({
      type: search.Type.CUSTOM_RECORD + "_cseg_area",
      filters: [["name", "is", areaName]],
      columns: ["internalid"],
      type: search.Type.CUSTOM_RECORD + "_cseg_area",
    });

    areaSearch.run().each(function (result) {
      areaId = parseInt(result.getValue({ name: "internalid" }));
      log.debug("Area Internal ID", areaId);

      return true;
    });
    return areaId;
  }

  function checkIfJournalEntryExists(workOrderNumber) {
    try {
      var journalEntrySearch = search.create({
        type: search.Type.JOURNAL_ENTRY,
        filters: [["custbody1", "is", workOrderNumber]],
        columns: ["internalid"],
      });

      var searchResult = journalEntrySearch.run().getRange({
        start: 0,
        end: 1,
      });

      if (searchResult.length > 0) {
        var internalId = searchResult[0].getValue("internalid");
        log.debug("Journal Entry Found", "Internal ID: " + internalId);
        return true;
      } else {
        log.debug("Journal Entry Not Found", "External ID: " + workOrderNumber);
        return false;
      }
    } catch (e) {
      log.error("Error Checking Journal Entry", e.message);
      return false;
    }
  }

  const getWorkOrders = () => {
    var workOrderNumberParam = runtime.getCurrentScript().getParameter({
      name: "custscriptworkordernumber",
    });
    log.debug("Work Order number param", workOrderNumberParam);

    // const params = `$filter=not%20customFields/Any(c:(c/value%20eq%20'IMPORTED'%20or%20c/value%20eq%20'NO%20PARTS')%20and%20c/fieldname%20eq%20'API%20Loaded')%20and%20statusId%20eq%20'Completed'%20and%20workOrderNumber%20eq%20${workOrderNumberParam}`;
    // const params = `$filter=not%20customFields/Any(c:(c/value%20eq%20'NO%20PARTS'%20or%20startswith(c/value,'JE'))%20and%20c/fieldname%20eq%20'API%20Loaded')%20and%20statusId%20eq%20'Completed'%20and%20workOrderNumber%20eq%20${workOrderNumberParam}`;
    // const params = `$filter=customFields/Any(c:(c/value%20eq%20''%20or%20c/value%20eq%20null)%20and%20c/fieldname%20eq%20'API%20Loaded')%20and%20statusId%20eq%20'Completed'%20and%20workOrderNumber%20eq%20${workOrderNumberParam}`;
    const params = `$filter=(customFields/Any(c:(c/value%20eq%20''%20or%20c/value%20eq%20null)%20and%20c/fieldname%20eq%20'API%20Loaded')%20or%20not%20customFields/Any(c:c/fieldname%20eq%20'API%20Loaded'))%20and%20statusId%20eq%20'Completed'%20and%20workOrderNumber%20eq%20${workOrderNumberParam}`;

    const workOrders = managerPlusGet("WorkOrders/", params);
    if (workOrders) {
      log.debug("Work Order Retrieved", workOrders);
      workOrders.forEach((wo) => {
        if (!wo.workOrderNumber) {
          log.error("workOrderNumber not found. skipping");
          return;
        }
        log.debug(
          `Checking to see if WO exists in NetSuite: ${wo.workOrderNumber}`
        );
        const woExists = checkIfJournalEntryExists(wo.workOrderNumber);
        if (woExists) {
          log.debug(`Work order exists`);
          return;
        }
        let areaInternalId = getAreaInternalId(wo.entityName);

        const partsParams = `id=${wo.workOrderKey}`;
        const parts = managerPlusGet("WorkOrders/Parts/", partsParams);

        if (!parts) {
          log.error(`Could not get Work Order Parts.`);
          return;
        }
        log.debug(`Got parts list from work order`);

        const woUpdateNoPartsData = {
          fieldName: "API Loaded",
          value: "NO PARTS",
        };
        const woUpdatePostingDate = {
          fieldName: "API Posting Date",
          value: new Date().toISOString(), // current datetime in ISO format
        };
        if (parts.length === 0) {
          log.debug("No parts are in this WO, marking as NO PARTS");
          const woUpdatedRes = managerPlusPatch(
            `WorkOrders/WorkOrderCustomFields?key=${wo.workOrderKey}`,
            woUpdateNoPartsData
          );
          const woUpdatedRes2 = managerPlusPatch(
           `WorkOrders/WorkOrderCustomFields?key=${wo.workOrderKey}`,
            woUpdatePostingDate
          );

          log.debug("Responses", {
            noParts: woUpdatedRes,
            postingDate: woUpdatedRes2,
          });
          
          if (!woUpdatedRes) {
            log.error(
              `could not mark WO ${wo.workOrderKey} as NO PARTS. This order will be duplicated next run if you do not mark it by hand in Manager+`
            );
          }
          return;
        }
        let nonZeroPartFound = parts.some((part) => {
          let truncatedUnitCost = Math.trunc(part.unitCost * 100) / 100;
          if (truncatedUnitCost !== 0) {
            log.debug(`Part with non-zero cost found. Continuing with script.`);
            return true;
          }
          return false;
        });

        if (!nonZeroPartFound) {
          log.debug(`Only parts with 0 cost found. Cannot create JE.`);
          return;
        }

        let journalEntry = record.create({
          type: record.Type.JOURNAL_ENTRY,
          isDynamic: true,
        });
        journalEntry.setValue({
          fieldId: "customform",
          value: "267", //hard coded "Estis Compressi - Journal Entry - Manager Plus"
        });
        journalEntry.setValue({
          fieldId: "subsidiary",
          value: "21", //hard coded "Estis Compression, LLC"
        });
        journalEntry.setValue({
          fieldId: "custbody1",
          value: wo.workOrderNumber,
        });
        journalEntry.setValue({
          fieldId: "trandate",
          value: new Date(),
        });
        journalEntry.setValue({
          fieldId: "memo",
          value: `Unit#: ${wo.assetId}`,
        });

        //Credit first
        let creditLines = [];
        let debitLines = [];
        let creditTotal = 0;
        let debitTotal = 0;
        //one line for credit
        //each debit line will be posted
        parts.forEach((part) => {
          let truncatedUnitCost = Math.trunc(part.unitCost * 100) / 100;
          log.debug(`looking at part: ${part.partKey}`);
          if (truncatedUnitCost == 0) {
            log.debug(`part has zero cost, skipping`);
            return;
          }
          let amount = truncatedUnitCost * part.quantity;
          let expense = "";

          const resPartInfo = managerPlusGet(
            `Parts/GetPartsCustomFields/${part.partKey}`,
            ""
          );
          log.debug(`got part custom fields`);
          resPartInfo.forEach((custpart) => {
            if (custpart.fieldName && custpart.fieldName == "Expense") {
              expense = custpart.value;
              log.debug(`got expense account: ${expense}`);
            }
          });

          if (expense == "") {
            log.error(
              `Part # ${part.partKey} does not have an expense field associated with it`
            );
            return;
          }
          let inventoryItemName = `Inventory ${wo.entityName}`;
          let creditGL = getAccountInternalId(inventoryItemName);
          // let creditGL = getAccountInternalId(11310);
          let debitGL = getAccountInternalIdForDebit(expense);
          if (!creditLines.hasOwnProperty(creditGL)) {
            log.debug(
              "Credit Entry",
              "Adding " + amount + " to CREDIT " + creditGL
            );
            creditLines[creditGL] = amount;
            creditTotal = amount;
          } else {
            log.debug(
              "Credit Entry",
              "Appending " + amount + " to CREDIT " + creditGL
            );
            creditLines[creditGL] += amount;
            creditTotal += amount;
          }

          if (!debitLines.hasOwnProperty(debitGL)) {
            log.debug(
              "Debit Entry",
              "Adding " + amount + " to DEBIT " + debitGL
            );
            debitLines[debitGL] = amount;
            debitTotal = amount;
          } else {
            log.debug(
              "Debit Entry",
              "Appending " + amount + " to DEBIT " + debitGL
            );
            debitLines[debitGL] += amount;
            debitTotal += amount;
          }

          journalEntry.selectNewLine({ sublistId: "line" });

          journalEntry.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "account",
            value: debitGL,
          });

          journalEntry.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "debit",
            value: amount,
          });

          journalEntry.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "cseg_area",
            value: areaInternalId,
          });

          journalEntry.commitLine({ sublistId: "line" });

          log.debug("next part");
        });

        creditLines.forEach((creditLine, index) => {
          journalEntry.selectNewLine({ sublistId: "line" });

          journalEntry.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "account",
            value: index,
          });

          journalEntry.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "credit",
            value: creditLine,
          });

          journalEntry.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "cseg_area",
            value: areaInternalId,
          });

          //Our area field in for credit and debit lines (comes from entity from work order)
          journalEntry.commitLine({ sublistId: "line" });
        });
        log.debug("Done rollup for credit");

        // debitLines.forEach((debitLine, index) => {
        //   journalEntry.selectNewLine({ sublistId: "line" });

        //   journalEntry.setCurrentSublistValue({
        //     sublistId: "line",
        //     fieldId: "account",
        //     value: index,
        //   });

        //   journalEntry.setCurrentSublistValue({
        //     sublistId: "line",
        //     fieldId: "debit",
        //     value: debitLine,
        //   });

        //   journalEntry.setCurrentSublistValue({
        //     sublistId: "line",
        //     fieldId: "memo",
        //     value: "Debit line description",
        //   });

        //   journalEntry.commitLine({ sublistId: "line" });
        // });
        log.debug(`debit total: ${debitTotal}`);
        log.debug(`credit total: ${creditTotal}`);
        log.debug(
          `saving GL for WO number as: ${wo.workOrderNumber} and key is ${wo.workOrderKey}`
        );

        const journalEntryId = journalEntry.save();
        log.debug(
          "Journal Entry Created",
          "Journal Entry ID: " + journalEntryId
        );
        const tranId = getJournalEntryTranId(journalEntryId);
        const woUpdateData = {
          fieldName: "API Loaded",
          value: tranId,
        };
        const woUpdateData2 = {
          fieldName: "API Posting Date",
          value: new Date().toISOString(), // current datetime in ISO format
        };
       
        log.debug(`marked WO as: ${tranId}`);
        const woUpdateRes = managerPlusPatch(
          `WorkOrders/WorkOrderCustomFields?key=${wo.workOrderKey}`,
          woUpdateData
        );
        
        const woUpdateRes2 = managerPlusPatch(
          `WorkOrders/WorkOrderCustomFields?key=${wo.workOrderKey}`,
          woUpdateData2
        );

        log.debug("Responses", {
          noParts: woUpdateRes,
          postingDate: woUpdateRes2,
        });
        
        if (!woUpdateRes) {
          log.error(
            `could not mark WO ${wo.workOrderKey} as API Loaded. This order will be duplicated next run if you do not mark it by hand in Manager+`
          );
        }
        return;
      });
    }
  };

  const execute = (context) => {
    try {
      log.debug("Script starting");
      getWorkOrders();
    } catch (e) {
      log.error("Script Execution Error", `Error: ${e.name} - ${e.message}`);
      throw e;
    }
  };
  return {
    execute: execute,
  };
});
