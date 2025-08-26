import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validateRequest = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400));
    }
    
    next();
  };
};

// Custom validation functions
export const validateObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validateLetteraTechNumber = (number: string): boolean => {
  const letteraTechRegex = /^\+11111\d{11}$/;
  return letteraTechRegex.test(number);
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateCodePhrase = (phrase: string): boolean => {
  const codePhaseRegex = /^[a-z]+-[a-z]+-\d+$/;
  return codePhaseRegex.test(phrase);
};

export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.trim();
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  return input;
};

// Rate limiting validation
export const validateRequestFrequency = (
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) => {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientIp);
    
    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientIp, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return next(new AppError('Too many requests. Please try again later.', 429));
    }
    
    clientData.count++;
    next();
  };
};