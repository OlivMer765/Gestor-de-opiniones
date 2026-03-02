import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const registerValidators = [
    body('username').notEmpty().withMessage('Username es requerido').trim(),
    body('email').isEmail().withMessage('Formato de email inválido').trim(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('Name es requerido').trim(),
    checkValidators
];

export const loginValidators = [
    body('identifier').notEmpty().withMessage('Identificador (username or email) es requerido'),
    body('password').notEmpty().withMessage('Password es requerido'),
    checkValidators
];