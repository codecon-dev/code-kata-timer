const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
updateButtons();
let seconds = "30";
let minutes = "00";
let hours = "00";
let intervalInstance = null;
let isCountdownActive = false;
let lastBackgroundColor = "black";

document.getElementById("hour").value = hours;
document.getElementById("min").value = minutes;
document.getElementById("sec").value = seconds;

function updateInputs(h, m, s) {
  hours = h;
  minutes = m;
  seconds = s;
  document.getElementById("hour").value = twoDigits(hours);
  document.getElementById("min").value = twoDigits(minutes);
  document.getElementById("sec").value = twoDigits(seconds);
}

function toggleInputs(enabled) {
  const inputs = document.querySelectorAll(".input-stopwatch input");
  inputs.forEach((input) => {
    input.disabled = enabled;
  });
}

document.getElementById("startBtn").addEventListener("click", function () {
  if (!timerStarted) {
    timerStarted = true;
    if (intervalInstance) {
      clearInterval(intervalInstance);
    }
    run();
  }
  toggleInputs(true);
  updateButtons();
});

document.getElementById("pauseBtn").addEventListener("click", function () {
  console.log("pause");
  pause();
});

document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  updateInputs(0, 0, 30);
  exitCountdownMode();
  updateButtons();
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

  let duration = moment.duration({
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  });

  if (intervalInstance) {
    clearInterval(intervalInstance);
  }

  intervalInstance = setInterval(function () {
    if (!timerStarted) return;

    duration.subtract(1, "seconds");

    if (duration.asSeconds() <= 0) {
      timerStarted = false;
      clearInterval(intervalInstance);
      intervalInstance = null;
      updateInputs(0, 0, 0);
      exitCountdownMode();
      toggleInputs(false);
      updateButtons();
      return;
    }

    if (duration.asSeconds() <= 10 && !isCountdownActive) {
      enterCountdownMode();
    } else if (duration.asSeconds() > 10 && isCountdownActive) {
      exitCountdownMode();
    }

    hours = duration.hours();
    minutes = duration.minutes();
    seconds = duration.seconds();

    document.getElementById("sec").value = twoDigits(seconds);
    document.getElementById("min").value = twoDigits(minutes);
    document.getElementById("hour").value = twoDigits(hours);

    if (isCountdownActive) {
      toggleBackgroundColor();
      updateCountdownDisplay(seconds);
    }
  }, DEFAULT_INTERVAL);
}

function enterCountdownMode() {
  isCountdownActive = true;
  document.body.classList.add("countdown-mode");

  const inputs = document.querySelectorAll(".input-stopwatch input");
  inputs.forEach((input) => {
    if (input.id !== "sec") {
      input.style.display = "none";
    } else {
      input.style.fontSize = "15rem";
      input.style.width = "100%";
      input.style.textAlign = "center";
    }
  });

  const separators = document.querySelectorAll(".input-stopwatch");
  separators.forEach((sep) => {
    Array.from(sep.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = "";
      }
    });
  });

  document.querySelector(".js-stopwatch-button").style.display = "none";
  document.getElementById("sec").classList.add("countdown-pulse");
}

function exitCountdownMode() {
  isCountdownActive = false;
  document.body.classList.remove("countdown-mode");
  document.body.style.backgroundColor = "";
  lastBackgroundColor = "black";
  document.body.style.color = "";
  document.getElementById("sec").style.color = "";

  const inputs = document.querySelectorAll(".input-stopwatch input");
  inputs.forEach((input) => {
    input.style.display = "";
    input.style.fontSize = "";
    input.style.width = "";
    input.style.textAlign = "";
  });

  const separators = document.querySelectorAll(".input-stopwatch");
  separators.forEach((sep) => {
    let idx = 0;
    Array.from(sep.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (idx === 1 || idx === 2) {
          node.textContent = " : ";
        } else {
          node.textContent = "";
        }
        idx++;
      }
    });
  });

  document.querySelector(".js-stopwatch-button").style.display = "";
  isCountdownActive = false;
  document.getElementById("sec").classList.remove("countdown-pulse");
}

function updateCountdownDisplay(seconds) {
  document.getElementById("sec").value = seconds;
}

function toggleBackgroundColor() {
  const color = lastBackgroundColor === "#1e1e1e" ? "#46ffbe" : "#1e1e1e";
  document.body.style.backgroundColor = color;

  document.body.style.color = color === "#1e1e1e" ? "#46ffbe" : "#1e1e1e";
  document.getElementById("sec").style.color =
    color === "#1e1e1e" ? "#46ffbe" : "#1e1e1e";

  lastBackgroundColor = color;
}

function pause() {
  timerStarted = false;
  if (intervalInstance) {
    clearInterval(intervalInstance);
    intervalInstance = null;
  }
  toggleInputs(false);
  updateButtons();
}

function stop() {
  timerStarted = false;
}

function twoDigits(value) {
  return String(value).padStart(2, "0");
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
    document.getElementById("hour").value = twoDigits(hours);
    document.getElementById("min").value = twoDigits(minutes);
    document.getElementById("sec").value = twoDigits(seconds);
  });

  initAutoHideButtons();
});

let hideTimeout;
function showButtons() {
  document.querySelector(".js-stopwatch-button").classList.remove("auto-hide");
  document
    .querySelector(".js-edit-container-stopwatch")
    .classList.remove("auto-hide");
}
function hideButtons() {
  document.querySelector(".js-stopwatch-button").classList.add("auto-hide");
  document
    .querySelector(".js-edit-container-stopwatch")
    .classList.add("auto-hide");
}
document.addEventListener("mousemove", () => {
  showButtons();
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(hideButtons, 1000);
});

function updateButtons() {
  if (timerStarted) {
    document.querySelector(".js-play-button").classList.add("hide");
    document.querySelector(".js-pause-button").classList.remove("hide");
    document.querySelector(".js-stop-button").classList.remove("hide");
    document.querySelector(".js-active-fullscreen").classList.remove("hide");
  } else {
    document.querySelector(".js-play-button").classList.remove("hide");
    document.querySelector(".js-pause-button").classList.add("hide");
    document.querySelector(".js-stop-button").classList.add("hide");
    document.querySelector(".js-active-fullscreen").classList.remove("hide");
  }
}
