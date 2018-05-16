
window.onload = function(){
	initFireBase();
	document.getElementById("add-person").addEventListener("click", addNewPerson);
	document.getElementById("clear_btn").addEventListener("click", function(){
		console.log("YEES");
		localStorage.removeItem("cur_party_info");
		document.getElementById("persons").innerHTML = "";
		updateInfo();
		loadFromStorage();
	});

	loadFromStorage();
}

function initFireBase(){
	var config = {
    apiKey: "AIzaSyCl_mlUCPiTR3Cwmu4be3DpWiab-V-mpkI",
    authDomain: "avagenerator.firebaseapp.com",
    databaseURL: "https://avagenerator.firebaseio.com",
    projectId: "avagenerator",
    storageBucket: "avagenerator.appspot.com",
    messagingSenderId: "140289767041"
  };
  firebase.initializeApp(config);
}


function loadFromStorage(){
	var loaded_persons = JSON.parse(localStorage.getItem("cur_party_info")) || null;

	if(loaded_persons){
		for(var i = 0; i<loaded_persons.length; i++){
			addNewPerson(loaded_persons[i]);
		}
	}

}

function deletePerson(e){
	var btn = e.target;
	btn.parentElement.parentElement.remove();
	updateInfo();
}

var all_persons = [];

function addNewPerson(person){

	var persons_container = document.getElementById("persons");
	var buttons = document.createElement("div");
	var single_person = document.createElement("div");
	var person_name = document.createElement("input");
	var delete_btn = document.createElement("input");

	single_person.className = "single-person";
	buttons.className = "buttons"
	person_name.type = "text";
	person_name.className = "person-name";
	person_name.placeholder = "Firstname";
	person_name.value = person.name || "";
	delete_btn.type = "button";
	delete_btn.className = "del-btn";
	delete_btn.addEventListener("click", deletePerson);
	buttons.appendChild(person_name);
	buttons.appendChild(delete_btn);
	single_person.appendChild(buttons);

	
	var drinks = ["beer", "vodka", "wine"];	
	var stats = document.createElement("div");
	stats.className = "stats";

	for(var i = 0; i<drinks.length; i++){

		var item = document.createElement("div");
		var counter = document.createElement("span");
		var up = document.createElement("input");
		var down = document.createElement("input");
		counter.className = drinks[i] + " counter";
		var cur_drink =  person[drinks[i]];

		counter.innerHTML = drinks[i] + ": " + (cur_drink || "0");
		up.type = "button";
		up.addEventListener("click", changeStat);
		up.setAttribute("val","1");
		up.setAttribute("drink", drinks[i]);
		down.type = "button";
		up.value = "+";
		down.value = "-";
		down.setAttribute("val","-1");
		down.setAttribute("drink", drinks[i]);
		down.addEventListener("click", changeStat);

		up.className = "stat-btn";
		down.className = "stat-btn";

		item.className = "item";
		item.appendChild(counter);
		item.appendChild(up);
		item.appendChild(down);

		stats.appendChild(item);
	}

	single_person.appendChild(stats);
	persons_container.appendChild(single_person);
	updateInfo();
}

function changeStat(e){
	var btn = e.target;
	var val = +(btn.getAttribute("val"));

	var counter; 

	if(val ==1) counter =  btn.previousSibling ;
	else counter = btn.previousSibling.previousSibling ;



	var numb = getNumber(counter.innerHTML);
	numb+= val;

	if(numb<0) numb = 0;

	counter.innerHTML= btn.getAttribute("drink") +": "+numb;


	updateInfo();

}


function updateInfo(){

	all_persons = [];

	var persons = document.getElementsByClassName("single-person");
	

	for(var i = 0; i<persons.length; i++){
		var name = persons[i].getElementsByClassName("person-name")[0].value;
		var beer = getNumber(persons[i].getElementsByClassName("beer")[0].innerHTML);
		var vodka = getNumber(persons[i].getElementsByClassName("vodka")[0].innerHTML);
		var wine = getNumber(persons[i].getElementsByClassName("wine")[0].innerHTML);

		var obj = {
			name: name,
			beer: beer,
			vodka: vodka,
			wine: wine
		}

		all_persons.push(obj);
	}


	if(all_persons.length){
		document.getElementById("clear").style.display = "";
	}else{
		document.getElementById("clear").style.display = "none";
	}

	document.getElementById("p-count").innerHTML = "Persons (" + all_persons.length + ")";

	localStorage.setItem('cur_party_info', JSON.stringify(all_persons));



};

function getNumber(string) {

	var numb = string.match(/\d/g);
	numb = +numb.join("");
	return numb;
}