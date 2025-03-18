const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
let seconds = 15;
let minutes = 0;
let hours = 0;
let intervalInstance = null;

const fullscreenButton = document.querySelector(".js-active-fullscreen");
const editButton = document.querySelector(".js-edit-stopwatch");
const editContainer = document.querySelector(".js-edit-container-stopwatch");
const stopwatchButtons = document.querySelector(".js-stopwatch-button");
const watchDisplay = document.querySelector(".input-stopwatch");

document.getElementById("hour").value = hours;
document.getElementById("min").value = minutes;
document.getElementById("sec").value = seconds;

const beepSound = new Audio("./assets/sounds/beepSound.mp3")
const endSound = new Audio("./assets/sounds/endSound.mp3")

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
  seconds = 15;

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

    if (seconds <= 10 && seconds >= 1 && hours == 0 && minutes == 0) {
      beepSound.play()
      document.body.style.background =  getComputedStyle(document.documentElement).getPropertyValue('--second-color');
      watchDisplay.classList.add("hide")
      stopwatchButtons.classList.add("hide")

      lastTen.style.display = "block"
      lastTen.children[0].innerHTML = seconds
      lastTen.children[0].style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-principal');
    }

    if (seconds == 0 && hours == 0 && minutes == 0) {
      lastTen.children[0].innerHTML = "0"
      beepSound.pause()
      endSound.play()
      lastTenInterval = setInterval(() => {
        lastTen.style.display = "none"
        document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--primary-principal');
        watchDisplay.classList.remove("hide")
      stopwatchButtons.classList.remove("hide")
      }, 6000);
    }

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
