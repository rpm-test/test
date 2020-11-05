


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

/*

// Create a Recaptcha verifier instance globally
  // Calls submitPhoneNumberAuth() when the captcha is verified
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "normal",
      callback: function(response) {
        submitPhoneNumberAuth();
      }
    }
  );

  // This function runs when the 'sign-in-button' is clicked
  // Takes the value from the 'phoneNumber' input and sends SMS to that phone number
  function submitPhoneNumberAuth() {
    var phoneNumber = $("#phone").val();
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function(confirmationResult) {
        window.confirmationResult = confirmationResult;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // This function runs when the 'confirm-code' button is clicked
  // Takes the value from the 'code' input and submits the code to verify the phone number
  // Return a user object if the authentication was successful, and auth is complete
  function submitPhoneNumberAuthCode() {
    var code = document.getElementById("code").value;
    confirmationResult
      .confirm(code)
      .then(function(result) {
        var user = result.user;
        console.log(user);
      })
      .catch(function(error) {
        console.log(error);
      });
  }*/

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



