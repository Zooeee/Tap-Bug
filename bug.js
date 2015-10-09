var canvas = document.getElementById("board");
var context = canvas.getContext("2d");
var bugs = [];
var foods = [];
var score = 0;

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
	info = {
		x: x,
		y: y,
		speed: 200;
		point: 5;
	};

	bugs.push(info);
	//console.log(bugs[0]);
	context.save();
	context.scale(0.5, 2);
	context.beginPath();
	context.arc(x, y/2, z * 2, 0, 2 * Math.PI, false);
	context.fillStyle = "red";
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

}
makeBug(40, 20, 4, "");
makeBug(randomX(), 0, 4, "");

function addBug() {
	//add bug and a random time with the designed percentage
	bugTimeout = setTimeout(makeBug(randomX(), 20, 4, ""), randomTime(10));
}

function randomCoord(){
	a = 5;
	while(a>0){
		x = Math.random()*398;
		y = Math.random()*(600-120) + 120;
		var foodCoord = {
			x: x,
			y: y
		};
		drawFood(x, y, 5);
		foods.push(foodCoord);
		a--;
	}
}
randomCoord();

function randomTime(){
	min = 1;
	max = 3;
	interval = max - min;
	return Math.floor((Math.random() * interval) + min);
}

function randomX(){
	min = 10;
	max = 390;
	interval = max - min;
	return ((Math.random() * interval) + min)
}

function findFood() {

}
//bugCreationID = setInterval(makeBug(randomX(), 0, 4, ""), randomTime());
//var timer = setInterval(myTimer, 5 * 1000);

canvas.addEventListener("mousedown", kill, false);
function kill(event){
	var x = event.offsetX;
	var y = event.offsetY;
	for (c = 0; c < bugs.length -1; c++){
		if(Math.abs(bugs[c].x - x) <= 30 && Math.abs(bugs[c].y - y) <= 30){
			deleteBug(bugs[c]);
			remove(bugs[c]);
			score += bugs[c].score
		}
	}
}

function deleteBug(pos) {
	//delete the bug -> remove the position from the list and remove it from the canvas
	current = bugs[pos]
	bugs = bugs.splice(pos, 1);


}

function remove (pos) {
	//alpha = 0;
	//delta = 0.03;
	//if (alpha <= 0 || alpha >= 1) delta = -delta;
	context.clearRect(x, y, 40, 40);
}

function eat() {
	// if a bug is at a food, delete the food
}
function deleteFood(pos){
	//delete the food -> remove from the list and change the color to white
}


