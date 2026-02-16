import { rateLimit } from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 5,
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión, por favor intente nuevamente en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, por favor intente nuevamente en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});