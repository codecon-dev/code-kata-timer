const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
let seconds = 30;
let minutes = 0;
let hours = 0;
let intervalInstance = null;

document.getElementById("hour").innerText = hours;
document.getElementById("min").innerText = minutes;
document.getElementById("sec").innerText = seconds;

document.getElementById("startBtn").addEventListener("click", function () {
  if (!timerStarted) {
    timerStarted = true;
    if (intervalInstance) {
      clearInterval(intervalInstance);
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
  hours = 0;
  minutes = 0;
  seconds = 30;

  document.getElementById("hour").value = hours;
  document.getElementById("min").value = minutes;
  document.getElementById("sec").value = seconds;
});

function run() {
  
  hours = Math.max(0, parseInt(document.getElementById("hour").innerText, 10) || 0);
  minutes = Math.max(
    0,
    parseInt(document.getElementById("min").innerText, 10) || 0
  );
  seconds = Math.max(
    0,
    parseInt(document.getElementById("sec").innerText, 10) || 0
  );

  if (intervalInstance) {
    clearInterval(intervalInstance);
  }

  intervalInstance = setInterval(function () {
    if (!timerStarted) return;

    if (seconds === 0) {
      if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      } else {
        // Timer acabou
        timerStarted = false;
        clearInterval(intervalInstance);
        intervalInstance = null;
        lastStep();
        return;
      }
    } else {

      if(seconds === 10){
        tenSeconds();
      }
      seconds--; 
    }

    document.getElementById("sec").innerText = seconds;
    document.getElementById("min").innerText = minutes;
    document.getElementById("hour").innerText = hours;
  }, DEFAULT_INTERVAL);
}
/**** última etapa, fim */
function lastStep(){
  const body = document.getElementById("body");
  body.classList.remove("body-background-and-colorFont");
  body.classList.add("fim-step");

  const buttonWrapper = document.querySelector(".button-wrapper");
  buttonWrapper.style.display = "none";
}
/**** fim  ****/
/***** quando chegar nos 10 segundos ****/
function tenSeconds(){
  const btHour = document.getElementById("hour");
  const btMin = document.getElementById("min");
  const separeteTime = document.querySelectorAll(".separete-time");
  separeteTime.forEach((element) =>{
    element.classList.add("hidden-hour-minutes-separete");
  })
  
  btHour.classList.add("hidden-hour-minutes-separete");
  btMin.classList.add("hidden-hour-minutes-separete");
}
/**** fim  ****/
function pause() {
  timerStarted = false;
  if (intervalInstance) {
    clearInterval(intervalInstance);
    intervalInstance = null;
  }
}

function stop() {
  timerStarted = false;
}

// funcionalidade para o botão de tela cheia e editar
document.addEventListener("DOMContentLoaded", () => {
  const fullscreenButton = document.querySelector(".js-active-fullscreen");
  const editButton = document.querySelector(".js-edit-stopwatch");
  const editContainer = document.querySelector(".js-edit-container-stopwatch");
  const stopwatchButtons = document.querySelector(".js-stopwatch-button");
  const btHour = document.getElementById("hour");
  const btMin = document.getElementById("min");
  const btSeconds = document.getElementById("sec");
  let saveHour;
  let saveMin;
  let saveSeconds;

  fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
  /**** ativa e desativa edição */
  function enableEdit(){
    btHour.setAttribute("contenteditable",true);
    btMin.setAttribute("contenteditable",true);
    btSeconds.setAttribute("contenteditable",true);
  }
  function disableEdit(){
    btHour.removeAttribute("contenteditable");
    btMin.removeAttribute("contenteditable");
    btSeconds.removeAttribute("contenteditable");
  }
  /*** fim */
  /*** funcionalidade: volta ao time anterior ***/
  function backTimeBeforeEdit(){
    btHour.innerText = saveHour;
    btMin.innerText = saveMin;
    btSeconds.innerText = saveSeconds;
  }
  function saveTimeBeforeEdit(){
    saveHour = btHour.innerText;
    saveMin = btMin.innerText;
    saveSeconds = btSeconds.innerText;
  }
  /**** fim *****/
  editButton.addEventListener("click", () => {
    enableEdit();
    saveTimeBeforeEdit();
    editContainer.classList.toggle("hide");
    stopwatchButtons.classList.toggle("hide");
  });

  const cancelButton = document.querySelector(".js-cancel-button");
  cancelButton.addEventListener("click", () => {
    disableEdit();
    backTimeBeforeEdit();
    editContainer.classList.add("hide");
    stopwatchButtons.classList.remove("hide");
  });

  const finishEditButton = document.querySelector(".js-finish-edit-button");
  finishEditButton.addEventListener("click", () => {
    disableEdit();
    editContainer.classList.add("hide");
    stopwatchButtons.classList.remove("hide");
    hours = parseInt(document.getElementById("hour").innerText, 10);
    minutes = parseInt(document.getElementById("min").innerText, 10);
    seconds = parseInt(document.getElementById("sec").innerText, 10);
    document.getElementById("hour").innerText = hours;
    document.getElementById("min").innerText = minutes;
    document.getElementById("sec").innerText = seconds;
  });
});
