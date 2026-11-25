import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { publicService } from '../../services/publicService';
import { Button } from '../../components/common/Button';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  budgetRange: z.string().optional(),
  message: z.string().min(10, 'Project details must be at least 10 characters'),
  website_hp: z.string().optional(), // Honeypot field for anti-spam
});

const SERVICES = [
  'Website Development',
  'Mobile App Development',
  'UI/UX & Design Systems',
  'Custom Software Development',
  'Content Strategy',
  'Video & Motion Graphics',
  'Other Inquiry',
];

const BUDGET_RANGES = [
  'Flexible / To be discussed',
  '< $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
];

export const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const { user, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [serverError, setServerError] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    document.title = 'Contact — CYDEX DIGITAL';
    publicService
      .getSettings()
      .then((res) => {
        if (res.success && res.data) setSettings(res.data);
      })
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: preselectedService || 'Website Development',
      budgetRange: 'Flexible / To be discussed',
      message: '',
      website_hp: '',
    },
  });

  // Prefill when logged in customer is loaded, while keeping fields editable
  useEffect(() => {
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (preselectedService) {
      setValue('service', preselectedService);
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data) => {
    // Honeypot spam check
    if (data.website_hp && data.website_hp.trim().length > 0) {
      console.warn('Bot detected via honeypot');
      setSubmissionSuccess({ referenceId: 'CYD-VERIFIED' });
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone ? data.phone.trim() : '',
        service: data.service || 'Website Development',
        budgetRange: data.budgetRange || 'Flexible / To be discussed',
        projectTitle: `${data.service || 'Project'} Inquiry — ${data.name.trim()}`,
        details: data.message.trim(),
        preferredContactMethod: 'Email',
        privacyConsent: true,
      };

      const res = await publicService.submitInquiry(payload);

      if (res.success) {
        setSubmissionSuccess(res.data || { referenceId: 'SUCCESS' });
        reset({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          service: 'Website Development',
          budgetRange: 'Flexible / To be discussed',
          message: '',
          website_hp: '',
        });
      } else {
        setServerError(res.message || 'Unable to submit your inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setServerError(
        err.response?.data?.message || 'Server error. Please email us directly at contact@cydexdigital.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      {/* 1. Header */}
      <section className="pt-7 pb-12 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6 animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA]">
              // Contact
            </div>
            <h1 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
              Start a <span className="accent-word">project</span>.
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose">
              Tell us about your technical goals. We will review your project and get back to you with a clear plan.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Form & Direct Contact Layout */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7">
              {submissionSuccess ? (
                <div className="studio-card p-6 sm:p-10 text-left space-y-4">
                  <div className="w-12 h-12 rounded-md bg-[#0AE3DA]/10 border border-[#0AE3DA] flex items-center justify-center text-[#0AE3DA]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
                    Message Received
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    Thank you for reaching out. We have logged your inquiry and our team will get back to you shortly.
                  </p>
                  {submissionSuccess.referenceId && (
                    <div className="text-xs text-[var(--text-muted)] font-mono pt-2">
                      Reference ID: <span className="text-[var(--text-primary)] font-semibold">{submissionSuccess.referenceId}</span>
                    </div>
                  )}
                  <div className="pt-4">
                    <Button variant="secondary" size="sm" onClick={() => setSubmissionSuccess(null)}>
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="studio-card p-5 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
                  {isAuthenticated && (
                    <div className="p-3.5 rounded-md bg-[#0AE3DA]/10 border border-[#0AE3DA]/30 flex items-center gap-2.5 text-xs text-[var(--text-primary)]">
                      <UserCheck className="w-4 h-4 text-[#0AE3DA] shrink-0" />
                      <span>
                        Signed in as <strong className="text-[#0AE3DA]">{user?.name || user?.email}</strong>. Your contact details have been prefilled below.
                      </span>
                    </div>
                  )}

                  {serverError && (
                    <div className="p-4 rounded-md bg-red-500/10 border border-red-500/30 text-xs text-red-500 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Honeypot anti-spam field (hidden from view) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register('website_hp')}
                    />
                  </div>

                  {/* Name & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Name field */}
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                        Your Name <span className="text-[#0AE3DA]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Jane Doe"
                        disabled={isSubmitting}
                        {...register('name')}
                        className={`w-full bg-[var(--bg-color)] border rounded-md px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#0AE3DA] ${
                          errors.name ? 'border-red-500' : 'border-[var(--border-color)]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                        Work Email <span className="text-[#0AE3DA]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="jane@company.com"
                        disabled={isSubmitting}
                        {...register('email')}
                        className={`w-full bg-[var(--bg-color)] border rounded-md px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#0AE3DA] ${
                          errors.email ? 'border-red-500' : 'border-[var(--border-color)]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone / WhatsApp field */}
                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Phone / WhatsApp <span className="text-[var(--text-muted)] font-normal text-[11px] lowercase">(optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+92 300 1234567 or +1 (555) 000-0000"
                      disabled={isSubmitting}
                      {...register('phone')}
                      className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#0AE3DA]"
                    />
                  </div>

                  {/* Service selection & Budget Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                        Service of Interest
                      </label>
                      <select
                        id="contact-service"
                        disabled={isSubmitting}
                        {...register('service')}
                        className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[#0AE3DA]"
                      >
                        {SERVICES.map((srv) => (
                          <option key={srv} value={srv}>
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-budget" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                        Estimated Budget
                      </label>
                      <select
                        id="contact-budget"
                        disabled={isSubmitting}
                        {...register('budgetRange')}
                        className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[#0AE3DA]"
                      >
                        {BUDGET_RANGES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Project Details <span className="text-[#0AE3DA]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us about what you want to build, existing systems, or key requirements."
                      disabled={isSubmitting}
                      {...register('message')}
                      className={`w-full bg-[var(--bg-color)] border rounded-md p-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#0AE3DA] ${
                        errors.message ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      <span>Submit Project Inquiry</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Direct Contact Info Sidebar */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <div className="studio-card p-5 sm:p-8 space-y-5 sm:space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Direct Contact
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                    Prefer direct communication? Reach out to our solutions team directly.
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#0AE3DA] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Email</div>
                      <a
                        href={`mailto:${settings?.contactEmail || 'cydexdigital@gmail.com'}`}
                        className="text-[var(--text-primary)] hover:text-[#0AE3DA] transition-colors font-medium break-all"
                      >
                        {settings?.contactEmail || 'cydexdigital@gmail.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#0AE3DA] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Phone</div>
                      <a
                        href={`tel:${settings?.contactPhone ? settings.contactPhone.replace(/\s+/g, '') : '+923162088436'}`}
                        className="text-[var(--text-primary)] hover:text-[#0AE3DA] transition-colors font-medium"
                      >
                        {settings?.contactPhone || '+92 3162088436'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#0AE3DA] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Location</div>
                      <div className="text-[var(--text-primary)]">
                        {settings?.contactAddress || 'Karachi, Pakistan (Serving Globally)'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working process note */}
              <div className="studio-card p-6 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                  What happens next?
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  We review your project requirements and arrange a short initial discussion to align on scope and technical feasibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
