    import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { Button } from '../../components/common/Button';
import {
  Globe,
  Smartphone,
  Palette,
  FileText,
  Video,
  Cpu,
  ArrowRight,
  CheckCircle2,
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
    features: ['Custom Frontend Architecture', 'SEO & Performance Optimized', 'Responsive Across All Viewports'],
  },
  {
    _id: 'def-mobile',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: 'Smartphone',
    shortDescription: 'Cross-platform mobile applications for iOS and Android.',
    features: ['Native-Feel UI/UX Design', 'Offline-First Capabilities', 'App Store Deployment & CI/CD'],
  },
  {
    _id: 'def-uiux',
    title: 'UI/UX & Design Systems',
    slug: 'ui-ux-design',
    icon: 'Palette',
    shortDescription: 'Intuitive digital interface design and interactive prototypes.',
    features: ['Design Systems & Component Tokens', 'Interactive Clickable Prototypes', 'User Journey & UX Research'],
  },
  {
    _id: 'def-custom',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    icon: 'Cpu',
    shortDescription: 'APIs, databases, and custom software for business workflows.',
    features: ['Scalable Architecture', 'Automated Test Pipelines', 'Role-Based Access Control'],
  },
  {
    _id: 'def-content',
    title: 'Content Strategy',
    slug: 'content-writing',
    icon: 'FileText',
    shortDescription: 'Clear technical documentation and digital brand messaging.',
    features: ['Technical Documentation', 'SEO Content Strategy', 'Copywriting'],
  },
  {
    _id: 'def-video',
    title: 'Video & Motion Graphics',
    slug: 'video-editing',
    icon: 'Video',
    shortDescription: 'Product walkthroughs, interface animations, and digital video assets.',
    features: ['Product Demos', 'UI Micro-Animations', 'Brand Motion Collateral'],
  },
];

export const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    document.title = 'Services — CYDEX DIGITAL';
    publicService
      .getServices()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const displayServices = React.useMemo(() => {
    if (!services || services.length === 0) return DEFAULT_SERVICES;
    const existingSlugs = new Set(services.map((s) => s.slug));
    const supplemental = DEFAULT_SERVICES.filter((d) => !existingSlugs.has(d.slug));
    return [...services, ...supplemental];
  }, [services]);

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      {/* 1. Header */}
      <section className="pt-7 pb-12 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6 animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA]">
              // Capabilities
            </div>
            <h1 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
              Services & <span className="accent-word">Offerings</span>.
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose">
              We provide focused full-stack software development and UI/UX design services tailored to your technical requirements.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Services Grid */}
      <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayServices.map((service) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <div
                  key={service._id}
                  className="studio-card p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div className="space-y-4 sm:space-y-5">
                    <div className="w-12 h-12 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mt-2.5">
                        {service.shortDescription}
                      </p>
                    </div>

                    {service.features && service.features.length > 0 && (
                      <ul className="pt-4 space-y-2 border-t border-[var(--border-color)]">
                        {service.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#03A094] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-5 sm:pt-6 border-t border-[var(--border-color)] mt-5 sm:mt-6">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center text-xs font-medium text-[#0AE3DA] hover:text-[var(--text-primary)] uppercase tracking-wider gap-1.5 transition-colors"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Final CTA */}
      <section className="py-14 sm:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
          <h2 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
            Ready to start your <span className="accent-word">project</span>?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose mx-auto">
            Tell us about your project and we will get back to you with a clear plan.
          </p>
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/contact">
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

export default ServicesPage;
