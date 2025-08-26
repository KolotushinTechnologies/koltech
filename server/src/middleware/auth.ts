import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from './errorHandler';

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Access denied. No token provided.', 401));
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token.', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired.', 401));
    }
    return next(new AppError('Authentication failed.', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(); // Continue without authentication
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

export const requireEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (!req.user.isEmailVerified && req.user.email) {
    return next(new AppError('Please verify your email address to access this feature.', 403));
  }

  next();
};