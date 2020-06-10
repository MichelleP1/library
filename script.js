let main = document.querySelector('#main');
let table = document.querySelector('#table');
let addButton = document.querySelector('#addButton');
let closeButton = document.querySelector('#closeButton');
let form = document.getElementById("myForm");
form.style.display = 'none';

let myLibrary = [];
let indexValue = 0;
let loaded = false;


(function() {
	// Firebase configuration
	var firebaseConfig = {
	apiKey: "AIzaSyB89YiFovzek4SBJ_MCN6YDsEIde6MzEo8",
	authDomain: "library-e5b33.firebaseapp.com",
	databaseURL: "https://library-e5b33.firebaseio.com",
	projectId: "library-e5b33",
	storageBucket: "library-e5b33.appspot.com",
	messagingSenderId: "1077317292533",
	appId: "1:1077317292533:web:a712654c502111c63dd0bc"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	// Display stored books on webpage
	firebase.database().ref().on('value', function(snap){
		snap.forEach(function(childNodes){
			if (loaded == false) {
				let index = childNodes.val().index;
				let title = childNodes.val().title;
				let author = childNodes.val().author;
				let pages = childNodes.val().pages;
				let read =childNodes.val().read;

				let book = new Book(index, title, author, pages, read);
				myLibrary.push(book);
				render(index);

				console.log(myLibrary);

				//index values should increase as array is looped
				indexValue = index + 1;
			}
		});
		loaded = true;
	});
}());
	

// Write newly added book to database
function writeData(index, title, author, pages, read) {
	firebase.database().ref(index).set({
		index: index,
		title: title,
		author: author,
		pages: pages,
		read: read
	});
}


// Book constructor
function Book(index, title, author, pages, read) {
	this.index = index;
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
	
	this.info = function() {
		return title + " by " + author + ", " + pages + ", " + read;
	}
}


// Add book to library
function addBookToLibrary() {

	document.getElementById("myForm").style.display = "none"; 

	let index = indexValue;
	let title = document.getElementById("title").value;
	let author = document.getElementById("author").value;
	let pages = document.getElementById("pages").value;
	let read = document.querySelector('input[name=read]:checked').value;

	let book = new Book(index, title, author, pages, read);
	myLibrary.push(book);

	render(index);
	writeData(index, title, author, pages, read);

	indexValue++;
}

// Display row at given index
function render(index){
	addButton.innerHTML = 'Add Book';

    var tr = table.insertRow();
	var td1 = tr.insertCell();
	var td2 = tr.insertCell();
	var td3 = tr.insertCell();
	var td4 = tr.insertCell();
	var td5 = tr.insertCell();
	var td6 = tr.insertCell();

	let arrayIndex = myLibrary.findIndex(x => x.index == index);

	td1.appendChild(document.createTextNode(myLibrary[arrayIndex].title));
    td2.appendChild(document.createTextNode(myLibrary[arrayIndex].author));
    td3.appendChild(document.createTextNode(myLibrary[arrayIndex].pages));
    td4.appendChild(document.createTextNode(myLibrary[arrayIndex].read));

    var btnRead = document.createElement('input');
	btnRead.type = "button";
	btnRead.className = "btn";
	btnRead.value = 'Read Status';

	btnRead.addEventListener('click', function(){
	    toggleRead(index);
	});

	td5.appendChild(btnRead);

    var btn = document.createElement('input');
	btn.type = "button";
	btn.className = "btn";
	btn.value = 'Delete Book';

	btn.addEventListener('click', function(){
	    deleteRow(index);
	});

	td6.appendChild(btn);
}


function toggleRead(i) {
	let arrayIndex = myLibrary.findIndex(x => x.index == i);

	let isRead = myLibrary[arrayIndex].read;
	if (isRead == 'yes') {
		isRead = 'no';
	} else {
		isRead = 'yes';
	}

	myLibrary[arrayIndex].read = isRead;
	console.log(myLibrary);

	table.rows[arrayIndex + 1].cells[3].innerHTML = isRead;

	firebase.database().ref(i).update({
		read: isRead
	});
}


function deleteRow(i) {

	let arrayIndex = myLibrary.findIndex(x => x.index == i);

	myLibrary = myLibrary.filter(item => item.index !== i);
	console.log(myLibrary);

	// add one to avoid header
	table.deleteRow(arrayIndex + 1);

	firebase.database().ref(i).remove();
}


addButton.addEventListener("click", e => {

	if (form.style.display == 'none') {
		form.style.display = 'block';
		addButton.innerHTML = 'Close Form';
	} else {
		form.style.display = 'none';
		addButton.innerHTML = 'Add Book';
	}
});

closeButton.addEventListener("click", e => {
	document.getElementById("myForm").style.display = "none"; 
	addButton.innerHTML = 'Add Book';
});


// Create table header
let headerElements = ["Title", "Author", "Pages", "Read", "", ""];


var row = table.insertRow(-1);
for (var i = 0; i < headerElements.length; i++) {
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = headerElements[i];
    row.appendChild(headerCell);
}