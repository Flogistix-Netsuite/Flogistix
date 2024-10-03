/**
 * Copyright (c) 1998-2012 NetSuite, Inc.
 * 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * NetSuite, Inc. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with NetSuite.
 */

/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Oct 2012     nfrancisco
 * 2.00		  05 Nov 2013     asinsin          Set the value of Warehouse (on fixed asset) = Warehouse on Release Transfer Order if related asset it not null and (rental release transfer is true or false). Code change is on line 86 to 87.
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function afterSubmit_UpdFixedAsset(type)
{
	try
	{
		if((nlapiGetField('custbody_related_asset') != null) && (nlapiGetField('custbody_rental_release_transfer') != null))
		{
			var stRelatedAsset = nlapiGetFieldValue('custbody_related_asset');
			nlapiLogExecution('DEBUG', 'stRelatedAsset', stRelatedAsset);
			var stRentalReleaseTransfer = nlapiGetFieldValue('custbody_rental_release_transfer');
			nlapiLogExecution('DEBUG', 'stRentalReleaseTransfer', stRentalReleaseTransfer);
			if(!isEmpty(stRelatedAsset))
			{
				var stCustId = '';
				var stCustLoc = '';
				var stCustCounty = '';
				var stCustState = '';	
				var stSubsidiary;
				var stOpAreaBU;
				
				var recAsset = nlapiLoadRecord('customrecord_ncfar_asset', stRelatedAsset);
				
				if(stRentalReleaseTransfer != 'T')
				{
					nlapiLogExecution('DEBUG', 'isRental', 'isRental');
					stCustId = nlapiGetFieldValue('custbody_rental_unit_customer');
					stCustLoc = nlapiGetFieldValue('custbody_rental_unit_location_dropdown');
					stCustCounty = nlapiGetFieldValue('custbody_rental_unit_county');
					stCustState = nlapiGetFieldText('custbody_rental_unit_state');
					stSubsidiary = nlapiGetFieldValue('subsidiary');
					stOpAreaBU = nlapiGetFieldValue('class');
					
					// Nate - 20121018  : As per Nathan(FC), Removed filtering for the Class and Subsidiary fields on Fixed Asset, should now be able to update customer location info without errors.
					//recAsset.setFieldValue('custrecord_assetsubsidiary', stSubsidiary);
					recAsset.setFieldValue('custrecord_assetclass', stOpAreaBU);
					
					recAsset.setFieldText('custrecord_current_state', stCustState);
				}
				else
				{
					nlapiLogExecution('DEBUG', 'notRental', 'notRental');
					recAsset.setFieldValue('custrecord_current_state', stCustState);
					
				}
		
				nlapiLogExecution('DEBUG', 'stCustId', stCustId);
				nlapiLogExecution('DEBUG', 'stCustLoc', stCustLoc);
				nlapiLogExecution('DEBUG', 'stCustCounty', stCustCounty);
				nlapiLogExecution('DEBUG', 'stCustState', stCustState);
				
				recAsset.setFieldValue('custrecord_current_customer', stCustId);
				recAsset.setFieldValue('custrecord_current_location', stCustLoc);
				
				recAsset.setFieldValue('custrecord_current_county', stCustCounty);
				
				var stWarehouseOnRelease = nlapiGetFieldValue('custbody_rental_unit_warehouse_release');
				recAsset.setFieldValue('custrecord_assetlocation', stWarehouseOnRelease);
				
				nlapiSubmitRecord(recAsset);
			}
		}
	}
	catch (error)
	{
		if (error.getDetails != undefined)
		{
			nlapiLogExecution('ERROR', 'Process Error', error.getCode() + ': '
					+ error.getDetails());
			throw error;
		}
		else
		{
			nlapiLogExecution('ERROR', 'Unexpected Error', error.toString());
			throw nlapiCreateError('99999', error.toString());
		}
	}
}

//Custom function to determine if a variable is empty.
function isEmpty(text)
{
	var blIsEmptyFlag = false;
	
	if(text == null && !blIsEmptyFlag)
	{
		blIsEmptyFlag = true;
	}
	
	
	if(text.length <= 0 && !blIsEmptyFlag)
	{
		blIsEmptyFlag = true;
	}
	
	return blIsEmptyFlag;
}
