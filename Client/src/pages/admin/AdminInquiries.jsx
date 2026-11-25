import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Inbox,
  Search,
  Eye,
  CheckCircle,
  FileText,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Send,
  ArrowRight,
  FolderPlus,
} from 'lucide-react';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'];

export const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllInquiries({
        status: statusFilter,
        search,
        page: currentPage,
        limit: 15,
      });
      if (res.success) {
        setInquiries(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter, currentPage]);

  const handleOpenDetail = async (inq) => {
    try {
      const res = await adminService.getInquiryById(inq._id);
      if (res.success && res.data) {
        setSelectedInquiry(res.data);
      } else {
        setSelectedInquiry(inq);
      }
    } catch (e) {
      setSelectedInquiry(inq);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedInquiry) return;
    setIsUpdatingStatus(true);
    try {
      const res = await adminService.updateInquiryStatus(selectedInquiry._id, { status: newStatus });
      if (res.success) {
        setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        loadInquiries();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !selectedInquiry) return;
    setIsAddingNote(true);
    try {
      const res = await adminService.addInquiryNote(selectedInquiry._id, noteInput.trim());
      if (res.success) {
        setSelectedInquiry((prev) => ({
          ...prev,
          internalNotes: res.data,
        }));
        setNoteInput('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleResendEmail = async () => {
    if (!selectedInquiry) return;
    setIsResending(true);
    setResendStatus(null);
    try {
      const res = await adminService.resendInquiryEmail(selectedInquiry._id);
      if (res.success) {
        setSelectedInquiry((prev) => ({
          ...prev,
          emailNotification: res.data || prev.emailNotification,
        }));
        setResendStatus({ success: true, message: res.message });
      } else {
        setResendStatus({ success: false, message: res.message || 'Dispatch failed' });
      }
    } catch (err) {
      setResendStatus({ success: false, message: err.message || 'Dispatch failed' });
    } finally {
      setIsResending(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedInquiry) return;
    if (!confirm('Convert this inquiry into an active client project?')) return;
    setIsConverting(true);
    try {
      const res = await adminService.convertInquiryToProject(selectedInquiry._id);
      if (res.success) {
        alert(`Success! Client project created with reference ${res.data.projectReference}`);
        setSelectedInquiry((prev) => ({ ...prev, status: 'Converted' }));
        loadInquiries();
      }
    } catch (err) {
      alert(err.message || 'Conversion failed. Make sure the client has registered an account with this email.');
    } finally {
      setIsConverting(false);
    }
  };

  const columns = [
    {
      header: 'Reference ID',
      render: (row) => <span className="font-mono text-xs font-bold text-[#0AE3DA]">{row.referenceId}</span>,
    },
    {
      header: 'Client / Contact',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-white text-xs">{row.name}</div>
          <div className="text-[11px] text-[#E5E7E7]/60 truncate">{row.email}</div>
          {row.company && <div className="text-[10px] text-[#03A094]">{row.company}</div>}
        </div>
      ),
    },
    {
      header: 'Project Title',
      render: (row) => (
        <div className="space-y-0.5 max-w-xs">
          <div className="font-semibold text-white text-xs truncate">{row.projectTitle}</div>
          <div className="text-[11px] text-[#0AE3DA]">{row.service}</div>
        </div>
      ),
    },
    {
      header: 'Budget',
      render: (row) => <span className="text-xs text-[#E5E7E7]/80">{row.budgetRange || 'Flexible'}</span>,
    },
    {
      header: 'Date',
      render: (row) => (
        <span className="text-xs text-[#E5E7E7]/60">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <Button variant="secondary" size="sm" icon={Eye} onClick={() => handleOpenDetail(row)}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Inquiry & Lead Management (CRM)</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Review incoming project briefs, manage qualification stages, add internal notes, and convert leads into client projects.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'cydex-gradient text-[#06161B]'
                  : 'bg-[#0c222a] border border-[#143542] text-[#E5E7E7]/70 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadInquiries()}
            placeholder="Search reference, client, email..."
            className="w-full bg-[#0c222a] border border-[#143542] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#E5E7E7]/40 focus:outline-none focus:border-[#0AE3DA]"
          />
          <Search className="w-4 h-4 text-[#E5E7E7]/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Inquiries Table */}
      <DataTable
        columns={columns}
        data={inquiries}
        isLoading={loading}
        emptyMessage="No inquiries matching criteria."
        pagination={{
          currentPage,
          totalPages,
          total: totalCount,
        }}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Detail / CRM Drawer Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title={`Inquiry: ${selectedInquiry.referenceId}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Top Bar Status Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#06161B] border border-[#143542]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#E5E7E7]/70">Pipeline Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="bg-[#0c222a] border border-[#143542] rounded-xl px-3 py-1 text-xs font-bold text-[#0AE3DA] focus:outline-none focus:border-[#0AE3DA]"
                >
                  {STATUS_OPTIONS.filter((s) => s !== 'All').map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {selectedInquiry.status !== 'Converted' && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={FolderPlus}
                  isLoading={isConverting}
                  onClick={handleConvert}
                >
                  Convert to Client Project
                </Button>
              )}
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#06161B]/60 border border-[#143542] text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <User className="w-4 h-4 text-[#0AE3DA]" />
                  <span>{selectedInquiry.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#E5E7E7]/70">
                  <Mail className="w-4 h-4 text-[#03A094]" />
                  <a href={`mailto:${selectedInquiry.email}`} className="hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2 text-[#E5E7E7]/70">
                    <Phone className="w-4 h-4 text-[#03A094]" />
                    <span>{selectedInquiry.phone}</span>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div className="flex items-center gap-2 text-[#E5E7E7]/70">
                    <Building2 className="w-4 h-4 text-[#03A094]" />
                    <span>{selectedInquiry.company}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-[#143542] pt-3 sm:pt-0 sm:pl-4">
                <div>
                  <span className="text-[#E5E7E7]/50 block">Requested Service:</span>
                  <span className="text-white font-bold">{selectedInquiry.service}</span>
                </div>
                <div>
                  <span className="text-[#E5E7E7]/50 block">Budget & Timeline:</span>
                  <span className="text-[#0AE3DA] font-semibold">
                    {selectedInquiry.budgetRange} • {selectedInquiry.timeline}
                  </span>
                </div>
                <div>
                  <span className="text-[#E5E7E7]/50 block">Preferred Contact:</span>
                  <span className="text-white">{selectedInquiry.preferredContactMethod || 'Email'}</span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0AE3DA]">Project Requirements</h4>
              <h3 className="text-sm font-bold text-white font-display">{selectedInquiry.projectTitle}</h3>
              <p className="text-xs text-[#E5E7E7]/90 leading-relaxed bg-[#06161B] p-4 rounded-xl border border-[#143542] whitespace-pre-line">
                {selectedInquiry.details}
              </p>
            </div>

            {/* Email Notification Dispatch Status */}
            <div className="p-4 rounded-2xl bg-[#06161B] border border-[#143542] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0AE3DA]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Gmail Notification Dispatch
                  </span>
                </div>
                {selectedInquiry.emailNotification?.status === 'sent' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" title="Accepted by Gmail SMTP relay for dispatch (inbox delivery subject to recipient mailbox)">
                    Dispatched (SMTP Accepted)
                  </span>
                )}
                {selectedInquiry.emailNotification?.status === 'skipped' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Skipped (Credentials Needed)
                  </span>
                )}
                {selectedInquiry.emailNotification?.status === 'failed' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                    Delivery Failed
                  </span>
                )}
                {(!selectedInquiry.emailNotification?.status || selectedInquiry.emailNotification?.status === 'pending') && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/30">
                    Pending / Not Dispatched
                  </span>
                )}
              </div>

              <div className="text-xs text-[#E5E7E7]/70 space-y-1 font-mono">
                <div>Recipient: <span className="text-white">{selectedInquiry.emailNotification?.recipient || 'cydexdigital@gmail.com'}</span></div>
                {selectedInquiry.emailNotification?.messageId && (
                  <div className="truncate">Message ID: <span className="text-[#0AE3DA]">{selectedInquiry.emailNotification.messageId}</span></div>
                )}
                {selectedInquiry.emailNotification?.error && (
                  <div className="text-amber-400/90 font-sans text-xs pt-1">
                    Diagnostics: {selectedInquiry.emailNotification.error}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#143542]">
                <span className="text-[11px] text-[#E5E7E7]/50">
                  Attempts: {selectedInquiry.emailNotification?.attempts || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isResending}
                  onClick={handleResendEmail}
                  className="text-xs"
                >
                  Trigger / Resend Email
                </Button>
              </div>

              {resendStatus && (
                <div className={`p-2 rounded text-xs ${resendStatus.success ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                  {resendStatus.message}
                </div>
              )}
            </div>

            {/* Internal Staff Notes (Never exposed to client) */}
            <div className="space-y-4 pt-4 border-t border-[#143542]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#03A094]">
                  Internal CRM Staff Notes (Private)
                </h4>
                <span className="text-[10px] text-[#E5E7E7]/50">Hidden from client view</span>
              </div>

              {/* Notes list */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {selectedInquiry.internalNotes && selectedInquiry.internalNotes.length > 0 ? (
                  selectedInquiry.internalNotes.map((n, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#06161B] border border-[#143542] text-xs space-y-1">
                      <p className="text-white">{n.note}</p>
                      <span className="text-[10px] text-[#03A094] block">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#E5E7E7]/50">No internal notes recorded yet.</p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Record an internal qualification note..."
                  className="flex-1 bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
                />
                <Button type="submit" variant="secondary" size="sm" isLoading={isAddingNote}>
                  Add Note
                </Button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminInquiries;

