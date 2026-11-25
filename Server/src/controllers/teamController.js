import { TeamMember } from '../models/TeamMember.js';

// @desc    Get visible team members for public site
// @route   GET /api/v1/team
// @access  Public
export const getPublicTeam = async (req, res, next) => {
  try {
    const team = await TeamMember.find({ isVisible: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all team members for admin
// @route   GET /api/v1/team/admin/all
// @access  Private (Admin)
export const getAllTeamAdmin = async (req, res, next) => {
  try {
    const team = await TeamMember.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team member
// @route   POST /api/v1/team
// @access  Private (Admin)
export const createTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/v1/team/:id
// @access  Private (Admin)
export const updateTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/v1/team/:id
// @access  Private (Admin)
export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
