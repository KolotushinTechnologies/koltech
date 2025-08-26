import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get all posts (public feed)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as string;
    const tags = req.query.tags as string;

    const filters: any = {};
    if (type) filters.type = type;
    if (tags) filters.tags = { $in: tags.split(',') };

    const posts = await Post.find({
      visibility: 'public',
      isActive: true,
      ...filters
    })
      .populate('author', 'firstName lastName username avatar profile.rating')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments({
      visibility: 'public',
      isActive: true,
      ...filters
    });

    const response: ApiResponse<{ posts: typeof posts; pagination: any }> = {
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get user feed (following + own posts)
// @route   GET /api/posts/feed
// @access  Private
export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get user's following list (this would need to be implemented in User model)
    const following: string[] = []; // Placeholder

    const posts = await Post.find({
      $or: [
        { author: req.user?.id },
        { 
          author: { $in: following }, 
          visibility: { $in: ['public', 'followers'] } 
        }
      ],
      isActive: true
    })
      .populate('author', 'firstName lastName username avatar profile.rating')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments({
      $or: [
        { author: req.user?.id },
        { 
          author: { $in: following }, 
          visibility: { $in: ['public', 'followers'] } 
        }
      ],
      isActive: true
    });

    const response: ApiResponse<{ posts: typeof posts; pagination: any }> = {
      success: true,
      message: 'Feed retrieved successfully',
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName username avatar profile.rating');

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check visibility
    if (post.visibility === 'private' && post.author._id.toString() !== req.user?.id) {
      return next(new AppError('Access denied', 403));
    }

    const response: ApiResponse<{ post: typeof post }> = {
      success: true,
      message: 'Post retrieved successfully',
      data: { post }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, images, type, tags, visibility, metadata } = req.body;

    const post = await Post.create({
      author: req.user?.id,
      content,
      images: images || [],
      type: type || 'post',
      tags: tags || [],
      visibility: visibility || 'public',
      metadata: metadata || {}
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName username avatar profile.rating');

    const response: ApiResponse<{ post: typeof populatedPost }> = {
      success: true,
      message: 'Post created successfully',
      data: { post: populatedPost }
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check ownership
    if (post.author.toString() !== req.user?.id) {
      return next(new AppError('Not authorized to update this post', 403));
    }

    const { content, images, tags, visibility, metadata } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        content: content || post.content,
        images: images || post.images,
        tags: tags || post.tags,
        visibility: visibility || post.visibility,
        metadata: metadata || post.metadata
      },
      { new: true }
    ).populate('author', 'firstName lastName username avatar profile.rating');

    const response: ApiResponse<{ post: typeof updatedPost }> = {
      success: true,
      message: 'Post updated successfully',
      data: { post: updatedPost }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check ownership or admin role
    if (post.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return next(new AppError('Not authorized to delete this post', 403));
    }

    await Post.findByIdAndDelete(req.params.id);

    const response: ApiResponse<{}> = {
      success: true,
      message: 'Post deleted successfully',
      data: {}
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const userId = req.user?.id!;
    const isLiked = post.likes.includes(userId as any);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId as any);
    }

    await post.save();

    const response: ApiResponse<{ liked: boolean; likesCount: number }> = {
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      data: {
        liked: !isLiked,
        likesCount: post.likes.length
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get post comments
// @route   GET /api/posts/:id/comments
// @access  Public
export const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const comments = await Comment.find({
      post: req.params.id,
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
          limit: 3
        }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Comment.countDocuments({
      post: req.params.id,
      parentComment: null,
      isActive: true
    });

    const response: ApiResponse<{ comments: typeof comments; pagination: any }> = {
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        comments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, parentComment } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const comment = await Comment.create({
      author: req.user?.id,
      post: req.params.id,
      content,
      parentComment: parentComment || null
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'firstName lastName username avatar profile.rating');

    const response: ApiResponse<{ comment: typeof populatedComment }> = {
      success: true,
      message: 'Comment added successfully',
      data: { comment: populatedComment }
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
export const searchPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, type, tags, author } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const searchQuery: any = {
      visibility: 'public',
      isActive: true
    };

    if (q) {
      searchQuery.$text = { $search: q as string };
    }

    if (type) {
      searchQuery.type = type;
    }

    if (tags) {
      searchQuery.tags = { $in: (tags as string).split(',') };
    }

    if (author) {
      const user = await User.findOne({ username: author });
      if (user) {
        searchQuery.author = user._id;
      }
    }

    const posts = await Post.find(searchQuery)
      .populate('author', 'firstName lastName username avatar profile.rating')
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(searchQuery);

    const response: ApiResponse<{ posts: typeof posts; pagination: any }> = {
      success: true,
      message: 'Search completed successfully',
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};