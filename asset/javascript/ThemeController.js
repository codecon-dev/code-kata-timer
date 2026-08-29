export const THEMES = {
    DEFAULT: 'default',
    VERSUS: 'versus',
};

export function ThemeController(reference) {
    const body = reference;

    const themeMenuButton = body.querySelector('.js-theme-menu-button');
    const themeDropdown = body.querySelector('.js-theme-dropdown');

    const defaultThemeButton = body.querySelector('.js-default-theme-button');
    const versusThemeButton = body.querySelector('.js-versus-theme-button');

    let currentTheme = THEMES.DEFAULT;
    let onChangeCallback = null;

    function init() {
        if (!themeMenuButton || !themeDropdown || !defaultThemeButton || !versusThemeButton) {
            return;
        }

        bindButtons();
    }

    function bindButtons() {
        themeMenuButton.addEventListener('click', toggleThemeMenu);
        defaultThemeButton.addEventListener('click', () => selectTheme(THEMES.DEFAULT));
        versusThemeButton.addEventListener('click', () => selectTheme(THEMES.VERSUS));
    }

    function toggleThemeMenu() {
        themeDropdown.classList.toggle('hide');
    }

    function selectTheme(theme) {
        setTheme(theme);
        closeMenu();

        if (onChangeCallback) onChangeCallback(currentTheme);
    }

    function setTheme(theme) {
        currentTheme = theme === THEMES.VERSUS ? THEMES.VERSUS : THEMES.DEFAULT;

        body.classList.toggle('versus-theme', currentTheme === THEMES.VERSUS);
        body.classList.remove('inverted');
    }

    function closeMenu() {
        if (themeDropdown) themeDropdown.classList.add('hide');
    }

    function getTheme() {
        return currentTheme;
    }

    function onChange(callback) {
        onChangeCallback = callback;
    }

    init();

    return { setTheme, getTheme, closeMenu, onChange };
}

export default ThemeController;
