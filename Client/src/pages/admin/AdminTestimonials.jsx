import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Star, CheckCircle, EyeOff } from 'lucide-react';

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllTestimonials();
      if (res.success) setTestimonials(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset({
      clientName: '',
      position: '',
      company: '',
      quote: '',
      rating: 5,
      isApproved: true,
      isSample: false,
      displayOrder: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    reset({
      clientName: item.clientName,
      position: item.position,
      company: item.company,
      quote: item.quote,
      rating: item.rating || 5,
      isApproved: item.isApproved !== undefined ? item.isApproved : true,
      isSample: item.isSample || false,
      displayOrder: item.displayOrder || 1,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        rating: parseInt(data.rating, 10) || 5,
        displayOrder: parseInt(data.displayOrder, 10) || 1,
      };

      if (editingItem) {
        await adminService.updateTestimonial(editingItem._id, payload);
      } else {
        await adminService.createTestimonial(payload);
      }

      setModalOpen(false);
      loadTestimonials();
    } catch (err) {
      alert(err.message || 'Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    try {
      await adminService.deleteTestimonial(deleteDialog.id);
      setDeleteDialog({ open: false, id: null, name: '' });
      loadTestimonials();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const columns = [
    {
      header: 'Client / Reviewer',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-white text-xs">{row.clientName}</div>
          <div className="text-[11px] text-[#03A094]">{row.position}, {row.company}</div>
          {row.isSample && (
            <span className="inline-block text-[9px] uppercase font-bold text-amber-400">
              Demo Content
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Quote',
      render: (row) => (
        <p className="text-xs text-[#E5E7E7]/80 line-clamp-2 italic max-w-md">"{row.quote}"</p>
      ),
    },
    {
      header: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="text-xs font-bold">{row.rating} / 5</span>
        </div>
      ),
    },
    {
      header: 'Approval',
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 text-xs rounded-full font-bold ${
            row.isApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}
        >
          {row.isApproved ? 'Approved' : 'Hidden'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg bg-[#06161B] border border-[#143542] text-[#E5E7E7]/80 hover:text-[#0AE3DA]"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteDialog({ open: true, id: row._id, name: row.clientName })}
            className="p-1.5 rounded-lg bg-[#06161B] border border-[#143542] text-[#E5E7E7]/80 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Client Testimonials</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Manage approved client endorsements displayed on the public homepage.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Add Testimonial
        </Button>
      </div>

      <DataTable columns={columns} data={testimonials} isLoading={loading} emptyMessage="No testimonials found." />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Client Name *</label>
            <input
              type="text"
              required
              {...register('clientName')}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Position</label>
              <input
                type="text"
                required
                {...register('position')}
                placeholder="Chief Product Officer"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Company</label>
              <input
                type="text"
                required
                {...register('company')}
                placeholder="Vanguard Dynamics"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Quote / Review *</label>
            <textarea
              rows={4}
              required
              {...register('quote')}
              placeholder="Their engineering team delivered our project with exceptional quality..."
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Star Rating (1-5)</label>
              <select
                {...register('rating')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Display Order</label>
              <input
                type="number"
                {...register('displayOrder')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input type="checkbox" {...register('isApproved')} className="accent-[#0AE3DA]" />
              <span>Approved (Live)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input type="checkbox" {...register('isSample')} className="accent-[#0AE3DA]" />
              <span>Mark as Demo/Sample</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143542]">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Save Testimonial
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message={`Are you sure you want to delete testimonial by "${deleteDialog.name}"?`}
      />
    </div>
  );
};

export default AdminTestimonials;

