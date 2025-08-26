import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  letteraTechNumber?: string;
  codePhrases?: string[];
  avatar?: string;
  role: 'user' | 'freelancer' | 'startup' | 'admin';
  isEmailVerified: boolean;
  isActive: boolean;
  profile: {
    bio?: string;
    skills?: string[];
    portfolio?: string[];
    rating?: number;
    completedProjects?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  _id: string;
  author: string;
  content: string;
  images?: string[];
  videos?: string[];
  likes: string[];
  comments: IComment[];
  isPublic: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface IProject extends Document {
  _id: string;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'ai' | 'design' | 'other';
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  skills: string[];
  client: string;
  freelancer?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  proposals: IProposal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProposal {
  _id: string;
  freelancer: string;
  amount: number;
  timeline: string;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EmailVerification {
  email: string;
  code: string;
  expiresAt: Date;
}

export interface LetteraTechNumberGenerator {
  prefix: string;
  currentSequence: number;
}