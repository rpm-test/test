 

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

var motionData = {
	"data": new Array()
};

var ft_sel = "";

var clickTimes = new Array();

var drawTimer;
var timeDraw = 0;

var shouldStop = false;
var stopped = false;

var audioTimer;
var timeAudio = 0;


var leftchannel = [];
var rightchannel = [];
var recorder = null;
var recordingLength = 0;
var volume = null;
var mediaStream = null;
var sampleRate = 48000;
var audiocontext = null;
var blob = null;
var curstream = null;


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
		"ft_right" : "Use your right index finger to alternately tap both squares",
		"ft_left" : "Use your left index finger to alternately tap both squares",
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
	//canvas.setAttribute('tabindex', '1');
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
	  drawTimer = setInterval(function(){
	  	timeDraw++;
	  }, 500);
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
	  clearInterval(drawTimer);
	});

	$('#canvas').mouseleave(function(e){
	  paint = false;
	  clearInterval(drawTimer);
	});

	canvas.addEventListener("touchstart", function(e)
	{
		// Mouse down location
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop - header[0].offsetHeight;
		
		paint = true;
		addClick(mouseX, mouseY, false);
		drawTimer = setInterval(function(){
		  	timeDraw++;
		  }, 500);
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
		clearInterval(drawTimer);
	  	redraw(true);
	}, false);

	canvas.addEventListener("touchcancel", function(e){
		paint= false;
		clearInterval(drawTimer);
	}, false);

	/*

	window.addEventListener('keydown', (e) => {
		console.log(e.key);
		if (e.key === "c") {
			paint = true;
			drawTimer = setInterval(function(){
			  	timeDraw++;
			  }, 1000);
			  redraw(true);
		}
	});

	window.addEventListener('keyup', (e) => {
		if (e.key === "c") {
			paint = false;
			clearInterval(drawTimer);
		  	redraw(true);
		}
	});*/

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
	  		if (ft_sel !== "left") {
	  			var d = new Date();
				var n = d.getTime();
	  			clickTimes.push(n);
	  			ft_sel = "left";
	  		}
						
		} else if (mouseX > canvas.width/2 + 25 && mouseX < canvas.width/2 + 75 && mouseY > canvas.height/2 - 25 &&  mouseY < canvas.height/2 + 25) {
			if (ft_sel !== "right") {
	  			var d = new Date();
				var n = d.getTime();
	  			clickTimes.push(n);
	  			ft_sel = "right";
	  		}
		} 

		if (clickTimes.length > 20) {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			$('#next').prop('disabled', false);
			context.font = '40px sans-serif';
			context.fillStyle = "black";
  			context.fillText('Done!', canvas.width/2 - 50, canvas.height/2);
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
	  		if (ft_sel !== "left") {
	  			var d = new Date();
				var n = d.getTime();
	  			clickTimes.push(n);
	  			ft_sel = "left";
	  		}
						
		} else if (mouseX > canvas.width/2 + 25 && mouseX < canvas.width/2 + 75 && mouseY > canvas.height/2 - 25 &&  mouseY < canvas.height/2 + 25) {
			if (ft_sel !== "right") {
	  			var d = new Date();
				var n = d.getTime();
	  			clickTimes.push(n);
	  			ft_sel = "right";
	  		}
		} 

		if (clickTimes.length > 20) {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			$('#next').prop('disabled', false);
			context.font = '40px sans-serif';
			context.fillStyle = "black";
  			context.fillText('Done!', canvas.width/2 - 50, canvas.height/2);
		} else {
			redraw_FT();
		}

	  	
		
	}, false);


}

function prepareMotionCanvas() {
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

	console.log("Preparing motion listener")

	if(window.DeviceMotionEvent){
		if (typeof( window.DeviceMotionEvent.requestPermission ) === "function") {
			window.DeviceMotionEvent.requestPermission()
	            .then( response => {
	            // (optional) Do something after API prompt dismissed.
	            if ( response == "granted" ) {
	                window.addEventListener("devicemotion", motion, true);
	                context.font = '20px sans-serif';
					context.fillStyle = "black";
					context.fillText('Recording motion...', canvas.width/2 - 75, canvas.height/2);
	                setTimeout(finishMotion, 10000);
	            }
	        })
		} else {
			window.addEventListener("devicemotion", motion, true);
			context.font = '20px sans-serif';
			context.fillStyle = "black";
			context.fillText('Recording motion...', canvas.width/2 - 75, canvas.height/2);
			setTimeout(finishMotion, 10000);
		}
	}else{
	  console.log("DeviceMotionEvent is not supported");
	  $('#next').prop('disabled', false);
	}
}

