import { ClientProject } from '../models/ClientProject.js';
import { ProjectMilestone } from '../models/ProjectMilestone.js';
import { Notification } from '../models/Notification.js';

// @desc    Get client's assigned projects
// @route   GET /api/v1/client-projects/my
// @access  Private (Client)
export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await ClientProject.find({ client: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-internalNotes'); // Never leak internal admin notes

    // Also fetch milestone counts for each project
    const projectIds = projects.map((p) => p._id);
    const milestones = await ProjectMilestone.find({ clientProject: { $in: projectIds } });

    const enriched = projects.map((proj) => {
      const projMilestones = milestones.filter((m) => m.clientProject.toString() === proj._id.toString());
      const totalMilestones = projMilestones.length;
      const completedMilestones = projMilestones.filter((m) => m.status === 'Completed').length;
      return {
        ...proj.toObject(),
        milestonesTotal: totalMilestones,
        milestonesCompleted: completedMilestones,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client's single project details
// @route   GET /api/v1/client-projects/my/:id
// @access  Private (Client)
export const getMyProjectDetails = async (req, res, next) => {
  try {
    const project = await ClientProject.findOne({
      _id: req.params.id,
      client: req.user._id,
    }).select('-internalNotes');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have permission to access it.',
      });
    }

    const milestones = await ProjectMilestone.find({ clientProject: project._id }).sort({ order: 1, dueDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        project,
        milestones,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all client projects for Admin
// @route   GET /api/v1/client-projects/admin/all
// @access  Private (Admin)
export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const { status, search, client } = req.query;

    const query = {};
    if (status && status !== 'All') query.status = status;
    if (client) query.client = client;
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { projectReference: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const projects = await ClientProject.find(query)
      .populate('client', 'name email company')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client project for Admin (includes internal notes)
// @route   GET /api/v1/client-projects/admin/:id
// @access  Private (Admin)
export const getProjectByIdAdmin = async (req, res, next) => {
  try {
    const project = await ClientProject.findById(req.params.id)
      .populate('client', 'name email company phone')
      .populate('clientUpdates.author', 'name email')
      .populate('internalNotes.author', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const milestones = await ProjectMilestone.find({ clientProject: project._id }).sort({ order: 1, dueDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        project,
        milestones,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create client project
// @route   POST /api/v1/client-projects
// @access  Private (Admin)
export const createClientProject = async (req, res, next) => {
  try {
    const { title, client, description, scope, deliverables, services, startDate, targetCompletionDate, status } =
      req.body;

    if (!title || !client || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, client, and description are required.',
      });
    }

    const projectReference = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const project = await ClientProject.create({
      title,
      projectReference,
      client,
      description,
      scope: scope || '',
      deliverables: deliverables || [],
      services: services || [],
      startDate: startDate || new Date(),
      targetCompletionDate,
      status: status || 'Planning',
      progress: 0,
      clientUpdates: [
        {
          update: 'Project initiated and opened in the client portal.',
          author: req.user._id,
        },
      ],
    });

    await Notification.create({
      user: client,
      title: 'New Project Created',
      message: `Your project "${title}" [${projectReference}] has been initiated.`,
      type: 'project',
      link: `/portal/projects/${project._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Client project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client project
// @route   PUT /api/v1/client-projects/:id
// @access  Private (Admin)
export const updateClientProject = async (req, res, next) => {
  try {
    const project = await ClientProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post client-visible update
// @route   POST /api/v1/client-projects/:id/updates
// @access  Private (Admin)
export const addClientUpdate = async (req, res, next) => {
  try {
    const { update } = req.body;
    if (!update || !update.trim()) {
      return res.status(400).json({ success: false, message: 'Update text is required' });
    }

    const project = await ClientProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.clientUpdates.unshift({
      update: update.trim(),
      author: req.user._id,
      date: new Date(),
    });

    await project.save();

    await Notification.create({
      user: project.client,
      title: 'New Project Update',
      message: `Update posted on "${project.title}": ${update.trim().substring(0, 80)}...`,
      type: 'project',
      link: `/portal/projects/${project._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Update posted to client portal',
      data: project.clientUpdates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add private internal note
// @route   POST /api/v1/client-projects/:id/notes
// @access  Private (Admin)
export const addInternalNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    const project = await ClientProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.internalNotes.unshift({
      note: note.trim(),
      author: req.user._id,
      date: new Date(),
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Internal note saved',
      data: project.internalNotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload / attach deliverable file
// @route   POST /api/v1/client-projects/:id/deliverables
// @access  Private (Admin)
export const addDeliverable = async (req, res, next) => {
  try {
    const { name, url } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, message: 'File name and URL are required' });
    }

    const project = await ClientProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.deliverableFiles.push({ name, url, uploadedAt: new Date() });
    await project.save();

    await Notification.create({
      user: project.client,
      title: 'New Deliverable Available',
      message: `A new deliverable "${name}" has been uploaded for "${project.title}".`,
      type: 'milestone',
      link: `/portal/projects/${project._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Deliverable attached successfully',
      data: project.deliverableFiles,
    });
  } catch (error) {
    next(error);
  }
};
