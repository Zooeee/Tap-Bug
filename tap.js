function pageTransition(){
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("gamePanel").style.display = "initial";
    countDown();
    level();
}

window.onload = function () { document.getElementById("gamePanel").style.display = "none"; }

var isPaused = false;
var i = 59;

function countDown(){
    var set = setInterval(function(){
        if(!isPaused){
            document.getElementById("time").innerHTML = '00:' + i;
            i-- || clearInterval(set) || popUp();}
    }, 1000);
}

function popUp(){
    alert('Time up!');
}

function toggleCountDown(){
    targetEvent = isPaused ? false : true;
    text = isPaused ? "Pause" : "Resume";
    isPaused = targetEvent;
    document.getElementById("pause").innerHTML = text;
}

function storage(){
    score = document.getElementById("score");
    if(typeof(Storage) !== "undefined"){
        if(localStorage.highest){
          if(localStorage.highest < current){
            localStorage.highest = current;
          }
          document.getElementById("highest").innerHTML= localStorage.highest;
        }
    }
    else{
        document.getElementById("score").innerHTML = "Sorry your browser does not support web storage";
    }
}

var canvas;
var surface;
var currentScreen;
var mainGameScreen;
var bugs = [];
var foods = [];
var fullCircle = Math.PI * 2;
var types = ["orange", "red", "black"];
var easy = false;
var current;
canvas = document.getElementById('board');

function level(){
  var val = document.getElementById('easy-checked');
	if(val.checked){
		easy = true;
	}
}

function beginLoop() {
    var frameId = 0;

    function loop() {
      if(!isPaused){
        setTimeout(function(){
          currentScreen.update();
          currentScreen.draw(surface);
          document.getElementById("current").innerHTML = current;
        }, 1000/100);
      }
      frameId = window.requestAnimationFrame(loop);
  }
    loop();
}


surface = canvas.getContext('2d');

function randomTime() {
    min = 1;
    max = 3;
    interval = max - min;
    return Math.floor((Math.random() * interval) + min);
}

function randomX() {
    min = 10;
    max = 390;
    interval = max - min;
    return ((Math.random() * interval) + min)
}

function food() {
    var pos = {
      x:  Math.random() * 398,
      y: Math.random() * (600 - 120) + 120
    };

    function drawFood(ctx) {
        ctx.beginPath();
        //console.log(pos.x);
        ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#855C33";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    return {
        drawFood: drawFood,
        x: pos.x,
        y: pos.y
    }
}

