# CYDEX DIGITAL — Full-Stack Digital Agency & Portfolio Platform

> **"Building Ideas Into Reality."**  
> Professional, production-grade MERN stack platform engineered for **Cydex Digital**, a premier Digital Solutions & Technology Agency.

---

## 🌟 Executive Summary

Cydex Digital is a full-stack digital agency web application featuring three deeply integrated, role-guarded experiences:

1. **Public Brand Website:** High-conversion, accessible experience for prospective clients, enterprise partners, and visitors showcasing agency services, live portfolio case studies, technical capabilities, process roadmap, leadership team, client testimonials, and interactive contact/inquiry forms.
2. **Client Portal (`/portal`):** Dedicated authenticated dashboard for active clients to track assigned projects in real-time, view development milestones, track deliverables, submit and monitor inquiries, chat with the agency via real-time messaging, manage notifications, and update profile credentials.
3. **Admin CMS & CRM Dashboard (`/admin`):** Comprehensive operational command center for agency administrators to manage services, publish portfolio projects, manage incoming CRM inquiries, track client projects and milestones, handle user access, publish blog posts with categories, approve testimonials, manage team profiles, upload assets to the media library, audit activity logs, and configure dynamic site settings.

---

## 🎨 Exact Brand Tokens & Design System

The application strictly adheres to the official Cydex Digital brand design system:

| Purpose | Token Name | HEX Code | CSS Variable |
|---|---|---|---|
| **Primary Background** | Dark Navy | `#06161B` | `--color-dark-navy` |
| **Primary Accent** | Turquoise | `#0AE3DA` | `--color-turquoise` |
| **Secondary Accent** | Teal | `#03A094` | `--color-teal` |
| **Deep Accent** | Deep Teal | `#027E71` | `--color-deep-teal` |
| **Light Background / Text** | Off-White | `#E5E7E7` | `--color-off-white` |
| **Card Surface** | Navy Card | `#0c222a` | `--color-navy-card` |
| **Borders & Dividers** | Navy Border | `#143542` | `--color-navy-border` |

### Signature Gradient
`linear-gradient(135deg, #0AE3DA 0%, #03A094 55%, #027E71 100%)`  
Used for primary CTA buttons, interactive focus rings, hero accents, and brand badges.

---

## 🛠️ Technology Stack

