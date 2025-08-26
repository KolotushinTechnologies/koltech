import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  _id: string;
  author: mongoose.Types.ObjectId;
  content: string;
  images?: string[];
  type: 'post' | 'project_update' | 'achievement' | 'announcement';
  tags?: string[];
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  comments: mongoose.Types.ObjectId[];
  commentsCount: number;
  shares: mongoose.Types.ObjectId[];
  sharesCount: number;
  visibility: 'public' | 'followers' | 'private';
  isActive: boolean;
  isPinned: boolean;
  metadata?: {
    projectId?: mongoose.Types.ObjectId;
    location?: string;
    linkedUrl?: string;
    mentions?: mongoose.Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  type: {
    type: String,
    enum: ['post', 'project_update', 'achievement', 'announcement'],
    default: 'post'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  shares: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  sharesCount: {
    type: Number,
    default: 0
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  metadata: {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    linkedUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid URL format']
    },
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ visibility: 1, isActive: 1, createdAt: -1 });
postSchema.index({ content: 'text', tags: 'text' });

// Virtual for engagement rate
postSchema.virtual('engagementRate').get(function() {
  const total = this.likesCount + this.commentsCount + this.sharesCount;
  return total;
});

// Pre-save middleware to update counts
postSchema.pre('save', function(next) {
  this.likesCount = this.likes ? this.likes.length : 0;
  this.commentsCount = this.comments ? this.comments.length : 0;
  this.sharesCount = this.shares ? this.shares.length : 0;
  next();
});

// Static methods
postSchema.statics.getPublicPosts = function(page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;
  const query = {
    visibility: 'public',
    isActive: true,
    ...filters
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName username avatar profile.rating')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

postSchema.statics.getUserFeed = function(userId: string, following: string[], page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const query = {
    $or: [
      { author: userId },
      { author: { $in: following }, visibility: { $in: ['public', 'followers'] } }
    ],
    isActive: true
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName username avatar profile.rating')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model<IPost>('Post', postSchema);