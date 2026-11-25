import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portalService } from '../../services/portalService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import {
  FolderGit2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Download,
  MessageSquare,
  FileCheck,
  Layers,
} from 'lucide-react';

export const PortalProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    portalService
      .getMyProjectDetails(id)
      .then((res) => {
        if (res.success && res.data) {
          setProject(res.data.project);
          setMilestones(res.data.milestones || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading project details..." />;
  }

  if (!project) {
    return (
      <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <p className="text-xs text-[#E5E7E7]/60">You do not have permission to access this project or it does not exist.</p>
        <Link to="/portal/projects">
          <Button variant="primary" size="sm">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/portal/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0AE3DA] hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Top Overview Card */}
      <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#03A094]">{project.projectReference}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">{project.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} size="md" />
            <Link to="/portal/messages">
              <Button variant="outline" size="sm" icon={MessageSquare}>
                Chat with Team
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-[#E5E7E7]/80 leading-relaxed max-w-4xl">{project.description}</p>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-[#143542]/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#E5E7E7]/70 font-semibold">Overall Project Progress</span>
            <span className="text-base font-bold text-[#0AE3DA]">{project.progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#06161B] border border-[#143542] overflow-hidden">
            <div
              className="h-full cydex-gradient transition-all duration-500 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Scope and Services tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
          {project.services && project.services.length > 0 && (
            <div>
              <span className="text-[#E5E7E7]/50 block mb-2 font-bold uppercase tracking-wider">
                Assigned Services:
              </span>
              <div className="flex flex-wrap gap-2">
                {project.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-[#06161B] border border-[#143542] text-[#0AE3DA] font-medium"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.targetCompletionDate && (
            <div className="flex items-center gap-3 md:justify-end">
              <Calendar className="w-5 h-5 text-[#03A094]" />
              <div>
                <span className="text-[#E5E7E7]/50 block">Target Completion Date:</span>
                <span className="text-white font-bold text-sm">
                  {new Date(project.targetCompletionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Milestones & Deliverables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Milestones Timeline */}
        <div className="lg:col-span-8 bg-[#0c222a] border border-[#143542] rounded-3xl p-7 space-y-6">
          <h3 className="text-lg font-bold text-white font-display border-b border-[#143542] pb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0AE3DA]" />
            Official Project Milestones
          </h3>

          {milestones.length === 0 ? (
            <p className="text-xs text-[#E5E7E7]/60 py-4">No milestones defined yet by the administrator.</p>
          ) : (
            <div className="space-y-4">
              {milestones.map((m, idx) => {
                const isDone = m.status === 'Completed';
                const isInProgress = m.status === 'In Progress';
                return (
                  <div
                    key={m._id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-[#06161B]/80 border-emerald-500/30'
                        : isInProgress
                        ? 'bg-[#06161B] border-[#0AE3DA]/50 shadow-[0_0_15px_rgba(10,227,218,0.1)]'
                        : 'bg-[#06161B]/40 border-[#143542]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isInProgress
                              ? 'bg-[#0AE3DA]/20 text-[#0AE3DA]'
                              : 'bg-[#143542] text-[#E5E7E7]/60'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">{m.title}</h4>
                          {m.description && (
                            <p className="text-xs text-[#E5E7E7]/70 leading-relaxed">{m.description}</p>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={m.status} size="sm" />
                    </div>

                    {m.dueDate && (
                      <div className="pt-3 mt-3 border-t border-[#143542]/40 flex items-center justify-between text-[11px] text-[#E5E7E7]/50">
                        <span>Due Date: {new Date(m.dueDate).toLocaleDateString()}</span>
                        {m.completedAt && (
                          <span className="text-emerald-400">
                            Completed on {new Date(m.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Deliverable Files & Project Updates */}
        <div className="lg:col-span-4 space-y-8">
          {/* Deliverables Files */}
          <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-display border-b border-[#143542] pb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#03A094]" />
              Shared Deliverables
            </h3>

            {project.deliverableFiles && project.deliverableFiles.length > 0 ? (
              <div className="space-y-2.5">
                {project.deliverableFiles.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#06161B] border border-[#143542] hover:border-[#0AE3DA] flex items-center justify-between group transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#0AE3DA]">
                        {file.name}
                      </p>
                      <span className="text-[10px] text-[#E5E7E7]/50">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-[#0AE3DA] shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#E5E7E7]/50 py-3">No files uploaded yet for this project.</p>
            )}
          </div>

          {/* Client Updates Log */}
          <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-display border-b border-[#143542] pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0AE3DA]" />
              Project Status Log
            </h3>

            {project.clientUpdates && project.clientUpdates.length > 0 ? (
              <div className="space-y-3.5">
                {project.clientUpdates.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#06161B] border border-[#143542] space-y-1">
                    <p className="text-xs text-[#E5E7E7]/90 leading-relaxed">{item.update}</p>
                    <span className="text-[10px] text-[#03A094] block">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#E5E7E7]/50 py-3">No updates posted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalProjectDetail;

