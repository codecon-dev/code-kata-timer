const TimerStatus = {
  STOPPED: "STOPPED",
  PAUSED: "PAUSED",
  COUNTDOWN: "COUNTDOWN",
  RUNNING: "RUNNING",
  EDITING: "EDITING",
  isRunning: (status) => status === TimerStatus.RUNNING,
  isCountdown: (status) => status === TimerStatus.COUNTDOWN,
};

const DEFAULT_INTERVAL = 1000;
const DEFAULT_SECONDS = 30;
let TIMER_STATUS = TimerStatus.STOPPED;

setInputValues(DEFAULT_SECONDS);

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("toZeroBtn").addEventListener("click", stop);
document.getElementById("restartBtn").addEventListener("click", stop);
document
  .querySelector(".js-edit-button")
  .addEventListener("click", openEditInput);
document
  .querySelector(".js-finish-edit-button")
  .addEventListener("click", closeEditInput);
document
  .querySelector(".js-cancel-button")
  .addEventListener("click", cancelEditInput);
document
  .querySelector(".js-active-fullscreen")
  .addEventListener("click", handleFullscreen);

document.getElementById("hour").addEventListener("input", function () {
  validateInput(this, 99);
});
document.getElementById("min").addEventListener("input", function () {
  validateInput(this, 59);
});
document.getElementById("sec").addEventListener("input", function () {
  validateInput(this, 59);
});

function timer() {
  let seconds = getInputSeconds();

  setTimeout(function () {
    if (
      TimerStatus.isRunning(TIMER_STATUS) ||
      TimerStatus.isCountdown(TIMER_STATUS)
    ) {
      seconds--;

      if (seconds <= 10) {
        TIMER_STATUS = TimerStatus.COUNTDOWN;
        styleCountdown(seconds);
      }

      setInputValues(seconds);
      if (seconds == 0) {
        document.body.classList.add("zero");
        return;
      } else {
        timer();
      }
    }
  }, DEFAULT_INTERVAL);
}

function validateInput(input, maxValue) {
  let value = parseInt(input.value) || 0;

  if (value < 0) value = 0;
  if (value > maxValue) value = maxValue;

  input.value = formatInput(value);
}

function formatInput(value = 0) {
  return value.toString().padStart(2, "0").slice(-2);
}

function getInputSeconds() {
  const { seconds, minutes, hours } = getInputValues();

  const sumMinutes = hours * 60 + minutes;
  const sumSeconds = sumMinutes * 60 + seconds;

  return sumSeconds;
}

function getInputValues() {
  const hours = parseInt(document.getElementById("hour").value) || 0;
  const minutes = parseInt(document.getElementById("min").value) || 0;
  const seconds = parseInt(document.getElementById("sec").value) || 0;

  return { seconds, minutes, hours };
}

function setInputValues(fromSeconds = 0) {
  const hours = Math.floor(fromSeconds / 3600);
  const minutes = Math.floor((fromSeconds % 3600) / 60);
  const seconds = fromSeconds % 60;

  document.getElementById(`sec`).value = formatInput(seconds);
  document.getElementById(`min`).value = formatInput(minutes);
  document.getElementById(`hour`).value = formatInput(hours);
}

function start() {
  TIMER_STATUS = TimerStatus.RUNNING;
  applyStyles();
  timer();
}

function pause() {
  TIMER_STATUS = TimerStatus.PAUSED;
  applyStyles();
}

function stop() {
  TIMER_STATUS = TimerStatus.STOPPED;
  applyStyles();
  setInputValues(DEFAULT_SECONDS);
}

function handleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.querySelector(".js-active-fullscreen").style =
      "background-color: rgba(255, 255, 255, 0.25)";
  } else {
    document.exitFullscreen();
    document.querySelector(".js-active-fullscreen").style = "";
  }
}

let PRE_EDIT_SECONDS = DEFAULT_SECONDS;

function cancelEditInput() {
  setInputValues(PRE_EDIT_SECONDS);
  closeEditInput();
}

function openEditInput() {
  TIMER_STATUS = TimerStatus.EDITING;
  PRE_EDIT_SECONDS = getInputSeconds();
  document.getElementById("hour").disabled = false;
  document.getElementById("min").disabled = false;
  document.getElementById("sec").disabled = false;

  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document
    .querySelector(".js-edit-container-stopwatch")
    .classList.remove("hide");
}

function closeEditInput() {
  TIMER_STATUS = TimerStatus.PAUSED;
  document.getElementById("hour").disabled = true;
  document.getElementById("min").disabled = true;
  document.getElementById("sec").disabled = true;

  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.add("hide");

  applyStyles();
}

function resetStyles() {
  document.querySelector(".js-play-button").classList.remove("press-start");
  document.querySelector(".js-stop-button").classList.remove("press-stop");
  document.querySelector(".js-pause-button").classList.remove("press-pause");
  document.querySelector(".js-edit-button").classList.remove("press-edit");
  document.querySelector(".input-stopwatch").classList.remove("hide");
  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.getElementById("countdown").classList.add("hide");
  document.body.classList.remove("zero");
}

const styles = {
  RUNNING: styleRunning,
  PAUSED: stylePause,
  STOPED: styleStop,
  EDITING: styleEditing,
};

function applyStyles() {
  resetStyles();
  styles[TIMER_STATUS]?.();
}

function styleCountdown(seconds = 0) {
  document.querySelector(".input-stopwatch").classList.add("hide");
  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document.getElementById("countdown").classList.remove("hide");
  document.getElementById("countdown-number").textContent = seconds;
}

function styleRunning() {
  document.querySelector(".js-play-button").classList.add("press-start");
}

function styleStop() {
  document.querySelector(".js-stop-button").classList.add("press-stop");
}

function stylePause() {
  document.querySelector(".js-pause-button").classList.add("press-pause");
}

function styleEditing() {
  document.querySelector(".js-edit-button").classList.add("press-edit");
}
