import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const updateProfileValidators = [
    body('name').optional().notEmpty().trim(),
    body('username').optional().notEmpty().trim(),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('Nueva contraseña debe tener al menos 6 caracteres'),
    body('oldPassword').if(body('newPassword').exists()).notEmpty().withMessage('La contraseña actual es requerida para cambiar la contraseña'),
    checkValidators
];