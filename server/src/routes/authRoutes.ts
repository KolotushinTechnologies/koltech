import { Router } from 'express';
import Joi from 'joi';
import {
  register,
  registerAnonymous,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updatePassword,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  username: Joi.string().trim().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).required().messages({
    'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters'
  }),
  role: Joi.string().valid('user', 'freelancer', 'startup').optional()
});

const anonymousRegisterSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters'
  }),
  role: Joi.string().valid('user', 'freelancer', 'startup').optional()
});

const loginSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().optional(),
  codePhrase: Joi.string().optional(),
  codePhraseIndex: Joi.number().integer().min(0).max(11).optional()
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).pattern(/^\d+$/).required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).pattern(/^\d+$/).required(),
  newPassword: Joi.string().min(6).required()
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/register-anonymous', validateRequest(anonymousRegisterSchema), registerAnonymous);
router.post('/login', validateRequest(loginSchema), login);
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', validateRequest(forgotPasswordSchema), resendVerification);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, validateRequest(updatePasswordSchema), updatePassword);
router.post('/logout', protect, logout);

export default router;