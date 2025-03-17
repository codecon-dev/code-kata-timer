let intervalInMillis = 10;

let timerStarted = false;
let millis = 0;
let seconds = 30;
let minutes = 0;
let hours = 0;
let intervalInstance;

document.getElementById("hour").value = hours;
document.getElementById("min").value = minutes;
document.getElementById("sec").value = seconds;

document.getElementById("startBtn").addEventListener("click", function () {
  timerStarted = true;
  run();
});

document.getElementById("pauseBtn").addEventListener("click", function () {
  console.log("pause");
  pause();
});

document.getElementById("toZeroBtn").addEventListener("click", function () {
  pause();
  hours = 0;
  minutes = 0;
  seconds = 30;

  document.getElementById("hour").value = hours;
  document.getElementById("min").value = minutes;
  document.getElementById("sec").value = seconds;
});

function run() {
  hours = document.getElementById("hour").value;
  minutes = document.getElementById("min").value;
  seconds = document.getElementById("sec").value;

  intervalInstance = setInterval(function () {
    if (timerStarted) {
      seconds--;

      if (seconds == 0) {
        if (minutes > 0) {
          minutes--;

          seconds = 0;
          seconds = 59;
        } else {
          if (hours > 0) {
            // sem condição
          } else {
            timerStarted = false;
            clearInterval(intervalInstance);
          }
        }
      }

      if (minutes == 0) {
        if (hours > 0) {
          hours--;
          minutes = 59;
        } else {
          // sem condição
        }
      }

      document.getElementById(`sec`).value = seconds;
      document.getElementById(`min`).value = minutes;
      document.getElementById(`hour`).value = hours;
    }
  }, 1000);
}

function pause() {
  timerStarted = false;
  clearInterval(intervalInstance);
}

function stop() {
  timerStarted = false;
}
// functio
