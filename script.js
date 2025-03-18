const DEFAULT_INTERVAL = 30_000;
let timerId = undefined;
let lastDate = undefined;
let remainingInterval = DEFAULT_INTERVAL;
let isEditing = false;
let beforeEditValue = undefined;

const containerDiv = document.querySelector(".container");
const editPanelButtons = document.getElementById("editPanelButtons");
const controlPanelButtons = document.getElementById("controlPanelButtons");
const hourInput = document.getElementById("hour");
const minInput = document.getElementById("min");
const secInput = document.getElementById("sec");

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("toZeroBtn").addEventListener("click", stop);
document.getElementById("editBtn").addEventListener("click", toggleEdit);
document.getElementById("saveBtn").addEventListener("click", saveEdit);
document.getElementById("cancelEditBtn").addEventListener("click", cancelEdit);
document.getElementById("fullScreenBtn").addEventListener("click", e => document.body.requestFullscreen());
addInputListener(hourInput);
addInputListener(minInput);
addInputListener(secInput);

function toogleInputState(input) {
  if (isEditing) {
    input.addEventListener("input", validateInputValue);
    input.addEventListener("focus", selectInput);
    input.removeAttribute("readonly");
  } else {
    input.removeEventListener("input", validateInputValue);
    input.removeEventListener("focus", selectInput);
    input.setAttribute("readonly", "readonly");
  }
}

function selectInput(e) {
  const input = e.target;
  if (!timerId && !input.hasAttribute("readonly"))
    input.select();
}

function toggleEdit() {
  if (timerId) {
    stop();
  }

  isEditing = !isEditing;

  const inputs = [hourInput, minInput, secInput];
  inputs.forEach(input => toogleInputState(input));

  editPanelButtons.classList.toggle("hide");
  controlPanelButtons.classList.toggle("hide");

  if (isEditing) {
    beforeEditValue = remainingInterval;
    secInput.focus();
  }
}

function validateInputValue(e) {
  const input = e.target;
  if (!input || !isEditing)
    return;

  const maxValue = parseInt(input.getAttribute("maxValue"), 10);
  const value = parseInt(input.value, 10);

  if (isNaN(value) || value > maxValue) {
    input.value = "00";
  } else {
    var formatedNumber = formatNumber(value);
    if (input.value !== formatedNumber)
      input.value = formatedNumber;
  }
}

function saveEdit() {
  if (!isEditing)
    return;

  const hours = parseInt(hourInput.value, 10);
  const minutes = parseInt(minInput.value, 10);
  const seconds = parseInt(secInput.value, 10);
  remainingInterval = (((hours || 0) * 60 * 60) + ((minutes || 0) * 60) + (seconds || 0)) * 1000;

  toggleEdit();
}

function cancelEdit() {
  toggleEdit();

  remainingInterval = beforeEditValue;
  updateInputValues();
}

function start() {
  if (timerId) {
    clearInterval(timerId);
    updateTimerVisibility();
  }

  lastDate = Date.now();
  timerId = setInterval(() => updateTimer(), 100);
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
  if (remainingInterval <= 11_000 && timerId) {
    hourInput.classList.add("hide");
    minInput.classList.add("hide");
    controlPanelButtons.classList.add("hide");
    containerDiv.classList.add("blink");
  } else {
    hourInput.classList.remove("hide");
    minInput.classList.remove("hide");
    controlPanelButtons.classList.remove("hide");
    containerDiv.classList.remove("blink");
  }
}