function motion(event) {
	var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    var motionArray = [x, y, z];

    if (!motionData["interval"]) {
    	motionData["interval"] = event.interval;
    }

    motionData["data"].push(motionArray);
} 

function finishMotion() {
	window.removeEventListener("devicemotion", motion, true); 
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.font = '40px sans-serif';
	context.fillStyle = "black";
	context.fillText('Done!', canvas.width/2 - 50, canvas.height/2);
	$('#next').prop('disabled', false);
}

function prepareAudioCanvas() {
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

	console.log("Preparing audio listener");

	var constraints = {audio: true, video: false};

	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccessAudio).catch(function(err){
		console.log("Error: " + err.message);
	})

	context.font = '20px sans-serif';
	context.fillStyle = "black";
	context.fillText('Listening...', canvas.width/2 - 50, canvas.height/2 - 20);

	audioTimer = setInterval(function(){
		context.clearRect(context.canvas.width/2 - 15, context.canvas.height/2 - 10, context.canvas.width/2 + 15, context.canvas.height/2 + 10);
	  	timeAudio++;
	  	var minutes = Math.floor(timeAudio/60);
	  	var seconds = timeAudio%60;
	  	if (minutes < 10) {
	  		minutes = "0" + minutes;
	  	}
	  	if (seconds < 10) {
	  		seconds = "0" + seconds;
	  	}
	  	context.font = '18px Helvetica';
		context.fillStyle = "black";
		context.fillText(minutes + ":" + seconds, canvas.width/2 - 8, canvas.height/2);
	}, 1000);
}

const handleSuccessAudio = function(stream) {

	console.log("user consent");

	curstream = stream;

    // creates the audio context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audiocontext = new AudioContext();

    // creates an audio node from the microphone incoming stream
    mediaStream = audiocontext.createMediaStreamSource(stream);

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
    // bufferSize: the onaudioprocess event is called when the buffer is full
    var bufferSize = 2048;
    var numberOfInputChannels = 2;
    var numberOfOutputChannels = 2;
    if (audiocontext.createScriptProcessor) {
        recorder = audiocontext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
    } else {
        recorder = audiocontext.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
    }

    recorder.onaudioprocess = function (e) {
        leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
        rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
        recordingLength += bufferSize;
    }

    // we connect the recorder
    mediaStream.connect(recorder);
    recorder.connect(audiocontext.destination);


	/*
	console.log("handleSuccess");
	console.log(stream);
    const options = {mimeType: 'audio/webm'};
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, options);


    mediaRecorder.addEventListener('dataavailable', function(e) {
    	console.log("dataavailable: " + shouldStop);
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }

      if(shouldStop === true && stopped === false) {
      	stream.getTracks().forEach(function(track) {
	        if (track.readyState == 'live') {
	            track.stop();
	        }
	    });
      	clearInterval(audioTimer);
        mediaRecorder.stop();
        stopped = true;
      }
    });

    mediaRecorder.addEventListener('stop', function() {

    	var dataBlob = new Blob(recordedChunks);

    	uploadFirebaseData("audio", dataBlob, ".webm").then(function(snapshot) {
  			snapshot.ref.getDownloadURL().then(function(downloadURL) {
  				reportData["patientNotes"]["audioURL"] = downloadURL;
  				updateReport();
  			});
  		});
    	

    	
      var url = URL.createObjectURL(new Blob(recordedChunks));
      var a = document.createElement("a");
	  document.body.appendChild(a);
	  a.style = "display: none";
	  a.href = url;
	  a.download = "test.webm";
	  a.click();
	  window.URL.revokeObjectURL(url);
    });

    mediaRecorder.start(1000);

    */
  };




