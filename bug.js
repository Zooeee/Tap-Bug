
var canvas, context

function draw(){
	canvas = document.getElementById('board');
	context = canvas.getContext('2d');
	canvas.addEventListener("mousedown", getPosition, false);
}


	/// Response to user tapping/clicking
function getPosition(event){ 
	var x = event.offsetX;
    var y = event.offsetY;
	context.font = "30px Arial";
	context.fillText("hi",x,y);
	//ref: http://www.w3schools.com/tags/canvas_beziercurveto.asp
	context.beginPath();
	context.moveTo(20,20);
	context.bezierCurveTo(20,100,200,100,200,20);
	context.stroke();
	}
