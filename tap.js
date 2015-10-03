function pageTransition(){
	document.open('text/html');
	document.write("<!DOCTYPE html><html><head><script src='tap.js'type='text/javascript'></script><link rel='stylesheet' type='text/css' href='style.css'></head><body onload='countDown()'><h2>Tap Tap Bug</h2><div class='mainTab' id='main'><div class='tab'>Time:<span id='time'>01:00</span></div><button class='tab' id='pause' onClick='pause()'>Pause</button><div class='tab'>Score:</div><canvas id='myCanvas'>Your browser does not support the HTML5 canvas tag.</canvas></div></body></html>");
	document.close();
}

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

function pause(){
    preventDefault();
    isPaused = true;
    document.getElementById("pause").innerHTML = "play";
}

