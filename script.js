const DEFAULT_INTERVAL = 1000;
const DEFAULT_SECONDS = 30;
let TIMER_STATUS = "STOPED";

// Definindo as acoes
document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("toZeroBtn").addEventListener("click", stop);
document.getElementById("restartBtn").addEventListener("click", stop);
document
  .querySelector(".js-edit-button")
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

// Definindo formatacao automatica no input
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    input.value = formatInput(input.value);
  });
});


// Definindo o valor default ao abrir a pagina
setValues(DEFAULT_SECONDS);


// Magica que faz os segundos descerem
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
  }, DEFAULT_INTERVAL);
}

// Utilitario de formatacao do input
function formatInput(value = 0) {
  return value.toString().padStart(2, "0").slice(-2);
}

// Pega o valor do timer em segundos
function getSeconds() {
  const { seconds, minutes, hours } = getValues();

  const sumMinutes = hours * 60 + minutes;
  const sumSeconds = sumMinutes * 60 + seconds;

  return sumSeconds;
}

// Pega os valores do timer separadamente
function getValues() {
  const hours = parseInt(document.getElementById("hour").value) || 0;
  const minutes = parseInt(document.getElementById("min").value) || 0;
  const seconds = parseInt(document.getElementById("sec").value) || 0;

  return { seconds, minutes, hours };
}

// Insere os valores formatados no timer a partir dos segundos informados
function setValues(fromSeconds = 0) {
  const hours = Math.floor(fromSeconds / 3600);
  const minutes = Math.floor((fromSeconds % 3600) / 60);
  const seconds = fromSeconds % 60;

  document.getElementById(`sec`).value = formatInput(seconds);
  document.getElementById(`min`).value = formatInput(minutes);
  document.getElementById(`hour`).value = formatInput(hours);
}

// Funcoes auxiliares dos botoes
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

// Apenas verifica se o timer ta rodando
function validateStatus() {
  return ["RUNNING", "COUNTDOWN"].includes(TIMER_STATUS);
}

// Utilitarios para aplicar e remover os estilos
function resetStyles() {
  document.querySelector(".js-play-button").classList.remove('press-start');
  document.querySelector(".js-stop-button").classList.remove('press-stop');
  document.querySelector(".js-pause-button").classList.remove('press-pause');
  document.querySelector(".js-edit-button").classList.remove('press-edit');
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
  document.querySelector(".js-play-button").classList.add('press-start');
}

function styleStop() {
  document.querySelector(".js-stop-button").classList.add('press-stop');
}

function stylePause() {
  document.querySelector(".js-pause-button").classList.add('press-pause');
}

function styleEditing() {
  document.querySelector(".js-edit-button").classList.add('press-edit');
}
