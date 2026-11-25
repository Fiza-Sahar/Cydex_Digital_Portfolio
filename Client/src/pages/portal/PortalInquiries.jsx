import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { portalService } from '../../services/portalService';
import { publicService } from '../../services/publicService';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FileQuestion, Plus, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const newInquirySchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  projectTitle: z.string().min(3, 'Title must be at least 3 characters'),
  details: z.string().min(10, 'Please provide more details'),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
});

const SERVICES = [
  'Website Development',
  'Mobile App Development',
  'UI/UX and Graphic Design',
  'Content Writing',
  'Video Editing',
  'Custom Software Development',
];

export const PortalInquiries = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newInquirySchema),
    defaultValues: {
      service: 'Website Development',
      budgetRange: '$5,000 - $10,000',
      timeline: '1 - 2 Months',
    },
  });

  const loadInquiries = () => {
    setLoading(true);
    portalService
      .getMyInquiries()
      .then((res) => {
        if (res.success) setInquiries(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const payload = {
        ...data,
        name: user.name,
        email: user.email,
        company: user.company || '',
        phone: user.phone || '',
        preferredContactMethod: 'Email',
        privacyConsent: true,
      };

      const res = await publicService.submitInquiry(payload);
      if (res.success) {
        setModalOpen(false);
        reset();
        loadInquiries();
      }
    } catch (err) {
      setServerError(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your project inquiries..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Project Inquiries</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Review status updates and submitted briefs for all your custom project proposals.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
          New Inquiry
        </Button>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-16 text-center space-y-4">
          <FileQuestion className="w-12 h-12 text-[#0AE3DA] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">No Inquiries Found</h3>
          <p className="text-xs text-[#E5E7E7]/60 max-w-sm mx-auto">
            Ready to initiate a new project or milestone? Submit an inquiry to receive a detailed technical proposal.
          </p>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            Submit Inquiry Now
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-7 space-y-4 shadow-lg hover:border-[#0AE3DA]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0AE3DA]">{inq.referenceId}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#06161B] text-[#03A094] font-medium border border-[#143542]">
                      {inq.service}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">{inq.projectTitle}</h3>
                </div>
                <StatusBadge status={inq.status} size="sm" />
              </div>

              <p className="text-xs text-[#E5E7E7]/80 leading-relaxed bg-[#06161B]/60 p-4 rounded-2xl border border-[#143542]/50">
                {inq.details}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#E5E7E7]/60 pt-2 border-t border-[#143542]/40">
                <div className="flex items-center gap-6">
                  <span>Budget: <strong className="text-white">{inq.budgetRange}</strong></span>
                  <span>Timeline: <strong className="text-white">{inq.timeline}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-[#03A094]" />
                  <span>Submitted {new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Inquiry Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit New Project Inquiry">
        {serverError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Requested Service</label>
            <select
              {...register('service')}
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            >
              {SERVICES.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Project Title</label>
            <input
              type="text"
              {...register('projectTitle')}
              placeholder="e.g. Next-Gen Mobile App Feature"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
            />
            {errors.projectTitle && <p className="text-[11px] text-red-400">{errors.projectTitle.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Budget Range</label>
              <select
                {...register('budgetRange')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                <option value="Under $5,000">Under $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                <option value="$25,000+">$25,000+</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Timeline</label>
              <select
                {...register('timeline')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                <option value="Immediate">Immediate (&lt; 2 weeks)</option>
                <option value="1 - 2 Months">1 - 2 Months</option>
                <option value="2 - 4 Months">2 - 4 Months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Project Details</label>
            <textarea
              rows={4}
              {...register('details')}
              placeholder="Describe your requirements, goals, and any relevant technical links..."
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
            />
            {errors.details && <p className="text-[11px] text-red-400">{errors.details.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143542]">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Submit Inquiry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PortalInquiries;

