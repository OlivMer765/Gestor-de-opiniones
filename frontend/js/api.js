import { CONFIG } from './config.js';
import { showToast } from './utils.js';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json'
    };
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem(CONFIG.TOKEN_KEY);
            localStorage.removeItem(CONFIG.USER_KEY);
            // Evitar bucle de redirección si ya estamos en login
            if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
                window.location.href = 'login.html';
            }
        }
        throw new Error(data.message || 'Error en la petición');
    }
    return data;
};

// --- AQUÍ ESTABA EL PROBLEMA ---
// Debe decir explícitamente "export const api"
// NO uses "export default api" ni solo "const api"
export const api = {
    get: async (endpoint) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(res);
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
            throw error;
        }
    },
    post: async (endpoint, body) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });
            return handleResponse(res);
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
            throw error;
        }
    },
    put: async (endpoint, body) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });
            return handleResponse(res);
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
            throw error;
        }
    },
    delete: async (endpoint) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return handleResponse(res);
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
            throw error;
        }
    }
};