function clearCanvas()
{
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	clickX = [];
	clickY = [];
	clickDrag = [];
	timeDraw = 0;
	clickTimes = [];
	ft_sel = "";
	motionData["data"] = new Array();

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

function redraw_FT() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle ='red';
  if (ft_sel == "left") {
  	context.fillRect(context.canvas.width/2 + 25, context.canvas.height/2 - 25, 50, 50);
  	context.fillStyle ='red';
  	context.fillRect(context.canvas.width/2 - 75, context.canvas.height/2 - 25, 50, 50);
  }
  else if (ft_sel == "right") {
  	context.fillRect(context.canvas.width/2 - 75, context.canvas.height/2 - 25, 50, 50);
  	context.fillStyle ='red';
  	context.fillRect(context.canvas.width/2 + 25, context.canvas.height/2 - 25, 50, 50);
  } else {
  	context.fillRect(context.canvas.width/2 + 25, context.canvas.height/2 - 25, 50, 50);
  	context.fillRect(context.canvas.width/2 - 75, context.canvas.height/2 - 25, 50, 50);
  }
  
  context.font = '15px sans-serif';
  context.fillStyle = "black";
  context.fillText(clickTimes.length, canvas.width/2 - 4, canvas.height/2 - 75);
  
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
		"created": firebase.firestore.Timestamp.now(),
		"overview": {
			"medicationTimes": "",
			"tremorScore": "",
			"bradykinesiaScore": "",
			"dyskinesiaScore": ""
		},
		"spiralWave": {
			"spiral": {
				"imageURL": "",
				"statsURL": "",
				"completionTime": "",
				"tremorScore": "",
				"bradykinesiaScore": ""
			},
			"wave": {
				"imageURL": "",
				"statsURL": "",
				"completionTime": "",
				"tremorScore": "",
				"bradykinesiaScore": ""
			},
			"combined": {
				"completionTime": "",
				"tremorScore": "",
				"bradykinesiaScore": ""
			}
		},
		"fingerTapping": {
			"left": {
				"tapTimes": "",
				"averageTimeBetweenTaps": "",
				"bradykinesiaScore": ""
			},
			"right": {
				"tapTimes": "",
				"averageTimeBetweenTaps": "",
				"bradykinesiaScore": ""
			},
			"combined": {
				"averageTimeBetweenTaps": "",
				"bradykinesiaScore": ""
			}
		},
		"restMotion": {
			"motionURL": "",
			"powerData": "",
			"dyskinesiaScore": ""
		},
		"patientNotes": {
			"audioURL": "",
			"transcript": ""
		},
		"updrs": {
			"videoURL": "",
			"currentTasks" : ""
		},
		"review": {
			"timeSpent": "",
			"notes": ""
		}
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



function uploadFirebaseImage(test, file) {
	var user = JSON.parse(localStorage.getItem('user'));
	var refString = user["id"] + "/" + curReport + "/" + test + ".jpg";
	var uploadRef = storageRef.child(refString);
	return uploadRef.putString(file.src, 'data_url');
}

function uploadFirebaseData(test, file, extension) {
	var user = JSON.parse(localStorage.getItem('user'));
	var refString = user["id"] + "/" + curReport + "/" + test + extension;
	var uploadRef = storageRef.child(refString);
	return uploadRef.put(file);
}


function completeCurrent() {
	if (curTest == "spiral") {
		redraw(false);
		var img = new Image();
		img.src = context.canvas.toDataURL();
		params = {
			"clickX": clickX,
			"clickY": clickY,
			"time": timeDraw
		}

		dataBlob = new Blob([JSON.stringify(params)]);

		var test = curTest;
		
		uploadFirebaseImage(test, img).then(function(snapshot) {
		  	snapshot.ref.getDownloadURL().then(function(downloadURL) {
		  		reportData["spiralWave"]["spiral"]["imageURL"] = downloadURL;
		  		uploadFirebaseData(test, dataBlob, ".txt").then(function(snapshot) {
		  			snapshot.ref.getDownloadURL().then(function(downloadURL) {
		  				reportData["spiralWave"]["spiral"]["statsURL"] = downloadURL;
		  				updateReport();
		  			});
		  		});
				
	  		});
		});
		clearCanvas();
	}
	if (curTest == "wave") {
		redraw(false);
		var img = new Image();
		img.src = context.canvas.toDataURL();
		params = {
			"clickX": clickX,
			"clickY": clickY,
			"time": timeDraw
		}

		dataBlob = new Blob([JSON.stringify(params)]);

		var test = curTest;
		
		uploadFirebaseImage(test, img, params).then(function(snapshot) {
		  	snapshot.ref.getDownloadURL().then(function(downloadURL) {
		  		reportData["spiralWave"]["wave"]["imageURL"] = downloadURL;
				uploadFirebaseData(test, dataBlob, ".txt").then(function(snapshot) {
		  			snapshot.ref.getDownloadURL().then(function(downloadURL) {
		  				reportData["spiralWave"]["wave"]["statsURL"] = downloadURL;
		  				updateReport();
		  			});
		  		});
	  		});
		});
		clearCanvas();
	}
	if (curTest == "ft_left") {
		reportData["fingerTapping"]["left"]["tapTimes"] = clickTimes;
		updateReport();
		clearCanvas();
	}
	if (curTest == "ft_right") {
		reportData["fingerTapping"]["right"]["tapTimes"] = clickTimes; 
		updateReport();
		clearCanvas();
	}
	if (curTest == "dysk") {

		dataBlob = new Blob([JSON.stringify(motionData)]);

		uploadFirebaseData(curTest, dataBlob, ".txt").then(function(snapshot) {
  			snapshot.ref.getDownloadURL().then(function(downloadURL) {
  				reportData["restMotion"]["motionURL"] = downloadURL;
  				updateReport();
  			});
  		});
		clearCanvas();
	}
	if (curTest == "audio") {
		recorder.disconnect(audiocontext.destination);
        mediaStream.disconnect(recorder);

        curstream.getTracks().forEach(function(track) {
	        if (track.readyState == 'live') {
	            track.stop();
	        }
	    });
      	clearInterval(audioTimer);

        // we flat the left and right channels down
        // Float32Array[] => Float32Array
        var leftBuffer = flattenArray(leftchannel, recordingLength);
        var rightBuffer = flattenArray(rightchannel, recordingLength);
        // we interleave both channels together
        // [left[0],right[0],left[1],right[1],...]
        var interleaved = interleave(leftBuffer, rightBuffer);

        // we create our wav file
        var buffer = new ArrayBuffer(44 + interleaved.length * 2);
        var view = new DataView(buffer);

        // RIFF chunk descriptor
        writeUTFBytes(view, 0, 'RIFF');
        view.setUint32(4, 44 + interleaved.length * 2, true);
        writeUTFBytes(view, 8, 'WAVE');
        // FMT sub-chunk
        writeUTFBytes(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // chunkSize
        view.setUint16(20, 1, true); // wFormatTag
        view.setUint16(22, 2, true); // wChannels: stereo (2 channels)
        view.setUint32(24, sampleRate, true); // dwSamplesPerSec
        view.setUint32(28, sampleRate * 4, true); // dwAvgBytesPerSec
        view.setUint16(32, 4, true); // wBlockAlign
        view.setUint16(34, 16, true); // wBitsPerSample
        // data sub-chunk
        writeUTFBytes(view, 36, 'data');
        view.setUint32(40, interleaved.length * 2, true);

        // write the PCM samples
        var index = 44;
        var volume = 1;
        for (var i = 0; i < interleaved.length; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }

        // our final blob
        dataBlob = new Blob([view], { type: 'audio/wav' });
        uploadFirebaseData("audio", dataBlob, ".wav").then(function(snapshot) {
  			snapshot.ref.getDownloadURL().then(function(downloadURL) {
  				reportData["patientNotes"]["audioURL"] = downloadURL;
  				updateReport();
  			});
  		});

		clearCanvas();
	}
	if (curTest == "video") {

	}
	if (testCount >= tests.length) {
		reportData["completed"] = "true";
		updateReport();
	}
}

function loadNext() {
	testCount++;
	curTest = tests[testCount];
	$("#step").html("Step " + (testCount + 1) + "/7");
	$("#message").html(messages[curTest]);
	if (testCount == tests.length - 1) {
		$("#next").html("Done");
	}

	if (curTest == "spiral" || curTest == "wave") {
		redraw(true);
	}
	else if (curTest == "ft_left") {
		$('#next').prop('disabled', true);
		prepareFTCanvas();
	}
	else if (curTest == "ft_right") {
		$('#next').prop('disabled', true);
		prepareFTCanvas();
	}
	else if (curTest == "dysk") {
		$('#next').prop('disabled', true);
		prepareMotionCanvas();
	}
	else if (curTest == "audio") {
		prepareAudioCanvas();
	}
	else if (curTest == "video") {

	}
	else {

	}
}

function next() {
	completeCurrent();
	loadNext();
}

function skip() {
	loadNext();
}

function restart() {
	clearCanvas();
	if (curTest == "ft_left" || curTest == "ft_right" || curTest == "dysk") {
	  	$('#next').prop('disabled', true);
	}
}

function checkLogin(){
	if (!localStorage.getItem('user')) {
		window.location.replace("./");
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




