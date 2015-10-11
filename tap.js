function pageTransition(){
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("gamePanel").style.display = "initial";
    countDown();
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
    if(typeof(Storage) === "undefined"){
        localStorage.score(highest);
        score.innerHTML = localStorage.getItem("highest");
    }
    else if(score > Number(localStorage.highest)){
        localStorage.score = score;
        score.innerHTML = localStorage.score;
    }
    else{
        document.getElementById("score").innerHTML = "Sorry your browser does not support web storage";
    }
}

