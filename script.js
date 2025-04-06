const TimerStatus = {
  STOPPED: "STOPPED",
  PAUSED: "PAUSED",
  COUNTDOWN: "COUNTDOWN",
  RUNNING: "RUNNING",
  EDITING: "EDITING",
  isRunning: (status) => status === TimerStatus.RUNNING || status === TimerStatus.COUNTDOWN,
  isCountdown: (status) => status === TimerStatus.COUNTDOWN,
  isPaused: (status) => status === TimerStatus.PAUSED,
  isStopped: (status) => status === TimerStatus.STOPPED,
  isEditing: (status) => status === TimerStatus.EDITING,
};

const DEFAULT_INTERVAL = 1000;
const DEFAULT_SECONDS = 30;
let TIMER_STATUS = TimerStatus.STOPPED;

// Variável para armazenar o intervalo do timer
let timerInterval = null;
// Variável para armazenar o segundo atual
let currentSeconds = DEFAULT_SECONDS;
// Variável para armazenar o tooltip atual
let currentTooltip = null;
// Variável para rastrear evento de hover
let tooltipTimeout = null;

// Configuração do tema
const Theme = {
  DARK: "dark",
  LIGHT: "light"
};

// Tema padrão
let currentTheme = Theme.DARK;

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
  // Criar o overlay para capturar cliques fora da área de edição
  const clickOverlay = document.createElement("div");
  clickOverlay.className = "click-overlay";
  document.body.appendChild(clickOverlay);
  
  // Click no overlay fecha o modo de edição
  clickOverlay.addEventListener("click", function() {
    if (TimerStatus.isEditing(TIMER_STATUS)) {
      closeEditInput();
    }
  });
  
  // Criar o container de tooltip
  const tooltipContainer = document.createElement("div");
  tooltipContainer.id = "tooltip-container";
  document.body.appendChild(tooltipContainer);
  
  // Criar o container para o rótulo "Editando"
  const editingTitleContainer = document.createElement("div");
  editingTitleContainer.className = "editing-title-container";
  document.body.appendChild(editingTitleContainer);
  
  // Criar o elemento para o rótulo "Editando"
  const editingLabel = document.createElement("div");
  editingLabel.className = "editing-label";
  editingLabel.textContent = "Editando...";
  editingTitleContainer.appendChild(editingLabel);
  
  setInputValues(DEFAULT_SECONDS);
  applyTheme(currentTheme);
  setupEventListeners();
  
  // Mostrar o botão +30s inicial apropriado com base no estado inicial
  updateButtonStates();
});

function setupEventListeners() {
  // Event listeners para os botões de controle
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

  // Event listeners para validação de entrada
  document.getElementById("hour").addEventListener("input", function () {
    validateInput(this, 99);
  });
  document.getElementById("min").addEventListener("input", function () {
    validateInput(this, 59);
  });
  document.getElementById("sec").addEventListener("input", function () {
    validateInput(this, 59);
  });

  // Prevenir interação com inputs quando não estão em modo de edição
  document.getElementById("hour").addEventListener("click", function(e) {
    if (TIMER_STATUS !== TimerStatus.EDITING) {
      e.preventDefault();
    }
  });
  document.getElementById("min").addEventListener("click", function(e) {
    if (TIMER_STATUS !== TimerStatus.EDITING) {
      e.preventDefault();
    }
  });
  document.getElementById("sec").addEventListener("click", function(e) {
    if (TIMER_STATUS !== TimerStatus.EDITING) {
      e.preventDefault();
    }
  });

  // Corrigir problema do cursor (|) sendo exibido ao clicar na página
  document.addEventListener("click", function(e) {
    if (TIMER_STATUS !== TimerStatus.EDITING) {
      // Remover foco de qualquer elemento ativo quando não estiver no modo de edição
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  });

  // Setup tooltips
  setupTooltips();
}

function setupTooltips() {
  // Limpar eventos anteriores
  document.querySelectorAll("[data-tooltip]").forEach(element => {
    element.removeEventListener("mouseenter", handleTooltipMouseEnter);
    element.removeEventListener("mouseleave", handleTooltipMouseLeave);
  });
  
  // Adicionar novos listeners
  document.querySelectorAll("[data-tooltip]").forEach(element => {
    element.addEventListener("mouseenter", handleTooltipMouseEnter);
    element.addEventListener("mouseleave", handleTooltipMouseLeave);
  });
}

function handleTooltipMouseEnter(e) {
  const tooltipText = this.getAttribute("data-tooltip");
  if (!tooltipText) return;
  
  // Limpar qualquer tooltip anterior e timeout
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }
  
  hideTooltip();
  
  // Mostrar o tooltip
  showTooltip(this, tooltipText);
}

