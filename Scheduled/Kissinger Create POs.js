/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */

define(["N/email", "N/https", "N/record", "N/log", "N/runtime", "N/search"], (
  email,
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

  const managerPlusPost = (endpoint) => {
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
      const url = `${BASE_URL}/${endpoint}`;
      log.debug("change status url", url);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      };

      let response = https.post({
        url: url,
        headers: headers,
      });

      if (response.code === 200 || response.code === 201) {
        return "Success";
      } else {
        log.error(
          "MP API Post Error",
          `Endpoint: ${endpoint}, Response Code: ${response.code}, Body: ${response.body}`
        );
        return null;
      }
    } catch (e) {
      log.error("Manager Plus API Post Error Exception", e.message);
      return null;
    }
  };

  const getPurchaseOrderReceivings = (purchaseOrderKey) => {
    // Need to also paginate
    // const params;
    const batches = managerPlusGet(
      `PurchaseOrders/${purchaseOrderKey}/Receivings`
    );
    if (batches) {
      log.debug("Purchase Orders Receivings Retrieved", batches);
      return batches;
    }
    log.error("Purchase Orders Receivings not found");
    return [];
  };

  function getLetterSequence(index) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    let num = index;

    do {
      result = letters[num % 26] + result;
      num = Math.floor(num / 26) - 1;
    } while (num >= 0);

    return result;
  }

  function getVendorNumber(vendorInfo) {
    let sVendorNumber = null;
    const customFields = vendorInfo.customFields;

    for (let i = 0; i < customFields.length; i++) {
      let field = customFields[i];
      if (field.fieldName === "SAGE # (VENDOR)") {
        sVendorNumber = field.value;
        break;
      }
    }

    return sVendorNumber;
  }

  const checkPurchaseOrderExists = (purchaseOrderId) => {
    const poSearch = search.create({
      type: search.Type.PURCHASE_ORDER,
      filters: [["custbody_mp_po", "is", purchaseOrderId]],
    });

    const searchResultCount = poSearch.runPaged().count;

    return searchResultCount > 0;
  };

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

  function getItemInternalId(itemName) {
    var itemId = null;
    log.debug("item Name", itemName);

    var itemSearch = search.create({
      type: search.Type.ITEM,
      filters: [["name", "is", itemName]],
      columns: ["internalid"],
    });

    itemSearch.run().each(function (result) {
      itemId = parseInt(result.getValue({ name: "internalid" }));
      log.debug("Item Internal ID", itemId);

      return true;
    });
    return itemId;
  }

  function getVendorInternalId(sageVendorValue) {
    // let vendorName = sageVendorValue.padStart(7, "0");
    var vendorId = null;
    var vendorSearch = search.create({
      type: search.Type.VENDOR,
      // filters: [["externalid", "is", vendorName]],
      filters: [["entityid", "is", sageVendorValue]],
      columns: ["internalid"],
    });

    vendorSearch.run().each(function (result) {
      vendorId = parseInt(result.getValue({ name: "internalid" }));
      log.debug("Vendor Internal ID", vendorId);

      return true;
    });
    return vendorId;
  }

  const getVendors = (vendorId) => {
    const vendorIdTrim = vendorId.trim();
    const params = `$filter=vendorId%20Eq%20%27${vendorIdTrim}%27`;
    const vendors = managerPlusGet("Vendors/", params);
    if (vendors) {
      log.debug("Vendors Retrieved", vendors);
      vendorInfo = vendors[0];
      log.debug("Vendor Info", vendorInfo);
      return vendorInfo;
    }
  };

  const handleError = (id, eName, eMessage) => {
    log.error("Script Execution Error", `Error: ${eName} - ${eMessage}`);

    const recipients = [
      //"developer@kissingerassoc.com",
      "Tonya.Page@flowco-inc.com",
    ];

    const subject = `SuiteScript Error ${eName} PO#: ${id}`;

    email.send({
      author: -5,
      recipients: recipients,
      subject: subject,
      body: eMessage,
    });
  };

  const getPurchaseOrders = (createdPOs, failedPOs) => {
    let skip = 0;
    const top = 100;
    let hasMoreRecords = true;
    while (hasMoreRecords) {
     // const params = `$top=${top}&$skip=${skip}&$filter=statusId%20ne%20%27NEW%27%20and%20statusId%20ne%20%27API%20LOCK%27%20and%20statusId%20ne%20%27CANCELED%27%20and%20statusId%20%27ORDERED%27`;
        const params = `$top=${top}&$skip=${skip}&$filter=statusId%20ne%20%27NEW%27%20and%20statusId%20ne%20%27API%20LOCK%27%20and%20statusId%20ne%20%27CANCELED%27%20and%20statusId%20ne%20%27ORDERED%27`;

     // const params = `$top=${top}&$skip=${skip}&$filter=statusId%20ne%20%27NEW%27`;
      
      const purchaseOrders = managerPlusGet("PurchaseOrders/", params);
      if (!purchaseOrders) {
        hasMoreRecords = false;
        log.debug("Could not get POs");
        return;
      }
      if (purchaseOrders.length === 0) {
        hasMoreRecords = false;
        log.debug("No more POs");
        break;
      }

      log.debug("Purchase Orders Retrieved", purchaseOrders);
     
      purchaseOrders.forEach((po) => {
       
      
        let purchaseOrderKey = po.purchaseOrderKey;
        let vendorId = po.vendorId;
        let purchaseOrderNumber = po.purchaseOrderNumber;
        let totalReceived = 0;
        let inventoryItemName = `Inventory ${po.entityName}`;
        let inventoryInternalId = getItemInternalId(inventoryItemName);
        // let inventoryInternalId = getItemInternalId("11310 Inventory MP");
        const batches = getPurchaseOrderReceivings(purchaseOrderKey);
        if (batches.length <= 0) {
          log.debug(
            "No batches on PO",
            `No batches on PO ${purchaseOrderNumber}`
          );
          failedPOs.push({
            purchaseOrderNumber: po.purchaseOrderNumber,
            vendorId: vendorId,
            error: `No batches on PO ${purchaseOrderNumber}`,
          });
          return;
        }
        let areaInternalId = getAreaInternalId(po.entityName);

        const vendorInfo = getVendors(vendorId);
        const sVendorNumber = getVendorNumber(vendorInfo);

        if (sVendorNumber == "Unknown" || sVendorNumber == null) {
          log.error(
            "Could not find the vendor number, check your vendor custom field in Manager+ for:",
            `ID: ${vendorId}`
          );
          handleError(
            purchaseOrderNumber,
            "Could not find the vendor number",
            `Could not find the vendor number, check your vendor custom field in Manager+ for: ID: ${vendorId}`
          );
          failedPOs.push({
            purchaseOrderNumber: po.purchaseOrderNumber,
            vendorId: vendorId,
            error: `Could not find the vendor number, check your vendor custom field in Manager+ for: ID: ${vendorId}`,
          });
          return;
        }
        const vendorInternalId = getVendorInternalId(sVendorNumber);
        if (!vendorInternalId) {
          handleError(
            purchaseOrderNumber,
            "vendor not found in netsuite PO:",
            `vendor not found in netsuite PO: ${purchaseOrderNumber} Sage vendor number: ${sVendorNumber} MP Vendor Id: ${vendorId}`
          );
          failedPOs.push({
            purchaseOrderNumber: po.purchaseOrderNumber,
            vendorId: vendorId,
            error: `vendor not found in netsuite PO: ${purchaseOrderNumber} Sage vendor number: ${sVendorNumber} MP Vendor Id: ${vendorId}`,
          });
          return;
        } else {
          log.debug(
            "got vendor number",
            `ID: ${vendorInternalId} Sage vendor number: ${sVendorNumber} MP Vendor Id: ${vendorId}`
          );
        }
        let poerrors = 0;
        batches.forEach((batch, i) => {
          let batchTotal = 0;
          batch.receivingLines.forEach(function (receivingLine) {
            batchTotal += receivingLine.subTotal;
          });
          if (batchTotal < 0) {
            log.debug(
              "Purchase order batch total is negative, skipping",
              `Purchase order batch total is negative PO #: ${po.purchaseOrderNumber} Batch #: ${batch.batchNumber} total: ${batchTotal}`
            );
            failedPOs.push({
              purchaseOrderNumber: po.purchaseOrderNumber,
              vendorId: vendorId,
              error: `Purchase order batch total is negative PO #: ${po.purchaseOrderNumber} Batch #: ${batch.batchNumber} total: ${batchTotal}`,
            });
            return;
          }
          log.debug("new batch");
          let letters = getLetterSequence(i);
          let sPoName = `${purchaseOrderNumber}${letters}`;
          log.debug(`Checking to see if PO exists in Net Suite: ${sPoName}`);
          const poExists = checkPurchaseOrderExists(sPoName);
          if (poExists) {
            log.debug("PO found skipping");
            return;
          }
          log.debug("PO not found, creating in Netsuite from Batch");

          log.debug(`Will create PO: ${sPoName}`);

          let poRecord = record.create({
            type: record.Type.PURCHASE_ORDER,
            isDynamic: true,
          });
          poRecord.setValue({
            fieldId: "tranId",
            value: sPoName,
          });
          poRecord.setValue({
            fieldId: "entity",
            value: vendorInternalId,
          });
          poRecord.setValue({
            fieldId: "customform",
            value: "264", //hard coded Estis Compressi - Purchase Order one 219
          });
          poRecord.setValue({
            fieldId: "trandate",
            value: new Date(),
          });
           poRecord.setValue({
             fieldId: "subsidiary",
             value: "21", //Subsidiary "Estis Compression LLC" Want to get this value from a search instead of hard code
           });
          /*
          poRecord.setValue({
            fieldId:'employee',
            value:29250
          })
          */
          poRecord.setValue({
            fieldId: "memo",
            value: batch.batchNumber,
          });
         
          let sGL = "";
          let sLines = [];

          batch.receivingLines.forEach(function (receiving) {
            // 51998	Miscellaneous expense
            // 11310	Inventory (we are using this one for parts)
            log.debug(`itemType ${receiving.itemType}`);

            if (receiving.itemType == "PART") {
              sGL = inventoryInternalId;
              if (sLines.hasOwnProperty(sGL)) {
                log.debug(`appending ${receiving.subTotal} to ${sGL}`);
                sLines[sGL] = sLines[sGL] + receiving.subTotal;
              } else {
                log.debug(`adding ${receiving.subTotal} to ${sGL}`);
                sLines[sGL] = receiving.subTotal;
              }
            } else if (receiving.itemType == "COST") {
              log.debug(`appending ${receiving.subTotal} to ${sGL}`);
              sGL = getItemInternalId(receiving.item + " MP");

              if (sLines.hasOwnProperty(sGL)) {
                log.debug(`appending ${receiving.subTotal} to ${sGL}`);
                sLines[sGL] = sLines[sGL] + receiving.subTotal;
              } else {
                log.debug(`adding ${receiving.subTotal} to ${sGL}`);
                sLines[sGL] = receiving.subTotal;
              }
            } else {
              log.debug("I don't recognize this cost type");
            }
            log.debug(
              `adding to total: ${receiving.subTotal} to ${totalReceived}`
            );
            totalReceived += receiving.subTotal;
          });
          log.debug("Lines Rollup for Batch:");
          sLines.forEach(function (line, index) {
            log.debug(`Entity name ${po.entityName}`);

            log.debug(`Line item: ${index} ${line}`);
            poRecord.selectNewLine({ sublistId: "item" });

            poRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "item",
              value: index,
            });
            poRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              value: 1,
            });
            poRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "rate",
              value: line,
            });
            poRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "cseg_area",
              value: areaInternalId,
            });
            poRecord.setCurrentSublistValue({
              sublistId:'item',
              fieldId:'location',
              value:752
            })
            poRecord.commitLine({ sublistId: "item" });
          });

          log.debug(`received: ${totalReceived} / ${po.orderTotal}`);
           poRecord.setValue({fieldId:'custbody_mp_po',value:sPoName});
          poRecord.setValue({fieldId:'approvalstatus',value:2});
          let recordId = poRecord.save({
            enableSourcing: true,
            ignoreMandatoryFields: false,
          });
