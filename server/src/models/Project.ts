import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  title: string;
  description: string;
  category: 'web_development' | 'mobile_app' | 'ai_ml' | 'design' | 'marketing' | 'blockchain' | 'iot' | 'other';
  type: 'freelance' | 'crowdfunding' | 'internal';
  status: 'draft' | 'active' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'funded';
  
  // Owner and participants
  owner: mongoose.Types.ObjectId;
  freelancer?: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  
  // Project details
  tags: string[];
  skills: string[];
  images: string[];
  documents: string[];
  
  // Freelance specific
  budget?: {
    type: 'fixed' | 'hourly';
    amount: number;
    currency: string;
    hourlyRate?: number;
  };
  timeline?: {
    startDate?: Date;
    endDate?: Date;
    estimatedHours?: number;
  };
  
  // Crowdfunding specific
  funding?: {
    goal: number;
    raised: number;
    currency: string;
    backers: {
      user: mongoose.Types.ObjectId;
      amount: number;
      tier?: string;
      date: Date;
    }[];
    tiers: {
      name: string;
      amount: number;
      description: string;
      rewards: string[];
      maxBackers?: number;
      currentBackers: number;
    }[];
    deadline: Date;
  };
  
  // Progress tracking
  progress: {
    percentage: number;
    milestones: {
      title: string;
      description: string;
      dueDate: Date;
      completed: boolean;
      completedDate?: Date;
    }[];
    updates: mongoose.Types.ObjectId[];
  };
  
  // Interaction data
  views: number;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  applications: {
    freelancer: mongoose.Types.ObjectId;
    proposal: string;
    budget: number;
    timeline: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: Date;
  }[];
  
  // Settings
  visibility: 'public' | 'private' | 'invited_only';
  allowApplications: boolean;
  isActive: boolean;
  isFeatured: boolean;
  
  // Metadata
  location?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  category: {
    type: String,
    enum: ['web_development', 'mobile_app', 'ai_ml', 'design', 'marketing', 'blockchain', 'iot', 'other'],
    required: [true, 'Project category is required']
  },
  type: {
    type: String,
    enum: ['freelance', 'crowdfunding', 'internal'],
    required: [true, 'Project type is required']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'in_progress', 'review', 'completed', 'cancelled', 'funded'],
    default: 'draft'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project must have an owner'],
    index: true
  },
  freelancer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill cannot exceed 50 characters']
  }],
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  documents: [{
    type: String
  }],
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly']
    },
    amount: {
      type: Number,
      min: [0, 'Budget amount must be positive']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate must be positive']
    }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedHours: {
      type: Number,
      min: [1, 'Estimated hours must be at least 1']
    }
  },
  funding: {
    goal: {
      type: Number,
      min: [100, 'Funding goal must be at least $100']
    },
    raised: {
      type: Number,
      default: 0,
      min: [0, 'Raised amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    backers: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: [1, 'Backing amount must be at least $1']
      },
      tier: String,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    tiers: [{
      name: {
        type: String,
        required: true,
        maxlength: [100, 'Tier name cannot exceed 100 characters']
      },
      amount: {
        type: Number,
        required: true,
        min: [1, 'Tier amount must be at least $1']
      },
      description: {
        type: String,
        required: true,
        maxlength: [500, 'Tier description cannot exceed 500 characters']
      },
      rewards: [{
        type: String,
        maxlength: [200, 'Reward description cannot exceed 200 characters']
      }],
      maxBackers: {
        type: Number,
        min: [1, 'Max backers must be at least 1']
      },
      currentBackers: {
        type: Number,
        default: 0,
        min: [0, 'Current backers cannot be negative']
      }
    }],
    deadline: {
      type: Date,
      required: function() {
        return this.type === 'crowdfunding';
      }
    }
  },
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100%']
    },
    milestones: [{
      title: {
        type: String,
        required: true,
        maxlength: [200, 'Milestone title cannot exceed 200 characters']
      },
      description: {
        type: String,
        maxlength: [1000, 'Milestone description cannot exceed 1000 characters']
      },
      dueDate: {
        type: Date,
        required: true
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedDate: Date
    }],
    updates: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }]
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  applications: [{
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    proposal: {
      type: String,
      required: true,
      maxlength: [2000, 'Proposal cannot exceed 2000 characters']
    },
    budget: {
      type: Number,
      required: true,
      min: [0, 'Proposed budget must be positive']
    },
    timeline: {
      type: String,
      required: true,
      maxlength: [500, 'Timeline description cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'invited_only'],
    default: 'public'
  },
  allowApplications: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
projectSchema.index({ category: 1, status: 1, createdAt: -1 });
projectSchema.index({ type: 1, status: 1, createdAt: -1 });
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ skills: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ 'budget.amount': 1 });
projectSchema.index({ urgency: 1, difficulty: 1 });
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for funding percentage
projectSchema.virtual('fundingPercentage').get(function() {
  if (this.type !== 'crowdfunding' || !this.funding?.goal) return 0;
  return Math.round((this.funding.raised / this.funding.goal) * 100);
});

// Virtual for days remaining
projectSchema.virtual('daysRemaining').get(function() {
  if (this.type === 'crowdfunding' && this.funding?.deadline) {
    const now = new Date();
    const deadline = new Date(this.funding.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  if (this.timeline?.endDate) {
    const now = new Date();
    const endDate = new Date(this.timeline.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Pre-save middleware to update counts
projectSchema.pre('save', function(next) {
  this.likesCount = this.likes ? this.likes.length : 0;
  
  if (this.funding && this.funding.backers) {
    this.funding.raised = this.funding.backers.reduce((total, backer) => total + backer.amount, 0);
  }
  
  next();
});

// Static methods
projectSchema.statics.getActiveProjects = function(filters = {}, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const query = {
    status: { $in: ['active', 'in_progress'] },
    isActive: true,
    visibility: 'public',
    ...filters
  };
  
  return this.find(query)
    .populate('owner', 'firstName lastName username avatar profile.rating')
    .populate('freelancer', 'firstName lastName username avatar profile.rating')
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

projectSchema.statics.searchProjects = function(searchTerm: string, filters = {}, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const query = {
    $text: { $search: searchTerm },
    status: { $in: ['active', 'in_progress'] },
    isActive: true,
    visibility: 'public',
    ...filters
  };
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('owner', 'firstName lastName username avatar profile.rating')
    .sort({ score: { $meta: 'textScore' }, isFeatured: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model<IProject>('Project', projectSchema);