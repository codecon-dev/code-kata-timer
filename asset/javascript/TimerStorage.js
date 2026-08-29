const STORAGE_KEY = 'codecon-timer-state-v1';

export function loadState() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) return null;

        const parsed = JSON.parse(raw);

        if (!parsed || typeof parsed !== 'object') return null;

        return parsed;
    } catch (error) {
        console.warn('Não foi possível ler o estado salvo:', error);
        return null;
    }
}

export function saveState(state) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Não foi possível salvar o estado:', error);
    }
}

export function clearState() {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Não foi possível limpar o estado:', error);
    }
}

export { STORAGE_KEY };
