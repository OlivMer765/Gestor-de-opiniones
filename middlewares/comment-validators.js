import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const createCommentValidators = [
    body('content').isLength({ min: 1 }).withMessage('Contenido es requerido'),
    body('publicationId').isMongoId().withMessage('ID de publicación inválido'),
    checkValidators
];

export const updateCommentValidators = [
    body('content').optional().isLength({ min: 1 }).withMessage('Contenido no puede estar vacío'),
    checkValidators
];