let timerStarted = false;
let seconds = 0;
let intervalInstance;

const convertInputsToSeconds = () => {
  const hour = Number(document.getElementById("hour").value);
  const min = Number(document.getElementById("min").value);
  const sec = Number(document.getElementById("sec").value);

  seconds = sec;

  if( min > 0 )
    seconds += min * 60;

  if ( hour > 0 )
    seconds += hour * 3600;
}

const convertSecondsToInputs = () => {
  let hour = 0;
  let min = 0;
  let sec = 0;

  if( seconds > 3600 ){
    hour = Math.floor(  seconds / 3600  );
    seconds = seconds % 3600;
  }

  if( seconds > 60 ){
    min = Math.floor( seconds / 60);
    sec = seconds % 60;
  } else {
    sec = seconds;
  }

  document.getElementById("hour").value = hour < 10 && hour > 0 ? '0' + hour : hour == 0 ? '00' : hour;
  document.getElementById("min").value = min < 10 && min > 0 ? '0' + min : min == 0 ? '00' : min;
  document.getElementById("sec").value = sec < 10 && sec > 0 ? '0' + sec : sec == 0 ? '00' : sec;
}

document.getElementById("startBtn").addEventListener("click", function () {
  timerStarted = true;
  run();
});

document.getElementById("pauseBtn").addEventListener("click", function () {
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
  intervalInstance = setInterval(function () {
    if (timerStarted) {
      convertInputsToSeconds();
      seconds--;

      if( seconds >= 0 ){
        convertSecondsToInputs();
      } else {
        timerStarted = false;
        clearInterval(intervalInstance);
      }
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
