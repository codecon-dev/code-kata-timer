let timerStarted = false;
let intervalInstance;

let hours = 0, minutes = 0, seconds = 0;

// Inicializa os valores de tempo a partir dos selects
document.getElementById("hour").value = hours.toString().padStart(2, "0");
document.getElementById("min").value = minutes.toString().padStart(2, "0");
document.getElementById("sec").value = seconds.toString().padStart(2, "0");

// Atualiza o cronômetro imediatamente ao selecionar qualquer valor
document.getElementById("hour").addEventListener("change", updateTimerFromSelect);
document.getElementById("min").addEventListener("change", updateTimerFromSelect);
document.getElementById("sec").addEventListener("change", updateTimerFromSelect);

document.getElementById("playPauseBtn").addEventListener("click", togglePlayPause);
document.getElementById("toZeroBtn").addEventListener("click", reset);
const fullscreenBtn = document.getElementById("fullscreenBtn");
const timerContainer = document.getElementById("timerContainer");

function updateTimerFromSelect() {
  hours = parseInt(document.getElementById("hour").value, 10) || 0;
  minutes = parseInt(document.getElementById("min").value, 10) || 0;
  seconds = parseInt(document.getElementById("sec").value, 10) || 0;
  updateDisplay();
}

function togglePlayPause() {
  if (timerStarted) {
    pause();
    updatePlayPauseIcon("play");
  } else {
    start();
    updatePlayPauseIcon("pause");
  }
}

function start() {
  timerStarted = true;
  updateValues();

  intervalInstance = setInterval(() => {
    if (!timerStarted) return;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      pause();
      updatePlayPauseIcon("play");
      return;
    }

    if (seconds === 0) {
      if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      }
    } else {
      seconds--;
    }

    updateDisplay();
  }, 1000);
}

function pause() {
  timerStarted = false;
  clearInterval(intervalInstance);
}

function reset() {
  pause();
  hours = 0;
  minutes = 0;
  seconds = 0;
  updateDisplay();
  updatePlayPauseIcon("play");
}

function updateValues() {
  hours = parseInt(document.getElementById("hour").value, 10) || 0;
  minutes = parseInt(document.getElementById("min").value, 10) || 0;
  seconds = parseInt(document.getElementById("sec").value, 10) || 0;
}

function updateDisplay() {
  document.getElementById("hour-display").textContent = hours.toString().padStart(2, "0");
  document.getElementById("min-display").textContent = minutes.toString().padStart(2, "0");
  document.getElementById("sec-display").textContent = seconds.toString().padStart(2, "0");
}

function updatePlayPauseIcon(action) {
  const playPauseIcon = document.getElementById("playPauseIcon");
  const playPauseText = document.getElementById("playPauseText");

  if (action === "play") {
    playPauseIcon.src = "/images/play.svg";
    playPauseIcon.alt = "Iniciar";
    playPauseText.textContent = "Iniciar"; // Alterando o texto
  } else if (action === "pause") {
    playPauseIcon.src = "/images/pause.svg";
    playPauseIcon.alt = "Pausar";
    playPauseText.textContent = "Pausar"; // Alterando o texto
  }
}


// Função para tela cheia
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    // Tentar entrar em tela cheia
    if (timerContainer.requestFullscreen) {
      timerContainer.requestFullscreen();
    } else if (timerContainer.mozRequestFullScreen) { // Para Firefox
      timerContainer.mozRequestFullScreen();
    } else if (timerContainer.webkitRequestFullscreen) { // Para Chrome, Safari, Opera
      timerContainer.webkitRequestFullscreen();
    } else if (timerContainer.msRequestFullscreen) { // Para IE/Edge
      timerContainer.msRequestFullscreen();
    }
  } else {
    // Sair de tela cheia
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Para Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Para Chrome, Safari, Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // Para IE/Edge
      document.msExitFullscreen();
    }
  }
});



