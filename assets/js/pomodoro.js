var workValues = [2, 45, 50];
var breakValues = [1, 15, 10];

var countDownTime = new Date().getTime() +
    workValues[document.getElementById("work-slider").value] * 60 * 1000;
var remaining = workValues[document.getElementById("work-slider").value] * 60 * 1000;

var timer;

var workMusic = new Audio();
var breakMusic = new Audio();

var work = false;
var play = false;
var mute = false;
var fresh = true;

// Change session from work to break and vice versa
function changeSession() {
    if (work == true) {
        work = false;

        countDownTime = new Date().getTime() +
            breakValues[document.getElementById("work-slider").value] * 60 * 1000;
    } else {
        work = true;

        countDownTime = new Date().getTime() +
            workValues[document.getElementById("work-slider").value] * 60 * 1000;
    }

    fresh = true;
    remaining = countDownTime;
}

// Display the countdown timer
function displayCountdown() {
    // Time calculations minutes and seconds
    var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    // Add trailing zero if minutes and/or seconds consist of a single digit 
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;

    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}

// Update the count down every 1 second
function startCountdown() {
    // If the countdown is (ready to be) expired, change the session 
    if (remaining < 1000) {
        if (work == true)
            playBreakBell();
        else
            playWorkBell();

        changeSession();
    }

    // Get current date and time
    var now = new Date().getTime();

    // Find the distance between now and the countdown date
    remaining = countDownTime - now;

    displayCountdown();
}

function playWorkBell() {
    new Audio("assets/notifications/metalGong.mp3").play();
}

function playBreakBell() {
    new Audio("assets/notifications/doorbell.mp3").play();
}

// Upon page load or update, execute initial code to display the timer
document.addEventListener("DOMContentLoaded", displayCountdown);

// Volume button functionality
document.getElementById("volume").addEventListener("click", function () {
    if (mute == true) {
        document.getElementById("volume").innerHTML = "<i class=\"fa fa-fw fa-volume-up fa-2x\"></i>";
        mute = false;
    } else {
        document.getElementById("volume").innerHTML = "<i class=\"fa fa-fw fa-volume-off fa-2x\"></i>";
        mute = true;
    }
});

// Play button functionality
document.getElementById("play").addEventListener("click", function () {
    if (play == true) {
        document.getElementById("play").innerHTML = "<i class=\"fa fa-fw fa-play-circle fa-2x\"></i>";
        document.getElementById("skip").removeAttribute("disabled", "");
        document.getElementById("work-slider").removeAttribute("disabled", "");
        
        countDownTime = countDownTime - new Date().getTime();
        clearInterval(timer);
        
        if (fresh == true) {
            playBreakBell();
            fresh = false;
        }

        play = false;
    } else {
        document.getElementById("play").innerHTML = "<i class=\"fa fa-fw fa-pause-circle fa-2x\"></i>";
        document.getElementById("skip").setAttribute("disabled", "");
        document.getElementById("work-slider").setAttribute("disabled", "");

        countDownTime = new Date().getTime() + remaining;
        timer = setInterval(startCountdown, 1000);

        if (fresh == true) {
            playWorkBell();
            fresh = false;
        }

        play = true;
    }
});

// Skip button functionality
document.getElementById("skip").addEventListener("click", function () {
    changeSession();
    displayCountdown();
});

// Work time slider functionality
document.getElementById("work-slider").addEventListener("change", function () {
    document.getElementById("work-label").innerHTML = "<h5>Work: " + workValues[this.value] +
        "\' | Break: " + breakValues[this.value] + "\'</h5>";

    countDownTime = workValues[this.value] * 60 * 1000;
    remaining = countDownTime;

    displayCountdown();
});
