import { PortfolioProject } from '../models/PortfolioProject.js';
import { Inquiry } from '../models/Inquiry.js';
import { ClientProject } from '../models/ClientProject.js';
import { User } from '../models/User.js';
import { BlogPost } from '../models/BlogPost.js';
import { Message } from '../models/Message.js';
import { ActivityLog } from '../models/ActivityLog.js';

// @desc    Get aggregate metrics and dashboard stats
// @route   GET /api/v1/admin/dashboard-stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalPortfolioProjects,
      publishedPortfolioProjects,
      totalInquiries,
      newInquiries,
      activeClientProjects,
      registeredClients,
      publishedBlogs,
      unreadMessages,
      recentInquiries,
      recentClientProjects,
      inquiryStatusBreakdown,
    ] = await Promise.all([
      PortfolioProject.countDocuments(),
      PortfolioProject.countDocuments({ isPublished: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
      ClientProject.countDocuments({ status: { $in: ['Planning', 'In Progress', 'Review'] } }),
      User.countDocuments({ role: 'client' }),
      BlogPost.countDocuments({ status: 'published' }),
      Message.countDocuments({ recipient: req.user._id, isRead: false }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).select('referenceId name projectTitle service status createdAt'),
      ClientProject.find()
        .populate('client', 'name email company')
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title projectReference status progress updatedAt client'),
      Inquiry.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Format status breakdown for chart rendering
    const statusMap = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      'Proposal Sent': 0,
      Converted: 0,
      Closed: 0,
    };
    inquiryStatusBreakdown.forEach((item) => {
      if (item._id && statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
    });

    const chartData = Object.keys(statusMap).map((key) => ({
      name: key,
      count: statusMap[key],
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPortfolioProjects,
          publishedPortfolioProjects,
          totalInquiries,
          newInquiries,
          activeClientProjects,
          registeredClients,
          publishedBlogs,
          unreadMessages,
        },
        inquiryStatusBreakdown: chartData,
        recentInquiries,
        recentClientProjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registered clients for Admin CRM
// @route   GET /api/v1/admin/clients
// @access  Private (Admin)
export const getClients = async (req, res, next) => {
  try {
    const { search, status } = req.query;

    const query = { role: 'client' };
    if (status && status !== 'All') query.status = status;
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const clients = await User.find(query).sort({ createdAt: -1 });

    // Enrich with count of projects and inquiries
    const enriched = await Promise.all(
      clients.map(async (client) => {
        const [projectCount, inquiryCount] = await Promise.all([
          ClientProject.countDocuments({ client: client._id }),
          Inquiry.countDocuments({
            $or: [{ client: client._id }, { email: client.email }],
          }),
        ]);

        return {
          ...client.toObject(),
          projectCount,
          inquiryCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client full details for Admin
// @route   GET /api/v1/admin/clients/:id
// @access  Private (Admin)
export const getClientDetails = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const [projects, inquiries] = await Promise.all([
      ClientProject.find({ client: client._id }).sort({ createdAt: -1 }),
      Inquiry.find({ $or: [{ client: client._id }, { email: client.email }] }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        client,
        projects,
        inquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client status (activate / suspend)
// @route   PUT /api/v1/admin/clients/:id/status
// @access  Private (Admin)
export const updateClientStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be active or suspended.' });
    }

    // Prevent modifying own admin account status accidentally
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Cannot modify status of your own account' });
    }

    const client = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await ActivityLog.create({
      user: req.user._id,
      action: 'CLIENT_STATUS_UPDATED',
      targetType: 'User',
      targetId: client._id.toString(),
      details: { email: client.email, status },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: `Client account status changed to ${status}`,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity logs for audit
// @route   GET /api/v1/admin/activity-logs
// @access  Private (Admin)
export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
