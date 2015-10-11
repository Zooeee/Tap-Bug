var canvas;
var surface;
var currentScreen;
var mainGameScreen;
var bugs = [];
var foods = [];
var fullCircle = Math.PI * 2;


function beginLoop() {
    var frameId = 0;

    function loop() {
        frameId = window.requestAnimationFrame(loop);
        currentScreen.update();
        currentScreen.draw(surface);
    }
    loop();
}

canvas = document.getElementById("board");
//canvas.setAttribute('width', 400);
//canvas.setAttribute('height', 600);

surface = canvas.getContext('2d');

function makeBugs() {
    var position = {
        x: randomX(),
        y: 0
    };

    var turnSpeed = fullCircle / 30;
    var speed = 0.2;
    var orientation = 0;
    var target = findNewTarget();

    function makeBug(position, ctx, z, type) {
        ctx.translate(position.x, position.y);
        ctx.rotate(orientation + Math.PI * 0.5);
        ctx.beginPath();
        ctx.scale(0.5, 2);
				ctx.arc(x, y/2, z * 2, 0, 2 * Math.PI);
				//ctx.arc(0, 0, z, 0, 2 * Math.PI);
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

    function draw(ctx) {
        ctx.save();
        makeBug(ctx, 5, "orange");
        ctx.restore();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.arc(target.x, target.y, 2, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function update() {
        var y = target.y - position.y;
        var x = target.x - position.x;
        var d2 = Math.pow(x, 2) + Math.pow(y, 2);
        if (d2 < 16) {
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
        var target = {
            x: Math.round(Math.random() * 400),
            y: Math.round(Math.random() * 600)
        };

        return target;
    }

    return {
        draw: draw,
        update: update
    }
}

// define the main screen for the game
mainGameScreen = (function () {

    var entities = [];
    var numOfEnemyShips = 4;

    function start() {

        for (var i = 0; i <= numOfEnemyShips; i++) {
            entities.push(makeBugs(i * 10, i));
        }
    }

    function draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var entityIndex = entities.length - 1;
        for (; entityIndex != 0; entityIndex--) {
            entities[entityIndex].draw(ctx);
        }
    }

    function update(elapsed) {
        var entityIndex = entities.length - 1;
        for (; entityIndex != 0; entityIndex--) {
            entities[entityIndex].update(elapsed);
        }
    }

    return {
        draw: draw,
        update: update,
        start: start
    };
}());

function randomX(){
	min = 10;
	max = 390;
	interval = max - min;
	return ((Math.random() * interval) + min)
}

currentScreen = mainGameScreen;
currentScreen.start();

beginLoop();
