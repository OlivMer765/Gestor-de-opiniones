import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const updateProfileValidators = [
    body('name').optional().notEmpty().trim(),
    body('username').optional().notEmpty().trim(),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('oldPassword').if(body('newPassword').exists()).notEmpty().withMessage('Old password is required to set a new one'),
    checkValidators
];