### Frontend
- **React.js 19** with **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`) with custom theme tokens
- **React Router DOM v7** for nested layouts and role-based route guards
- **Lucide React** & custom SVG icon components
- **Axios** with global interceptors, cookie credentials, and automatic CSRF handling
- **React Hook Form** with **Zod** schema validation
- **Recharts** for real-time CRM and project analytics dashboards
- **Sonner** for contextual toast notifications

### Backend
- **Node.js** & **Express.js** RESTful API with versioned routing (`/api/v1`)
- **MongoDB** & **Mongoose 8** with 18 schema models
- **JWT (JSON Web Tokens)** stored in secure `HttpOnly`, `SameSite=Lax` cookies
- **Bcrypt.js** (salt rounds = 12) for secure password hashing
- **Helmet.js** for HTTP security headers
- **Express Rate Limit** protecting public and authentication endpoints
- **Multer** for file and media uploads
- **Server-side validation** with sanitization middleware

---

## 🔑 Default Seeded Accounts

The application includes pre-seeded accounts populated with realistic agency data:

| Portal | Role | Email | Password |
|---|---|---|---|
| **Admin Dashboard** | `admin` | `admin@cydexdigital.com` | `Admin@Cydex2026!` |
| **Client Portal** | `client` | `client@cydexdigital.com` | `Client1234!` |

*(You can also create custom admin accounts via CLI: `cd Server && npm run create-admin`)*

---

## 📁 Project Architecture

```
MY_PORTFOLIO/
├── package.json                   # Root workspace orchestration scripts
├── README.md                      # Comprehensive project documentation
│
├── Server/                        # Backend REST API
│   ├── .env                       # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example               # Example configuration template
│   ├── package.json               # Backend dependencies & scripts
│   └── src/
│       ├── app.js                 # Express application configuration & middleware
│       ├── server.js              # Server bootstrapper & MongoDB connection
│       ├── config/
│       │   ├── db.js              # Mongoose connection with retry logic
│       │   └── env.js             # Validated environment configuration
│       ├── middleware/
│       │   ├── auth.js            # JWT verification & role authorization (verifyToken, requireAdmin)
│       │   ├── errorHandler.js    # Global error handler with operational error formatting
│       │   ├── rateLimiter.js     # Rate limiting for auth and public endpoints
│       │   └── upload.js          # Multer storage engine for media uploads
│       ├── models/                # 18 Mongoose data models
│       │   ├── User.js            # Client and Administrator user accounts
│       │   ├── Service.js         # 6 core agency services
│       │   ├── PortfolioProject.js# Case studies & completed portfolio items
│       │   ├── Inquiry.js         # CRM inquiries from public forms & clients
│       │   ├── ClientProject.js   # Active client deliverables & progress tracking
│       │   ├── ProjectMilestone.js# Milestone checkpoints with deliverable links
│       │   ├── Conversation.js    # Messaging threads between clients and agency
│       │   ├── Message.js         # Chat messages with read receipts
│       │   ├── Notification.js    # In-app alert notifications
│       │   ├── BlogPost.js        # Articles & insights
│       │   ├── BlogCategory.js    # Article taxonomy
│       │   ├── Testimonial.js     # Client reviews & ratings
│       │   ├── TeamMember.js      # Agency specialists & leadership
│       │   ├── MediaAsset.js      # Uploaded imagery metadata
│       │   ├── SiteSetting.js     # Dynamic hero, contact, and agency copy
│       │   ├── ActivityLog.js     # Security & administrative audit trail
│       │   └── PasswordResetToken.js # Secure token validation
│       ├── controllers/           # Modular request handlers
│       ├── routes/                # Versioned API route definitions (`/api/v1`)
│       ├── scripts/
│       │   ├── seed.js            # Database seeder with realistic agency data
│       │   └── createAdmin.js     # Interactive CLI tool to provision administrators
│       └── tests/
│           └── api.test.js        # Automated integration test suite (10/10 passing)
│
└── Client/                        # Frontend Single Page Application (Vite + React)
    ├── index.html                 # HTML template with Google Fonts & Meta tags
    ├── vite.config.js             # Vite config with proxy & Tailwind CSS plugin
    ├── package.json               # Client dependencies & build scripts
    └── src/
        ├── main.jsx               # React DOM entry point
        ├── App.jsx                # Global router provider, scroll-to-top, toast container
        ├── index.css              # Tailwind v4 theme tokens, gradients, custom scrollbars
        ├── context/
        │   └── AuthContext.jsx    # Authentication state, login, logout, refresh session
        ├── services/
        │   ├── api.js             # Axios base instance with cookie credentials
        │   ├── authService.js     # Auth API client
        │   ├── publicService.js   # Public CMS endpoints client
        │   ├── portalService.js   # Client portal API client
        │   └── adminService.js    # Admin CMS/CRM API client
        ├── components/
        │   ├── common/            # Reusable UI primitives
        │   │   ├── Button.jsx     # Brand buttons (primary gradient, outline, ghost)
        │   │   ├── Logo.jsx       # SVG geometric C mark & Cydex Digital wordmark
        │   │   ├── Modal.jsx      # Accessible dialog modals
        │   │   ├── ConfirmDialog.jsx # Confirmation dialog for destructive actions
        │   │   ├── DataTable.jsx  # Sortable, searchable admin/client tables
        │   │   ├── StatusBadge.jsx# Status chips for projects, inquiries, milestones
        │   │   ├── LoadingSpinner.jsx # Brand loading spinner
        │   │   └── SocialIcons.jsx # Clean SVG brand icons (GitHub, LinkedIn, Twitter)
        │   └── layout/
        │       ├── PublicLayout.jsx  # Sticky navigation, mobile drawer, footer
        │       ├── PortalLayout.jsx  # Client sidebar, topbar, active project breadcrumb
        │       └── AdminLayout.jsx   # Admin sidebar, quick actions, role badge
        ├── pages/
        │   ├── public/            # Public Website
        │   │   ├── HomePage.jsx   # Hero, services, portfolio, process, testimonials, CTA
        │   │   ├── AboutPage.jsx  # Mission, vision, core values, team showcase
        │   │   ├── ServicesPage.jsx# 6 agency services overview
        │   │   ├── ServiceDetailPage.jsx # In-depth service capabilities & pricing tiers
        │   │   ├── PortfolioPage.jsx # Filterable portfolio grid
        │   │   ├── ProjectDetailPage.jsx # Project showcase with tech tags & live demo links
        │   │   ├── BlogPage.jsx   # Insights & articles with category filters
        │   │   ├── BlogDetailPage.jsx # Formatted blog reading view
        │   │   ├── ContactPage.jsx# Interactive inquiry form with live backend submission
        │   │   ├── PrivacyPage.jsx# Privacy policy
        │   │   ├── TermsPage.jsx  # Terms of service
        │   │   └── NotFoundPage.jsx # 404 page
        │   ├── auth/              # Authentication
        │   │   ├── LoginPage.jsx
        │   │   ├── RegisterPage.jsx
        │   │   ├── ForgotPasswordPage.jsx
        │   │   └── ResetPasswordPage.jsx
        │   ├── portal/            # Client Portal (`/portal`)
        │   │   ├── PortalDashboard.jsx    # Active project card, milestone timeline, stats
        │   │   ├── PortalProjects.jsx     # Client project listing
        │   │   ├── PortalProjectDetail.jsx# Milestones, deliverables, progress bar
        │   │   ├── PortalInquiries.jsx    # Historical inquiries & responses
        │   │   ├── PortalMessages.jsx     # Direct chat with agency admins
        │   │   ├── PortalNotifications.jsx# Real-time alerts
        │   │   └── PortalProfile.jsx      # Password & profile settings
        │   └── admin/             # Admin Command Center (`/admin`)
        │       ├── AdminDashboard.jsx     # Recharts metrics, active leads, revenue
        │       ├── AdminPortfolio.jsx     # Portfolio CRUD with case studies
        │       ├── AdminServices.jsx      # Services CRUD & reordering
        │       ├── AdminInquiries.jsx     # CRM inquiry pipeline & status updater
        │       ├── AdminClientProjects.jsx# Client project & milestone management
        │       ├── AdminClients.jsx       # Client accounts & access management
        │       ├── AdminMessages.jsx      # Agency client support chat
        │       ├── AdminBlog.jsx          # Blog publication engine
        │       ├── AdminTestimonials.jsx  # Review moderation & approval
        │       ├── AdminTeam.jsx          # Leadership & team members
        │       ├── AdminMedia.jsx         # Media library & file uploads
        │       ├── AdminSettings.jsx      # Dynamic site copy & contact info
        │       └── AdminActivityLogs.jsx  # Security & administrative audit logs
        └── routes/
            └── AppRoutes.jsx      # Public, ProtectedRoute, and AdminRoute guards
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (v7.0+ or MongoDB Atlas)
- **npm** (v9+)

