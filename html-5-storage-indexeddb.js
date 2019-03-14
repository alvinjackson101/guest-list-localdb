//some sample data
const employeeData = [
   { id: "00-01", name: "Andy", age: 41, email: "andy@cool.com" },
   { id: "00-02", name: "Frank", age: 32, email: "frank@cool.com" }
];

//the database reference
let db;

//initializes the database
function initDatabase() {

	//create a unified variable for the browser variant
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		//if a variant wasn't found, let the user know
	if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}

   //attempt to open the database
	let request = window.indexedDB.open("employees", 1);
	request.onerror = function(event) {
		console.log(event);
	};

   //map db to the opening of a database
	request.onsuccess = function(event) { 
		db = request.result;
		console.log("success: " + db);
	};

   //if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("employee", {keyPath: "id"});
      
      for (var i in employeeData) {
         objectStore.add(employeeData[i]);
      }
   }
}

//adds a record as entered in the form
function add() {
	//get a reference to the fields in html
	let id = document.querySelector("#id").value;
	let name = document.querySelector("#name").value;
	let email = document.querySelector("#email").value;
	let age = document.querySelector("#age").value;

	//alert(id + name + email + age);
   
   //create a transaction and attempt to add data
	var request = db.transaction(["employee"], "readwrite")
	.objectStore("employee")
	.add({ id: id, name: name, age: age, email: email });

   //when successfully added to the database
	request.onsuccess = function(event) {
		alert(`${name} has been added to your database.`);
	};

   //when not successfully added to the database
	request.onerror = function(event) {
	alert(`Unable to add data\r\n${name} is already in your database! `);
	}
}

//not used in code example
//reads one record by id
function read() {
   //get a transaction
   var transaction = db.transaction(["employee"]);
   
   //create the object store
   var objectStore = transaction.objectStore("employee");

   //get the data by id
   var request = objectStore.get("00-03");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
         alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
      }
      
      else {
         alert("Kenny couldn't be found in your database!");
      }
   };
}

//reads all the data in the database
function readAll() {
   var objectStore = db.transaction("employee").objectStore("employee");
   
   //creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
         cursor.continue();
      }
      
      else {
         alert("No more entries!");
      }
   };
}

//deletes a record by id
function remove() {
	let delid = document.querySelector("#delid").value;
   var request = db.transaction(["employee"], "readwrite")
   .objectStore("employee")
   .delete(delid);
   
   request.onsuccess = function(event) {
      alert("Entry has been removed from your database.");
   };
}

initDatabase();