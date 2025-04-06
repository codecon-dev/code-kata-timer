const TimerStatus = {
  STOPPED: "STOPPED",
  PAUSED: "PAUSED",
  COUNTDOWN: "COUNTDOWN",
  RUNNING: "RUNNING",
  EDITING: "EDITING",
  isRunning: s => s === "RUNNING" || s === "COUNTDOWN",
  isCountdown: s => s === "COUNTDOWN",
  isPaused: s => s === "PAUSED",
  isStopped: s => s === "STOPPED",
  isEditing: s => s === "EDITING"
};
const DEFAULT_INTERVAL = 1000;
const DEFAULT_SECONDS = 30;
let TIMER_STATUS = TimerStatus.STOPPED;
let timerInterval = null;
let currentSeconds = DEFAULT_SECONDS;
let currentTooltip = null;
let tooltipTimeout = null;
const Theme = { DARK: "dark", LIGHT: "light" };
let currentTheme = Theme.DARK;
let PRE_EDIT_SECONDS = DEFAULT_SECONDS;
const SETTINGS_STORAGE_KEY = 'timerSettings';
let timerSettings = {
  showContributors: true,
  currentSeconds: DEFAULT_SECONDS,
  timerStatus: TimerStatus.STOPPED,
  theme: Theme.DARK
};
function focusAtEnd(el) {
  const val = el.value;
  requestAnimationFrame(() => {
    el.setSelectionRange(val.length, val.length);
  });
}
function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (saved) {
    try {
      timerSettings = JSON.parse(saved);
      if (timerSettings.currentSeconds !== undefined) {
        currentSeconds = timerSettings.currentSeconds;
        setInputValues(currentSeconds);
      }
      if (timerSettings.timerStatus !== undefined) {
        TIMER_STATUS = timerSettings.timerStatus;
      }
      if (timerSettings.theme !== undefined) {
        currentTheme = timerSettings.theme;
        applyTheme(currentTheme);
      }
    } catch (e) {
      console.error(e);
    }
  }
  const showContributorsCheckbox = document.getElementById('showContributors');
  if (showContributorsCheckbox) {
    showContributorsCheckbox.checked = timerSettings.showContributors;
  }
  updateContributorsVisibility();
}
function saveSettings() {
  timerSettings.currentSeconds = currentSeconds;
  timerSettings.timerStatus = TIMER_STATUS;
  timerSettings.theme = currentTheme;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(timerSettings));
}
function updateContributorsVisibility() {
  const contributorsContainer = document.getElementById('contributors');
  if (!contributorsContainer) return;
  if (TimerStatus.isCountdown(TIMER_STATUS) || TimerStatus.isEditing(TIMER_STATUS)) {
    contributorsContainer.classList.add('hide');
    return;
  }
  if (timerSettings.showContributors) {
    contributorsContainer.classList.remove('hide');
  } else {
    contributorsContainer.classList.add('hide');
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const clickOverlay = document.createElement("div");
  clickOverlay.className = "click-overlay";
  document.body.appendChild(clickOverlay);
  clickOverlay.addEventListener("click", () => {
    if (TimerStatus.isEditing(TIMER_STATUS)) closeEditInput();
  });
  const tooltipContainer = document.createElement("div");
  tooltipContainer.id = "tooltip-container";
  document.body.appendChild(tooltipContainer);
  setInputValues(DEFAULT_SECONDS);
  applyTheme(currentTheme);
  setupEventListeners();
  updateButtonStates();
  loadSettings();
});
function setupEventListeners() {
  document.getElementById("startBtn").addEventListener("click", start);
  document.getElementById("pauseBtn").addEventListener("click", pause);
  document.getElementById("toZeroBtn").addEventListener("click", stop);
  document.getElementById("restartBtn").addEventListener("click", stop);
  document.querySelector(".js-edit-button").addEventListener("click", openEditInput);
  document.querySelector(".js-finish-edit-button").addEventListener("click", closeEditInput);
  document.querySelector(".js-cancel-button").addEventListener("click", cancelEditInput);
  document.querySelector(".js-active-fullscreen").addEventListener("click", handleFullscreen);
  document.getElementById("add30sPaused").addEventListener("click", add30Seconds);
  document.getElementById("add30sStopped").addEventListener("click", add30Seconds);
  document.getElementById("add30sRunning").addEventListener("click", add30SecondsRunning);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("hour").addEventListener("input", () => validateInput(hour, 99));
  document.getElementById("min").addEventListener("input", () => validateInput(min, 59));
  document.getElementById("sec").addEventListener("input", () => validateInput(sec, 59));
  ["hour","min","sec"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("click", e => {
      if (!TimerStatus.isEditing(TIMER_STATUS)) e.preventDefault();
    });
    el.addEventListener("focus", () => {
      if (TimerStatus.isEditing(TIMER_STATUS)) focusAtEnd(el);
    });
  });
  document.addEventListener("click", () => {
    if (!TimerStatus.isEditing(TIMER_STATUS) && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  const configToggle = document.getElementById('configToggle');
  if (configToggle) {
    configToggle.addEventListener('click', toggleConfigPopup);
  }
  const closeConfig = document.getElementById('closeConfig');
  if (closeConfig) {
    closeConfig.addEventListener('click', closeConfigPopup);
  }
  const showContributorsSwitch = document.getElementById('showContributors');
  if (showContributorsSwitch) {
    showContributorsSwitch.addEventListener('change', (e) => {
      timerSettings.showContributors = e.target.checked;
      saveSettings();
      updateContributorsVisibility();
    });
  }
  document.getElementById('configPopup').addEventListener('click', (e) => {
    if (e.target === document.getElementById('configPopup')) {
      closeConfigPopup();
    }
  });
  setupTooltips();
}
function toggleConfigPopup(e) {
  e.stopPropagation();
  const configPopup = document.getElementById('configPopup');
  const configToggle = document.getElementById('configToggle');
  configToggle.classList.add("button-feedback");
  setTimeout(() => { configToggle.classList.remove("button-feedback"); }, 300);
  if (configPopup) {
    configPopup.classList.toggle('hide');
  }
}
function closeConfigPopup() {
  const configPopup = document.getElementById('configPopup');
  if (configPopup) {
    configPopup.classList.add('hide');
  }
}
function setupTooltips() {
  document.querySelectorAll("[data-tooltip]").forEach(el => {
    el.removeEventListener("mouseenter", handleTooltipMouseEnter);
    el.removeEventListener("mouseleave", handleTooltipMouseLeave);
  });
  document.querySelectorAll("[data-tooltip]").forEach(el => {
    el.addEventListener("mouseenter", handleTooltipMouseEnter);
    el.addEventListener("mouseleave", handleTooltipMouseLeave);
  });
}
function handleTooltipMouseEnter() {
  const txt = this.getAttribute("data-tooltip");
  if (!txt) return;
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
  hideTooltip();
  showTooltip(this, txt);
}
function handleTooltipMouseLeave() {
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => {
    hideTooltip();
    tooltipTimeout = null;
  }, 100);
}
function showTooltip(el, text) {
  const c = document.getElementById("tooltip-container");
  if (!c) return;
  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.textContent = text;
  c.appendChild(tip);
  positionTooltip(tip, el);
  currentTooltip = tip;
}
function positionTooltip(tip, el) {
  const r = el.getBoundingClientRect();
  tip.style.maxWidth = "250px";
  setTimeout(() => {
    const tr = tip.getBoundingClientRect();
    let top = r.bottom + 10;
    let left = r.left + (r.width/2) - (tr.width/2);
    if (left < 10) left = 10;
    if (left + tr.width > window.innerWidth - 10) left = window.innerWidth - tr.width - 10;
    if (top + tr.height > window.innerHeight - 10) top = r.top - tr.height - 10;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
    tip.style.opacity = "1";
  }, 0);
}
function hideTooltip() {
  if (!currentTooltip) return;
  currentTooltip.style.opacity = "0";
  setTimeout(() => {
    if (currentTooltip && currentTooltip.parentNode) currentTooltip.parentNode.removeChild(currentTooltip);
    currentTooltip = null;
  }, 200);
}
function timer() {
  clearInterval(timerInterval);
  currentSeconds = getInputSeconds();
  timerInterval = setInterval(() => {
    if (TimerStatus.isRunning(TIMER_STATUS)) {
      currentSeconds--;
      if (currentSeconds <= 10) {
        TIMER_STATUS = TimerStatus.COUNTDOWN;
        styleBlinkCountdown(currentSeconds);
        updateButtonStates();
        updateContributorsVisibility();
      }
      setInputValues(currentSeconds);
      saveSettings();
      if (currentSeconds <= 0) {
        clearInterval(timerInterval);
        document.body.classList.add("zero");
        TIMER_STATUS = TimerStatus.STOPPED;
        updateButtonStates();
        updateContributorsVisibility();
        saveSettings();
        return;
      }
    } else {
      clearInterval(timerInterval);
    }
  }, DEFAULT_INTERVAL);
}
function validateInput(el, maxValue) {
  let v = parseInt(el.value) || 0;
  if (v < 0) v = 0;
  if (v > maxValue) v = maxValue;
  el.value = formatInput(v);
}
function formatInput(v = 0) {
  return v.toString().padStart(2,"0").slice(-2);
}
function getInputSeconds() {
  const h = parseInt(hour.value) || 0;
  const m = parseInt(min.value) || 0;
  const s = parseInt(sec.value) || 0;
  return (h * 3600) + (m * 60) + s;
}
function setInputValues(t=0) {
  const h = Math.floor(t/3600);
  const m = Math.floor((t%3600)/60);
  const s = t%60;
  hour.value = formatInput(h);
  min.value = formatInput(m);
  sec.value = formatInput(s);
}
function updateButtonStates() {
  const startBtn = document.querySelector(".js-play-button");
  const pauseBtn = document.querySelector(".js-pause-button");
  const editBtn = document.querySelector(".js-edit-button");
  const stopBtn = document.querySelector(".js-stop-button");
  const add30sPaused = document.getElementById("add30sPaused");
  const add30sStopped = document.getElementById("add30sStopped");
  const add30sRunning = document.getElementById("add30sRunning");
  const ov = document.querySelector(".click-overlay");
  pauseBtn.classList.add("hide");
  startBtn.setAttribute("data-tooltip", "Iniciar o cronômetro");
  if (TimerStatus.isRunning(TIMER_STATUS) && !TimerStatus.isCountdown(TIMER_STATUS)) {
    startBtn.classList.add("hide");
    pauseBtn.classList.remove("hide");
    editBtn.classList.add("hide");
    stopBtn.classList.remove("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.remove("hide");
    ov.classList.remove("active");
  } else if (TimerStatus.isCountdown(TIMER_STATUS)) {
    startBtn.classList.add("hide");
    pauseBtn.classList.remove("hide");
    editBtn.classList.add("hide");
    stopBtn.classList.add("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.add("hide");
    ov.classList.remove("active");
  } else if (TimerStatus.isPaused(TIMER_STATUS)) {
    startBtn.classList.remove("hide");
    editBtn.classList.remove("hide");
    stopBtn.classList.remove("hide");
    add30sPaused.classList.remove("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.add("hide");
    ov.classList.remove("active");
    startBtn.setAttribute("data-tooltip", "Continuar o cronômetro");
  } else if (TimerStatus.isStopped(TIMER_STATUS)) {
    startBtn.classList.remove("hide");
    editBtn.classList.remove("hide");
    stopBtn.classList.add("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.remove("hide");
    add30sRunning.classList.add("hide");
    ov.classList.remove("active");
  } else if (TimerStatus.isEditing(TIMER_STATUS)) {
    startBtn.classList.remove("hide");
    editBtn.classList.remove("hide");
    stopBtn.classList.add("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.add("hide");
    ov.classList.add("active");
  }
  const lbl = document.querySelector(".editing-label");
  const inStop = document.querySelector(".input-stopwatch");
  if (TimerStatus.isEditing(TIMER_STATUS)) {
    inStop.classList.add("editing-mode");
    lbl.textContent = "Editando...";
    lbl.classList.add("visible");
  } else {
    inStop.classList.remove("editing-mode");
    lbl.classList.remove("visible");
  }
  updateContributorsVisibility();
  setupTooltips();
}
function start() {
  if (TimerStatus.isRunning(TIMER_STATUS)) return;
  TIMER_STATUS = TimerStatus.RUNNING;
  applyStyles();
  updateButtonStates();
  timer();
  saveSettings();
}
function pause() {
  if (TimerStatus.isRunning(TIMER_STATUS)) {
    TIMER_STATUS = TimerStatus.PAUSED;
    applyStyles();
    updateButtonStates();
    saveSettings();
  }
}
function stop() {
  clearInterval(timerInterval);
  TIMER_STATUS = TimerStatus.STOPPED;
  applyStyles();
  setInputValues(DEFAULT_SECONDS);
  currentSeconds = DEFAULT_SECONDS;
  updateButtonStates();
  document.body.classList.remove("zero");
  saveSettings();
}
function add30Seconds() {
  if (TimerStatus.isRunning(TIMER_STATUS)) return;
  const ns = getInputSeconds() + 30;
  setInputValues(ns);
  currentSeconds = ns;
  const btn = TimerStatus.isPaused(TIMER_STATUS) ? add30sPaused : add30sStopped;
  btn.classList.add("button-feedback");
  setTimeout(() => btn.classList.remove("button-feedback"), 300);
  saveSettings();
}
function add30SecondsRunning() {
  if (!TimerStatus.isRunning(TIMER_STATUS)) return;
  currentSeconds += 30;
  setInputValues(currentSeconds);
  if (TimerStatus.isCountdown(TIMER_STATUS) && currentSeconds > 10) {
    TIMER_STATUS = TimerStatus.RUNNING;
    document.querySelector(".input-stopwatch").classList.remove("hide");
    document.querySelector(".js-stopwatch-button").classList.remove("hide");
    document.getElementById("countdown").classList.add("hide");
    updateButtonStates();
  }
  add30sRunning.classList.add("button-feedback");
  setTimeout(() => add30sRunning.classList.remove("button-feedback"), 300);
  saveSettings();
}
function cancelEditInput() {
  setInputValues(PRE_EDIT_SECONDS);
  currentSeconds = PRE_EDIT_SECONDS;
  closeEditInput();
  saveSettings();
}
function openEditInput() {
  if (TimerStatus.isRunning(TIMER_STATUS)) return;
  TIMER_STATUS = TimerStatus.EDITING;
  PRE_EDIT_SECONDS = getInputSeconds();
  currentSeconds = PRE_EDIT_SECONDS;
  hour.disabled = false; hour.removeAttribute("tabindex");
  min.disabled = false; min.removeAttribute("tabindex");
  sec.disabled = false; sec.removeAttribute("tabindex");
  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.remove("hide");
  updateButtonStates();
  saveSettings();
}
function closeEditInput() {
  TIMER_STATUS = TimerStatus.PAUSED;
  hour.disabled = true; hour.setAttribute("tabindex","-1");
  min.disabled = true; min.setAttribute("tabindex","-1");
  sec.disabled = true; sec.setAttribute("tabindex","-1");
  currentSeconds = getInputSeconds();
  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.add("hide");
  applyStyles();
  updateButtonStates();
  saveSettings();
}
function resetStyles() {
  document.querySelector(".js-play-button").classList.remove("press-start");
  document.querySelector(".js-stop-button").classList.remove("press-stop");
  document.querySelector(".js-pause-button").classList.remove("press-pause");
  document.querySelector(".js-edit-button").classList.remove("press-edit");
  document.querySelector(".js-active-fullscreen").classList.remove("press-start");
  document.querySelector(".input-stopwatch").classList.remove("hide");
  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.getElementById("countdown").classList.add("hide");
  document.body.classList.remove("zero");
}
const styles = {
  RUNNING: styleRunning,
  PAUSED: stylePause,
  STOPPED: styleStop,
  EDITING: styleEditing
};
function applyStyles() {
  resetStyles();
  if (styles[TIMER_STATUS]) styles[TIMER_STATUS]();
}
function styleBlinkCountdown(s=10) {
  document.querySelector(".input-stopwatch").classList.add("hide");
  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document.getElementById("countdown").classList.remove("hide");
  document.getElementById("countdown-number").textContent = s;
  if (s % 2 === 0) {
    countdown.style.backgroundColor = "var(--secondary-bg-color)";
    countdownNumber.style.color = "var(--secondary-text-color)";
  } else {
    countdown.style.backgroundColor = "var(--primary-bg-color)";
    countdownNumber.style.color = "var(--primary-text-color)";
  }
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
function handleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(e => {});
    document.querySelector(".js-active-fullscreen").classList.add("press-start");
  } else {
    document.exitFullscreen().catch(e => {});
    document.querySelector(".js-active-fullscreen").classList.remove("press-start");
  }
}
function toggleTheme() {
  currentTheme = currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
  applyTheme(currentTheme);
  themeToggle.classList.add("button-feedback");
  setTimeout(() => themeToggle.classList.remove("button-feedback"), 300);
  saveSettings();
}
function applyTheme(t) {
  const root = document.documentElement;
  const icon = themeIcon;
  if (t === Theme.DARK) {
    root.setAttribute("data-theme","dark");
    icon.src = "/images/sun-regular.svg";
    themeToggle.setAttribute("data-tooltip","Mudar para tema claro");
  } else {
    root.setAttribute("data-theme","light");
    icon.src = "/images/moon-regular.svg";
    themeToggle.setAttribute("data-tooltip","Mudar para tema escuro");
  }
}