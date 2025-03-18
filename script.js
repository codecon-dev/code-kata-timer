let timerStarted = false;
let seconds = 0;
let sec = 0;
let min = 0;
let hour = 0;
let intervalInstance;

const timeInputs = document.querySelector('.input-stopwatch');

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const editBtn = document.getElementById("editBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const confirmEditBtn = document.getElementById("confirmEditBtn");

startBtn.addEventListener("click", function () {
  if( !timerStarted ){
    timerStarted = true;
    run();
  }
});

pauseBtn.addEventListener("click", function () {
  pause();
});

resetBtn.addEventListener("click", function () {
  reset();
});

editBtn.addEventListener("click", function () {
  document.querySelector('.js-stopwatch-button').classList.add('hide');
  document.querySelector('.js-edit-container-stopwatch').classList.remove('hide');

  timeInputs.querySelectorAll('input').forEach(input => input.disabled = false);

  hour = Number(document.getElementById("hour").value);
  min = Number(document.getElementById("min").value);
  sec = Number(document.getElementById("sec").value);
});

document.querySelectorAll('.input-stopwatch input').forEach(input => {
  input.addEventListener('input', function () {
    let max = input.id === 'hour' ? 99 : 59;
    let min = 0;

    const value = Number(input.value);

    if( value >= 0 && value < 10 ){
      input.value = '0' + value;
    } else {
      input.value = value;
    }

    if( value < min )
      input.value = '00';

    if( value > max )
      input.value = max;
    
  });
});

cancelEditBtn.addEventListener("click", function () {
  document.querySelector('.js-stopwatch-button').classList.remove('hide');
  document.querySelector('.js-edit-container-stopwatch').classList.add('hide');

  timeInputs.querySelectorAll('input').forEach(input => input.disabled = true);

  document.getElementById("hour").value = hour >= 0 && hour < 10 ? '0' + hour : hour;
  document.getElementById("min").value = min >= 0 && min < 10  ? '0' + min : min;
  document.getElementById("sec").value = sec >= 0 && sec < 10 ? '0' + sec : sec;
});

confirmEditBtn.addEventListener("click", function () {
  document.querySelector('.js-stopwatch-button').classList.remove('hide');
  document.querySelector('.js-edit-container-stopwatch').classList.add('hide');

  timeInputs.querySelectorAll('input').forEach(input => input.disabled = true);
});

function run() {
  if( timerStarted ) {
    startBtn.classList.add('hide');
    pauseBtn.classList.remove('hide');
    editBtn.disabled = true;

    intervalInstance = setInterval(function () {
      convertInputsToSeconds();
      seconds--;

      if( seconds >= 0 ){
        convertSecondsToInputs();
      } else {
        timerStarted = false;
        clearInterval(intervalInstance);
        startBtn.classList.remove('hide');
        pauseBtn.classList.add('hide');
        editBtn.disabled = false;
      }
    }, 1000);
  }
}

const convertInputsToSeconds = () => {
  hour = Number(document.getElementById("hour").value);
  min = Number(document.getElementById("min").value);
  sec = Number(document.getElementById("sec").value);

  seconds = sec;

  if( min > 0 )
    seconds += min * 60;

  if ( hour > 0 )
    seconds += hour * 3600;
}

const convertSecondsToInputs = () => {
  hour = 0;
  min = 0;
  sec = 0;

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

  document.getElementById("hour").value = hour >= 0 && hour < 10 ? '0' + hour : hour;
  document.getElementById("min").value = min >= 0 && min < 10  ? '0' + min : min;
  document.getElementById("sec").value = sec >= 0 && sec < 10 ? '0' + sec : sec;
}

function pause() {
  timerStarted = false;
  clearInterval(intervalInstance);
  startBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
  editBtn.disabled = false;
}

function reset() {
  timerStarted = false;
  clearInterval(intervalInstance);
  document.getElementById("hour").value = '00';
  document.getElementById("min").value = '00';
  document.getElementById("sec").value = 30;
  startBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
  editBtn.disabled = false;
}
