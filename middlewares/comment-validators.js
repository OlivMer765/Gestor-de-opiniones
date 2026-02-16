import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const createCommentValidators = [
    body('content').isLength({ min: 1 }).withMessage('Content cannot be empty'),
    body('publicationId').isMongoId().withMessage('Invalid Publication ID'),
    checkValidators
];

export const updateCommentValidators = [
    body('content').optional().isLength({ min: 1 }).withMessage('Content cannot be empty'),
    checkValidators
];