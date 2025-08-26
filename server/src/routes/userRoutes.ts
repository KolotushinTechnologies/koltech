import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { ApiResponse, AuthRequest } from '../types/index.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Get user profile
router.get('/profile', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password -codePhrases');
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    };
    res.json(response);
  } catch (error: any) {
    console.error('Profile get error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve profile'
    };
    res.status(500).json(response);
  }
}));

// Update user profile
router.put('/profile', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, username, bio, status, location, website, skills } = req.body as {
      firstName?: string;
      lastName?: string;
      username?: string;
      bio?: string;
      status?: string;
      location?: string;
      website?: string;
      skills?: string[];
    };
    
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return res.status(404).json(response);
    }

    // Check if username is already taken (if username is being changed)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          message: 'Username is already taken'
        };
        return res.status(400).json(response);
      }
      user.username = username.toLowerCase();
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (status !== undefined) user.status = status;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (skills) user.skills = skills;

    await user.save();

    const updatedUser = await User.findById(req.user?._id).select('-password -codePhrases');

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    };
    res.json(response);
  } catch (error: any) {
    console.error('Profile update error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to update profile'
    };
    res.status(500).json(response);
  }
}));

// Check username availability
router.get('/check-username/:username', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    if (username.length < 3) {
      const response: ApiResponse = {
        success: false,
        message: 'Username must be at least 3 characters long'
      };
      return res.status(400).json(response);
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    
    const response: ApiResponse = {
      success: true,
      message: 'Username availability checked',
      data: { available: !existingUser }
    };
    res.json(response);
  } catch (error: any) {
    console.error('Username check error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to check username availability'
    };
    res.status(500).json(response);
  }
}));

// Change password
router.put('/change-password', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user?._id).select('+password');
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return res.status(404).json(response);
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        message: 'Current password is incorrect'
      };
      return res.status(400).json(response);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully'
    };
    res.json(response);
  } catch (error: any) {
    console.error('Password change error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to change password'
    };
    res.status(500).json(response);
  }
}));

// Toggle 2FA
router.put('/toggle-2fa', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { enabled } = req.body;
    
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return res.status(404).json(response);
    }

    user.twoFactorEnabled = enabled;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`,
      data: { twoFactorEnabled: enabled }
    };
    res.json(response);
  } catch (error: any) {
    console.error('2FA toggle error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to update 2FA settings'
    };
    res.status(500).json(response);
  }
}));

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/avatars';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'));
    }
  }
});

// Upload avatar
router.post('/avatar', protect, upload.single('avatar'), asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      const response: ApiResponse = {
        success: false,
        message: 'No file uploaded'
      };
      return res.status(400).json(response);
    }

    const user = await User.findById(req.user?._id);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return res.status(404).json(response);
    }

    // Delete old avatar if it exists
    if (user.avatar) {
      const oldAvatarPath = user.avatar.replace('/uploads/', 'uploads/');
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user avatar path
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatar: user.avatar }
    };
    res.json(response);
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to upload avatar'
    };
    res.status(500).json(response);
  }
}));

export default router;