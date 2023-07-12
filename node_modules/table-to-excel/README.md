# tabletoexcel
create excel by javascript for table or json



## Install

    $ npm install table-to-excel

## Use

1、
```bash
<table id="table">
	<tr>
		<th>Name</th>
		<th>Age</th>
	</tr>
	<tr>
		<td>ecofe</td>
		<td>18</td>
	</tr>
	<tr>
		<td>alice</td>
		<td>3</td>
	</tr>
</table>
<button id="button1">Create By DOM</button>
<script src='table-to-excel.js'></script>
<script>
var tableToExcel=new TableToExcel();
document.getElementById('button1').onclick=function(){
	
	tableToExcel.render("table");
	
};
document.getElementById('button2').onclick=function(){
	var arr = [
		['Name', 'Age', 'Sex', 'Country'],
		['ecofe', '18', 'male', 'china'],
		['alice', '3', 'female', 'china']
	]
	tableToExcel.render(arr,[{text:"title1",bg:"#333",color:"#fff"},{text:"title2",bg:"#ddd",color:"#333"}]);
};
</script>
```

2、

```bash
var TableToExcel = require('table-to-excel');
var tableToExcel=new TableToExcel();
document.getElementById('button1').onclick=function(){
	
	tableToExcel.render("table");
	
};
document.getElementById('button2').onclick=function(){
	var arr = [
		['Name', 'Age', 'Sex', 'Country'],
		['ecofe', '18', 'male', 'china'],
		['alice', '3', 'female', 'china']
	]
	tableToExcel.render(arr,[{text:"title1",bg:"#333",color:"#fff"},{text:"title2",bg:"#ddd",color:"#333"}]);
};

```




[github](https://github.com/ecofe/tabletoexcel)
