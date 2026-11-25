import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { Button } from '../../components/common/Button';
import { useCountUp } from '../../hooks/useCountUp';
import { siteStatsConfig } from '../../config/siteStats';
import {
  Globe,
  Smartphone,
  Palette,
  FileText,
  Video,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronDown,
  Layers,
  Users,
  MessageSquare,
  Terminal,
  ShieldCheck,
  Activity,
  Lock,
} from 'lucide-react';

const iconMap = {
  Globe,
  Smartphone,
  Palette,
  FileText,
  Video,
  Cpu,
};

// Agency core capabilities based strictly on existing site content
const DEFAULT_SERVICES = [
  {
    _id: 'def-web',
    title: 'Website Development',
    slug: 'website-development',
    icon: 'Globe',
    shortDescription: 'Custom responsive web applications built for performance and speed.',
  },
  {
    _id: 'def-mobile',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: 'Smartphone',
    shortDescription: 'Cross-platform mobile applications for iOS and Android.',
  },
  {
    _id: 'def-uiux',
    title: 'UI/UX & Design Systems',
    slug: 'ui-ux-design',
    icon: 'Palette',
    shortDescription: 'Intuitive digital interface design and interactive prototypes.',
  },
  {
    _id: 'def-custom',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    icon: 'Cpu',
    shortDescription: 'APIs, databases, and custom software for business workflows.',
  },
  {
    _id: 'def-content',
    title: 'Content Strategy',
    slug: 'content-writing',
    icon: 'FileText',
    shortDescription: 'Clear technical documentation and digital brand messaging.',
  },
  {
    _id: 'def-video',
    title: 'Video & Motion Graphics',
    slug: 'video-editing',
    icon: 'Video',
    shortDescription: 'Product walkthroughs, interface animations, and digital video assets.',
  },
];

// Approved minimal FAQ entries (generic and true)
const FAQ_ITEMS = [
  {
    question: 'What do you build?',
    answer:
      'We build websites, web applications, and custom software tailored to your business needs.',
  },
  {
    question: 'How do we get started?',
    answer:
      'Reach out through our contact form. We will arrange a short discussion about your project goals and scope.',
  },
  {
    question: 'How long does a project take?',
    answer:
      'Project timelines depend on the scope. We share a clear milestone schedule before work begins.',
  },
  {
    question: 'Do you offer support after launch?',
    answer:
      'Yes, we can discuss maintenance and support based on your needs.',
  },
];

