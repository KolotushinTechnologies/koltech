import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
};

// Helper function to send token response
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = generateToken(user._id);
  
  // Remove password from output
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.codePhrases;
  
  const response: ApiResponse<{ user: any; token: string }> = {
    success: true,
    data: { user: userObj, token },
    message: statusCode === 201 ? 'Registration successful' : 'Login successful'
  };

  res.status(statusCode).json(response);
};

// Generate verification code
const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// @desc    Register user with email/password
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstName, lastName, username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email?.toLowerCase() },
        { username: username?.toLowerCase() }
      ]
    });

    if (existingUser) {
      return next(new AppError('User with this email or username already exists', 400));
    }

    // Generate email verification code
    const emailVerificationCode = generateVerificationCode();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      firstName,
      lastName,
      username: username.toLowerCase(),
      password,
      role: role || 'user',
      emailVerificationCode,
      emailVerificationExpires
    });

    // TODO: Send verification email
    console.log(`Email verification code for ${email}: ${emailVerificationCode}`);

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Register user with LTMROW method (anonymous)
// @route   POST /api/auth/register-anonymous
// @access  Public
export const registerAnonymous = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, password, role } = req.body;

    // Password is required for LTMROW registration
    if (!password) {
      return next(new AppError('Password is required for LTMROW registration', 400));
    }

    // Generate unique LetteraTech number
    let letteraTechNumber: string;
    let isUnique = false;
    
    while (!isUnique) {
      letteraTechNumber = '+11111' + Math.floor(Math.random() * 10000000000).toString().padStart(11, '0');
      const existingUser = await User.findOne({ letteraTechNumber });
      if (!existingUser) {
        isUnique = true;
      }
    }

    // Create user instance to generate code phrases
    const tempUser = new User();
    const codePhrases = tempUser.generateCodePhrases();

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      password,
      letteraTechNumber: letteraTechNumber!,
      codePhrases,
      role: role || 'user',
      isEmailVerified: true // Anonymous users don't need email verification
    });

    // Return the plain text code phrases to user (only time they'll see them)
    const userObj = user.toObject();
    delete userObj.password;
    
    const response: ApiResponse<{ 
      user: any; 
      token: string; 
      letteraTechNumber: string;
      codePhrases: string[];
    }> = {
      success: true,
      data: { 
        user: userObj, 
        token: generateToken(user._id),
        letteraTechNumber: letteraTechNumber!,
        codePhrases // Return plain text phrases for user to save
      },
      message: 'Anonymous registration successful'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { login, password, codePhrase, codePhraseIndex } = req.body;

    if (!login) {
      return next(new AppError('Please provide email, username, or LetteraTech number', 400));
    }

    // Find user by email, username, or LetteraTech number
    let user;
    
    if (login.startsWith('+11111')) {
      user = await User.findOne({ letteraTechNumber: login, isActive: true }).select('+password +codePhrases');
    } else if (login.includes('@')) {
      user = await User.findOne({ email: login.toLowerCase(), isActive: true }).select('+password +codePhrases');
    } else {
      user = await User.findOne({ username: login.toLowerCase(), isActive: true }).select('+password +codePhrases');
    }

    if (!user || !user.isActive) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check authentication method
    if (user.letteraTechNumber && !user.email) {
      // LTMROW method - can login with either password or code phrase
      if (password) {
        // Login with password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
          return next(new AppError('Invalid credentials', 401));
        }
      } else if (codePhrase !== undefined && codePhraseIndex !== undefined) {
        // Login with code phrase
        const isValidPhrase = user.codePhrases && user.codePhrases[codePhraseIndex] ?
          await bcrypt.compare(codePhrase, user.codePhrases[codePhraseIndex]) : false;
        if (!isValidPhrase) {
          return next(new AppError('Invalid code phrase', 401));
        }
      } else {
        return next(new AppError('Either password or code phrase with index is required for LetteraTech login', 400));
      }
    } else {
      // Traditional method - check password
      if (!password) {
        return next(new AppError('Password is required', 400));
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return next(new AppError('Invalid credentials', 401));
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired verification code', 400));
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Email verified successfully' },
      message: 'Email verification successful'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: false 
    });

    if (!user) {
      return next(new AppError('User not found or already verified', 400));
    }

    const emailVerificationCode = generateVerificationCode();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationCode = emailVerificationCode;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // TODO: Send verification email
    console.log(`New verification code for ${email}: ${emailVerificationCode}`);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Verification code sent' },
      message: 'Verification code sent successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return next(new AppError('No user found with that email address', 404));
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetCode = resetCode;
    user.passwordResetExpires = passwordResetExpires;
    await user.save();

    // TODO: Send reset email
    console.log(`Password reset code for ${email}: ${resetCode}`);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Reset code sent' },
      message: 'Password reset code sent to your email'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      passwordResetCode: code,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return next(new AppError('Invalid or expired reset code', 400));
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id).populate('profile');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const response: ApiResponse<{ user: IUser }> = {
      success: true,
      data: { user },
      message: 'User retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return next(new AppError('Current password is incorrect', 400));
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a stateless JWT setup, logout is handled client-side by removing the token
    // For enhanced security, you could implement token blacklisting here
    
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Logged out successfully' },
      message: 'Logout successful'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};