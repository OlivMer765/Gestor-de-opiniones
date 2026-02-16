import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const createPublicationValidators = [
    body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters').trim(),
    body('category').notEmpty().withMessage('Category is required').trim(),
    body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    checkValidators
];

export const updatePublicationValidators = [
    body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters').trim(),
    body('category').optional().notEmpty().trim(),
    body('content').optional().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    checkValidators
];