/*
          let poRecordToUpdate = record.load({
            type: record.Type.PURCHASE_ORDER,
            id: recordId,
            isDynamic: true,
          });

          poRecordToUpdate.setValue({
            fieldId: "tranid",
            value: sPoName,
          });
           poRecordToUpdate.setValue({
            fieldId:'approvalstatus',
            value:2
          });

          poRecordToUpdate.save({
            enableSourcing: true,
            ignoreMandatoryFields: false,
          });
*/
          createdPOs.push(sPoName);

          log.debug("Purchase Order Record Created", `ID: ${recordId}`);

          log.debug("Done checking");
        });
        log.debug(
          `po order total / po received total: ${po.orderTotal} / ${po.receivedTotal}`
        );

        if (po.orderTotal == po.receivedTotal) {
             if (poerrors) {
               log.debug(
                 "Not updating Manager+ PO status because of errors: ".JSON.encode(
                   poerrors
                 )
               );
             } else {
          log.debug("Mark this order as completed.");
          const postParams = "?NewStatus=API%20LOCK";
          log.debug(
            `PurchaseOrders/${po.purchaseOrderKey}/ChangeStatus${postParams}`
          );
          //removed 8-19-2025
         const postRes = managerPlusPost(
            `PurchaseOrders/${po.purchaseOrderKey}/ChangeStatus${postParams}`
          );
          if (postRes) {
            log.debug("Order Marked");
          } else {
            log.debug(`Could not mark ${po.purchaseOrderNumber} as completed`);
          }
            }
          //end removal of 8-19-2025
        }
        log.debug(`Done PO: ${po.purchaseOrderNumber}`);
      });
      skip += top;
    }
    log.debug("finished import");
  };

  const execute = (context) => {
    try {
      var createdPOs = [];
      var failedPOs = [];
      log.debug("Script starting");
      getPurchaseOrders(createdPOs, failedPOs);
    } catch (e) {
      handleError("", e.name, e.message);
      throw e;
    } finally {
      log.audit({
        title: "PO Creation Summary",
        details: "Created POs: " + JSON.stringify(createdPOs),
      });
      log.audit({
        title: "POs Not Created Summary",
        details: "POs that could not be created: " + JSON.stringify(failedPOs),
      });
    }
  };
  return {
    execute: execute,
  };
});
