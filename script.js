let timerStarted = false;
let seconds = 30;
let minutes = 0;
let hours = 0;
let intervalInstance;

let defaultHours = 0;
let defaultMinutes = 0;
let defaultSeconds = 30;

function formatTime(value) {
  return value < 10 ? `0${value}` : value.toString();
}

function validateInput(input, maxValue) {
  let value = parseInt(input.value) || 0;
  if (value < 0) value = 0;
  if (value > maxValue) value = maxValue;
  input.value = formatTime(value);
}

document.getElementById("hour").disabled = true;
document.getElementById("min").disabled = true;
document.getElementById("sec").disabled = true;

document.getElementById("hour").value = formatTime(hours);
document.getElementById("min").value = formatTime(minutes);
document.getElementById("sec").value = formatTime(seconds);

document.getElementById("hour").addEventListener("input", function () {
  validateInput(this, 99);
});

function verifyStopped() {
  const pauseBtn = document.querySelector(".js-pause-button");
  const playBtn = document.querySelector(".js-play-button");

  if (!pauseBtn || !playBtn) return;

  if (timerStarted) {
    pauseBtn.classList.remove("hide");
    pauseBtn.style.display = "block";
    playBtn.classList.add("hide");
    playBtn.style.display = "none";
  } else {
    pauseBtn.classList.add("hide");
    pauseBtn.style.display = "none";
    playBtn.classList.remove("hide");
    playBtn.style.display = "block";
  }
}

document.getElementById("min").addEventListener("input", function () {
  validateInput(this, 59);
});

document.getElementById("sec").addEventListener("input", function () {
  validateInput(this, 59);
});

document.getElementById("startBtn").addEventListener("click", function () {
  if (!timerStarted) {
    timerStarted = true;
    run();
  }
});

document.getElementById("pauseBtn").addEventListener("click", function () {
  pause();
});

document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  hours = defaultHours;
  minutes = defaultMinutes;
  seconds = defaultSeconds;

  document.getElementById("hour").value = formatTime(hours);
  document.getElementById("min").value = formatTime(minutes);
  document.getElementById("sec").value = formatTime(seconds);
});

document.querySelector(".js-settings-button").addEventListener("click", function () {
  const settingsExpand = document.querySelector(".settings-expand");
  if (settingsExpand.classList.contains("hide")) {
    settingsExpand.classList.remove("hide");
    document.getElementById("default-hour").value = formatTime(defaultHours);
    document.getElementById("default-min").value = formatTime(defaultMinutes);
    document.getElementById("default-sec").value = formatTime(defaultSeconds);
  } else {
    settingsExpand.classList.add("hide");
  }
});

document.querySelector(".js-save-settings").addEventListener("click", function () {
  defaultHours = parseInt(document.getElementById("default-hour").value) || 0;
  defaultMinutes = parseInt(document.getElementById("default-min").value) || 0;
  defaultSeconds = parseInt(document.getElementById("default-sec").value) || 0;

  if (defaultHours > 99) defaultHours = 99;
  if (defaultMinutes > 59) defaultMinutes = 59;
  if (defaultSeconds > 59) defaultSeconds = 59;

  document.querySelector(".settings-expand").classList.add("hide");
});

document.querySelector(".js-close-settings").addEventListener("click", function () {
  document.querySelector(".settings-expand").classList.add("hide");
});

document.querySelector(".js-edit-stopwatch").addEventListener("click", function () {
  document.getElementById("hour").disabled = false;
  document.getElementById("min").disabled = false;
  document.getElementById("sec").disabled = false;

  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.remove("hide");
});

document.querySelector(".js-cancel-button").addEventListener("click", function () {
  document.getElementById("hour").value = formatTime(hours);
  document.getElementById("min").value = formatTime(minutes);
  document.getElementById("sec").value = formatTime(seconds);

  document.getElementById("hour").disabled = true;
  document.getElementById("min").disabled = true;
  document.getElementById("sec").disabled = true;

  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.add("hide");
});

document.querySelector(".js-finish-edit-button").addEventListener("click", function () {
  hours = parseInt(document.getElementById("hour").value) || 0;
  minutes = parseInt(document.getElementById("min").value) || 0;
  seconds = parseInt(document.getElementById("sec").value) || 0;

  document.getElementById("hour").disabled = true;
  document.getElementById("min").disabled = true;
  document.getElementById("sec").disabled = true;

  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.add("hide");
});

document.querySelector(".js-active-fullscreen").addEventListener("click", function () {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
});

document.getElementById("restartBtn").addEventListener("click", function () {
  hours = defaultHours;
  minutes = defaultMinutes;
  seconds = defaultSeconds;

  document.getElementById("hour").value = formatTime(hours);
  document.getElementById("min").value = formatTime(minutes);
  document.getElementById("sec").value = formatTime(seconds);

  document.querySelector(".input-stopwatch").classList.remove("hide");
  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.getElementById("countdown").classList.add("hide");

  document.body.classList.remove("zero");
});

verifyStopped();

function run() {
  verifyStopped();
  hours = parseInt(document.getElementById("hour").value) || 0;
  minutes = parseInt(document.getElementById("min").value) || 0;
  seconds = parseInt(document.getElementById("sec").value) || 0;

  intervalInstance = setInterval(function () {
    if (timerStarted) {
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            timerStarted = false;
            clearInterval(intervalInstance);
            verifyStopped();
            document.getElementById("countdown").classList.remove("hide");
            document.getElementById("countdown-number").textContent = "0";

            document.body.classList.add("zero");

            document.querySelector(".input-stopwatch").classList.add("hide");
            document.querySelector(".js-stopwatch-button").classList.add("hide");
          } else {
            hours--;
            minutes = 59;
            seconds = 59;
          }
        } else {
          minutes--;
          seconds = 59;
        }
      } else {
        seconds--;
      }

      if (hours === 0 && minutes === 0 && seconds <= 10) {
        document.querySelector(".input-stopwatch").classList.add("hide");
        document.querySelector(".js-stopwatch-button").classList.add("hide");

        document.getElementById("countdown").classList.remove("hide");
        document.getElementById("countdown-number").textContent = seconds;
      }

      document.getElementById("sec").value = formatTime(seconds);
      document.getElementById("min").value = formatTime(minutes);
      document.getElementById("hour").value = formatTime(hours);
    }
  }, 1000);
}

function pause() {
  timerStarted = false;
  verifyStopped();
  if (intervalInstance) {
    clearInterval(intervalInstance);
    intervalInstance = null;
  }
}