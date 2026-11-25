import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Plus, Edit2, Trash2, Globe, Smartphone, Palette, FileText, Video, Cpu } from 'lucide-react';

const iconOptions = ['Globe', 'Smartphone', 'Palette', 'FileText', 'Video', 'Cpu'];

export const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });
  const [editingService, setEditingService] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllServices();
      if (res.success) setServices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    reset({
      title: '',
      slug: '',
      icon: 'Globe',
      displayOrder: services.length + 1,
      shortDescription: '',
      heroDescription: '',
      benefits: '',
      deliverables: '',
      features: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    reset({
      title: srv.title,
      slug: srv.slug,
      icon: srv.icon || 'Globe',
      displayOrder: srv.displayOrder || 1,
      shortDescription: srv.shortDescription,
      heroDescription: srv.heroDescription,
      benefits: srv.benefits?.join('\n') || '',
      deliverables: srv.deliverables?.join('\n') || '',
      features: srv.features?.join('\n') || '',
      isPublished: srv.isPublished !== undefined ? srv.isPublished : true,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        displayOrder: parseInt(data.displayOrder, 10) || 1,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        benefits: data.benefits ? data.benefits.split('\n').map((s) => s.trim()).filter(Boolean) : [],
        deliverables: data.deliverables ? data.deliverables.split('\n').map((s) => s.trim()).filter(Boolean) : [],
        features: data.features ? data.features.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      };

      if (editingService) {
        await adminService.updateService(editingService._id, payload);
      } else {
        await adminService.createService(payload);
      }

      setModalOpen(false);
      loadServices();
    } catch (err) {
      alert(err.message || 'Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    try {
      await adminService.deleteService(deleteDialog.id);
      setDeleteDialog({ open: false, id: null, title: '' });
      loadServices();
    } catch (err) {
      alert(err.message || 'Failed to delete service');
    }
  };

  const columns = [
    {
      header: 'Order',
      accessor: 'displayOrder',
      className: 'w-16 font-mono font-bold text-[#0AE3DA]',
    },
    {
      header: 'Service Name',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-white text-sm">{row.title}</div>
          <span className="text-[11px] font-mono text-[#03A094]">/services/{row.slug}</span>
        </div>
      ),
    },
    {
      header: 'Icon',
      render: (row) => (
        <span className="text-xs px-2.5 py-1 rounded bg-[#06161B] border border-[#143542] text-[#0AE3DA]">
          {row.icon || 'Globe'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.isPublished ? 'published' : 'draft'} size="sm" />
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
            onClick={() => setDeleteDialog({ open: true, id: row._id, title: row.title })}
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
          <h1 className="text-2xl font-bold text-white font-display">Services Management</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Configure agency core services, deliverables, display ordering, and public visibility.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Add New Service
        </Button>
      </div>

      <DataTable columns={columns} data={services} isLoading={loading} emptyMessage="No services found." />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Service Title *</label>
              <input
                type="text"
                required
                {...register('title')}
                placeholder="e.g. Website Development"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Display Order *</label>
              <input
                type="number"
                required
                {...register('displayOrder')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">URL Slug</label>
              <input
                type="text"
                {...register('slug')}
                placeholder="website-development"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Icon *</label>
              <select
                {...register('icon')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                {iconOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Short Description (for cards) *</label>
            <textarea
              rows={2}
              required
              {...register('shortDescription')}
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Hero Description (for detail page) *</label>
            <textarea
              rows={3}
              required
              {...register('heroDescription')}
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Benefits (one per line)</label>
              <textarea
                rows={3}
                {...register('benefits')}
                placeholder="Fast speed&#10;High conversion"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Deliverables (one per line)</label>
              <textarea
                rows={3}
                {...register('deliverables')}
                placeholder="Figma Specs&#10;Production Code"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Features (one per line)</label>
              <textarea
                rows={3}
                {...register('features')}
                placeholder="Tailwind Styling&#10;MERN Stack"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="srvPublished" {...register('isPublished')} className="accent-[#0AE3DA]" />
            <label htmlFor="srvPublished" className="text-xs text-white cursor-pointer font-medium">
              Published on Public Website
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#143542]">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              {editingService ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteDialog.title}"?`}
      />
    </div>
  );
};

export default AdminServices;

