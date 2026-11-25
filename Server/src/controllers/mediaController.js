import fs from 'fs';
import { MediaAsset } from '../models/MediaAsset.js';

// @desc    Upload media asset (image/doc)
// @route   POST /api/v1/media/upload
// @access  Private (Admin)
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const media = await MediaAsset.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploader: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get media library assets
// @route   GET /api/v1/media
// @access  Private (Admin)
export const getMediaAssets = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 24 } = req.query;

    const query = {};
    if (search && search.trim()) {
      query.originalName = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const [assets, total] = await Promise.all([
      MediaAsset.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      MediaAsset.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media asset
// @route   DELETE /api/v1/media/:id
// @access  Private (Admin)
export const deleteMediaAsset = async (req, res, next) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found' });
    }

    // Safely remove file on disk if exists
    if (asset.path && fs.existsSync(asset.path)) {
      try {
        fs.unlinkSync(asset.path);
      } catch (e) {
        console.error('File unlink error:', e);
      }
    }

    await MediaAsset.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Media asset deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