function handleTooltipMouseLeave() {
  // Usar timeout para evitar piscar em movimentos rápidos do mouse
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }
  
  tooltipTimeout = setTimeout(() => {
    hideTooltip();
    tooltipTimeout = null;
  }, 100);
}

function showTooltip(element, text) {
  const container = document.getElementById("tooltip-container");
  if (!container) return;
  
  // Criar o tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = text;
  container.appendChild(tooltip);
  
  // Posicionar o tooltip
  positionTooltip(tooltip, element);
  
  currentTooltip = tooltip;
}

function positionTooltip(tooltip, element) {
  const rect = element.getBoundingClientRect();
  
  // Definir largura máxima para evitar cortes
  tooltip.style.maxWidth = "250px";
  
  // Esperar um tick para garantir que o CSS seja aplicado e as dimensões calculadas
  setTimeout(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Posição inicial (centro inferior do elemento)
    let top = rect.bottom + 10;
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    
    // Ajustar para evitar sair da tela
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    
    // Verificar se está abaixo da tela
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = rect.top - tooltipRect.height - 10; // Colocar acima
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    
    // Tornar visível após posicionamento
    tooltip.style.opacity = "1";
  }, 0);
}

function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.style.opacity = "0";
    setTimeout(() => {
      if (currentTooltip && currentTooltip.parentNode) {
        currentTooltip.parentNode.removeChild(currentTooltip);
      }
      currentTooltip = null;
    }, 200);
  }
}