### Installation

1. **Clone and enter the workspace:**
   ```bash
   cd cydex-digital
   ```

2. **Configure Environment Variables:**
   A configured `.env` file is located in `Server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://127.0.0.1:27017/cydex_digital
   JWT_SECRET=cydex_digital_jwt_secret_key_super_secure_2026_dev
   JWT_EXPIRES_IN=7d
   COOKIE_EXPIRES_DAYS=7
   ```

3. **Install Dependencies:**
   ```bash
   # Install server packages
   cd Server && npm install

   # Install client packages
   cd ../Client && npm install
   ```

4. **Seed the Database:**
   ```bash
   cd Server
   npm run seed
   ```

5. **Start Both Applications:**
   - **Terminal 1 (Backend API):**
     ```bash
     cd Server
     npm run dev
     # Runs on http://localhost:5000
     ```
   - **Terminal 2 (Frontend Client):**
     ```bash
     cd Client
     npm run dev
     # Runs on http://localhost:5173
     ```

---

## 🧪 Automated Testing

An automated integration test suite tests the API endpoints, authentication flows, authorization guards, CRM workflows, and data integrity:

```bash
cd Server
npm test
```

### Test Suite Execution Output
```
▶ Cydex Digital Backend API Tests
  ✔ 1. Health Check Endpoint
  ✔ 2. Public Services Listing
  ✔ 3. Public Portfolio Listing
  ✔ 4. Admin Authentication Login
  ✔ 5. Client Authentication Login
  ✔ 6. Unauthorized Access Rejection on Admin Endpoint
  ✔ 7. Admin Dashboard Stats Retrieval
  ✔ 8. Submit Contact Inquiry (End-to-End)
  ✔ 9. Admin Update Inquiry Status & CRM Note
  ✔ 10. Client Portal Isolated Project Access
✔ Cydex Digital Backend API Tests (10/10 passed)
```

---

## 🌐 API Endpoints Reference

All endpoints are versioned under `/api/v1`:

