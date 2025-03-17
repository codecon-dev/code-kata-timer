const DEFAULT_SECONDS = 30;
let isRunning = false;
let TIMER_STATUS = "STOPED";

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("toZeroBtn").addEventListener("click", stop);
document.getElementById("restartBtn").addEventListener("click", stop);
document
  .querySelector(".js-edit-stopwatch")
  .addEventListener("click", openEdit);
document
  .querySelector(".js-finish-edit-button")
  .addEventListener("click", closeEdit);
document
  .querySelector(".js-cancel-button")
  .addEventListener("click", handleCancelEdit);
document
  .querySelector(".js-active-fullscreen")
  .addEventListener("click", handleFullscreen);

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    input.value = formatInput(input.value);
  });
});

setValues(DEFAULT_SECONDS);

function timer() {
  let seconds = getSeconds();

  setTimeout(function () {
    if (validateStatus()) {
      seconds--;

      if (seconds <= 10) {
        TIMER_STATUS = "COUNTDOWN";
        styleCountdown(seconds);
      }

      setValues(seconds);
      if (seconds == 0) {
        document.body.classList.add("zero");
        return;
      } else {
        timer();
      }
    }
  }, 1000);
}

function start() {
  TIMER_STATUS = "RUNNING";
  applyStyles();
  timer();
}

function pause() {
  TIMER_STATUS = "PAUSED";
  applyStyles();
}

function stop() {
  TIMER_STATUS = "STOPED";
  applyStyles();
  setValues(DEFAULT_SECONDS);
}

function formatInput(value = 0) {
  return value.toString().padStart(2, "0").slice(-2);
}

function getSeconds() {
  const { seconds, minutes, hours } = getValues();

  const sumMinutes = hours * 60 + minutes;
  const sumSeconds = sumMinutes * 60 + seconds;

  return sumSeconds;
}

function getValues() {
  const hours = parseInt(document.getElementById("hour").value) || 0;
  const minutes = parseInt(document.getElementById("min").value) || 0;
  const seconds = parseInt(document.getElementById("sec").value) || 0;

  return { seconds, minutes, hours };
}

function setValues(fromSeconds = 0) {
  const hours = Math.floor(fromSeconds / 3600);
  const minutes = Math.floor((fromSeconds % 3600) / 60);
  const seconds = fromSeconds % 60;

  document.getElementById(`sec`).value = formatInput(seconds);
  document.getElementById(`min`).value = formatInput(minutes);
  document.getElementById(`hour`).value = formatInput(hours);
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

function handleCancelEdit() {
  setValues(PRE_EDIT_SECONDS);
  closeEdit();
}

function openEdit() {
  TIMER_STATUS = "EDITING";
  PRE_EDIT_SECONDS = getSeconds();
  document.getElementById("hour").disabled = false;
  document.getElementById("min").disabled = false;
  document.getElementById("sec").disabled = false;

  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document
    .querySelector(".js-edit-container-stopwatch")
    .classList.remove("hide");
}

function closeEdit() {
  TIMER_STATUS = "PAUSED";
  document.getElementById("hour").disabled = true;
  document.getElementById("min").disabled = true;
  document.getElementById("sec").disabled = true;

  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.add("hide");

  applyStyles();
}

function validateStatus() {
  return ["RUNNING", "COUNTDOWN"].includes(TIMER_STATUS);
}

function resetStyles() {
  document.querySelector(".js-play-button").style = "";
  document.querySelector(".js-stop-button").style = "";
  document.querySelector(".js-pause-button").style = "";
  document.querySelector(".js-edit-stopwatch").style = "";
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

function styleRunning() {
  document.querySelector(".js-play-button").style =
    "background-color: rgba(70, 255, 190, 0.25)";
}

function styleCountdown(seconds = 0) {
  document.querySelector(".input-stopwatch").classList.add("hide");
  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document.getElementById("countdown").classList.remove("hide");
  document.getElementById("countdown-number").textContent = seconds;
}

function styleStop() {
  document.querySelector(".js-stop-button").style =
    "background-color: rgba(255, 70, 70, 0.25)";
}

function stylePause() {
  document.querySelector(".js-pause-button").style =
    "background-color: rgba(255, 221, 70, 0.25)";
}

function styleEditing() {
  document.querySelector(".js-edit-stopwatch").style =
    "background-color: rgba(255, 255, 255, 0.25)";
}
