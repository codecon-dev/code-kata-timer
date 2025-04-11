HTMLElement.prototype.showElement = function showElement() {
    if (this.classList.contains("hide")) {
        this.classList.remove("hide");
    }
};

HTMLElement.prototype.hideElement = function hideElement() {
    if (!this.classList.contains("hide")) {
        this.classList.add("hide");
    }
};