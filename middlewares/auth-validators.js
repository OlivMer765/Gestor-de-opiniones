import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const registerValidators = [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('email').isEmail().withMessage('Invalid email format').trim(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required').trim(),
    checkValidators
];

export const loginValidators = [
    body('identifier').notEmpty().withMessage('Identifier (username or email) is required'),
    body('password').notEmpty().withMessage('Password is required'),
    checkValidators
];