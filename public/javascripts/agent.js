let categories = []

let table = '/admin/dashboard/store-listing/agent'


$('.abc').hide()



$('#show').click(function(){

$.getJSON('/api/get-agent',data=>{
    categories = data
    makeTable(data)
})

})




function makeTable(categories){
    let table = ` <div class="table-responsive">

    <button type="button" id="back" class="btn btn-primary" style="margin:20px">BacK</button>
<table id="report-table" class="table  table-striped mb-0">
<thead>
<tr>
<th>Name</th>
<th>Number</th>
<th>Role</th>
<th>Status</th>


<th>Options</th>
</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>

<td>${item.name}</td>
<td>${item.number}</td>
<td>${item.role}</td>
<td>${item.status}</td>

<td>
<a href="#!" class="btn btn-info btn-sm edits" id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit </a>
<a href="#!" class="btn btn-danger btn-sm deleted" id="${item.id}"><i class="feather icon-trash-2"></i>&nbsp;Delete </a>
</td>
</tr>`
})
table+=`</tbody>
</table>
</div>

  
<!-- End Row -->`
    $('#result').html(table)
    $('#insertdiv').hide()
    $('#result').show()
}



{/* <a href="#!" class="btn btn-info btn-sm updateimage"  id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit Image </a> */}

$('#result').on('click', '.deleted', function() {
     const id = $(this).attr('id')
    
     $.get(`${table}/delete`,  { id }, data => {
        refresh()
    })
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
  
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
     $('#pnumber').val(result.number)
     $('#paddress').val(result.address)
     $('#pstatus').val(result.status)
     $('#ppassword').val(result.password)
     $('#prole').val(result.role)

   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        name: $('#pname').val(),
        number: $('#pnumber').val(),
        address: $('#paddress').val(),
        status: $('#pstatus').val(),
        password: $('#ppassword').val(),
        role: $('#prole').val(),

       
        }

    $.post(`${table}/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON('/api/get-agent',data=>{
        makeTable(data)
    })
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
    refresh()
    refresh()
}

//================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
})

$('#result').on('click', '.updateimage', function() {
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})


