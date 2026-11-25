import { BlogPost, BlogCategory } from '../models/BlogPost.js';

// @desc    Get published blog posts with search, category filter, pagination
// @route   GET /api/v1/blog
// @access  Public
export const getPublicPosts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;

    const query = { status: 'published' };
    if (category && category !== 'All') query.category = category;
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limitNum),
      BlogPost.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published post by slug
// @route   GET /api/v1/blog/:slug
// @access  Public
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const related = await BlogPost.find({
      category: post.category,
      _id: { $ne: post._id },
      status: 'published',
    })
      .limit(3)
      .select('title slug coverImage publishedAt category excerpt');

    res.status(200).json({
      success: true,
      data: {
        post,
        related,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blog categories
// @route   GET /api/v1/blog/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blog posts for admin
// @route   GET /api/v1/blog/admin/all
// @access  Private (Admin)
export const getAllPostsAdmin = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      BlogPost.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog post
// @route   POST /api/v1/blog
// @access  Private (Admin)
export const createPost = async (req, res, next) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/v1/blog/:id
// @access  Private (Admin)
export const updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/v1/blog/:id
// @access  Private (Admin)
export const deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog category
// @route   POST /api/v1/blog/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const category = await BlogCategory.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
