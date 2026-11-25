import { PortfolioProject } from '../models/PortfolioProject.js';

// @desc    Get published portfolio projects with filtering, search, pagination
// @route   GET /api/v1/portfolio
// @access  Public
export const getPublicProjects = async (req, res, next) => {
  try {
    const { category, search, sort = 'newest', page = 1, limit = 9, featured } = req.query;

    const query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      PortfolioProject.find(query).sort(sortOption).skip(skip).limit(limitNum),
      PortfolioProject.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by slug
// @route   GET /api/v1/portfolio/:slug
// @access  Public
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await PortfolioProject.findOne({ slug: req.params.slug, isPublished: true });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Related projects in same category
    const related = await PortfolioProject.find({
      category: project.category,
      _id: { $ne: project._id },
      isPublished: true,
    })
      .limit(3)
      .select('title slug coverImage category shortDescription');

    res.status(200).json({
      success: true,
      data: {
        project,
        related,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for admin
// @route   GET /api/v1/portfolio/admin/all
// @access  Private (Admin)
export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
        { technologies: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      PortfolioProject.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      PortfolioProject.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create portfolio project
// @route   POST /api/v1/portfolio
// @access  Private (Admin)
export const createProject = async (req, res, next) => {
  try {
    const project = await PortfolioProject.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Portfolio project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update portfolio project
// @route   PUT /api/v1/portfolio/:id
// @access  Private (Admin)
export const updateProject = async (req, res, next) => {
  try {
    const project = await PortfolioProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Portfolio project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete portfolio project
// @route   DELETE /api/v1/portfolio/:id
// @access  Private (Admin)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await PortfolioProject.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Portfolio project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
