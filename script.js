const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
let seconds = 30;
let minutes = 0;
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
  console.log("pause");
  pause();
});

document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  hours = 0;
  minutes = 0;
  seconds = 30;

  document.getElementById("hour").value = hours;
  document.getElementById("min").value = minutes;
  document.getElementById("sec").value = seconds;
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
    
    document.getElementById("sec").value = seconds;
    document.getElementById("min").value = minutes;
    document.getElementById("hour").value = hours;
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
    hours = parseInt(document.getElementById("hour").value, 10);
    minutes = parseInt(document.getElementById("min").value, 10);
    seconds = parseInt(document.getElementById("sec").value, 10);
    document.getElementById("hour").value = hours;
    document.getElementById("min").value = minutes;
    document.getElementById("sec").value = seconds;
  });
});
