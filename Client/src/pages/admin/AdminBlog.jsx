import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BookOpen, Plus, Edit2, Trash2, Search, FolderPlus } from 'lucide-react';

export const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Forms
  const { register: registerPost, handleSubmit: handlePostSubmit, reset: resetPost } = useForm();
  const { register: registerCat, handleSubmit: handleCatSubmit, reset: resetCat } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsRes, catsRes] = await Promise.all([
        adminService.getAllBlogPosts(),
        publicService.getBlogCategories(),
      ]);
      if (postsRes.success) setPosts(postsRes.data || []);
      if (catsRes.success) setCategories(catsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreatePost = () => {
    setEditingPost(null);
    resetPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      author: 'Cydex Editorial Team',
      category: categories[0]?.name || 'Technology',
      tags: '',
      status: 'published',
    });
    setPostModalOpen(true);
  };

  const handleOpenEditPost = (post) => {
    setEditingPost(post);
    resetPost({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      category: post.category,
      tags: post.tags?.join(', ') || '',
      status: post.status || 'published',
    });
    setPostModalOpen(true);
  };

  const onSavePost = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      if (editingPost) {
        await adminService.updateBlogPost(editingPost._id, payload);
      } else {
        await adminService.createBlogPost(payload);
      }

      setPostModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  const onSaveCategory = async (data) => {
    try {
      const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await adminService.createBlogCategory({ name: data.name, slug });
      setCategoryModalOpen(false);
      resetCat();
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create category');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    try {
      await adminService.deleteBlogPost(deleteDialog.id);
      setDeleteDialog({ open: false, id: null, title: '' });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const columns = [
    {
      header: 'Article',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#06161B] overflow-hidden shrink-0 border border-[#143542]">
            <img src={row.coverImage} alt={row.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-xs truncate max-w-sm">{row.title}</p>
            <span className="text-[10px] text-[#03A094] font-mono">/blog/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#06161B] text-[#0AE3DA] border border-[#143542]">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Author',
      render: (row) => <span className="text-xs text-[#E5E7E7]/80">{row.author}</span>,
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEditPost(row)}
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
          <h1 className="text-2xl font-bold text-white font-display">Editorial & Blog Posts</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Author and publish technical articles, engineering journals, and category taxonomies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={FolderPlus} onClick={() => setCategoryModalOpen(true)}>
            New Category
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreatePost}>
            Write Article
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={posts} isLoading={loading} emptyMessage="No blog posts authored." />

      {/* Post Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title={editingPost ? `Edit: ${editingPost.title}` : 'Write New Article'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handlePostSubmit(onSavePost)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Article Title *</label>
            <input
              type="text"
              required
              {...registerPost('title')}
              placeholder="e.g. Architecting Scalable MERN Systems"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Category *</label>
              <select
                {...registerPost('category')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Publishing Status *</label>
              <select
                {...registerPost('status')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Cover Image URL *</label>
              <input
                type="url"
                required
                {...registerPost('coverImage')}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Author Byline</label>
              <input
                type="text"
                {...registerPost('author')}
                placeholder="Cydex Engineering Team"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Tags (comma-separated)</label>
            <input
              type="text"
              {...registerPost('tags')}
              placeholder="Architecture, React, Security, Node.js"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Excerpt (Short Summary) *</label>
            <textarea
              rows={2}
              required
              {...registerPost('excerpt')}
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Full Content (Markdown / Text) *</label>
            <textarea
              rows={8}
              required
              {...registerPost('content')}
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143542]">
            <Button variant="outline" size="sm" onClick={() => setPostModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Save Article
            </Button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Add Blog Category"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCatSubmit(onSaveCategory)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Category Name *</label>
            <input
              type="text"
              required
              {...registerCat('name')}
              placeholder="e.g. AI & Automation"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-[#143542]">
            <Button variant="outline" size="sm" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteDialog.title}"?`}
      />
    </div>
  );
};

export default AdminBlog;

