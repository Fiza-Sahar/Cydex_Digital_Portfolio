import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const TermsPage = () => {
  useEffect(() => {
    document.title = 'Terms of Service | CYDEX DIGITAL';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-[var(--text-muted)] text-sm leading-relaxed">
      <div className="studio-card rounded-2xl p-6 sm:p-10 space-y-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">Terms of Service</h1>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">CYDEX DIGITAL — Last updated: October 2026</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">1. Services & Engagement</h2>
          <p>
            CYDEX DIGITAL provides custom technology engineering, web application development, mobile software, and interface design under formal project scopes and agreed milestone deliverables.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">2. Intellectual Property</h2>
          <p>
            Deliverables, codebases, and custom project assets are transferred in accordance with the terms established in the individual client agreement upon fulfillment of agreed milestone payments.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">3. Account & Portal Use</h2>
          <p>
            Authorized clients receive access credentials to monitor project milestones and deliverables. Users are responsible for maintaining the confidentiality of their credentials.
          </p>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)]">
          <Link to="/contact">
            <Button variant="outline" size="sm">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
