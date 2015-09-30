function pageTransition(){
	document.open('text/html');
	document.write("<!DOCTYPE html><html><head><script src='tap.js'type='text/javascript'></script><link rel='stylesheet' type='text/css' href='style.css'></head><body onload='timer()'><h2>Tap Tap Bug</h2><div class='mainTab' id='main'><div class='tab'>Time:<span id='time'>01:00</span></div><div class='tab'>Pause ||</div><div class='tab'>Score:</div></div></body></html>");
	document.close();
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

function timer() {
    var oneMinutes = 60 * 1,
        display = document.querySelector('#time');
    startTimer(oneMinutes, display);
};

