import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalService } from '../../services/portalService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { FolderGit2, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const PortalProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalService
      .getMyProjects()
      .then((res) => {
        if (res.success) setProjects(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading your projects..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">My Assigned Projects</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Track live milestones, deliverables, and engineering progress for your active contracts.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-16 text-center space-y-4">
          <FolderGit2 className="w-12 h-12 text-[#0AE3DA] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">No Projects Assigned Yet</h3>
          <p className="text-xs text-[#E5E7E7]/60 max-w-sm mx-auto">
            Once you submit an inquiry and finalize terms, your projects will appear here with transparent milestone tracking.
          </p>
          <Link to="/portal/inquiries">
            <Button variant="primary" size="sm">
              Submit a Project Inquiry
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-[#0c222a] border border-[#143542] rounded-3xl p-7 flex flex-col justify-between hover:border-[#0AE3DA]/50 transition-all space-y-6 group shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#03A094]">
                      {project.projectReference}
                    </span>
                    <h3 className="text-xl font-bold text-white font-display group-hover:text-[#0AE3DA] transition-colors mt-0.5">
                      {project.title}
                    </h3>
                  </div>
                  <StatusBadge status={project.status} size="sm" />
                </div>

                <p className="text-xs text-[#E5E7E7]/70 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#E5E7E7]/60">Milestone Progress</span>
                    <span className="font-bold text-[#0AE3DA]">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#06161B] border border-[#143542] overflow-hidden">
                    <div
                      className="h-full cydex-gradient transition-all duration-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones count and Target date */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#143542]/50 text-xs">
                  <div className="flex items-center gap-2 text-[#E5E7E7]/70">
                    <CheckCircle2 className="w-4 h-4 text-[#03A094]" />
                    <span>
                      {project.milestonesCompleted || 0} / {project.milestonesTotal || 0} Milestones
                    </span>
                  </div>

                  {project.targetCompletionDate && (
                    <div className="flex items-center gap-2 text-[#E5E7E7]/70 justify-end">
                      <Calendar className="w-4 h-4 text-[#0AE3DA]" />
                      <span>{new Date(project.targetCompletionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#143542]/50">
                <Link
                  to={`/portal/projects/${project._id}`}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#0AE3DA] hover:text-white uppercase tracking-wider transition-colors"
                >
                  <span>Open Project Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalProjects;

