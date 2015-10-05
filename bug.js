var canvas = document.getElementById("board");
var context = canvas.getContext("2d");
var bugs = [];

function drawFood(x, y, z) {
	context.beginPath();
	context.arc(x, y, z * 2, 0, 2 * Math.PI);
	context.fillStyle = "#855C33";
	context.stroke();
	context.fill();
	context.closePath();
}

//drawFood(30, 125, 5);

function makeBug(x, y, z, type){
	context.save();
	context.scale(0.5, 2);
	context.beginPath();
	context.arc(x, y/2, z * 2, 0, 2 * Math.PI, false);
	context.restore();
	context.stroke();
	context.closePath();

	//front-left leg
	context.beginPath();
	context.moveTo(x/2 - z, y-z);
	context.lineTo(x/2-z-5, y-z-5);
	context.stroke();
	context.closePath();

	//front-right leg
	context.beginPath();
	context.moveTo(x/2 + z, y-z);
	context.lineTo(x/2+z+5, y-z-5);
	context.stroke();
	context.closePath();

	//hind-left leg
	context.beginPath();
	context.moveTo(x/2 - z, y+z);
	context.lineTo(x/2-z-5, y+z+5);
	context.stroke();
	context.closePath();

	//hind-right leg
	context.beginPath();
	context.moveTo(x/2+z, y+z);
	context.lineTo(x/2+z+5, y+z+5);
	context.stroke();
	context.closePath();

	return (x, y)
}
//makeBug(40, 20, 4, "");

function randomCoord(){
	a = 10;
	while(a>0){
		drawFood(Math.random()*398, Math.random()*(600-120) + 120, 5, "");
		a--;
	}
}
randomCoord();
//var timer = setInterval(myTimer, 5 * 1000);
/**
canvas.addEventListener("mousedown", kill, false);
function kill(event){
	var x = event.offsetX;
	var y = event.offsetY;
	if()
}
**/
