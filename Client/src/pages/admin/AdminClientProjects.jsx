import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FolderGit2,
  Plus,
  Edit2,
  Layers,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';

const PROJECT_STATUSES = ['Planning', 'In Progress', 'Review', 'On Hold', 'Completed', 'Cancelled'];

export const AdminClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [milestonesModalProject, setMilestonesModalProject] = useState(null);
  const [updatesModalProject, setUpdatesModalProject] = useState(null);

  // Form states
  const [isSaving, setIsSaving] = useState(false);
  const [newUpdateText, setNewUpdateText] = useState('');
  const [newDeliverable, setNewDeliverable] = useState({ name: '', url: '' });
  const [newMilestone, setNewMilestone] = useState({ title: '', dueDate: '', status: 'Pending' });

  const { register, handleSubmit, reset } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, clientsRes] = await Promise.all([
        adminService.getAllClientProjects(),
        adminService.getClients(),
      ]);
      if (projRes.success) setProjects(projRes.data || []);
      if (clientsRes.success) setClients(clientsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        services: data.services ? data.services.split(',').map((s) => s.trim()) : [],
      };
      const res = await adminService.createClientProject(payload);
      if (res.success) {
        setCreateModalOpen(false);
        reset();
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to create client project');
    } finally {
      setIsSaving(false);
    }
  };

  // Milestone management
  const handleOpenMilestones = async (project) => {
    try {
      const res = await adminService.getClientProjectById(project._id);
      if (res.success) {
        setMilestonesModalProject(res.data);
      }
    } catch (e) {
      setMilestonesModalProject({ project, milestones: [] });
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.title || !milestonesModalProject) return;
    try {
      const res = await adminService.createMilestone(milestonesModalProject.project._id, newMilestone);
      if (res.success) {
        setMilestonesModalProject((prev) => ({
          ...prev,
          milestones: [...prev.milestones, res.data],
        }));
        setNewMilestone({ title: '', dueDate: '', status: 'Pending' });
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to create milestone');
    }
  };

  const handleToggleMilestone = async (m) => {
    const nextStatus = m.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await adminService.updateMilestone(
        milestonesModalProject.project._id,
        m._id,
        { status: nextStatus }
      );
      if (res.success) {
        setMilestonesModalProject((prev) => ({
          ...prev,
          milestones: prev.milestones.map((item) => (item._id === m._id ? res.data : item)),
        }));
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update milestone status');
    }
  };

  // Client Updates and Deliverables
  const handleOpenUpdates = async (project) => {
    try {
      const res = await adminService.getClientProjectById(project._id);
      if (res.success) {
        setUpdatesModalProject(res.data.project);
      }
    } catch (e) {
      setUpdatesModalProject(project);
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdateText.trim() || !updatesModalProject) return;
    try {
      const res = await adminService.addClientUpdate(updatesModalProject._id, newUpdateText.trim());
      if (res.success) {
        setUpdatesModalProject((prev) => ({ ...prev, clientUpdates: res.data }));
        setNewUpdateText('');
      }
    } catch (err) {
      alert(err.message || 'Failed to post update');
    }
  };

  const handleAddDeliverable = async (e) => {
    e.preventDefault();
    if (!newDeliverable.name || !newDeliverable.url || !updatesModalProject) return;
    try {
      const res = await adminService.addDeliverable(updatesModalProject._id, newDeliverable);
      if (res.success) {
        setUpdatesModalProject((prev) => ({ ...prev, deliverableFiles: res.data }));
        setNewDeliverable({ name: '', url: '' });
      }
    } catch (err) {
      alert(err.message || 'Failed to attach deliverable');
    }
  };

  const columns = [
    {
      header: 'Reference',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-[#0AE3DA]">{row.projectReference}</span>
      ),
    },
    {
      header: 'Project Title',
      render: (row) => (
        <div className="space-y-0.5 max-w-xs">
          <div className="font-bold text-white text-xs truncate">{row.title}</div>
          <div className="text-[11px] text-[#03A094]">
            Client: {row.client?.name} ({row.client?.company || 'Direct'})
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Progress',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-[#06161B] border border-[#143542] overflow-hidden">
            <div className="h-full cydex-gradient rounded-full" style={{ width: `${row.progress}%` }} />
          </div>
          <span className="text-xs font-mono font-bold text-white">{row.progress}%</span>
        </div>
      ),
    },
    {
      header: 'Target Date',
      render: (row) => (
        <span className="text-xs text-[#E5E7E7]/60">
          {row.targetCompletionDate ? new Date(row.targetCompletionDate).toLocaleDateString() : 'TBD'}
        </span>
      ),
    },
    {
      header: 'Management Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenMilestones(row)}
            className="p-1.5 rounded-lg bg-[#06161B] border border-[#143542] text-[#0AE3DA] hover:bg-[#143542] text-xs font-semibold flex items-center gap-1"
            title="Manage Milestones"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Milestones</span>
          </button>
          <button
            onClick={() => handleOpenUpdates(row)}
            className="p-1.5 rounded-lg bg-[#06161B] border border-[#143542] text-[#03A094] hover:bg-[#143542] text-xs font-semibold flex items-center gap-1"
            title="Post Updates & Deliverables"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Updates</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Client Projects & Contracts</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Administer private client engagements, milestone progress percentages, deliverables, and progress logs.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateModalOpen(true)}>
          New Client Project
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        isLoading={loading}
        emptyMessage="No active client projects registered."
      />

      {/* Create Project Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Client Project">
        <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Assigned Client *</label>
            <select
              required
              {...register('client')}
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            >
              <option value="">Select a registered client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email}) {c.company ? `— ${c.company}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Project Title *</label>
            <input
              type="text"
              required
              {...register('title')}
              placeholder="e.g. Enterprise Client Portal Modernization"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Initial Status</label>
              <select
                {...register('status')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              >
                {PROJECT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Target Completion Date</label>
              <input
                type="date"
                {...register('targetCompletionDate')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Services (comma-separated)</label>
            <input
              type="text"
              {...register('services')}
              placeholder="Website Development, UI/UX and Graphic Design"
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#E5E7E7]/90">Project Description *</label>
            <textarea
              rows={4}
              required
              {...register('description')}
              placeholder="Detailed description of scope, milestones, and deliverable expectations..."
              className="w-full bg-[#06161B] border border-[#143542] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143542]">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Milestones Manager Modal */}
      {milestonesModalProject && (
        <Modal
          isOpen={!!milestonesModalProject}
          onClose={() => setMilestonesModalProject(null)}
          title={`Milestones: ${milestonesModalProject.project.title}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0AE3DA]">Current Milestones</h4>
              {milestonesModalProject.milestones?.length === 0 ? (
                <p className="text-xs text-[#E5E7E7]/50">No milestones created yet.</p>
              ) : (
                <div className="space-y-2">
                  {milestonesModalProject.milestones?.map((m) => {
                    const isDone = m.status === 'Completed';
                    return (
                      <div
                        key={m._id}
                        className="p-3.5 rounded-xl bg-[#06161B] border border-[#143542] flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="min-w-0">
                          <p className={`font-bold ${isDone ? 'line-through text-[#E5E7E7]/50' : 'text-white'}`}>
                            {m.title}
                          </p>
                          {m.dueDate && (
                            <span className="text-[10px] text-[#03A094]">
                              Due: {new Date(m.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleToggleMilestone(m)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#143542] text-[#0AE3DA] hover:bg-[#0AE3DA] hover:text-[#06161B]'
                          }`}
                        >
                          {isDone ? 'Completed ✓' : 'Mark Complete'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add Milestone Form */}
            <form onSubmit={handleAddMilestone} className="p-4 rounded-2xl bg-[#06161B] border border-[#143542] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#03A094]">Add Milestone</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g. Phase 2: Core Microservices"
                  className="bg-[#0c222a] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
                />
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  className="bg-[#0c222a] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Add Milestone
              </Button>
            </form>
          </div>
        </Modal>
      )}

      {/* Updates & Deliverables Modal */}
      {updatesModalProject && (
        <Modal
          isOpen={!!updatesModalProject}
          onClose={() => setUpdatesModalProject(null)}
          title={`Status Updates & Deliverables: ${updatesModalProject.title}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Post Client Update */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0AE3DA]">Post Client Update</h4>
              <form onSubmit={handlePostUpdate} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newUpdateText}
                  onChange={(e) => setNewUpdateText(e.target.value)}
                  placeholder="Post progress message visible to the client in portal..."
                  className="flex-1 bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
                />
                <Button type="submit" variant="primary" size="sm">
                  Post Update
                </Button>
              </form>

              {/* Existing Updates */}
              <div className="space-y-2 max-h-40 overflow-y-auto pt-2">
                {updatesModalProject.clientUpdates?.map((up, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#06161B] border border-[#143542] text-xs">
                    <p className="text-white">{up.update}</p>
                    <span className="text-[10px] text-[#03A094] block mt-1">
                      {new Date(up.date).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attach Deliverables */}
            <div className="space-y-3 pt-4 border-t border-[#143542]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#03A094]">Attach Deliverable File</h4>
              <form onSubmit={handleAddDeliverable} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newDeliverable.name}
                  onChange={(e) => setNewDeliverable({ ...newDeliverable, name: e.target.value })}
                  placeholder="File name (e.g. Design-System-v2.pdf)"
                  className="bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
                />
                <input
                  type="url"
                  required
                  value={newDeliverable.url}
                  onChange={(e) => setNewDeliverable({ ...newDeliverable, url: e.target.value })}
                  placeholder="File download URL"
                  className="bg-[#06161B] border border-[#143542] rounded-xl px-3 py-2 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
                />
                <div className="sm:col-span-2">
                  <Button type="submit" variant="secondary" size="sm" className="w-full">
                    Attach Deliverable
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminClientProjects;

