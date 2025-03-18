const DEFAULT_INTERVAL = 30_000;
let timerId = undefined;
let lastDate = undefined;
let remainingInterval = DEFAULT_INTERVAL;

const hourInput = document.getElementById("hour");
const minInput = document.getElementById("min");
const secInput = document.getElementById("sec");

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("toZeroBtn").addEventListener("click", stop);
document.getElementById("editBtn").addEventListener("click", toggleEdit);
document.getElementById("fullScreenBtn").addEventListener("click", e => document.body.requestFullscreen());
addInputListener(hourInput);
addInputListener(minInput);
addInputListener(secInput);

function addInputListener(input) {
  input.addEventListener("input", updateInputValue);
  input.addEventListener("focus", selectInput);
}

function selectInput(e) {
  const input = e.target;
  if (!timerId && !input.hasAttribute("readonly"))
    input.select();
}

function toggleEdit() {
  if (timerId)
    return;

  setInputsReadOnly(!hourInput.hasAttribute("readonly"));
}

function setInputsReadOnly(isReadOnly) {
  const inputs = [hourInput, minInput, secInput];
  inputs.forEach(input => {
    if (isReadOnly) {
      input.setAttribute("readonly", "");
    } else {
      input.removeAttribute("readonly");
    }
  });
}

function updateInputValue(e) {
  console.log(e, e.target);
  const input = e.target;
  if (!input || timerId)
    return;

  const value = parseInt(input.value, 10);

  if (isNaN(value)) {
    input.value = "00";
  } else {
    var formatedNumber = formatNumber(value);
    if (input.value !== formatedNumber)
      input.value = formatedNumber;
  }

  const hours = parseInt(hourInput.value, 10);
  const minutes = parseInt(minInput.value, 10);
  const seconds = parseInt(secInput.value, 10);
  remainingInterval = (((hours || 0) * 60 * 60) + ((minutes || 0) * 60) + (seconds || 0)) * 1000;
}

function start() {
  if (timerId) {
    clearInterval(timerId);
    updateTimerVisibility();
  }

  lastDate = Date.now();
  setInputsReadOnly(true);
  timerId = setInterval(() => updateTimer(), 500);
}

function pause() {
  if (timerId) {
    clearInterval(timerId);
    timerId = undefined;
  }
}

function stop() {
  if (timerId) {
    clearInterval(timerId);
    timerId = undefined;
    lastDate = undefined;
  }

  remainingInterval = DEFAULT_INTERVAL;
  updateInputValues();
}

function updateTimer() {
  const now = Date.now();
  const diff = Math.floor(now - lastDate);
  lastDate = now;

  remainingInterval -= diff;
  if (remainingInterval <= 0) {
    stop();
  }

  updateInputValues();
}

function formatNumber(number) {
  return Math.max(0, number).toFixed(0).padStart(2, '0');
}

function updateInputValues() {
  const seconds = Math.round(Math.floor(remainingInterval / 1000));
  const minutes = Math.round(Math.floor(seconds / 60));
  const hours = Math.round(Math.floor(minutes / 60));


  hourInput.value = formatNumber(hours);
  minInput.value = formatNumber(minutes);
  secInput.value = formatNumber(seconds);

  updateTimerVisibility();
}

function updateTimerVisibility() {
  if (remainingInterval <= 9_000 && timerId) {
    hourInput.classList.add("hide");
    minInput.classList.add("hide");
  } else {
    hourInput.classList.remove("hide");
    minInput.classList.remove("hide");
  }
}