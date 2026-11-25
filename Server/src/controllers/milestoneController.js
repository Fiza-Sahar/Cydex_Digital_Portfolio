import { ProjectMilestone } from '../models/ProjectMilestone.js';
import { ClientProject } from '../models/ClientProject.js';
import { Notification } from '../models/Notification.js';

// Helper to recalculate project progress from milestones
const updateProjectProgress = async (projectId) => {
  const milestones = await ProjectMilestone.find({ clientProject: projectId });
  if (milestones.length === 0) return;
  const completed = milestones.filter((m) => m.status === 'Completed').length;
  const progressPercent = Math.round((completed / milestones.length) * 100);
  await ClientProject.findByIdAndUpdate(projectId, { progress: progressPercent });
};

// @desc    Get milestones for a project
// @route   GET /api/v1/client-projects/:projectId/milestones
// @access  Private (Client & Admin)
export const getMilestones = async (req, res, next) => {
  try {
    const project = await ClientProject.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // If client, ensure they own the project
    if (req.user.role === 'client' && project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const milestones = await ProjectMilestone.find({ clientProject: project._id }).sort({ order: 1, dueDate: 1 });

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create milestone for project
// @route   POST /api/v1/client-projects/:projectId/milestones
// @access  Private (Admin)
export const createMilestone = async (req, res, next) => {
  try {
    const { title, description, dueDate, status, order } = req.body;
    const project = await ClientProject.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const milestone = await ProjectMilestone.create({
      clientProject: project._id,
      title,
      description: description || '',
      dueDate,
      status: status || 'Pending',
      order: order || 0,
      completedAt: status === 'Completed' ? new Date() : null,
    });

    await updateProjectProgress(project._id);

    await Notification.create({
      user: project.client,
      title: 'New Milestone Defined',
      message: `A new milestone "${title}" was added to "${project.title}".`,
      type: 'milestone',
      link: `/portal/projects/${project._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update milestone
// @route   PUT /api/v1/client-projects/:projectId/milestones/:id
// @access  Private (Admin)
export const updateMilestone = async (req, res, next) => {
  try {
    const { title, description, dueDate, status, order } = req.body;

    const milestone = await ProjectMilestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    if (title) milestone.title = title;
    if (description !== undefined) milestone.description = description;
    if (dueDate !== undefined) milestone.dueDate = dueDate;
    if (order !== undefined) milestone.order = order;

    if (status && status !== milestone.status) {
      milestone.status = status;
      if (status === 'Completed') {
        milestone.completedAt = new Date();
      } else {
        milestone.completedAt = null;
      }
    }

    await milestone.save();
    await updateProjectProgress(milestone.clientProject);

    // Notify client if completed
    if (status === 'Completed') {
      const project = await ClientProject.findById(milestone.clientProject);
      if (project) {
        await Notification.create({
          user: project.client,
          title: 'Milestone Completed!',
          message: `Milestone "${milestone.title}" has been marked as completed for "${project.title}".`,
          type: 'milestone',
          link: `/portal/projects/${project._id}`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Milestone updated successfully',
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete milestone
// @route   DELETE /api/v1/client-projects/:projectId/milestones/:id
// @access  Private (Admin)
export const deleteMilestone = async (req, res, next) => {
  try {
    const milestone = await ProjectMilestone.findByIdAndDelete(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    await updateProjectProgress(milestone.clientProject);

    res.status(200).json({
      success: true,
      message: 'Milestone deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