function timer() {
  // Limpa qualquer intervalo existente
  clearInterval(timerInterval);
  
  // Obtém os segundos atuais
  currentSeconds = getInputSeconds();
  
  // Cria um novo intervalo
  timerInterval = setInterval(function() {
    if (TimerStatus.isRunning(TIMER_STATUS)) {
      currentSeconds--;

      if (currentSeconds <= 10) {
        TIMER_STATUS = TimerStatus.COUNTDOWN;
        styleBlinkCountdown(currentSeconds);
        updateButtonStates(); // Atualizar botões também no modo countdown
      }

      setInputValues(currentSeconds);
      
      if (currentSeconds <= 0) {
        clearInterval(timerInterval);
        document.body.classList.add("zero");
        TIMER_STATUS = TimerStatus.STOPPED;
        updateButtonStates();
        return;
      }
    } else {
      // Se o timer não está rodando, limpa o intervalo
      clearInterval(timerInterval);
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

function updateButtonStates() {
  const startBtn = document.querySelector(".js-play-button");
  const pauseBtn = document.querySelector(".js-pause-button");
  const editBtn = document.querySelector(".js-edit-button");
  const add30sPaused = document.getElementById("add30sPaused");
  const add30sStopped = document.getElementById("add30sStopped");
  const add30sRunning = document.getElementById("add30sRunning");
  const overlay = document.querySelector(".click-overlay");

  // Primeiro, esconder o botão de pausar em todos os casos
  pauseBtn.classList.add("hide");

  // Ocultar/mostrar botões com base no estado do timer
  if (TimerStatus.isRunning(TIMER_STATUS) && !TimerStatus.isCountdown(TIMER_STATUS)) {
    // Quando o timer está em execução normal
    startBtn.classList.add("hide");
    pauseBtn.classList.remove("hide"); // Mostrar o botão pausar apenas quando estiver rodando
    editBtn.classList.add("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.remove("hide");
    overlay.classList.remove("active");
  } else if (TimerStatus.isCountdown(TIMER_STATUS)) {
    // Durante a contagem regressiva final, ocultar todos os botões adicionais
    startBtn.classList.add("hide");
    pauseBtn.classList.remove("hide"); // Mostrar o botão pausar também durante countdown
    editBtn.classList.add("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.add("hide");
    overlay.classList.remove("active");
  } else if (TimerStatus.isPaused(TIMER_STATUS)) {
    // Quando pausado, mostrar os botões relevantes
    startBtn.classList.remove("hide");
    editBtn.classList.remove("hide");
    add30sPaused.classList.remove("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.add("hide");
    overlay.classList.remove("active");
  } else if (TimerStatus.isStopped(TIMER_STATUS)) {
    // Quando parado, mostrar os botões relevantes
    startBtn.classList.remove("hide");
    editBtn.classList.remove("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.remove("hide");
    add30sRunning.classList.add("hide");
    overlay.classList.remove("active");
  } else if (TimerStatus.isEditing(TIMER_STATUS)) {
    // No modo de edição
    startBtn.classList.remove("hide");
    editBtn.classList.remove("hide");
    add30sPaused.classList.add("hide");
    add30sStopped.classList.add("hide");
    add30sRunning.classList.add("hide");
    overlay.classList.add("active"); // Ativar overlay no modo de edição
  }

  // Atualizar a classe para indicação visual de modo de edição
  const timerContainer = document.querySelector(".input-stopwatch");
  const editingLabel = document.querySelector(".editing-label");
  
  if (TimerStatus.isEditing(TIMER_STATUS)) {
    timerContainer.classList.add("editing-mode");
    editingLabel.classList.add("visible");
  } else {
    timerContainer.classList.remove("editing-mode");
    editingLabel.classList.remove("visible");
  }
  
  // Reconfigurar tooltips após alterações no DOM
  setupTooltips();
}

function start() {
  if (TimerStatus.isRunning(TIMER_STATUS)) return;
  
  TIMER_STATUS = TimerStatus.RUNNING;
  applyStyles();
  updateButtonStates();
  timer();
}

function pause() {
  if (TimerStatus.isRunning(TIMER_STATUS)) {
    TIMER_STATUS = TimerStatus.PAUSED;
    applyStyles();
    updateButtonStates();
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
}

function add30Seconds() {
  if (TimerStatus.isRunning(TIMER_STATUS)) return;
  
  const newSeconds = getInputSeconds() + 30;
  setInputValues(newSeconds);
  currentSeconds = newSeconds;
  
  // Mostrar feedback visual temporário
  const addBtn = TimerStatus.isPaused(TIMER_STATUS) 
    ? document.getElementById("add30sPaused") 
    : document.getElementById("add30sStopped");
    
  addBtn.classList.add("button-feedback");
  
  setTimeout(() => {
    addBtn.classList.remove("button-feedback");
  }, 300);
}

function add30SecondsRunning() {
  if (!TimerStatus.isRunning(TIMER_STATUS)) return;

  // Adicionar 30 segundos ao tempo atual  
  currentSeconds += 30;
  setInputValues(currentSeconds);
  
  // Se estava em modo countdown e agora tem mais de 10 segundos, voltar para modo normal
  if (TimerStatus.isCountdown(TIMER_STATUS) && currentSeconds > 10) {
    TIMER_STATUS = TimerStatus.RUNNING;
    // Restaurar a visualização normal
    document.querySelector(".input-stopwatch").classList.remove("hide");
    document.querySelector(".js-stopwatch-button").classList.remove("hide");
    document.getElementById("countdown").classList.add("hide");
    updateButtonStates();
  }
  
  // Mostrar feedback visual temporário
  const add30sBtn = document.getElementById("add30sRunning");
  add30sBtn.classList.add("button-feedback");
  
  setTimeout(() => {
    add30sBtn.classList.remove("button-feedback");
  }, 300);
}

function handleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
    });
    document.querySelector(".js-active-fullscreen").classList.add("press-start");
  } else {
    document.exitFullscreen().catch(err => {
      console.error(`Erro ao tentar sair da tela cheia: ${err.message}`);
    });
    document.querySelector(".js-active-fullscreen").classList.remove("press-start");
  }
}

function toggleTheme() {
  currentTheme = currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
  applyTheme(currentTheme);
  
  // Mostrar feedback visual temporário
  const themeBtn = document.getElementById("themeToggle");
  themeBtn.classList.add("button-feedback");
  
  setTimeout(() => {
    themeBtn.classList.remove("button-feedback");
  }, 300);
}

function applyTheme(theme) {
  const themeBtn = document.getElementById("themeToggle");
  const root = document.documentElement;
  const themeIcon = document.getElementById("themeIcon");
  
  if (theme === Theme.DARK) {
    root.setAttribute("data-theme", "dark");
    themeIcon.src = "/images/sun-regular.svg"; // Ícone de sol para mudar para modo claro
    themeBtn.setAttribute("data-tooltip", "Mudar para tema claro");
  } else {
    root.setAttribute("data-theme", "light");
    themeIcon.src = "/images/moon-regular.svg"; // Ícone de lua para mudar para modo escuro
    themeBtn.setAttribute("data-tooltip", "Mudar para tema escuro");
  }
}

let PRE_EDIT_SECONDS = DEFAULT_SECONDS;

function cancelEditInput() {
  setInputValues(PRE_EDIT_SECONDS);
  currentSeconds = PRE_EDIT_SECONDS;
  closeEditInput();
}

function openEditInput() {
  // Não permitir edição se o timer estiver rodando
  if (TimerStatus.isRunning(TIMER_STATUS)) return;
  
  TIMER_STATUS = TimerStatus.EDITING;
  PRE_EDIT_SECONDS = getInputSeconds();
  currentSeconds = PRE_EDIT_SECONDS;
  
  document.getElementById("hour").disabled = false;
  document.getElementById("min").disabled = false;
  document.getElementById("sec").disabled = false;

  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.remove("hide");
  updateButtonStates();
}

function closeEditInput() {
  TIMER_STATUS = TimerStatus.PAUSED;
  document.getElementById("hour").disabled = true;
  document.getElementById("min").disabled = true;
  document.getElementById("sec").disabled = true;
  
  currentSeconds = getInputSeconds();

  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.querySelector(".js-edit-container-stopwatch").classList.add("hide");

  applyStyles();
  updateButtonStates();
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
  EDITING: styleEditing,
};

function applyStyles() {
  resetStyles();
  styles[TIMER_STATUS]?.();
}

function styleBlinkCountdown(seconds = 10) {
  document.querySelector(".input-stopwatch").classList.add("hide");
  document.querySelector(".js-stopwatch-button").classList.add("hide");
  document.getElementById("countdown").classList.remove("hide");
  document.getElementById("countdown-number").textContent = seconds;

  // Alterna a cor a cada segundo
  if (seconds % 2 === 0) {
    document.getElementById("countdown").style.backgroundColor = "var(--secondary-bg-color)";
    document.getElementById("countdown-number").style.color = "var(--secondary-text-color)";
  } else {
    document.getElementById("countdown").style.backgroundColor = "var(--primary-bg-color)";
    document.getElementById("countdown-number").style.color = "var(--primary-text-color)";
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