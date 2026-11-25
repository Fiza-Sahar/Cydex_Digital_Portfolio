import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
import { Github, Linkedin, Twitter } from '../../components/common/SocialIcons';
import { toast } from 'sonner';

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: '',
    skills: '',
    order: 0,
    isActive: true,
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: ''
    }
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTeam();
      setMembers(res.data || []);
    } catch (err) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        avatar: member.avatar || '',
        skills: member.skills ? member.skills.join(', ') : '',
        order: member.order || 0,
        isActive: member.isActive ?? true,
        socialLinks: {
          linkedin: member.socialLinks?.linkedin || '',
          twitter: member.socialLinks?.twitter || '',
          github: member.socialLinks?.github || ''
        }
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        bio: '',
        avatar: '',
        skills: '',
        order: members.length,
        isActive: true,
        socialLinks: { linkedin: '', twitter: '', github: '' }
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        order: Number(formData.order) || 0,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      if (editingMember) {
        await adminService.updateTeamMember(editingMember._id, payload);
        toast.success('Team member updated');
      } else {
        await adminService.createTeamMember(payload);
        toast.success('Team member added');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteTeamMember(deleteId);
      toast.success('Member removed');
      setDeleteId(null);
      fetchMembers();
    } catch (err) {
      toast.error('Failed to remove team member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cydex-turquoise" />
            Team Management
          </h1>
          <p className="text-sm text-gray-400">
            Showcase leadership, key specialists, and digital talent on the public About page.
          </p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Team Member
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : members.length === 0 ? (
        <div className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl p-12 text-center text-gray-400">
          <Users className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p className="text-lg font-medium text-white">No team members yet</p>
          <p className="text-sm mt-1">Add members to display them in the team section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl p-5 flex flex-col justify-between hover:border-cydex-turquoise/40 transition-all"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cydex-turquoise/30 flex-shrink-0 bg-[#06161B]">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xl text-cydex-turquoise">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{member.name}</h3>
                    <p className="text-xs text-cydex-turquoise font-medium truncate">{member.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {member.isActive ? (
                        <span className="flex items-center gap-1 text-[11px] text-green-400">
                          <CheckCircle className="w-3 h-3" /> Visible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <XCircle className="w-3 h-3" /> Hidden
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">Order: {member.order}</span>
                    </div>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-gray-300 line-clamp-3 mb-3 leading-relaxed">
                    {member.bio}
                  </p>
                )}

                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.skills.map((skill, i) => (
                      <span key={i} className="text-[10px] bg-[#06161B] text-gray-300 px-2 py-0.5 rounded border border-cydex-teal/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-cydex-teal/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  {member.socialLinks?.linkedin && <Linkedin className="w-3.5 h-3.5 hover:text-cydex-turquoise" />}
                  {member.socialLinks?.twitter && <Twitter className="w-3.5 h-3.5 hover:text-cydex-turquoise" />}
                  {member.socialLinks?.github && <Github className="w-3.5 h-3.5 hover:text-cydex-turquoise" />}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(member)}
                    className="p-1.5 text-gray-400 hover:text-cydex-turquoise hover:bg-[#06161B] rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(member._id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#06161B] rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Role / Job Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                placeholder="e.g. Head of Engineering"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Short Biography</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
              placeholder="Brief professional background..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
              placeholder="Architecture, React, Node.js, Cloud Solutions"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                placeholder="https://x.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.socialLinks.github}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, github: e.target.value }
                })}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                id="order"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-20 bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-1.5 text-white text-sm"
              />
              <label htmlFor="order" className="text-xs text-gray-300">Display Order</label>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-cydex-teal text-cydex-turquoise focus:ring-0 bg-[#06161B]"
              />
              <span className="text-xs text-gray-300">Active / Visible on public site</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cydex-teal/20">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Remove Team Member"
        message="Are you sure you want to remove this team member? This action cannot be undone."
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
