import api from './api';

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getClients: (params) => api.get('/admin/clients', { params }),
  getClientDetails: (id) => api.get(`/admin/clients/${id}`),
  updateClientStatus: (id, status) => api.put(`/admin/clients/${id}/status`, { status }),
  getActivityLogs: () => api.get('/admin/activity-logs'),

  // Portfolio
  getAllPortfolioProjects: (params) => api.get('/portfolio/admin/all', { params }),
  createPortfolioProject: (data) => api.post('/portfolio', data),
  updatePortfolioProject: (id, data) => api.put(`/portfolio/${id}`, data),
  deletePortfolioProject: (id) => api.delete(`/portfolio/${id}`),

  // Services
  getAllServices: () => api.get('/services/admin/all'),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Inquiries / CRM
  getAllInquiries: (params) => api.get('/inquiries', { params }),
  getInquiryById: (id) => api.get(`/inquiries/${id}`),
  updateInquiryStatus: (id, data) => api.put(`/inquiries/${id}/status`, data),
  addInquiryNote: (id, note) => api.post(`/inquiries/${id}/notes`, { note }),
  convertInquiryToProject: (id) => api.post(`/inquiries/${id}/convert`),
  resendInquiryEmail: (id) => api.post(`/inquiries/${id}/resend-email`),

  // Client Projects
  getAllClientProjects: (params) => api.get('/client-projects/admin/all', { params }),
  getClientProjectById: (id) => api.get(`/client-projects/admin/${id}`),
  createClientProject: (data) => api.post('/client-projects', data),
  updateClientProject: (id, data) => api.put(`/client-projects/${id}`, data),
  addClientUpdate: (id, update) => api.post(`/client-projects/${id}/updates`, { update }),
  addInternalNote: (id, note) => api.post(`/client-projects/${id}/notes`, { note }),
  addDeliverable: (id, deliverable) => api.post(`/client-projects/${id}/deliverables`, deliverable),

  // Milestones
  createMilestone: (projectId, data) => api.post(`/client-projects/${projectId}/milestones`, data),
  updateMilestone: (projectId, id, data) => api.put(`/client-projects/${projectId}/milestones/${id}`, data),
  deleteMilestone: (projectId, id) => api.delete(`/client-projects/${projectId}/milestones/${id}`),

  // Blog
  getAllBlogPosts: (params) => api.get('/blog/admin/all', { params }),
  createBlogPost: (data) => api.post('/blog', data),
  updateBlogPost: (id, data) => api.put(`/blog/${id}`, data),
  deleteBlogPost: (id) => api.delete(`/blog/${id}`),
  createBlogCategory: (data) => api.post('/blog/categories', data),

  // Testimonials
  getAllTestimonials: () => api.get('/testimonials/admin/all'),
  createTestimonial: (data) => api.post('/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Team
  getAllTeamMembers: () => api.get('/team/admin/all'),
  createTeamMember: (data) => api.post('/team', data),
  updateTeamMember: (id, data) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),

  // Media
  uploadMedia: (formData) =>
    api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMediaAssets: (params) => api.get('/media', { params }),
  deleteMediaAsset: (id) => api.delete(`/media/${id}`),

  // Settings
  updateSettings: (data) => api.put('/settings', data),
};
