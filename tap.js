function pageTransition1(){
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("gamePanel").style.display = "initial";
    document.getElementById("afterGame").style.display = "none";
    countDown();
    level();
    currentScreen = mainGameScreen;
    currentScreen.start();
    beginLoop();
}


window.onload = function(){current = 0; storage()};


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
    gameOver();
    storage();
}

function toggleCountDown(){
    targetEvent = isPaused ? false : true;
    text = isPaused ? "Pause" : "Resume";
    isPaused = targetEvent;
    document.getElementById("pause").innerHTML = text;
}

function storage(){
    document.getElementById("gamePanel").style.display = "none";
    if(typeof(Storage) !== "undefined"){
        if (localStorage.getItem("highest") == undefined || Number(localStorage.getItem("highest")) < current){
          localStorage.setItem("highest", current);
          }
        document.getElementById("highest").innerHTML= localStorage.highest;
    }
    else{
        document.getElementById("highest").innerHTML = "Sorry your browser does not support web storage";
    }
  }

var canvas;
var surface;
var current;
var currentScreen;
var mainGameScreen;
var bugs = [];
var foods = [];
var fullCircle = Math.PI * 2;
var types = ["orange", "red", "black"];
var easy = false;
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
      x: Math.random() * 398,
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
    var turnSpeed = fullCircle / 10;
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
        if(target == undefined){
          gameOver();
          return;
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
              return;
            }
        }
        return foods[minIndex];
    }

		type();

    return {
			type:type,
      drawBug: drawBug,
      update: update,
      killBug: killBug,
			position: position
    }
}
canvas.addEventListener('mousedown', mouseDown, false);

function mouseDown(event){
  var mouse = {
    x: event.x,
    y: event.y
  }
  mouse.x -= canvas.offsetLeft;
  mouse.y -= canvas.offsetTop;

  killBug(mouse.x, mouse.y);
}

function killBug(x, y){
  function availableBugs(x, y){
      var available = [];
      for(var q = 0; q<bugs.length - 1; q++){
        currentPosition = bugs[q].position;
        disX = currentPosition.x - x;
        disY = currentPosition.y - y;
        distance = Math.pow(disX, 2) + Math.pow(disY, 2);
        if(distance <= 900){
          available.push(bugs[q]);
        }
      }
      return available;
  }
  function kill(x, y){
    var available;
    available = availableBugs(x, y);
    for(var q = 0; q < available.length; q++){
      index = bugs.indexOf(available[q]);
      killed = bugs.splice(index, 1);
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
  }
  kill(x, y);
  /**
  for(var q = 0; q < bugs.length - 1; q++){
    bugPosition = bugs[q].position;
    tempX = bugPosition.x - x;
    tempY = bugPosition.y - y;
    distance = Math.pow(tempX, 2) + Math.pow(tempY, 2);
    console.log(distance);
    if(distance <= 900){
      killed = bugs.splice(q, 1);
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
  }
  **/
}

// define the main screen for the game
mainGameScreen = (function game() {
    var numOfFoods = 5;

    function create(){
      if(!isPaused){
        time = randomTime() * 1000;
        setTimeout(function(){
          bugs.push(makeBugs());
          create();
        }, time)
      }
    }

    function start() {
      //current = 0;
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

    function update() {
        var index = bugs.length - 1;
        for (; index >= 0; index--) {
          bugs[index].update();
        }
        if(foods.length == 0){
          gameOver();
          return;
        }
    }

    return {
        draw: draw,
        update: update,
        start: start
    };
}());

function gameOver(){
  isPaused = true;
  document.getElementById("gamePanel").style.display = "none";
  document.getElementById("afterGame").style.display = "inline";
  document.getElementById("latest").innerHTML = current;
  storage();
}
