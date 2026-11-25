import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Target, Compass, Layers, Users, MessageSquare, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  useEffect(() => {
    document.title = 'About — CYDEX DIGITAL';
  }, []);

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      {/* 1. Header */}
      <section className="pt-7 pb-12 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6 animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA]">
              // About
            </div>
            <h1 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
              Engineering with <span className="accent-word">purpose</span>.
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose">
              CYDEX DIGITAL is a technology agency dedicated to building dependable web applications,
              custom software platforms, and intuitive digital interfaces for modern businesses.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mission & Approach */}
      <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="studio-card p-6 sm:p-8 lg:p-10 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">Our Mission</h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                To transform innovative concepts into dependable, high-quality digital products that empower our clients to operate and scale with confidence.
              </p>
            </div>

            <div className="studio-card p-6 sm:p-8 lg:p-10 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">Our Approach</h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                We work closely with clients through clear milestones, honest timelines, and direct engineering collaboration from planning to final deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Principles */}
      <section className="py-12 sm:py-20 lg:py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8 sm:mb-14 text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA] mb-2 sm:mb-3">
              // Principles
            </div>
            <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
              How we <span className="accent-word">work</span>.
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2.5 sm:mt-3 max-w-prose leading-relaxed">
              Straightforward engineering values that guide every project we take on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="studio-card p-5 sm:p-6 space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Clean Architecture</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Maintainable, modular code built for stability and future expansion.
              </p>
            </div>

            <div className="studio-card p-5 sm:p-6 space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[#0AE3DA]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Direct Collaboration</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Work directly with the engineers designing and building your product.
              </p>
            </div>

            <div className="studio-card p-5 sm:p-6 space-y-2.5 sm:space-y-3">
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
      </section>

      {/* 4. Final CTA */}
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

export default AboutPage;
