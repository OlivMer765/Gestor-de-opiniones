import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const createPublicationValidators = [
    body('title').isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres').trim(),
    body('category').notEmpty().withMessage('Category es requerida').trim(),
    body('content').isLength({ min: 10 }).withMessage('El contenido debe tener al menos 10 caracteres'),
    checkValidators
];

export const updatePublicationValidators = [
    body('title').optional().isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres').trim(),
    body('category').optional().notEmpty().trim(),
    body('content').optional().isLength({ min: 10 }).withMessage('El contenido debe tener al menos 10 caracteres'),
    checkValidators
];