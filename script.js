const DEFAULT_INTERVAL = 1000;
// let timerStarted = false;
// let seconds = 30;
// let minutes = 0;
// let hours = 0;
// let intervalInstance = null;

class Timer {
  constructor(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.timerStarted = false;
    this.intervalInstance = null;
  }
}

const timer = new Timer('00', '00', '50');
const alarmSound = new Audio('./sounds/alarm.wav');
const popSound = new Audio('./sounds/pop2.wav');

document.getElementById("hour").value = timer.hours;
document.getElementById("min").value = timer.minutes;
document.getElementById("sec").value = timer.seconds;

document.getElementById("startBtn").addEventListener("click", function () {
  if (!timer.timerStarted) {
    timer.timerStarted = true;
    if (timer.intervalInstance) {
      clearInterval(timer.intervalInstance);
    }
    run();
  }
});

document.getElementById("pauseBtn").addEventListener("click", function () {
  console.log("pause");
  pause();
});

document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  timer.hours = '00';
  timer.minutes = '00';
  timer.seconds = '30';

  console.log(timer.seconds.length);
  if (timer.hours.length === 1) {
    console.log(timer.hours.length);
    timer.hours = "0" + timer.hours;
  }
  if (timer.minutes.length === 1) {
    timer.minutes = "0" + timer.minutes;
  }
  if (timer.seconds.length === 1) {
    timer.seconds = "0" + timer.seconds;
  }

  document.getElementById("hour").value = timer.hours;
  document.getElementById("min").value = timer.minutes;
  document.getElementById("sec").value = timer.seconds;
});

function run() {
  timer.hours = Math.max(0, parseInt(document.getElementById("hour").value, 10) || 0);
  timer.minutes = Math.max(
    0,
    parseInt(document.getElementById("min").value, 10) || 0
  );
  timer.seconds = Math.max(
    0,
    parseInt(document.getElementById("sec").value, 10) || 0
  );

  if (timer.intervalInstance) {
    clearInterval(timer.intervalInstance);
  }

  console.log('primeiro')
  console.log(timer.seconds, timer.minutes, timer.hours);


  timer.intervalInstance = setInterval(function () {
    timer.seconds = parseInt(timer.seconds, 10);
    timer.minutes = parseInt(timer.minutes, 10);
    timer.hours = parseInt(timer.hours, 10);

    if (!timer.timerStarted) return;

    if (timer.seconds === 0) {
      if (timer.minutes > 0) {
        timer.minutes--;
        timer.seconds = 59;
      } else if (hours > 0) {
        timer.hours--;
        timer.minutes = 59;
        timer.seconds = 59;
      } else {
        // Timer acabou
        timer.timerStarted = false;
        clearInterval(timer.intervalInstance);
        timer.intervalInstance = null;
        return;
      }
    } else {
      timer.seconds--;
    }

    console.log('mamaco');
    console.log(timer.seconds, timer.minutes, timer.hours);

    if (timer.hours === 0 && timer.minutes === 0 && timer.seconds <= 10) {
      // console.log(document.getElementById('timerCountdown').style)
      document.getElementById('timerCountdown').style.visibility = 'visible'
      document.getElementById('secCountdown').innerText = timer.seconds;
      document.getElementById('secCountdown').style.color = '#46ffbe'
      document.getElementById('timerCountdown').style.backgroundColor = '#1e1e1e'

      if (timer.seconds > 0) {
        popSound.play();
      }
    }

    if (timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0) {
      // console.log(document.getElementById('timerCountdown').style)
      timer.timerStarted = false;
      clearInterval(timer.intervalInstance);
      timer.intervalInstance = null;
      document.getElementById('timerCountdown').style.backgroundColor = '#46FFBE'
      document.getElementById('secCountdown').style.color = '#1e1e1e'
      document.getElementById('buttonWrapperCountdown').querySelectorAll('button').forEach(button => {
        button.style.borderColor = 'black'
      })
      alarmSound.play();
    }

    timer.hours = timer.hours.toString();
    timer.minutes = timer.minutes.toString();
    timer.seconds = timer.seconds.toString();

    if (timer.hours.length === 1) {
      timer.hours = "0" + timer.hours;
    }
    if (timer.minutes.length === 1) {
      timer.minutes = "0" + timer.minutes;
    }
    if (timer.seconds.length === 1) {
      timer.seconds = "0" + timer.seconds
    }

    console.log('segundo')
    console.log(timer.seconds, timer.minutes, timer.hours);

    document.getElementById("sec").value = timer.seconds;
    document.getElementById("min").value = timer.minutes;
    document.getElementById("hour").value = timer.hours;
  }, DEFAULT_INTERVAL);
}

function pause() {
  timer.timerStarted = false;
  if (timer.intervalInstance) {
    clearInterval(timer.intervalInstance);
    timer.intervalInstance = null;
  }
}

function stop() {
  timer.timerStarted = false;
}

// funcionalidade para o botão de tela cheia e editar
document.addEventListener("DOMContentLoaded", () => {
  const fullscreenButton = document.querySelector(".js-active-fullscreen");
  const editButton = document.querySelector(".js-edit-stopwatch");
  const editContainer = document.querySelector(".js-edit-container-stopwatch");
  const stopwatchButtons = document.querySelector(".js-stopwatch-button");
  const closeCountdown = document.querySelector(".js-close-countdown");

  fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  editButton.addEventListener("click", () => {
    editContainer.classList.toggle("hide");
    stopwatchButtons.classList.toggle("hide");
  });

  closeCountdown.addEventListener("click", () => {
    document.getElementById('timerCountdown').style.visibility = 'hidden'
    document.getElementById('buttonWrapperCountdown').querySelectorAll('button').forEach(button => {
      button.style.borderColor = 'white'
    })
  });

  const cancelButton = document.querySelector(".js-cancel-button");
  cancelButton.addEventListener("click", () => {
    editContainer.classList.add("hide");
    stopwatchButtons.classList.remove("hide");
  });

  const finishEditButton = document.querySelector(".js-finish-edit-button");
  finishEditButton.addEventListener("click", () => {
    editContainer.classList.add("hide");
    stopwatchButtons.classList.remove("hide");
    timer.hours = parseInt(document.getElementById("hour").value, 10);
    timer.minutes = parseInt(document.getElementById("min").value, 10);
    timer.seconds = parseInt(document.getElementById("sec").value, 10);
    document.getElementById("hour").value = timer.hours;
    document.getElementById("min").value = timer.minutes;
    document.getElementById("sec").value = timer.seconds;
  });
});

// tonylimaoo passou por aqui