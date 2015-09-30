function pageTransition(){
	document.open('text/html');
	document.write("<!DOCTYPE html><html><head><script src='tap.js'type='text/javascript'></script><link rel='stylesheet' type='text/css' href='style.css'></head><body onload='countDown(59)'><h2>Tap Tap Bug</h2><div class='mainTab' id='main'><div class='tab'>Time:<span id='time'>01:00</span></div><div class='tab'>Pause ||</div><div class='tab'>Score:</div></div></body></html>");
	document.close();
}

function countDown(i){
    var set = setInterval(function(){
        document.getElementById("time").innerHTML = '00:' + i;
        i-- || clearInterval(set) || popUp();
    }, 1000);
}

function popUp(){
    alert('Time up!');
}