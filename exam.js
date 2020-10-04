 

var canvas;
var context;


var canvasWidth = 100;
var canvasHeight = 100;
var padding = 25;
var lineWidth = 2;
var spiralImage = new Image();
var waveImage = new Image();
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

var curTest = "spiral";
var testCount = 0;

var curReport = "";
var reportData = {};


var firebaseConfig = {
	"apiKey": "AIzaSyCGvKK4jxIjZnWdeCJRQwnERv-CnXtyGPs",
    "authDomain": "testrpm-e5b42.firebaseapp.com",
    "databaseURL": "https://testrpm-e5b42.firebaseio.com",
    "projectId": "testrpm-e5b42",
    "storageBucket": "testrpm-e5b42.appspot.com"
}

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref()


var messages = {
		"spiral" : "Use your stylus to trace the spiral",
		"wave" : "Use your stylus to trace the wave",
		"ft_right" : "Use your right index finger to repeatedly tap both squares",
		"ft_left" : "Use your left index finger to repeatedly tap both squares",
		"dysk" : "Hold your phone at rest for 10 seconds",
		"audio" : "Tell your doctor about your symptoms and medications",
		"updrs" : "Sit back arms length and follow directions"
	}



var tests = ["spiral", "wave", "ft_left", "ft_right", "dysk", "audio", "updrs"]




function resourceLoaded()
{
	redraw(true);
}

function prepareCanvas()
{
	var header = document.getElementsByTagName('header');
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasDiv.offsetWidth);
	canvas.setAttribute('height', canvasDiv.offsetHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");

	spiralImage.onload = function() { resourceLoaded(); 
	};
	spiralImage.setAttribute('crossorigin', 'anonymous');
	spiralImage.src = "assets/spiral.png";	

	waveImage.onload = function() { resourceLoaded(); 
	};
	waveImage.setAttribute('crossorigin', 'anonymous');
	waveImage.src = "assets/wave.png";	

	window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = canvasDiv.offsetWidth;
            canvas.height = canvasDiv.offsetHeight;
            redraw(true)
    }
    resizeCanvas();

	$('#canvas').mousedown(function(e){
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
			
	  paint = true;
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop - header[0].offsetHeight);
	  redraw(true);
	});

	$('#canvas').mousemove(function(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop - header[0].offsetHeight, true);
	    redraw(true);
	  }
	});

	$('#canvas').mouseup(function(e){
	  paint = false;
	});

	$('#canvas').mouseleave(function(e){
	  paint = false;
	});

	canvas.addEventListener("touchstart", function(e)
	{
		// Mouse down location
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop - header[0].offsetHeight;
		
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw(true);
	}, false);

	canvas.addEventListener("touchmove", function(e){
		
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop - header[0].offsetHeight;
					
		if(paint){
			addClick(mouseX, mouseY, true);
			redraw(true);
		}
		e.preventDefault()
	}, false);

	canvas.addEventListener("touchend", function(e){
		paint = false;
	  	redraw(true);
	}, false);

	canvas.addEventListener("touchcancel", function(e){
		paint= false;
	}, false);

}


function prepareFTCanvas()
{
	var header = document.getElementsByTagName('header');
	var canvasDiv = document.getElementById('canvasDiv');
	canvasDiv.innerHTML = "";
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasDiv.offsetWidth);
	canvas.setAttribute('height', canvasDiv.offsetHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");

	context.fillStyle ='red';
  	context.fillRect(canvas.width/2 - 75, canvas.height/2 - 25, 50, 50);
  	context.fillRect(canvas.width/2 + 25, canvas.height/2 - 25, 50, 50);
	

	window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = canvasDiv.offsetWidth;
            canvas.height = canvasDiv.offsetHeight;
            redraw_FT();
    }
    resizeCanvas();

	$('#canvas').mousedown(function(e){
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
			
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop - header[0].offsetHeight);
	  if (mouseX > canvas.width/2 - 75 && mouseX < canvas.width/2 - 25 && mouseY > canvas.height/2 - 25 &&  mouseY < canvas.height/2 + 25) {
			redraw_FT("left");
			setTimeout(function(){ redraw_FT() }, 300);
		} else if (mouseX > canvas.width/2 + 25 && mouseX < canvas.width/2 + 75 && mouseY > canvas.height/2 - 25 &&  mouseY < canvas.height/2 + 25) {
			redraw_FT("right");
			setTimeout(function(){ redraw_FT() }, 300);
		} else {
			redraw_FT();
		}
	});

	canvas.addEventListener("touchstart", function(e)
	{
		// Mouse down location
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop - header[0].offsetHeight;
		
		addClick(mouseX, mouseY, false);

		if (mouseX > canvas.width/2 - 75 && mouseX < canvas.width/2 - 25 && mouseY > canvas.height/2 - 25 &&  mouseY < canvas.height/2 + 25) {
			redraw_FT("left");
			setTimeout(function(){ redraw_FT() }, 300);
		} else if (mouseX > canvas.width/2 + 25 && mouseX < canvas.width/2 + 75 && mouseY > canvas.height/2 - 25 &&  mouseY < canvas.height/2 + 25) {
			redraw_FT("right");
			setTimeout(function(){ redraw_FT() }, 300);
		} else {
			redraw_FT();
		}
		
	}, false);


}




