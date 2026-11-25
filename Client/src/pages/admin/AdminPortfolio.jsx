import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Plus, Edit2, Trash2, Search, ExternalLink, Star } from 'lucide-react';

const CATEGORIES = ['Websites', 'Mobile Applications', 'UI/UX and Design', 'Custom Software', 'Other'];
const PROJECT_TYPES = ['Client Project', 'Concept / Demo', 'Internal Tool', 'Mobile Application'];

export const AdminPortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllPortfolioProjects({
        search,
        category: categoryFilter,
      });
      if (res.success) setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [categoryFilter]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    reset({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      coverImage: '',
      category: 'Websites',
      technologies: '',
      projectType: 'Concept / Demo',
      clientName: '',
      projectUrl: '',
      githubUrl: '',
      featured: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      coverImage: project.coverImage,
      category: project.category,
      technologies: project.technologies?.join(', ') || '',
      projectType: project.projectType || 'Concept / Demo',
      clientName: project.clientName || '',
      projectUrl: project.projectUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
      isPublished: project.isPublished !== undefined ? project.isPublished : true,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        technologies: data.technologies ? data.technologies.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      if (editingProject) {
        await adminService.updatePortfolioProject(editingProject._id, payload);
      } else {
        await adminService.createPortfolioProject(payload);
      }

      setModalOpen(false);
      loadProjects();
    } catch (err) {
      alert(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    try {
      await adminService.deletePortfolioProject(deleteDialog.id);
      setDeleteDialog({ open: false, id: null, title: '' });
      loadProjects();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const columns = [
    {
      header: 'Project',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#06161B] overflow-hidden shrink-0 border border-[#143542]">
            <img src={row.coverImage} alt={row.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white truncate max-w-xs">{row.title}</span>
              {row.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
            </div>
            <span className="text-[11px] text-[#03A094] font-mono">/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (row) => <span className="text-xs text-[#E5E7E7]/80">{row.category}</span>,
    },
    {
      header: 'Type',
      render: (row) => (
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#06161B] border border-[#143542] text-[#0AE3DA]">
          {row.projectType || 'Concept'}
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
            className="p-1.5 rounded-lg bg-[#06161B] border border-[#143542] text-[#E5E7E7]/80 hover:text-[#0AE3DA] hover:border-[#0AE3DA]"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteDialog({ open: true, id: row._id, title: row.title })}
            className="p-1.5 rounded-lg bg-[#06161B] border border-[#143542] text-[#E5E7E7]/80 hover:text-red-400 hover:border-red-400/50"
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
          <h1 className="text-2xl font-bold text-white font-display">Portfolio Projects</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Create, update, and publish public showcase case studies and concept demonstrations.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Create New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                categoryFilter === cat
                  ? 'cydex-gradient text-[#06161B]'
                  : 'bg-[#0c222a] border border-[#143542] text-[#E5E7E7]/70 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadProjects()}
            placeholder="Search projects..."
            className="w-full bg-[#0c222a] border border-[#143542] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#E5E7E7]/40 focus:outline-none focus:border-[#0AE3DA]"
          />
          <Search className="w-4 h-4 text-[#E5E7E7]/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={projects} isLoading={loading} emptyMessage="No portfolio projects found." />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? `Edit: ${editingProject.title}` : 'Create Portfolio Project'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Project Title *</label>
              <input
                type="text"
                required
                {...register('title')}
                placeholder="Apex Financial Platform"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">URL Slug (leave blank to auto-generate)</label>
              <input
                type="text"
                {...register('slug')}
                placeholder="apex-financial-platform"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Category *</label>
              <select
                {...register('category')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Project Type *</label>
              <select
                {...register('projectType')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Cover Image URL *</label>
            <input
              type="text"
              required
              {...register('coverImage')}
              placeholder="https://images.unsplash.com/... or /uploads/..."
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Technologies (comma-separated)</label>
            <input
              type="text"
              {...register('technologies')}
              placeholder="React, Node.js, Tailwind CSS, MongoDB"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Live Project URL / APK Download Link</label>
              <input
                type="text"
                {...register('projectUrl')}
                placeholder="https://example.com or /uploads/...apk"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">GitHub URL</label>
              <input
                type="url"
                {...register('githubUrl')}
                placeholder="https://github.com/..."
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Short Description (max 300 chars) *</label>
            <textarea
              rows={2}
              required
              {...register('shortDescription')}
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Full Description *</label>
            <textarea
              rows={5}
              required
              {...register('fullDescription')}
              placeholder="Detailed architecture, challenges solved, metrics..."
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input type="checkbox" {...register('featured')} className="accent-[#0AE3DA]" />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input type="checkbox" {...register('isPublished')} className="accent-[#0AE3DA]" />
              <span>Published (Publicly Visible)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#143542]">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Portfolio Project"
        message={`Are you sure you want to delete "${deleteDialog.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default AdminPortfolio;

