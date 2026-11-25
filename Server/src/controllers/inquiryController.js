import { Inquiry } from '../models/Inquiry.js';
import { ClientProject } from '../models/ClientProject.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { sendInquiryNotification } from '../services/emailService.js';

// Helper to generate reference ID
const generateReferenceId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CYD-${new Date().getFullYear()}-${rand}`;
};

// @desc    Submit project inquiry (Public / Client)
// @route   POST /api/v1/contact
// @access  Public / Authenticated
export const createInquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service,
      budgetRange,
      timeline,
      projectTitle,
      details,
      preferredContactMethod,
      privacyConsent,
    } = req.body;

    if (!name || !email || !service || !projectTitle || !details) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, service, project title, and project details are required.',
      });
    }

    if (!privacyConsent) {
      return res.status(400).json({
        success: false,
        message: 'You must consent to the privacy policy to submit an inquiry.',
      });
    }

    // Basic input sanitization (trim strings)
    const sanitizedName = String(name).trim();
    const sanitizedEmail = String(email).trim().toLowerCase();
    const sanitizedProjectTitle = String(projectTitle).trim();
    const sanitizedDetails = String(details).trim();
    const sanitizedPhone = phone ? String(phone).trim() : '';
    const sanitizedCompany = company ? String(company).trim() : '';

    const referenceId = generateReferenceId();

    const inquiry = await Inquiry.create({
      referenceId,
      client: req.user ? req.user._id : null,
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      company: sanitizedCompany,
      service,
      budgetRange: budgetRange || 'Flexible',
      timeline: timeline || 'Flexible',
      projectTitle: sanitizedProjectTitle,
      details: sanitizedDetails,
      preferredContactMethod: preferredContactMethod || 'Email',
      privacyConsent: true,
      status: 'New',
    });

    // Notify admins about the new inquiry
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map((admin) => ({
      user: admin._id,
      title: 'New Project Inquiry',
      message: `${name} submitted an inquiry for "${projectTitle}" (${service}) [Ref: ${referenceId}]`,
      type: 'inquiry',
      link: `/admin/inquiries/${inquiry._id}`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Deliver email notification to cydexdigital@gmail.com (fail-safe)
    sendInquiryNotification(inquiry).catch((err) => {
      console.error('[InquiryController] Unexpected email notification failure:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your inquiry has been safely received.',
      data: {
        referenceId: inquiry.referenceId,
        id: inquiry._id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in client's own inquiries
// @route   GET /api/v1/inquiries/my
// @access  Private (Client)
export const getClientInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({
      $or: [{ client: req.user._id }, { email: req.user.email.toLowerCase() }],
    })
      .sort({ createdAt: -1 })
      .select('-internalNotes'); // Never expose internal staff notes to clients

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries for admin
// @route   GET /api/v1/inquiries
// @access  Private (Admin)
export const getAllInquiriesAdmin = async (req, res, next) => {
  try {
    const { status, service, search, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status && status !== 'All') query.status = status;
    if (service && service !== 'All') query.service = service;

    if (search && search.trim()) {
      query.$or = [
        { referenceId: { $regex: search.trim(), $options: 'i' } },
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { projectTitle: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .populate('assignedTo', 'name email')
        .populate('client', 'name email company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Inquiry.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry by ID
// @route   GET /api/v1/inquiries/:id
// @access  Private (Admin)
export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('client', 'name email company phone')
      .populate('internalNotes.author', 'name email');

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/v1/inquiries/:id/status
// @access  Private (Admin)
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, assignedTo } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (status) inquiry.status = status;
    if (assignedTo !== undefined) inquiry.assignedTo = assignedTo || null;

    await inquiry.save();

    // If client is registered, notify them of status update
    if (inquiry.client) {
      await Notification.create({
        user: inquiry.client,
        title: 'Inquiry Status Updated',
        message: `Your inquiry "${inquiry.projectTitle}" [${inquiry.referenceId}] is now marked as "${inquiry.status}".`,
        type: 'inquiry',
        link: '/portal/inquiries',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add internal note to inquiry
// @route   POST /api/v1/inquiries/:id/notes
// @access  Private (Admin)
export const addInquiryNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    inquiry.internalNotes.push({
      note: note.trim(),
      author: req.user._id,
      createdAt: new Date(),
    });

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Internal note recorded',
      data: inquiry.internalNotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert inquiry to client project
// @route   POST /api/v1/inquiries/:id/convert
// @access  Private (Admin)
export const convertInquiryToProject = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (inquiry.convertedProject) {
      return res.status(400).json({
        success: false,
        message: 'This inquiry has already been converted into a client project.',
      });
    }

    // Find or locate client user
    let clientUser = null;
    if (inquiry.client) {
      clientUser = await User.findById(inquiry.client);
    } else {
      clientUser = await User.findOne({ email: inquiry.email.toLowerCase() });
    }

    if (!clientUser) {
      return res.status(400).json({
        success: false,
        message:
          'No registered client found for this email address. Please have the client register or create their client account first.',
      });
    }

    const projectReference = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProject = await ClientProject.create({
      title: inquiry.projectTitle,
      projectReference,
      client: clientUser._id,
      description: inquiry.details,
      services: [inquiry.service],
      status: 'Planning',
      progress: 0,
      clientUpdates: [
        {
          update: `Project created from inquiry ${inquiry.referenceId}. Kickoff and planning underway.`,
          author: req.user._id,
        },
      ],
    });

    inquiry.status = 'Converted';
    inquiry.convertedProject = newProject._id;
    await inquiry.save();

    // Notify client
    await Notification.create({
      user: clientUser._id,
      title: 'Project Initiated!',
      message: `Your inquiry "${inquiry.projectTitle}" has been converted into an active client project [Ref: ${projectReference}].`,
      type: 'project',
      link: `/portal/projects/${newProject._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry successfully converted to client project',
      data: newProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend inquiry email notification (Admin only)
// @route   POST /api/v1/inquiries/:id/resend-email
// @access  Private (Admin)
export const resendInquiryEmail = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const result = await sendInquiryNotification(inquiry);
    const updated = await Inquiry.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: result.success
        ? 'Notification email dispatched successfully.'
        : (result.message || result.error || 'Email dispatch completed.'),
      data: updated.emailNotification,
    });
  } catch (error) {
    next(error);
  }
};
