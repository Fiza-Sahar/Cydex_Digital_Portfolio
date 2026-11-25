import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

// @desc    Get conversations for current user (client gets theirs, admin gets all)
// @route   GET /api/v1/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { client: req.user._id };

    const conversations = await Conversation.find(query)
      .populate('client', 'name email company avatar')
      .populate('clientProject', 'title projectReference')
      .sort({ lastMessageAt: -1 });

    // Calculate unread count for each conversation
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          recipient: req.user._id,
          isRead: false,
        });
        return {
          ...conv.toObject(),
          unreadCount,
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

// @desc    Get or start conversation
// @route   POST /api/v1/messages/conversations
// @access  Private
export const startConversation = async (req, res, next) => {
  try {
    const { clientId, clientProjectId, subject, initialMessage } = req.body;

    let targetClientId = req.user.role === 'client' ? req.user._id : clientId;
    if (!targetClientId) {
      return res.status(400).json({ success: false, message: 'Client ID is required' });
    }

    // Find any admin user for conversation partner if initiated by client
    const adminUser = await User.findOne({ role: 'admin' });
    const participants = [targetClientId];
    if (adminUser) participants.push(adminUser._id);

    let conversation = await Conversation.findOne({
      client: targetClientId,
      clientProject: clientProjectId || null,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        client: targetClientId,
        clientProject: clientProjectId || null,
        subject: subject || 'Project Discussion',
        lastMessage: initialMessage || 'Conversation opened',
        lastMessageAt: new Date(),
      });
    }

    if (initialMessage && initialMessage.trim()) {
      const recipientId =
        req.user.role === 'client'
          ? (adminUser ? adminUser._id : targetClientId)
          : targetClientId;

      await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        recipient: recipientId,
        content: initialMessage.trim(),
      });
    }

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/v1/messages/conversations/:id
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('client', 'name email company avatar')
      .populate('clientProject', 'title projectReference');

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Verify ownership if client
    if (req.user.role === 'client' && conversation.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to conversation' });
    }

    // Mark messages sent to current user as read
    await Message.updateMany(
      { conversation: conversation._id, recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name role avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message in conversation
// @route   POST /api/v1/messages/conversations/:id
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { content, attachments } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Determine recipient
    let recipientId;
    if (req.user.role === 'client') {
      // Find admin
      const admin = await User.findOne({ role: 'admin' });
      recipientId = admin ? admin._id : conversation.client;
    } else {
      recipientId = conversation.client;
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      recipient: recipientId,
      content: content.trim(),
      attachments: attachments || [],
    });

    conversation.lastMessage = content.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Create notification for recipient
    await Notification.create({
      user: recipientId,
      title: 'New Message',
      message: `${req.user.name}: ${content.trim().substring(0, 75)}...`,
      type: 'message',
      link: req.user.role === 'admin' ? `/portal/messages/${conversation._id}` : `/admin/messages/${conversation._id}`,
    });

    const populated = await Message.findById(message._id).populate('sender', 'name role avatar');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get total unread message count for current user
// @route   GET /api/v1/messages/unread-count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    next(error);
  }
};
