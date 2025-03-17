let timerStarted = false;
let seconds = 30;
let minutes = 0;
let hours = 0;
let intervalInstance;

// Função para formatar o tempo com dois dígitos
function formatTime(value) {
  return value < 10 ? `0${value}` : value.toString();
}

// Função para validar e corrigir os valores dos campos de entrada
function validateInput(input, maxValue) {
  let value = parseInt(input.value) || 0; // Converte o valor para número ou usa 0 se for inválido

  // Garante que o valor esteja dentro dos limites
  if (value < 0) value = 0;
  if (value > maxValue) value = maxValue;

  // Atualiza o valor no campo de entrada
  input.value = formatTime(value);
}

// Desabilita os campos de entrada inicialmente
document.getElementById("hour").disabled = true;
document.getElementById("min").disabled = true;
document.getElementById("sec").disabled = true;

// Inicializa os valores dos campos de entrada
document.getElementById("hour").value = formatTime(hours);
document.getElementById("min").value = formatTime(minutes);
document.getElementById("sec").value = formatTime(seconds);

// Adiciona validação aos campos de entrada
document.getElementById("hour").addEventListener("input", function () {
  validateInput(this, 99); // Horas podem ser de 0 a 99
});

document.getElementById("min").addEventListener("input", function () {
  validateInput(this, 59); // Minutos podem ser de 0 a 59
});

document.getElementById("sec").addEventListener("input", function () {
  validateInput(this, 59); // Segundos podem ser de 0 a 59
});

// Função para iniciar o cronômetro
document.getElementById("startBtn").addEventListener("click", function () {
  if (!timerStarted) {
    timerStarted = true;
    run();
  }
});

// Função para pausar o cronômetro
document.getElementById("pauseBtn").addEventListener("click", function () {
  pause();
});

// Função para resetar o cronômetro
document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  hours = 0;
  minutes = 0;
  seconds = 30;

  document.getElementById("hour").value = formatTime(hours);
  document.getElementById("min").value = formatTime(minutes);
  document.getElementById("sec").value = formatTime(seconds);
});

// Função para entrar no modo de edição
document
  .querySelector(".js-edit-stopwatch")
  .addEventListener("click", function () {
    // Habilita os campos de entrada
    document.getElementById("hour").disabled = false;
    document.getElementById("min").disabled = false;
    document.getElementById("sec").disabled = false;

    // Mostra o container de edição e esconde os outros botões
    document.querySelector(".js-stopwatch-button").classList.add("hide");
    document
      .querySelector(".js-edit-container-stopwatch")
      .classList.remove("hide");
  });

// Função para cancelar a edição
document
  .querySelector(".js-cancel-button")
  .addEventListener("click", function () {
    // Restaura os valores anteriores
    document.getElementById("hour").value = formatTime(hours);
    document.getElementById("min").value = formatTime(minutes);
    document.getElementById("sec").value = formatTime(seconds);

    // Desabilita os campos de entrada
    document.getElementById("hour").disabled = true;
    document.getElementById("min").disabled = true;
    document.getElementById("sec").disabled = true;

    // Mostra os botões normais e esconde o container de edição
    document.querySelector(".js-stopwatch-button").classList.remove("hide");
    document
      .querySelector(".js-edit-container-stopwatch")
      .classList.add("hide");
  });

// Função para finalizar a edição
document
  .querySelector(".js-finish-edit-button")
  .addEventListener("click", function () {
    // Atualiza os valores de horas, minutos e segundos com base nos campos de entrada
    hours = parseInt(document.getElementById("hour").value) || 0;
    minutes = parseInt(document.getElementById("min").value) || 0;
    seconds = parseInt(document.getElementById("sec").value) || 0;

    // Desabilita os campos de entrada
    document.getElementById("hour").disabled = true;
    document.getElementById("min").disabled = true;
    document.getElementById("sec").disabled = true;

    // Mostra os botões normais e esconde o container de edição
    document.querySelector(".js-stopwatch-button").classList.remove("hide");
    document
      .querySelector(".js-edit-container-stopwatch")
      .classList.add("hide");
  });

// Função para colocar em tela cheia
document
  .querySelector(".js-active-fullscreen")
  .addEventListener("click", function () {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  });

// Função para reiniciar a aplicação
document.getElementById("restartBtn").addEventListener("click", function () {
  // Restaura os valores iniciais
  hours = 0;
  minutes = 0;
  seconds = 30;

  document.getElementById("hour").value = formatTime(hours);
  document.getElementById("min").value = formatTime(minutes);
  document.getElementById("sec").value = formatTime(seconds);

  // Restaura a interface original
  document.querySelector(".input-stopwatch").classList.remove("hide");
  document.querySelector(".js-stopwatch-button").classList.remove("hide");
  document.getElementById("countdown").classList.add("hide");

  // Remove a classe de mudança de cor
  document.body.classList.remove("zero");
});

// Função principal do cronômetro (refatorada)
function run() {
  // Atualiza os valores de horas, minutos e segundos com base nos campos de entrada
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

            // Exibe o número centralizado e o botão de reiniciar
            document.getElementById("countdown").classList.remove("hide");
            document.getElementById("countdown-number").textContent = "0";

            // Aplica as mudanças de cor
            document.body.classList.add("zero");

            // Esconde os campos de entrada e os botões
            document.querySelector(".input-stopwatch").classList.add("hide");
            document
              .querySelector(".js-stopwatch-button")
              .classList.add("hide");
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

      // Verifica se restam 10 segundos
      if (hours === 0 && minutes === 0 && seconds <= 10) {
        // Esconde os campos de entrada e os botões
        document.querySelector(".input-stopwatch").classList.add("hide");
        document.querySelector(".js-stopwatch-button").classList.add("hide");

        // Exibe o número centralizado
        document.getElementById("countdown").classList.remove("hide");
        document.getElementById("countdown-number").textContent = seconds;
      }

      // Atualiza os valores na tela com formatação de dois dígitos
      document.getElementById("sec").value = formatTime(seconds);
      document.getElementById("min").value = formatTime(minutes);
      document.getElementById("hour").value = formatTime(hours);
    }
  }, 1000);
}

// Função para pausar o cronômetro
function pause() {
  timerStarted = false;
  clearInterval(intervalInstance);
}
