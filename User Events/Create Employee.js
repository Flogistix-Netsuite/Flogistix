//function createEmp()
{
	var rec=nlapiCreateRecord('employee')
		rec.setFieldValue('subsidiary',4);
		rec.setFieldValue('firstname','RR');
		rec.setFieldValue('lastname','Tester');
		rec.selectNewLineItem('earning');
		rec.setCurrentLineItemText('earning','payrollitem','Salary - Management');
		rec.setCurrentLineItemValue('earning','defaultearning','T');
		rec.setCurrentLineItemValue('earning','primaryearning','T');
		rec.commitLineItem('earning');
		nlapiSubmitRecord(rec);
		var dldld=99;
}