function makeBugs() {
    var position = {
        x: randomX(),
        y: 0
    };
    var turnSpeed = fullCircle / 20;
		var type;
    var speed;
		var point;
    var orientation = 0;
    var target = findNewTarget();

		function type() {
        var possibility = Math.random();
        if (possibility < 0.4) {
            type = types[0];
						point = 1;
						if(easy){
							speed = 0.6;
						}
						else{
							speed = 0.8;
						}
        }
        if (possibility >= 0.4 && possibility <= 0.7) {
            type = types[1];
						point = 3;
						if(easy){
							speed = 0.75;
						}
						else{
							speed = 1;
						}
        }
        if (possibility > 0.7) {
            type = types[2];
						point = 5;
						if(easy){
							speed = 1.5;
						}
						else{
							speed = 2;
						}
        }
    }

    function makeBug(ctx, z, type) {
        ctx.translate(position.x, position.y);
        ctx.rotate(orientation + Math.PI * 0.5);
        ctx.beginPath();
        ctx.scale(0.5, 2);
        ctx.arc(0, 0, z, 0, 2 * Math.PI);
        ctx.fillStyle = type;
        ctx.stroke();
        ctx.fill();
        ctx.scale(2, .5);
        ctx.closePath();

        //front-left leg
        ctx.beginPath();
        ctx.moveTo(-z + 2, -z + 2);
        ctx.lineTo(-z - 3, -z - 3);
        ctx.stroke();
        ctx.closePath();

        //front-right leg
        ctx.beginPath();
        ctx.moveTo(z - 2, -z + 2);
        ctx.lineTo(z + 3, -z - 3);
        ctx.stroke();
        ctx.closePath();

        //hind-left leg
        ctx.beginPath();
        ctx.moveTo(-z + 2, z - 2);
        ctx.lineTo(-z - 3, z + 3);
        ctx.stroke();
        ctx.closePath();

        //hind-right leg
        ctx.beginPath();
        ctx.moveTo(z - 2, z - 2);
        ctx.lineTo(z + 3, z + 3);
        ctx.stroke();
        ctx.closePath();
    }

    function drawBug(ctx) {
        ctx.save();
        makeBug(ctx, 5, type);
        ctx.restore();
    }

    function update() {
        if(foods.indexOf(target) == -1){
          target = findNewTarget();
        }
        var y = target.y - position.y;
        var x = target.x - position.x;
        var d2 = Math.pow(x, 2) + Math.pow(y, 2);
        if (d2 < 50) {
						index = foods.indexOf(target);
						foods.splice(index, 1);
            target = findNewTarget();
        } else {
            var angle = Math.atan2(y, x);
            var delta = angle - orientation;
            var delta_abs = Math.abs(delta);

            if (delta_abs > Math.PI) {
                delta = delta_abs - fullCircle;
            }

            if (delta !== 0) {
                var direction = delta / delta_abs;
                orientation += (direction * Math.min(turnSpeed, delta_abs));
            }
            orientation %= fullCircle;

            position.x += Math.cos(orientation) * speed;
            position.y += Math.sin(orientation) * speed;
        }
			}

    function findNewTarget() {
        //calculate the closest path between the bug and food
        l = foods.length - 1;
        var minDistance = Number.MAX_VALUE;
        var minIndex = -1;
        for (; l >= 0; l--) {
            x = foods[l].x - position.x;
            y = foods[l].y - position.y;
            distance = Math.pow(x, 2) + Math.pow(y, 2);
            if (distance < minDistance) {
                minDistance = distance;
                minIndex = l;
            }
            if(minIndex == -1){
              gameOver();
            }
        }
        return foods[minIndex];
    }
		canvas.addEventListener('mousedown', killBug, false);
		function killBug(){
			var mouse = {
        x: event.x,
        y: event.y
    	}
    	mouse.x -= canvas.offsetLeft;
    	mouse.y -= canvas.offsetTop;
			for(p = 0; p < bugs.length -1; p++){
				if(Math.abs(mouse.x - x)<=30 && Math.abs(mouse.y - y)<=30){
					var killed = bugs.splice(p, 1);
				}
			}
		if(killed[0].type =="black"){
      current += 5;
    }
    if(killed[0].type =="red"){
      current += 3;
    }
    if(killed[0].type =="orange"){
      current += 1;
    }
		}

		type();

    return {
			type:type,
      drawBug: drawBug,
      update: update,
			x: x,
			y: y
    }
}

// define the main screen for the game
mainGameScreen = (function game() {
    var numOfFoods = 5;

    function create(){
      time = randomTime() * 1000;
      setTimeout(function(){
        bugs.push(makeBugs());
        create();
      }, time)
    }

    function start() {
      current = 0;
        for (var p = 0; p < numOfFoods; p++) {
            foods.push(food());
        }
				create();
    }

    function draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 400, 600);

        var indexBug = bugs.length - 1;
        for (; indexBug >= 0; indexBug--) {
            bugs[indexBug].drawBug(ctx);
        }

        var indexFood = foods.length - 1;
        for (; indexFood >= 0; indexFood--) {
            foods[indexFood].drawFood(ctx);
        }
    }

    function update(elapsed) {
        var index = bugs.length - 1;
        for (; index >= 0; index--) {
          bugs[index].update(elapsed);
        }
    }

    function gameOver(){
      if(confirm("Play again")){
        game();
      }
      else{
        window.close();
      }
    }

    return {
        draw: draw,
        update: update,
        start: start
    };
}());

currentScreen = mainGameScreen;
currentScreen.start();
beginLoop();
