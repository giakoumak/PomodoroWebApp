// GLOBAL VARIABLES SECTION

var workValues = [25, 45, 50];
var breakValues = [5, 15, 10];
var workAudioFiles = [
    "assets/music/gryffindor25.mp3"
];
var breakAudioFiles = [
    "assets/music/hagridsHut5.mp3"
];

var workMusic = new Audio(workAudioFiles[document.getElementById("work-slider").value]);
var breakMusic = new Audio(breakAudioFiles[document.getElementById("work-slider").value]);
var workBell = new Audio("assets/notifications/metalGong.mp3");
var breakBell = new Audio("assets/notifications/frontDeskBells.mp3");

var work = true;
var play = false;
var mute = false;
var fresh = true;

var timer;
var remaining = workValues[document.getElementById("work-slider").value] * 60;

// FUNCTIONS SECTION

// Change session from work to break and vice versa
function changeSession() {
    if (work == true) {
        work = false;
        remaining = breakValues[document.getElementById("work-slider").value] * 60;
    } else {
        work = true;
        remaining = workValues[document.getElementById("work-slider").value] * 60;
    }

    fresh = true;
}

// Display the countdown timer
function displayCountdown() {
    // Time calculations for minutes and seconds
    var minutes = Math.floor(remaining / 60);
    var seconds = Math.floor(remaining % 60);

    // Add trailing zero if minutes and/or seconds consist of a single digit 
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}

// Check and update the remaining time every 1 second
function startCountdown() {
    // If the countdown is (ready to be) expired, change the session 
    if (remaining < 1) {
        if (work == true) {
            playBreakBell();
            playBreakMusic();
        } else {
            playWorkBell();
            playWorkMusic();
        }

        changeSession();
    }

    // Reduce the remaining time by 1 second
    remaining -= 1;

    displayCountdown();
}

function playWorkBell() {
    workBell.volume = 0.4;
    workBell.play();
}

function playBreakBell() {
    breakBell.volume = 0.4;
    breakBell.play();
}

function playWorkMusic() {
    workMusic.play();
}

function pauseWorkMusic() {
    workMusic.pause();
}

function playBreakMusic() {
    breakMusic.play();
}

function pauseBreakMusic() {
    breakMusic.pause();
}

// EVENT HANDLERS SECTION

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

        clearInterval(timer);

        if (work == true) {
            pauseWorkMusic();
        } else {
            pauseBreakMusic();
        }

        play = false;
    } else {
        document.getElementById("play").innerHTML = "<i class=\"fa fa-fw fa-pause-circle fa-2x\"></i>";
        document.getElementById("skip").setAttribute("disabled", "");
        document.getElementById("work-slider").setAttribute("disabled", "");

        timer = setInterval(startCountdown, 1000);

        if (work == true) {
            if (fresh == true) {
                playWorkBell();
            }

            playWorkMusic();
        } else {
            if (fresh == true) {
                playBreakBell();
            }

            playBreakMusic();
        }

        fresh = false;

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

    remaining = workValues[this.value] * 60;

    displayCountdown();
});
