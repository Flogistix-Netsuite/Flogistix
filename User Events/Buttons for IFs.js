function userEventBeforeLoad_Hello(type,form){

	form.setScript('customscript_bol_client_script');
	//form.addButton('custpage_call_client', 'BOL', 'buttonPrint');
    form.addButton('custpage_call_ci','Commercial Invoice','invoicePrint');
    //form.addButton('custpage_call_packing_slip_ll','Print LL Packing Slip','LLPrint');
    //form.addButton('custpage_call_packing_slip_ao','Print AO Packing Slip','AOPrint')

}