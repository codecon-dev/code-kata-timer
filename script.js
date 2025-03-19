const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
let seconds = 1;
let minutes = 2;
let hours = 0;
let intervalInstance = null;

document.getElementById("hour").value = hours;
document.getElementById("min").value = minutes;
document.getElementById("sec").value = seconds;

document.getElementById("startBtn").addEventListener("click", function () {
  if (!timerStarted) {
    timerStarted = true;
    if (intervalInstance) {
      clearInterval(intervalInstance);
    }
    run();
  }
});

document.getElementById("pauseBtn").addEventListener("click", function () {
  pause();
});

document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  hours = 0;
  minutes = 1;
  seconds = 2;

  document.getElementById("hour").value = hours;
  document.getElementById("min").value = minutes;
  document.getElementById("sec").value = seconds;
});

function run() {
  hours = parseInt(document.getElementById("hour").value) * 3600;
  minutes = parseInt(document.getElementById("min").value) * 60;
  seconds = parseInt(document.getElementById("sec").value);

  let sumSeconds = hours + minutes + seconds

  if (intervalInstance) {
    clearInterval(intervalInstance);
  }

  intervalInstance = setInterval(function () {
    if (!timerStarted) return;
    sumSeconds -= 1

    let updatedHours = hours > 0 ? sumSeconds / 3600 : 0
    let updatedMinutes = minutes > 0 ? sumSeconds / 60 : 0
    let updatedSeconds = seconds > 0 ? sumSeconds : 0

    if(updatedHours > 0){
      updatedHours = Math.trunc(updatedHours)
      updatedSeconds -= updatedHours * 3600
    }
    if(updatedMinutes > 0){
      updatedMinutes = Math.trunc(updatedMinutes)
      updatedSeconds -= updatedMinutes * 60
    }

    document.getElementById("sec").value = updatedSeconds;
    document.getElementById("min").value = updatedMinutes;
    document.getElementById("hour").value = updatedHours;
  }, DEFAULT_INTERVAL);
}

function pause() {
  timerStarted = false;
  if (intervalInstance) {
    clearInterval(intervalInstance);
    intervalInstance = null;
  }
}

function stop() {
  timerStarted = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const fullscreenButton = document.querySelector(".js-active-fullscreen");
  const editButton = document.querySelector(".js-edit-stopwatch");
  const editContainer = document.querySelector(".js-edit-container-stopwatch");
  const stopwatchButtons = document.querySelector(".js-stopwatch-button");

  fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  editButton.addEventListener("click", () => {
    editContainer.classList.toggle("hide");
    stopwatchButtons.classList.toggle("hide");
  });

  const cancelButton = document.querySelector(".js-cancel-button");
  cancelButton.addEventListener("click", () => {
    editContainer.classList.add("hide");
    stopwatchButtons.classList.remove("hide");
  });

  const finishEditButton = document.querySelector(".js-finish-edit-button");
  finishEditButton.addEventListener("click", () => {
    editContainer.classList.add("hide");
    stopwatchButtons.classList.remove("hide");
    hours = parseInt(document.getElementById("hour").value, 10);
    minutes = parseInt(document.getElementById("min").value, 10);
    seconds = parseInt(document.getElementById("sec").value, 10);
    document.getElementById("hour").value = hours;
    document.getElementById("min").value = minutes;
    document.getElementById("sec").value = seconds;
  });
});
