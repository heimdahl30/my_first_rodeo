import { body } from 'express-validator';

export const userLoginValidationSchema = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email address required')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Minimum 6 characters required for password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const userSignUpValidationSchema = [
  body('name').trim().notEmpty().withMessage('Name required'),
  ...userLoginValidationSchema,
];
