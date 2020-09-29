

var canvas;
var context;


var canvasWidth = 100;
var canvasHeight = 100;
var padding = 25;
var lineWidth = 2;

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

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


	
	window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = canvasDiv.offsetWidth;
            canvas.height = canvasDiv.offsetHeight;
            redraw()
    }
    resizeCanvas();

	$('#canvas').mousedown(function(e){
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
			
	  paint = true;
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop - header[0].offsetHeight);
	  redraw();
	});

	$('#canvas').mousemove(function(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop - header[0].offsetHeight, true);
	    redraw();
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
		redraw();
	}, false);

	canvas.addEventListener("touchmove", function(e){
		
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop - header[0].offsetHeight;
					
		if(paint){
			addClick(mouseX, mouseY, true);
			redraw();
		}
		e.preventDefault()
	}, false);

	canvas.addEventListener("touchend", function(e){
		paint = false;
	  	redraw();
	}, false);

	canvas.addEventListener("touchcancel", function(e){
		paint= false;
	}, false);

}


function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
  context.strokeStyle = "#df4b26";
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

