

var phoneNum = 1234567890
var user = {};


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

//This function runs everytime the auth state changes. Use to verify if the user is logged in
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	  login(user.phoneNumber)
	} else {
	  // No user is signed in.
	  console.log("USER NOT LOGGED IN");
	}
});

function login(phoneNumber) {

	console.log(phoneNumber);

	db.collectionGroup('patients')
	  .where('phone', '==', phoneNumber.substr(2))
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



