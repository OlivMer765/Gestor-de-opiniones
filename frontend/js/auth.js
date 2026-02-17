import { CONFIG } from './config.js';
import { api } from './api.js';
import { showToast } from './utils.js';

export const isAuthenticated = () => {
    return !!localStorage.getItem(CONFIG.TOKEN_KEY);
};

export const logout = () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    window.location.href = 'login.html';
};

export const loginUser = async (identifier, password) => {
    const data = await api.post('/auth/login', { identifier, password });
    if (data.success) {
        localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        // Guardamos datos básicos del usuario
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        return true;
    }
    return false;
};

export const registerUser = async (userData) => {
    const data = await api.post('/auth/register', userData);
    if (data.success) {
        localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        return true;
    }
    return false;
};