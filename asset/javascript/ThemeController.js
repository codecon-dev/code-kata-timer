function ThemeController(reference) {
    const body = reference;

    const themeMenuButton = body.querySelector('.js-theme-menu-button');
    const themeDropdown = body.querySelector('.js-theme-dropdown');

    const defaultThemeButton = body.querySelector('.js-default-theme-button');
    const versusThemeButton = body.querySelector('.js-versus-theme-button');

    function init() {
        bindButtons();
    }

    function bindButtons() {
        themeMenuButton.addEventListener('click', toggleThemeMenu);
        defaultThemeButton.addEventListener('click', setDefaultTheme);
        versusThemeButton.addEventListener('click', setVersusTheme);
    }

    function toggleThemeMenu() {
        themeDropdown.classList.toggle('hide');
    }

    function setDefaultTheme() {
    body.classList.remove('versus-theme');
    body.classList.remove('inverted');
    closeThemeMenu();
    }

    function setVersusTheme() {
    body.classList.add('versus-theme');
    body.classList.remove('inverted');
    closeThemeMenu();
    }

    function closeThemeMenu() {
        themeDropdown.classList.add('hide');
    }

    init();
}

document.addEventListener('DOMContentLoaded', function () {
    const reference = document.querySelector('.js-body');
    const themeController = new ThemeController(reference);
    window.themeController = themeController;
});

export default ThemeController;