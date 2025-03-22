let intervalInstance;
let timeInSeconds = 30;

function formatTime(value) {
  return value.toString().padStart(2, '0');
}

function validateInput(input, maxValue) {
  let value = parseInt(input.value) || 0;

  if (value < 0) value = 0;
  if (value > maxValue) value = maxValue;

  input.value = formatTime(value);
}

const hoursElement = document.getElementById("hour");
const minutesElement = document.getElementById("min");
const secondsElement = document.getElementById("sec");

const countdown = document.getElementById("countdown");
const countdownNumber = document.getElementById("countdown-number");

const inputStopwatch = document.querySelector(".input-stopwatch");
const stopwatchButton = document.querySelector(".js-stopwatch-button");
const editContainerStopwatch = document.querySelector(".js-edit-container-stopwatch");

function updateCountdown() {
  const hours = Math.floor(timeInSeconds / 3600);
  const remainingMinutes = timeInSeconds % 3600;

  const minutes = Math.floor(remainingMinutes / 60);
  const remainingSeconds = remainingMinutes % 60;

  const seconds = remainingSeconds % 60;

  hoursElement.value = formatTime(hours);
  minutesElement.value = formatTime(minutes);
  secondsElement.value = formatTime(seconds);
}

function togglDisabledeCountdown(toggle) {
  hoursElement.disabled = toggle;
  minutesElement.disabled = toggle;
  secondsElement.disabled = toggle;
}

function enableCountdown() {
  togglDisabledeCountdown(false);
}

function disableCountdown() {
  togglDisabledeCountdown(true);
}

hoursElement.addEventListener("input", function () {
  validateInput(this, 99);
});

minutesElement.addEventListener("input", function () {
  validateInput(this, 59);
});

secondsElement.addEventListener("input", function () {
  validateInput(this, 59);
});

document.getElementById("startBtn").addEventListener("click", run);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("toZeroBtn").addEventListener("click", reset);

document.querySelector(".js-edit-stopwatch").addEventListener("click", function () {
  enableCountdown();

  stopwatchButton.classList.add("hide");
  editContainerStopwatch.classList.remove("hide");
});

document.querySelector(".js-cancel-button").addEventListener("click", function () {
  updateCountdown();

  disableCountdown();

  stopwatchButton.classList.remove("hide");
  editContainerStopwatch.classList.add("hide");
});

document
  .querySelector(".js-finish-edit-button")
  .addEventListener("click", function () {
    disableCountdown();
    
    const hoursInSeconds = hoursElement.value * 3600;
    const minutesInSeconds = minutesElement.value * 60;
    const seconds = Number(secondsElement.value);

    timeInSeconds = seconds + minutesInSeconds + hoursInSeconds;

    stopwatchButton.classList.remove("hide");
    editContainerStopwatch.classList.add("hide");

    updateCountdown();
  });

document
  .querySelector(".js-active-fullscreen")
  .addEventListener("click", function () {
    if (document.documentElement.requestFullscreen) {
      void document.documentElement.requestFullscreen();
    }
  });

document.getElementById("restartBtn").addEventListener("click", function () {
  timeInSeconds = 30;

  inputStopwatch.classList.remove("hide");
  stopwatchButton.classList.remove("hide");

  countdown.classList.add("hide");

  document.body.classList.remove("zero");
});

function run() {
  intervalInstance = setInterval(function () {
    if (timeInSeconds > 0) {
      timeInSeconds--;
    } else {
      clearInterval(intervalInstance);

      countdown.classList.remove("hide");

      document.body.classList.add("zero");

      inputStopwatch.classList.add("hide");
      stopwatchButton
        .classList.add("hide");
    }

    if (timeInSeconds <= 10) {
      inputStopwatch.classList.add("hide");
      stopwatchButton.classList.add("hide");

      countdown.classList.remove("hide");
      countdownNumber.textContent = timeInSeconds.toString();
    }

    updateCountdown();
  }, 1000);
}

function pause() {
  clearInterval(intervalInstance);
}

function reset() {
  pause();
  timeInSeconds = 30;
  updateCountdown();
}