// Lightweight scroll reveal hook
const useInView = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// Calm static stat component with gentle count-up
const StatItem = ({ number, label }) => {
  const [ref, inView] = useInView();
  const count = useCountUp(number, 1000, inView);

  return (
    <div ref={ref} className="space-y-1">
      <div className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
        {count}
      </div>
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-sans">
        {label}
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchHomeData = async () => {
      try {
        const [servicesRes, testimonialsRes, blogsRes, portfolioRes] = await Promise.all([
          publicService.getServices(),
          publicService.getTestimonials(),
          publicService.getBlogPosts({ limit: 3 }),
          publicService.getPortfolio({ limit: 4 }),
        ]);

        if (cancelled) return;

        if (servicesRes.success) setServices(servicesRes.data || []);
        if (testimonialsRes.success) setTestimonials(testimonialsRes.data || []);
        if (blogsRes.success) setLatestBlogs(blogsRes.data || []);
        if (portfolioRes.success) setPortfolio(portfolioRes.data || []);
      } catch (err) {
        console.error('Home data fetch error:', err);
      }
    };

    fetchHomeData();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayServices = React.useMemo(() => {
    if (!services || services.length === 0) return DEFAULT_SERVICES;
    const existingSlugs = new Set(services.map((s) => s.slug));
    const supplemental = DEFAULT_SERVICES.filter((d) => !existingSlugs.has(d.slug));
    return [...services, ...supplemental].slice(0, 6);
  }, [services]);

  // Strictly dynamic portfolio (at most 3 cards on homepage with View All Projects link)
  const displayPortfolio = React.useMemo(() => {
    if (portfolio && portfolio.length > 0) return portfolio.slice(0, 3);
    return [];
  }, [portfolio]);

  // Strictly dynamic testimonials (no fake hardcoded reviews)
  const displayTestimonials = React.useMemo(() => {
    if (testimonials && testimonials.length > 0) return testimonials;
    return [];
  }, [testimonials]);

  // Strictly dynamic blogs (empty if no DB records)
  const displayBlogs = React.useMemo(() => {
    if (latestBlogs && latestBlogs.length > 0) return latestBlogs.slice(0, 3);
    return [];
  }, [latestBlogs]);

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      {/* ─── 1. SOBER, MINIMAL, EDITORIAL HERO ─── */}
      <section className="pt-6 pb-12 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            {/* Left Column: Headline & Action Links */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 animate-fade-up">
              {/* Engineering Focus Micro-Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 rounded-full text-[11px] sm:text-xs font-mono tracking-wider uppercase bg-[#08181F] text-[#0AE3DA] border border-[#143542]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0AE3DA] animate-pulse"></span>
                Digital Engineering & Product Studio
              </div>

              {/* Headline with serif and plain italic accent */}
              <h1 className="editorial-title text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal text-[var(--text-primary)] leading-[1.1] sm:leading-[1.08]">
                Build <span className="accent-word">better</span>.<br />
                Grow <span className="accent-word">faster</span>.
              </h1>

              {/* Concise single sentence paragraph */}
              <p className="text-sm sm:text-base lg:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl">
                We engineer reliable web platforms, applications, and custom software that help modern businesses scale efficiently.
              </p>

              {/* Buttons: Solid Primary + Text Link */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 sm:pt-2">
                <Link to="/contact">
                  <Button variant="primary" size="lg">
                    Start a Project
                  </Button>
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center text-sm font-medium text-[var(--text-primary)] hover:text-[#0AE3DA] transition-colors py-2 px-1 gap-1.5 group"
                >
                  <span>View Work</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Sleek Digital Product & Architecture Showcase */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-xl sm:rounded-2xl bg-[#08181F] border border-[#143542] shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden">
                {/* Subtle turquoise top ambient glow bar */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#0AE3DA] to-transparent opacity-80" />

                {/* Browser / Shell Header */}
                <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#06161B] border-b border-[#143542] flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#E5484D]/70" />
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FFB224]/70" />
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#0AE3DA]/70" />
                  </div>
                  <div className="flex-1 max-w-[200px] sm:max-w-[240px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#040E12] border border-[#143542] flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)] truncate">
                    <Lock className="w-3 h-3 text-[#0AE3DA] shrink-0" />
                    <span className="truncate">cydexdigital.com/platform</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0AE3DA] animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#0AE3DA] hidden sm:inline">Active</span>
                  </div>
                </div>

                {/* Showcase Body */}
                <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 bg-[#08181F]">
                  {/* Status & Latency row */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#143542] text-xs">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Activity className="w-3.5 h-3.5 text-[#0AE3DA] shrink-0" />
                      <span className="font-mono text-[11px] sm:text-xs text-[var(--text-secondary)]">Edge Gateway</span>
                    </div>
                    <span className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-[rgba(10,227,218,0.1)] text-[#0AE3DA] border border-[rgba(10,227,218,0.2)] shrink-0">
                      24ms · 99.99% Uptime
                    </span>
                  </div>

                  {/* Architecture Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="p-2.5 sm:p-3 rounded-lg bg-[#040E12] border border-[#143542]">
                      <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono">Architecture</div>
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-1 truncate">Full-Stack Cloud</div>
                      <div className="text-[10px] text-[#0AE3DA] mt-0.5">High Scalability</div>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-lg bg-[#040E12] border border-[#143542]">
                      <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono">Security</div>
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-1 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0AE3DA] shrink-0" />
                        <span className="truncate">OWASP AA+</span>
                      </div>
                      <div className="text-[10px] text-[#0AE3DA] mt-0.5">Hardened Headers</div>
                    </div>
                  </div>

                  {/* Code / Workflow Preview Card */}
                  <div className="rounded-lg bg-[#040E12] border border-[#143542] p-3 sm:p-3.5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[var(--text-muted)] pb-2 mb-2 border-b border-[#143542]">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-[#0AE3DA]" />
                        <span>deploy.pipeline.ts</span>
                      </div>
                      <span className="text-[10px] text-[#0AE3DA]">Ready</span>
                    </div>
                    <p className="text-[var(--text-muted)]">
                      <span className="text-[#0AE3DA]">const</span> pipeline = <span className="text-[#0AE3DA]">await</span> cydex.<span className="text-[var(--text-primary)] font-medium">build</span>({'{'}
                    </p>
                    <p className="text-[var(--text-muted)] pl-4">
                      performance: <span className="text-[#0AE3DA]">'100/100'</span>,
                    </p>
                    <p className="text-[var(--text-muted)] pl-4">
                      uptimeSLA: <span className="text-[#0AE3DA]">'99.98%'</span>
                    </p>
                    <p className="text-[var(--text-muted)]">{'}'});</p>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-1.5">
                    {['React 19', 'Node.js', 'MongoDB Atlas', 'Tailwind CSS', 'Vite'].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-[var(--text-secondary)] bg-[#040E12] border border-[#143542]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calm, static stats row beneath (configured via siteStatsConfig) */}
          {siteStatsConfig.showStats && siteStatsConfig.stats?.length > 0 && (
            <div className="mt-10 sm:mt-16 lg:mt-24 pt-6 sm:pt-10 border-t border-[var(--border-color)] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {siteStatsConfig.stats.map((item) => (
                <StatItem key={item.id || item.label} number={item.number} label={item.label} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 2. ABOUT SECTION: ENGINEERING WITH PURPOSE ─── */}
      <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8 sm:mb-14 text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-2 sm:mb-3">
              // About
            </div>
            <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
              Engineering with <span className="accent-word">purpose</span>.
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2.5 sm:mt-3 max-w-prose leading-relaxed">
              CYDEX DIGITAL builds dependable software and digital experiences. We focus on clean architecture, transparent communication, and long-term maintainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="studio-card p-5 sm:p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">Clean Architecture</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Maintainable, modular code built for stability and future expansion.
                </p>
              </div>
            </div>

            <div className="studio-card p-5 sm:p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">Direct Collaboration</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Work directly with the engineers designing and building your product.
                </p>
              </div>
            </div>

            <div className="studio-card p-5 sm:p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">Clear Communication</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Regular updates and honest timelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. SERVICES SECTION: CAPABILITIES ─── */}
      <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-4 sm:gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-2 sm:mb-3">
                // Capabilities
              </div>
              <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
                Services & <span className="accent-word">Offerings</span>.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-md leading-relaxed">
              We provide focused full-stack software development and UI/UX design services tailored to your technical requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayServices.map((service) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <div
                  key={service._id}
                  className="studio-card p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-1.5">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-color)] mt-5">
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

      {/* ─── 4. SELECTED WORK (Rendered ONLY when real projects exist in DB) ─── */}
      {displayPortfolio.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-4 sm:gap-6">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-2 sm:mb-3">
                  // Selected Work
                </div>
                <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
                  Case studies & <span className="accent-word">digital platforms</span>.
                </h2>
              </div>
              <Link to="/portfolio">
                <Button variant="secondary" size="sm">
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayPortfolio.map((item) => (
                <div
                  key={item._id}
                  className="studio-card overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {item.coverImage && (
                      <div className="aspect-[16/10] w-full bg-[var(--bg-color)] border-b border-[var(--border-color)] overflow-hidden">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 sm:p-6 space-y-2.5 sm:space-y-3">
                      <div className="text-xs uppercase tracking-wider text-[#0AE3DA] font-mono">
                        {item.category || 'Case Study'}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        {item.shortDescription || item.summary || item.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-[var(--border-color)] mt-4 pt-4">
                    <Link
                      to={`/portfolio/${item.slug || item._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0AE3DA] hover:text-[var(--text-primary)] uppercase tracking-wider transition-colors"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 5. TESTIMONIALS (Rendered ONLY when real reviews exist in DB) ─── */}
      {displayTestimonials.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8 sm:mb-14 text-left">
              <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-2 sm:mb-3">
                // Client Feedback
              </div>
              <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
                Feedback from <span className="accent-word">clients</span>.
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2.5 sm:mt-3 max-w-prose leading-relaxed">
                What founders and product leaders say about collaborating with our engineering team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {displayTestimonials.map((t) => (
                <div
                  key={t._id}
                  className="studio-card p-5 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-6"
                >
                  <p className="text-sm text-[var(--text-primary)] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="pt-4 border-t border-[var(--border-color)]">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">{t.clientName}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{t.position}, {t.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. FAQ SECTION: CLEAN, GENERIC & TRUE ─── */}
      <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8 sm:mb-14 text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-2 sm:mb-3">
              // FAQ
            </div>
            <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
              Frequently Asked <span className="accent-word">Questions</span>.
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2.5 sm:mt-3 max-w-prose leading-relaxed">
              Clear answers to common questions about our technical process, timelines, and delivery.
            </p>
          </div>

          <div className="max-w-3xl space-y-3 sm:space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="studio-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0AE3DA]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-[var(--border-color)] mt-2 pt-4">
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. LATEST BLOG POSTS (Dynamic, rendered only when real articles exist) ─── */}
      {displayBlogs.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-4 sm:gap-6">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-2 sm:mb-3">
                  // Insights
                </div>
                <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
                  Latest engineering & <span className="accent-word">design insights</span>.
                </h2>
              </div>
              <Link to="/blog">
                <Button variant="secondary" size="sm">
                  <span>View All Articles</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {displayBlogs.map((post) => (
                <div
                  key={post._id}
                  className="studio-card overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {post.coverImage && (
                      <div className="aspect-video w-full overflow-hidden bg-[var(--bg-color)] border-b border-[var(--border-color)]">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 sm:p-6 space-y-2.5 sm:space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0 border-t border-[var(--border-color)] mt-4 pt-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-[#0AE3DA] hover:text-[var(--text-primary)] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 8. FINAL MINIMAL CONVERSION CTA ─── */}
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

export default HomePage;
