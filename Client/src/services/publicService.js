import api from './api';

export const publicService = {
  getSettings: () => api.get('/settings'),
  getServices: () => api.get('/services'),
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),
  getPortfolio: (params) => api.get('/portfolio', { params }),
  getProjectBySlug: (slug) => api.get(`/portfolio/${slug}`),
  getBlogPosts: (params) => api.get('/blog', { params }),
  getBlogPostBySlug: (slug) => api.get(`/blog/${slug}`),
  getBlogCategories: () => api.get('/blog/categories'),
  getTestimonials: () => api.get('/testimonials'),
  getTeam: () => api.get('/team'),
  submitInquiry: (inquiryData) => api.post('/contact', inquiryData),
};
