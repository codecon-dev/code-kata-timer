class Input {
	constructor(hourId, minId, secId) {
		this._hour = document.querySelector(`#${hourId}`);
		this._min = document.querySelector(`#${minId}`);
		this._sec = document.querySelector(`#${secId}`);
	}

	/**
	 *
	 * @param {string} value
	 */
	_safelyConvertToInt(value) {
		return Math.max(0, parseInt(value, 10) || 0);
	}

	/**
	 *
	 * @param {HTMLInputElement} element
	 * @param {string | number} value
	 */
	_safelySetValue(element, value) {
		element.value = value || 0;
		let inputNumber = Math.max(0, parseInt(element.value, 10) || 0);
		if (inputNumber <= 9) {
			element.value = `0${inputNumber}`;
		}
	}

	get hours() {
		return this._safelyConvertToInt(this._hour.value);
	}
	get minutes() {
		return this._safelyConvertToInt(this._min.value);
	}
	get seconds() {
		return this._safelyConvertToInt(this._sec.value);
	}

	/**
	 *
	 * @param {string | number} value
	 * @param {"hour" | "min" | "sec"} inputName
	 */
	/* setInputValue(value, inputName){} */

	setAllInputsValues(hour, min, sec) {
		this._safelySetValue(this._hour, hour);
		this._safelySetValue(this._min, min);
		this._safelySetValue(this._sec, sec);
	}

	format() {
		this._safelySetValue(this._hour, this._hour.value);
		this._safelySetValue(this._min, this._min.value);
		this._safelySetValue(this._sec, this._sec.value);
	}
}

export default Input;