function clearCanvas()
{
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	clickX = [];
	clickY = [];
	clickDrag = [];

	if (curTest == "spiral") {
	  	var spiral_size = context.canvas.height > context.canvas.width ? context.canvas.width : context.canvas.height;

	  	context.drawImage(spiralImage, context.canvas.width / 2 - spiral_size / 2,
	        context.canvas.height / 2 -  spiral_size / 2, spiral_size, spiral_size);
	  } else if (curTest == "wave") {
	  	var wave_size = context.canvas.height > context.canvas.width ? context.canvas.width : context.canvas.height;

	  	context.drawImage(waveImage, context.canvas.width / 2 - wave_size / 2,
	        context.canvas.height / 2 -  wave_size / 2, wave_size, wave_size);
	  } else if (curTest == "ft_left" || curTest == "ft_right") {
	  	context.fillStyle ='red';
  		context.fillRect(canvas.width/2 - 75, canvas.height/2 - 25, 50, 50);
  		context.fillRect(canvas.width/2 + 25, canvas.height/2 - 25, 50, 50);
	  }

}


function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw_FT(sel) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle ='red';
  if (sel == "left") {
  	context.fillRect(context.canvas.width/2 + 25, context.canvas.height/2 - 25, 50, 50);
  	context.fillStyle ='blue';
  	context.fillRect(context.canvas.width/2 - 75, context.canvas.height/2 - 25, 50, 50);
  }
  else if (sel == "right") {
  	context.fillRect(context.canvas.width/2 - 75, context.canvas.height/2 - 25, 50, 50);
  	context.fillStyle ='blue';
  	context.fillRect(context.canvas.width/2 + 25, context.canvas.height/2 - 25, 50, 50);
  } else {
  	context.fillRect(context.canvas.width/2 + 25, context.canvas.height/2 - 25, 50, 50);
  	context.fillRect(context.canvas.width/2 - 75, context.canvas.height/2 - 25, 50, 50);
  }
  
  
}

function redraw(drawBackground){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
  if (drawBackground) {
	  if (curTest == "spiral") {
	  	var spiral_size = context.canvas.height > context.canvas.width ? context.canvas.width : context.canvas.height;

	  	context.drawImage(spiralImage, context.canvas.width / 2 - spiral_size / 2,
	        context.canvas.height / 2 -  spiral_size / 2, spiral_size, spiral_size);
	  } else if (curTest == "wave") {
	  	var wave_size = context.canvas.height > context.canvas.width ? context.canvas.width : context.canvas.height;

	  	context.drawImage(waveImage, context.canvas.width / 2 - wave_size / 2,
	        context.canvas.height / 2 -  wave_size / 2, wave_size, wave_size);
	  }
  }
  

  context.strokeStyle = "red";

  if (!drawBackground) {
  	context.strokeStyle = "black";
  }
  context.lineJoin = "round";
  context.lineWidth = 2;
			
  for(var i=0; i < clickX.length; i++) {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}


// LOGIC

function createReport() {
	var user = JSON.parse(localStorage.getItem('user'));

	console.log(user);

	reportData = {
		"created": firebase.firestore.Timestamp.now()
	}

	db.collection('doctors')
	.doc(user["doctor"])
	.collection('patients')
	.doc(user["id"])
	.collection('reports')
	.add(reportData)
	.then(function(docRef) {
	    curReport = docRef.id;
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
}

function updateReport() {
	var user = JSON.parse(localStorage.getItem('user'));

	db.collection('doctors')
	.doc(user["doctor"])
	.collection('patients')
	.doc(user["id"])
	.collection('reports')
	.doc(curReport)
	.set(reportData)
	.then(function(docRef) {
	    console.log("updated")
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
}



function uploadFirebase(test, file, params) {
	var user = JSON.parse(localStorage.getItem('user'));
	var refString = user["id"] + "/" + curReport + "/" + test + ".jpg";
	var uploadRef = storageRef.child(refString);
	return uploadRef.putString(file.src, 'data_url');
}


function completeCurrent() {
	if (curTest == "spiral") {
		redraw(false);
		var img = new Image();
		img.src = context.canvas.toDataURL();
		params = {
			"clickX": clickX,
			"clickY": clickY,
			"time": 5
		}
		uploadFirebase(curTest, img, params).then(function(snapshot) {
		  	snapshot.ref.getDownloadURL().then(function(downloadURL) {
		  		reportData["spiral"] = downloadURL;
				updateReport();
	  		});
		});
		clearCanvas();
	}
	if (curTest == "wave") {
		redraw(false);
		var img = new Image();
		img.src = context.canvas.toDataURL();
		params = {}
		uploadFirebase(curTest, img, params).then(function(snapshot) {
		  	snapshot.ref.getDownloadURL().then(function(downloadURL) {
		  		reportData["wave"] = downloadURL;
				updateReport();
	  		});
		});
		clearCanvas();
	}
	if (curTest == "ft_left") {
		clearCanvas();
	}
	if (curTest == "ft_right") {
		clearCanvas();
	}
	testCount++;
}

function loadNext() {
	curTest = tests[testCount];
	$("#message").html(messages[curTest]);
	if (testCount == tests.length - 1) {
		$("#next").html("Done");
	}
	if (curTest == "spiral" || curTest == "wave") {
		redraw(true);
	}
	else if (curTest == "ft_left") {
		prepareFTCanvas();
	}
	else if (curTest == "ft_right") {
		prepareFTCanvas();
	}
	else if (curTest == "dysk") {

	}
	else if (curTest == "audio") {
	}
	else if (curTest == "video") {
	}
}

function next() {
	completeCurrent();
	loadNext();
}

function restart() {
	clearCanvas();
}

function checkLogin(){
	if (!localStorage.getItem('user')) {
		window.location.replace("/");
	}
}

window.onload = (event) => {
	checkLogin();
	createReport();
	prepareCanvas();
};

/*
window.onunload = function() {
     
}*/




