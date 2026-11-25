import api from './api';

export const portalService = {
  getMyProjects: () => api.get('/client-projects/my'),
  getMyProjectDetails: (id) => api.get(`/client-projects/my/${id}`),
  getMyInquiries: () => api.get('/inquiries/my'),
  getConversations: () => api.get('/messages/conversations'),
  startConversation: (data) => api.post('/messages/conversations', data),
  getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}`),
  sendMessage: (conversationId, messageData) =>
    api.post(`/messages/conversations/${conversationId}`, messageData),
  getUnreadMessageCount: () => api.get('/messages/unread-count'),
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/notifications/read-all'),
};
