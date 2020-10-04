


var phoneNum = 1234567890
var user = {};


var firebaseConfig = {
	"apiKey": "AIzaSyCGvKK4jxIjZnWdeCJRQwnERv-CnXtyGPs",
    "authDomain": "testrpm-e5b42.firebaseapp.com",
    "databaseURL": "https://testrpm-e5b42.firebaseio.com",
    "projectId": "testrpm-e5b42",
    "storageBucket": "testrpm-e5b42.appspot.com"
}

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


window.onload = (event) => {
	checkLogin();
};


function checkLogin(){
	if (localStorage.getItem('user')) {
		user = JSON.parse(localStorage.getItem('user'));
		$("#message").html("Welcome back, " + user["firstname"]);
		$("#phoneDiv").hide();
		$("#startDiv").show();
	} else {
		$("#phoneDiv").show();
		$("#startDiv").hide();
	}
}

function login() {

	db.collectionGroup('patients')
	  .where('phone', '==', $("#phone").val())
	  .get().then((querySnapshot) => {
	    querySnapshot.forEach((doc) => {
	        //console.log(`${doc.id} => ${doc.data()}`);
	        user["id"] = doc.id;
	        user["firstname"] = doc.data()["firstname"];
	        user["lastname"] = doc.data()["lastname"];
	        user["phone"] = doc.data()["phone"];
	        user["doctor"] = doc.data()["doctor_id"];
	        localStorage.setItem('user', JSON.stringify(user));
	        checkLogin();
	    });
	});

	//
}



