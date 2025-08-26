import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId;
  replies: mongoose.Types.ObjectId[];
  repliesCount: number;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  isActive: boolean;
  mentions?: mongoose.Types.ObjectId[];
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author'],
    index: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must belong to a post'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  repliesCount: {
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
  isActive: {
    type: Boolean,
    default: true
  },
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  editedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });

// Virtual for depth level
commentSchema.virtual('depth').get(function() {
  return this.parentComment ? 1 : 0;
});

// Pre-save middleware to update counts
commentSchema.pre('save', function(next) {
  this.likesCount = this.likes ? this.likes.length : 0;
  this.repliesCount = this.replies ? this.replies.length : 0;
  next();
});

// Post-save middleware to update post comment count
commentSchema.post('save', async function() {
  if (this.isNew && this.isActive) {
    await mongoose.model('Post').findByIdAndUpdate(
      this.post,
      { $inc: { commentsCount: 1 } }
    );
    
    // If it's a reply, update parent comment replies count
    if (this.parentComment) {
      await mongoose.model('Comment').findByIdAndUpdate(
        this.parentComment,
        { 
          $inc: { repliesCount: 1 },
          $addToSet: { replies: this._id }
        }
      );
    }
  }
});

// Post-remove middleware to update counts
commentSchema.pre('deleteOne', { document: true }, async function() {
  const comment = this as IComment;
  
  await mongoose.model('Post').findByIdAndUpdate(
    comment.post,
    { $inc: { commentsCount: -1 } }
  );
  
  if (comment.parentComment) {
    await mongoose.model('Comment').findByIdAndUpdate(
      comment.parentComment,
      {
        $inc: { repliesCount: -1 },
        $pull: { replies: comment._id }
      }
    );
  }
});

// Static methods
commentSchema.statics.getPostComments = function(postId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({
    post: postId,
    parentComment: null,
    isActive: true
  })
  .populate('author', 'firstName lastName username avatar profile.rating')
  .populate({
    path: 'replies',
    match: { isActive: true },
    populate: {
      path: 'author',
      select: 'firstName lastName username avatar profile.rating'
    },
    options: { 
      sort: { createdAt: 1 },
      limit: 3 // Limit initial replies shown
    }
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

commentSchema.statics.getCommentReplies = function(commentId: string, page = 1, limit = 5) {
  const skip = (page - 1) * limit;
  
  return this.find({
    parentComment: commentId,
    isActive: true
  })
  .populate('author', 'firstName lastName username avatar profile.rating')
  .sort({ createdAt: 1 })
  .skip(skip)
  .limit(limit);
};

export default mongoose.model<IComment>('Comment', commentSchema);