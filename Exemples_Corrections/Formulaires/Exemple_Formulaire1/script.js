var selectrow=null;
function onFormsubmit(e)
{
event.preventDefault();
var formData=readFormdata();
if(selectrow === null) {
    insertNewRecord(formData);
}
else {upgradeRecord(formData);

}
resetform();
}
function readFormdata()
{

    var formData={};
    formData["productCode"]=document.getElementById("productCode").value;
    formData["product"]=document.getElementById("product").value;
    formData["qty"]=document.getElementById("qty").value;
    formData["perprice"]=document.getElementById("perprice").value;
    return formData;
}
function insertNewRecord(data){
var table= document.getElementById("storelist").getElementsByTagName("tbody")[0];
var newRow = table.insertRow(table.length);
var cell1= newRow.insertCell(0);
cell1.innerHTML=data.productCode;
var cell2= newRow.insertCell(1);
cell2.innerHTML=data.product;
var cell3= newRow.insertCell(2);
cell3.innerHTML=data.qty;
var cell4= newRow.insertCell(3);
cell4.innerHTML=data.perprice;
var cell5= newRow.insertCell(4);
cell5.innerHTML="<button onClick='onEdit(this)'>Edit</button> <button onClick='onDelete(this)'>Delete</button>";

}
function onEdit(td)
{

    selectrow=td.parentElement.parentElement;
    document.getElementById("productCode").value=selectrow.cells[0].innerHTML;
    document.getElementById("product").value=selectrow.cells[1].innerHTML;
    document.getElementById("qty").value=selectrow.cells[2].innerHTML;
    document.getElementById("perprice").value=selectrow.cells[3].innerHTML;
}
function upgradeRecord(formData)
{
    selectrow.cells[0].innerHTML=formData.productCode;
    selectrow.cells[1].innerHTML=formData.product;
    selectrow.cells[2].innerHTML=formData.qty;
    selectrow.cells[3].innerHTML=formData.perprice;

}
function onDelete(td){

if(confirm('Voulez-vous supperimer element?'))
{
row=td.parentElement.parentElement;
document.getElementById("storelist").deleterows(row.rowIndex);
}
resetform();
}
function resetform()
{
    document.getElementById("productCode").value='';
    document.getElementById("product").value='';
    document.getElementById("qty").value='';
    document.getElementById("perprice").value='';
}

