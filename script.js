const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
let time = 30;
let intervalInstance = null;

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

  setValues(hours, minutes, seconds);
});

function run() {
  const { hour, minute, second } = getValues();
  let time = hour * 3600 + minute * 60 + second;

  if (intervalInstance) {
    clearInterval(intervalInstance);
  }

  intervalInstance = setInterval(function () {
    if (!timerStarted) return;

    if (time === 0) {
      timerStarted = false;
      clearInterval(intervalInstance);
      intervalInstance = null;
      return;
    } else {
      time--;
    }

    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);
    const second = time % 60;

    setValues(hour, minute, second);
  }, DEFAULT_INTERVAL);
}

function setValues(hour, minute, second) {
  document.getElementById("hour").value = hour.toString().padStart(2, "0");
  document.getElementById("min").value = minute.toString().padStart(2, "0");
  document.getElementById("sec").value = second.toString().padStart(2, "0");
}

function getValues() {
  return {
    hour: parseInt(document.getElementById("hour").value, 10),
    minute: parseInt(document.getElementById("min").value, 10),
    second: parseInt(document.getElementById("sec").value, 10),
  };
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
    const { hour, minute, second } = getValues();
    setValues(hour, minute, second);
  });
});