### Public Endpoints
- `GET /api/v1/health` — Health check status
- `GET /api/v1/services` — Published agency services
- `GET /api/v1/services/:slug` — Single service details
- `GET /api/v1/portfolio` — Published portfolio projects
- `GET /api/v1/portfolio/:slug` — Single project case study
- `GET /api/v1/blog` — Published blog articles
- `GET /api/v1/blog/:slug` — Single article details
- `GET /api/v1/testimonials` — Approved client testimonials
- `GET /api/v1/team` — Visible team members
- `GET /api/v1/settings` — Dynamic website copy & contact details
- `POST /api/v1/inquiries` — Submit new project inquiry (rate limited)

### Authentication Endpoints
- `POST /api/v1/auth/register` — Client registration
- `POST /api/v1/auth/login` — Authentication (sets HttpOnly cookie)
- `POST /api/v1/auth/logout` — Clears authentication cookie
- `GET /api/v1/auth/me` — Current user session verification
- `POST /api/v1/auth/forgot-password` — Request password reset
- `POST /api/v1/auth/reset-password/:token` — Set new password

### Client Portal Endpoints (Authenticated)
- `GET /api/v1/portal/dashboard` — Client overview metrics
- `GET /api/v1/portal/projects` — Client's assigned projects
- `GET /api/v1/portal/projects/:id` — Milestone & deliverable tracking
- `GET /api/v1/portal/inquiries` — Client inquiry history
- `GET /api/v1/portal/messages` — Conversation threads
- `POST /api/v1/portal/messages` — Send message to agency
- `GET /api/v1/portal/notifications` — Notification stream
- `PUT /api/v1/portal/profile` — Update user profile & password

### Admin Command Center Endpoints (Admin Only)
- `GET /api/v1/admin/dashboard` — Aggregate metrics & Recharts data
- `GET /api/v1/admin/activity-logs` — Immutable audit log feed
- `GET, POST, PUT, DELETE /api/v1/admin/services` — Manage agency services
- `GET, POST, PUT, DELETE /api/v1/admin/portfolio` — Manage portfolio projects
- `GET, PUT, DELETE /api/v1/admin/inquiries` — Manage CRM lead pipeline
- `GET, POST, PUT, DELETE /api/v1/admin/client-projects` — Manage client deliverables
- `GET, POST, PUT, DELETE /api/v1/admin/clients` — Client user management
- `GET, POST /api/v1/admin/messages` — Client communications
- `GET, POST, PUT, DELETE /api/v1/admin/blog` — Blog articles management
- `GET, POST, PUT, DELETE /api/v1/admin/testimonials` — Testimonial moderation
- `GET, POST, PUT, DELETE /api/v1/admin/team` — Team directory management
- `GET, POST, DELETE /api/v1/admin/media` — Media asset library & uploads
- `GET, PUT /api/v1/admin/settings` — Global website configuration

---

## 🔒 Security Best Practices Implemented

1. **HttpOnly Cookie Authentication:** JWT tokens are transferred strictly via `HttpOnly`, `SameSite=Lax` cookies, preventing XSS-based credential theft.
2. **Password Security:** Hashes passwords with `bcryptjs` using 12 salt rounds; passwords are never returned in database query projections (`select: false`).
3. **Helmet Header Protection:** Sets standard HTTP security headers to protect against clickjacking, MIME-sniffing, and cross-site script injection.
4. **Rate Limiting:** Public inquiry endpoints and authentication endpoints are protected by rate limiters to mitigate brute-force and spam attacks.
5. **CORS Isolation:** Backend explicitly limits allowed origins to the configured `CLIENT_URL` with credentials enabled.
6. **Role Guarding:** Express middleware validates roles on every protected route (`verifyToken`, `requireAdmin`), and React Router checks roles client-side before view mounting.

---

## 🚢 Production Deployment Guide

### Deploying the Backend (e.g. Render, Railway, AWS ECS)
1. Push the repository to GitHub.
2. In your cloud provider, create a Web Service pointing to the `Server` directory.
3. Configure environment variables (`PORT`, `NODE_ENV=production`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`).
4. Set Build Command: `npm install`
5. Set Start Command: `node src/server.js`

### Deploying the Frontend (e.g. Vercel, Netlify, Cloudflare Pages)
1. Create a project pointing to the `Client` directory.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Rewrite Rule for Single Page Application routing (route all requests to `/index.html`).
5. Configure `VITE_API_BASE_URL` to point to your live backend domain.

---

## 📄 License
Copyright © 2026 Cydex Digital. All rights reserved.
Built with precision and care for **Cydex Digital — Building Ideas Into Reality.**
