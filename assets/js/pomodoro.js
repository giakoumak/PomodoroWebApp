// GLOBAL VARIABLES SECTION

var workValues = [25, 45, 50];
var breakValues = [5, 15, 10];
var workAudioFiles = [
    "assets/music/hogwartsLibrary.mp3"
];
var breakAudioFiles = [
    "assets/music/hogwartsOutside.mp3"
];

var music = initMusic();
var bell = new Audio("assets/notifications/metalGong.mp3");

var work = true;
var play = false;
var mute = false;
var fresh = true;

var timer;
var remaining = workValues[document.getElementById("work-slider").value] * 60;

// FUNCTIONS SECTION

function initMusic() {
    var music = new Audio(workAudioFiles[0]);
    music.loop = true;

    return music;
}

// Change session from work to break and vice versa
function changeSession() {
    if (work == true) {
        setBreakSession();
    } else {
        setWorkSession();
    }
}

function setWorkSession() {
    work = true;
    remaining = workValues[document.getElementById("work-slider").value] * 60;
    music.src = workAudioFiles[0];
    document.getElementById("backgroundMedia").getElementsByTagName("video")[0].src = "assets/video/hogwartsLibrary.mp4";
    fresh = true;
}

function setBreakSession() {
    work = false;
    remaining = breakValues[document.getElementById("work-slider").value] * 60;
    music.src = breakAudioFiles[0];
    document.getElementById("backgroundMedia").getElementsByTagName("video")[0].src = "assets/video/hogwartsOutside.mp4";
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
        changeSession();
        playBell();
        playMusic();
        fresh = false;
    }

    // Reduce the remaining time by 1 second
    remaining -= 1;

    displayCountdown();
}

function playBell() {
    if (work == true) {
        bell = new Audio("assets/notifications/metalGong.mp3");
    } else {
        bell = new Audio("assets/notifications/frontDeskBells.mp3");
    }

    bell.volume = 0.4;
    bell.play();
}

function playMusic() {
    music.play();
}

function pauseMusic() {
    music.pause();
}

function muteMusic() {
    music.muted = true;
}

function unmuteMusic() {
    music.muted = false;
}

// EVENT HANDLERS SECTION

// Upon page load or update, execute initial code to display the timer
document.addEventListener("DOMContentLoaded", displayCountdown);

// Volume button functionality
document.getElementById("volume").addEventListener("click", function () {
    if (mute == true) {
        document.getElementById("volume").innerHTML = "<i class=\"fa fa-fw fa-volume-up fa-2x\"></i>";
        unmuteMusic();
        mute = false;
    } else {
        document.getElementById("volume").innerHTML = "<i class=\"fa fa-fw fa-volume-off fa-2x\"></i>";
        muteMusic();
        mute = true;
    }
});

// Play button functionality
document.getElementById("play").addEventListener("click", function () {
    if (play == true) {
        document.getElementById("play").innerHTML = "<i class=\"fa fa-fw fa-play-circle fa-2x\"></i>";
        document.getElementById("skip").removeAttribute("disabled", "");
        document.getElementById("work-label").removeAttribute("hidden", "");
        document.getElementById("work-slider").removeAttribute("hidden", "");
        clearInterval(timer);
        pauseMusic();
        play = false;
    } else {
        document.getElementById("play").innerHTML = "<i class=\"fa fa-fw fa-pause-circle fa-2x\"></i>";
        document.getElementById("skip").setAttribute("disabled", "");
        document.getElementById("work-label").setAttribute("hidden", "");
        document.getElementById("work-slider").setAttribute("hidden", "");
        timer = setInterval(startCountdown, 1000);
        if (fresh == true) {
            playBell();
        }
        playMusic();
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

    setWorkSession();
    displayCountdown();
});
