const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
let seconds = 30;
let minutes = 0;
let hours = 0;
let intervalInstance = null;

parseStopwatch(hours, minutes, seconds);

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
  console.log("pause");
  pause();
});

document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  hours = 0;
  minutes = 0;
  seconds = 30;

  parseStopwatch(hours, minutes, seconds);
});

function run() {
  hours = Math.max(0, parseInt(document.getElementById("hour").value, 10) || 0);
  minutes = Math.max(
    0,
    parseInt(document.getElementById("min").value, 10) || 0
  );
  seconds = Math.max(
    0,
    parseInt(document.getElementById("sec").value, 10) || 0
  );

  if (intervalInstance) {
    clearInterval(intervalInstance);
  }

  intervalInstance = setInterval(function () {
    if (!timerStarted) return;

    if (seconds === 0) {
      if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      } else {
        // Timer acabou
        timerStarted = false;
        clearInterval(intervalInstance);
        intervalInstance = null;
        return;
      }
    } else {
      seconds--;
    }

    parseStopwatch(hours, minutes, seconds);
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

// funcionalidade para o botão de tela cheia e editar
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

    let {hours, minutes, seconds} = parseToInt()
    parseStopwatch(hours, minutes, seconds);
  });
});

function parseToInt() {
  let hours = parseInt(document.getElementById("hour").value, 10);
  let minutes = parseInt(document.getElementById("min").value, 10);
  let seconds = parseInt(document.getElementById("sec").value, 10);
  
  minutes = checkMeasure(minutes);
  seconds = checkMeasure(seconds);

  return {hours, minutes, seconds}
}

function checkMeasure(value) {
  if(value > 60) return 60;
  return value;
}

function parseStopwatch(hours, minutes, seconds) {

  document.getElementById("hour").value = parseValueToText(hours);
  document.getElementById("min").value = parseValueToText(minutes);
  document.getElementById("sec").value = parseValueToText(seconds);
}

function parseValueToText(value) {
  if(value >= 10 ) return value;
  return `0${value}`; 
}
