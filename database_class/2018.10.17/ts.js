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
	//��ȡ����ֿ�
	students = tran.objectStore("students");
	//д������
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
	console.log("���ݿ����ӳɹ�");
	//д���¼
	db = req.result;
	var tran = db.transaction(['students'], 'readwrite');
	//��ȡ����ֿ�
	students = tran.objectStore("students");

	//д������
	students.add({id:10,name:"zs",age:18,course:"ps"});
	students.add({id:100,name:"ls",age:19,course:"cs"});
	
 }
 function onUpgrade(){
	console.log("���ݿ�Ľṹ�����˸���");
	//����һ������ֿ⣨��
	db = req.result;
	students = db.createObjectStore("students", {keyPath:"id"} );
	//�ڶ��󴴽�����  ������ �����������ĸ�����key�� ������Ϣ
	students.createIndex("id","id",{unique:true});
	students.createIndex("name","name",{unique:false});
	//д���¼
	students.add({id:0,name:"zs",age:18,course:"ps"});
	students.add({id:1,name:"ls",age:19,course:"cs"});
	
	
 }