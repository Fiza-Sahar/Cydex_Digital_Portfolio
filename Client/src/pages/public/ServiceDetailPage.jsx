import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import {
  Globe,
  Smartphone,
  Palette,
  FileText,
  Video,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const iconMap = {
  Globe,
  Smartphone,
  Palette,
  FileText,
  Video,
  Cpu,
};

const DEFAULT_SERVICES = [
  {
    _id: 'def-web',
    title: 'Website Development',
    slug: 'website-development',
    icon: 'Globe',
    shortDescription: 'Custom responsive web applications built for performance and speed.',
    heroDescription:
      'We engineer responsive, fast web platforms tailored to conversion, stability, and clean performance.',
    features: ['Custom Frontend Architecture', 'SEO & Performance Optimized', 'Responsive Across All Viewports', 'Headless CMS Integrations', 'Clean HTML & CSS'],
    deliverables: ['Production React / Web Source Code', 'Automated CI/CD Deployment Pipeline', 'SEO & Performance Audit', 'Architecture Documentation'],
    benefits: ['Fast page loading speed', 'Clean user experience', 'Scalable component structure', 'Full code accessibility'],
    process: [
      { step: '01', title: 'Requirements & Scope', description: 'User flows, technical requirements, and milestone planning.' },
      { step: '02', title: 'Interface Design', description: 'Design system, responsive layouts, and interactive prototypes.' },
      { step: '03', title: 'Frontend Engineering', description: 'Clean React code, semantic HTML, API integrations, and state management.' },
      { step: '04', title: 'Testing & Launch', description: 'Cross-browser testing, accessibility audit, and production deployment.' },
    ],
  },
  {
    _id: 'def-mobile',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: 'Smartphone',
    shortDescription: 'Cross-platform mobile applications for iOS and Android.',
    heroDescription:
      'Developing cross-platform mobile experiences for iOS and Android with reliable architecture and clean interfaces.',
    features: ['Intuitive Mobile UI Design', 'Offline Capabilities', 'App Store & Google Play Deployment', 'Push Notifications', 'Secure Storage'],
    deliverables: ['Mobile Application Repository', 'Store Submission Files', 'API Integration Layer', 'Automated Test Suite'],
    benefits: ['Faster deployment across iOS and Android', 'Consistent experience on all devices', 'Maintainable codebase', 'Responsive mobile gestures'],
    process: [
      { step: '01', title: 'App Scope', description: 'Feature definitions, user permissions, and API contract design.' },
      { step: '02', title: 'Prototyping', description: 'Navigation flows, touch targets, and interface states.' },
      { step: '03', title: 'Development', description: 'Cross-platform mobile code, offline caching, and API integration.' },
      { step: '04', title: 'Release Preparation', description: 'Staging builds, store submission compliance, and release verification.' },
    ],
  },
  {
    _id: 'def-uiux',
    title: 'UI/UX & Design Systems',
    slug: 'ui-ux-design',
    icon: 'Palette',
    shortDescription: 'Intuitive digital interface design and interactive prototypes.',
    heroDescription:
      'Digital interface design combining clarity, functional layout hierarchy, and systematic component tokens.',
    features: ['Design Systems & Component Tokens', 'Interactive Prototypes', 'User Journey Mapping', 'Accessibility Standards', 'Developer Specifications'],
    deliverables: ['Figma Design Files', 'Design Tokens Scale', 'Clickable Prototype', 'Component State Specs'],
    benefits: ['Faster development handover', 'Consistent visual identity', 'Reduced interface friction', 'Clear user navigation'],
    process: [
      { step: '01', title: 'User Research', description: 'User requirements, workflow analysis, and wireframe sketches.' },
      { step: '02', title: 'Wireframing', description: 'Layout blueprints and core user task completion flows.' },
      { step: '03', title: 'Design System', description: 'Color tokens, typography scale, and reusable components.' },
      { step: '04', title: 'Developer Handover', description: 'Detailed component specs, asset exports, and design tokens.' },
    ],
  },
  {
    _id: 'def-custom',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    icon: 'Cpu',
    shortDescription: 'APIs, databases, and custom software for business workflows.',
    heroDescription:
      'Custom software platforms and backend databases built for reliability, security, and specific business needs.',
    features: ['Scalable Architecture', 'Automated Test Pipelines', 'Role-Based Access Control', 'Database Modeling', 'API Documentation'],
    deliverables: ['Backend Application Source Code', 'Database Schemas & Migrations', 'API Documentation', 'Deployment Configuration'],
    benefits: ['Fit to exact business logic', 'Reliable database transactions', 'Standard authentication security', 'Structured codebase'],
    process: [
      { step: '01', title: 'Technical Architecture', description: 'Data modeling, API specifications, and service boundaries.' },
      { step: '02', title: 'Backend Engineering', description: 'Endpoints, database queries, and security middlewares.' },
      { step: '03', title: 'Integration', description: 'Frontend connectors, webhook handlers, and background tasks.' },
      { step: '04', title: 'Deployment', description: 'Environment configuration, security testing, and production launch.' },
    ],
  },
  {
    _id: 'def-content',
    title: 'Content Strategy',
    slug: 'content-writing',
    icon: 'FileText',
    shortDescription: 'Clear technical documentation and digital brand messaging.',
    heroDescription:
      'Clear, technical documentation and brand messaging designed to communicate your product value clearly.',
    features: ['Technical Documentation', 'SEO Keyword Strategy', 'Editorial Copywriting', 'Product Positioning', 'Style Guidelines'],
    deliverables: ['Content Strategy Document', 'Website & Product Copy', 'API & Developer Documentation', 'Brand Messaging Guide'],
    benefits: ['Clear developer understanding', 'Consistent voice across pages', 'Improved organic search discovery', 'Reduced user confusion'],
    process: [
      { step: '01', title: 'Content Audit', description: 'Audience analysis and technical topic mapping.' },
      { step: '02', title: 'Drafting', description: 'Structured documentation and clear interface copy.' },
      { step: '03', title: 'Review', description: 'Technical review, tone consistency, and editing.' },
      { step: '04', title: 'Publishing', description: 'Formatting for web, documentation indexing, and handover.' },
    ],
  },
  {
    _id: 'def-video',
    title: 'Video & Motion Graphics',
    slug: 'video-editing',
    icon: 'Video',
    shortDescription: 'Product walkthroughs, interface animations, and digital video assets.',
    heroDescription:
      'Product demos and interface motion graphics that clearly demonstrate software features and workflows.',
    features: ['Product Demos', 'UI Walkthroughs', 'Micro-Animations', 'Social Assets', 'High-Resolution Exports'],
    deliverables: ['High-Definition Video Files', 'Web-Optimized Video Clips', 'Storyboard Files', 'Project Assets'],
    benefits: ['Clear visual product explanation', 'Higher viewer engagement', 'Versatile across marketing channels', 'Polished brand presentation'],
    process: [
      { step: '01', title: 'Storyboard & Script', description: 'Defining the product workflow, key scenes, and narration.' },
      { step: '02', title: 'Motion Production', description: 'Screen capture, interface animation, and motion editing.' },
      { step: '03', title: 'Audio & Polishing', description: 'Sound design, pacing adjustments, and typography overlay.' },
      { step: '04', title: 'Final Delivery', description: 'Multi-resolution rendering and web-ready compression.' },
    ],
  },
];

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicService
      .getServiceBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setService(res.data);
          document.title = `${res.data.title} — CYDEX DIGITAL`;
        } else {
          const fallback = DEFAULT_SERVICES.find((s) => s.slug === slug);
          if (fallback) {
            setService(fallback);
            document.title = `${fallback.title} — CYDEX DIGITAL`;
          }
        }
      })
      .catch(() => {
        const fallback = DEFAULT_SERVICES.find((s) => s.slug === slug);
        if (fallback) {
          setService(fallback);
          document.title = `${fallback.title} — CYDEX DIGITAL`;
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading CYDEX DIGITAL service details..." />;
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-6">
        <h2 className="editorial-title text-3xl font-normal text-[var(--text-primary)]">
          Service Not Found
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          The requested service could not be found or is not currently active.
        </p>
        <Link to="/services">
          <Button variant="primary" size="md">
            Return to Services
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Globe;

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      {/* 1. Service Hero */}
      <section className="py-20 sm:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[#0AE3DA] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Services</span>
          </Link>

          <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA]">
            // Capability
          </div>

          <h1 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
            {service.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose">
            {service.heroDescription || service.shortDescription}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link to={`/contact?service=${encodeURIComponent(service.title)}`}>
              <Button variant="primary" size="lg">
                Request a Quote
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="secondary" size="lg">
                View Related Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Benefits & Deliverables */}
      <section className="py-20 sm:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.benefits && service.benefits.length > 0 && (
              <div className="studio-card p-8 sm:p-10 space-y-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#0AE3DA] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.deliverables && service.deliverables.length > 0 && (
              <div className="studio-card p-8 sm:p-10 space-y-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  Standard Deliverables
                </h3>
                <ul className="space-y-3">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#03A094] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Process Steps */}
      {service.process && service.process.length > 0 && (
        <section className="py-20 sm:py-28 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14 text-left">
              <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-3">
                // Process
              </div>
              <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
                How we deliver <span className="accent-word">{service.title}</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step, idx) => (
                <div key={idx} className="studio-card p-6 space-y-3">
                  <div className="text-2xl font-mono text-[var(--text-muted)]">
                    {step.step}
                  </div>
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Final CTA */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
            Ready to discuss <span className="accent-word">{service.title}</span>?
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose mx-auto">
            Tell us about your project and we will get back to you with a clear plan.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6">
            <Link to={`/contact?service=${encodeURIComponent(service.title)}`}>
              <Button variant="primary" size="lg">
                Start a Project
              </Button>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center text-sm font-medium text-[var(--text-primary)] hover:text-[#0AE3DA] transition-colors py-2 px-1 gap-1.5 group"
            >
              <span>Contact Team</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
