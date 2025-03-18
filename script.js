import Input from "./utils/input-utils.js";

const DEFAULT_INTERVAL = 1000;
let timerStarted = false;
let seconds = "30";
let minutes = "00";
let hours = "00";
let intervalInstance = null;
const inputs = new Input("hour", "min", "sec");
inputs.setAllInputsValues(hours, minutes, seconds);

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
	inputs.setAllInputsValues(0, 0, 30);
});

function run() {
	hours = inputs.hours;
	minutes = inputs.minutes;
	seconds = inputs.seconds;

	inputs.format();

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
				return;
			}
		} else {
			seconds--;
		}

		inputs.setAllInputsValues(hours, minutes, seconds);
	}, DEFAULT_INTERVAL);
}

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

	const cancelButton = document.querySelector(".js-cancel-button");
	cancelButton.addEventListener("click", () => {
		editContainer.classList.add("hide");
		stopwatchButtons.classList.remove("hide");
	});

	const finishEditButton = document.querySelector(".js-finish-edit-button");
	finishEditButton.addEventListener("click", () => {
		editContainer.classList.add("hide");
		stopwatchButtons.classList.remove("hide");
		hours = parseInt(hourInput.value, 10);
		minutes = parseInt(minInput.value, 10);
		seconds = parseInt(secInput.value, 10);

		inputs.setAllInputsValues(hours, minutes, seconds);
	});
});
