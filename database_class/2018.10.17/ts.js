var req = indexedDB.open("jiaowuchu",1);
 var db;
 var students;
 req.addEventListener("success", onSuccess);
 req.addEventListener("upgradeneeded", onUpgrade);
 var anniu = document.getElementById("jia");
 anniu.addEventListener("click", biaogejia);
 var id = 200;
 function jiayitiao(){
	var tran = db.transaction(['students'], 'readwrite');
	//获取对象仓库
	students = tran.objectStore("students");
	//写入数据
	students.add({id:id,name:"zs",age:18,course:"ps"});
	id++;
 }
 function biaogejia(){
	var tbody = document.getElementById("bb");
	var br = document.createElement("tr");
	br.innerHTML = 
			`<td>tomato</td>
			<td>4</td>
			<td>2</td>
			<td>8</td>`;
	
	tbody.appendChild(br);
 }
 
 function onSuccess(){
	console.log("数据库连接成功");
	//写入记录
	db = req.result;
	var tran = db.transaction(['students'], 'readwrite');
	//获取对象仓库
	students = tran.objectStore("students");

	//写入数据
	students.add({id:10,name:"zs",age:18,course:"ps"});
	students.add({id:100,name:"ls",age:19,course:"cs"});
	
 }
 function onUpgrade(){
	console.log("数据库的结构发生了更新");
	//创建一个对象仓库（表）
	db = req.result;
	students = db.createObjectStore("students", {keyPath:"id"} );
	//在对象创建索引  索引名 索引创建在哪个属性key上 配置信息
	students.createIndex("id","id",{unique:true});
	students.createIndex("name","name",{unique:false});
	//写入记录
	students.add({id:0,name:"zs",age:18,course:"ps"});
	students.add({id:1,name:"ls",age:19,course:"cs"});
	
	
 }