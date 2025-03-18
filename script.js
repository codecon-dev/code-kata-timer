let timerStarted = false;
let seconds = 0;
let sec = 0;
let min = 0;
let hour = 0;
let intervalInstance;

// CAPITURANDO ELEMENTOS DA DOM (HTML)
const divTimeInputs = document.querySelector('.input-stopwatch');
const allTimeInputs = document.querySelectorAll('input');
const secFinals = document.getElementById("secFinals");
const hourInput = document.getElementById("hour");
const minInput = document.getElementById("min");
const secInput = document.getElementById("sec");
const timeInputsFinals = document.querySelector('.input-stopwatch-finals');

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const editBtn = document.getElementById("editBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const confirmEditBtn = document.getElementById("confirmEditBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const jsStopwatchButton = document.querySelector('.js-stopwatch-button');
const jsEditContainerStopwatch = document.querySelector('.js-edit-container-stopwatch');

// EVENTOS DOS ELEMENTOS DA DOM
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
  toggleElementVisibily( [jsStopwatchButton, jsEditContainerStopwatch] );

  allTimeInputs.forEach(input => input.disabled = false);

  hour = Number(hourInput.value);
  min = Number(minInput.value);
  sec = Number(secInput.value);
});

allTimeInputs.forEach(input => {
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
  toggleElementVisibily( [jsStopwatchButton, jsEditContainerStopwatch] );

  allTimeInputs.forEach(input => input.disabled = true);

  hourInput.value = hour >= 0 && hour < 10 ? '0' + hour : hour;
  minInput.value = min >= 0 && min < 10  ? '0' + min : min;
  secInput.value = sec >= 0 && sec < 10 ? '0' + sec : sec;
});

confirmEditBtn.addEventListener("click", function () {
  toggleElementVisibily( [jsStopwatchButton, jsEditContainerStopwatch] );

  allTimeInputs.forEach(input => input.disabled = true);
});

fullscreenBtn.addEventListener("click", function () {
  if( !document.fullscreenElement ){
    document.documentElement.requestFullscreen().catch(e => {
      console.error(`Não foi possível colocar em tela cheia: ${e.message}`)
    });
  } else {
    document.exitFullscreen();
  }
});

// FUNÇÕES JAVASCRIPT
function run() {
  if( timerStarted ) {
    toggleElementVisibily( [startBtn, pauseBtn] );
    editBtn.disabled = true;

    intervalInstance = setInterval(function () {
      convertInputsToSeconds();
      seconds--;

      if( seconds >= 0 ){
        convertSecondsToHour();

        if( (seconds >= 0 && seconds <= 10) && !(hourInput.value > 0 || minInput.value > 0) ){
          divTimeInputs.classList.add('hide');
          jsStopwatchButton.classList.add('hide');
          timeInputsFinals.classList.remove('hide');

          secFinals.value = sec >= 0 && sec < 10 ? '0' + sec : sec;
          secInput.value = sec >= 0 && sec < 10 ? '0' + sec : sec;
        } else {
          hourInput.value = hour >= 0 && hour < 10 ? '0' + hour : hour;
          minInput.value = min >= 0 && min < 10  ? '0' + min : min;
          secInput.value = sec >= 0 && sec < 10 ? '0' + sec : sec;
        }
      } else {
        timerStarted = false;
        clearInterval(intervalInstance);

        let blinkCount = 0;
        let blinkEffect = setInterval(() => {
          document.body.classList.toggle('blink-background');
          divTimeInputs.classList.toggle('blink-font');
          secFinals.classList.toggle('blink-font');
          blinkCount++;

          if( blinkCount >= 8 ){
            clearInterval(blinkEffect);

            toggleElementVisibily( [startBtn, pauseBtn, divTimeInputs, jsStopwatchButton, timeInputsFinals] );
            secInput.value = '00';
            editBtn.disabled = false;
          }
        }, 500);
      }
    }, 1000);
  }
}

const convertInputsToSeconds = () => {
  hour = Number(hourInput.value);
  min = Number(minInput.value);
  sec = Number(secInput.value);

  seconds = sec;

  if( min > 0 )
    seconds += min * 60;

  if ( hour > 0 )
    seconds += hour * 3600;
}

const convertSecondsToHour = () => {
  hour = 0;
  min = 0;
  sec = 0;

  if( seconds >= 3600 ){
    hour = Math.floor(  seconds / 3600  );
    seconds = seconds % 3600;
  }

  if( seconds >= 60 ){
    min = Math.floor( seconds / 60);
    sec = seconds % 60;
  } else {
    sec = seconds;
  }
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
  hourInput.value = '00';
  minInput.value = '00';
  secInput.value = 30;
  startBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
  editBtn.disabled = false;
}

function toggleElementVisibily( elements ) {
  for( const element of elements ){
    element.classList.toggle('hide');
  }
}
