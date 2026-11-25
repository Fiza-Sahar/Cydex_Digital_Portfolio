import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const PrivacyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | CYDEX DIGITAL';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-[var(--text-muted)] text-sm leading-relaxed">
      <div className="studio-card rounded-2xl p-6 sm:p-10 space-y-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">Privacy Policy</h1>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">CYDEX DIGITAL — Last updated: October 2026</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">1. Information We Collect</h2>
          <p>
            CYDEX DIGITAL collects information that you provide directly to us when you submit an inquiry, register for a client account, or communicate regarding a project. This includes your name, business email address, phone number, company name, and project requirements.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">2. How We Use Your Information</h2>
          <p>
            We use your information solely to evaluate project requirements, respond to inquiries, deliver services, and maintain account security. We do not sell or share personal data with third-party advertisers.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">3. Data Security & Storage</h2>
          <p>
            Client account sessions use secure, HttpOnly authentication cookies. We implement rate limiting, server-side data validation, and role-based access controls to safeguard records and communications.
          </p>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)]">
          <Link to="/contact">
            <Button variant="outline" size="sm">Have Questions? Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
