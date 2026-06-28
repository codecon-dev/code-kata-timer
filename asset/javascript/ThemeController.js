export function ThemeController(reference) {
    const body = reference;

    const themeMenuButton = body.querySelector('.js-theme-menu-button');
    const themeDropdown = body.querySelector('.js-theme-dropdown');

    const defaultThemeButton = body.querySelector('.js-default-theme-button');
    const versusThemeButton = body.querySelector('.js-versus-theme-button');

    function init() {
        if (!themeMenuButton || !themeDropdown || !defaultThemeButton || !versusThemeButton) {
            return;
        }

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
