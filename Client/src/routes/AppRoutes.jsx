import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import PortalLayout from '../components/layout/PortalLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import PortfolioPage from '../pages/public/PortfolioPage';
import ProjectDetailPage from '../pages/public/ProjectDetailPage';
import ContactPage from '../pages/public/ContactPage';
import BlogPage from '../pages/public/BlogPage';
import BlogDetailPage from '../pages/public/BlogDetailPage';
import PrivacyPage from '../pages/public/PrivacyPage';
import TermsPage from '../pages/public/TermsPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Client Portal Pages (Code-Split)
const PortalDashboard = React.lazy(() => import('../pages/portal/PortalDashboard'));
const PortalProjects = React.lazy(() => import('../pages/portal/PortalProjects'));
const PortalProjectDetail = React.lazy(() => import('../pages/portal/PortalProjectDetail'));
const PortalInquiries = React.lazy(() => import('../pages/portal/PortalInquiries'));
const PortalMessages = React.lazy(() => import('../pages/portal/PortalMessages'));
const PortalNotifications = React.lazy(() => import('../pages/portal/PortalNotifications'));
const PortalProfile = React.lazy(() => import('../pages/portal/PortalProfile'));

// Admin Pages (Code-Split)
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const AdminPortfolio = React.lazy(() => import('../pages/admin/AdminPortfolio'));
const AdminServices = React.lazy(() => import('../pages/admin/AdminServices'));
const AdminInquiries = React.lazy(() => import('../pages/admin/AdminInquiries'));
const AdminClientProjects = React.lazy(() => import('../pages/admin/AdminClientProjects'));
const AdminClients = React.lazy(() => import('../pages/admin/AdminClients'));
const AdminMessages = React.lazy(() => import('../pages/admin/AdminMessages'));
const AdminBlog = React.lazy(() => import('../pages/admin/AdminBlog'));
const AdminTestimonials = React.lazy(() => import('../pages/admin/AdminTestimonials'));
const AdminTeam = React.lazy(() => import('../pages/admin/AdminTeam'));
const AdminMedia = React.lazy(() => import('../pages/admin/AdminMedia'));
const AdminSettings = React.lazy(() => import('../pages/admin/AdminSettings'));
const AdminActivityLogs = React.lazy(() => import('../pages/admin/AdminActivityLogs'));

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cydex-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cydex-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthGuestRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cydex-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <React.Suspense fallback={<LoadingSpinner fullScreen label="Loading CYDEX DIGITAL..." />}>
      <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Guest-only Auth Pages */}
      <Route
        path="/login"
        element={
          <AuthGuestRoute>
            <LoginPage />
          </AuthGuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthGuestRoute>
            <RegisterPage />
          </AuthGuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthGuestRoute>
            <ForgotPasswordPage />
          </AuthGuestRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <AuthGuestRoute>
            <ResetPasswordPage />
          </AuthGuestRoute>
        }
      />

      {/* Client Portal (Legacy Redirect to Public Website) */}
      <Route path="/portal" element={<Navigate to="/" replace />} />
      <Route path="/portal/*" element={<Navigate to="/" replace />} />

      {/* Admin Dashboard (Protected - Admin Only) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="client-projects" element={<AdminClientProjects />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="activity-logs" element={<AdminActivityLogs />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </React.Suspense>
  );
}
