import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalService } from '../../services/portalService';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  FileQuestion,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const PortalDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const [projRes, inqRes, convRes] = await Promise.all([
          portalService.getMyProjects(),
          portalService.getMyInquiries(),
          portalService.getConversations(),
        ]);

        if (projRes.success) setProjects(projRes.data || []);
        if (inqRes.success) setInquiries(inqRes.data || []);
        if (convRes.success) setConversations(convRes.data || []);
      } catch (err) {
        console.error('Portal dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading your project portal..." />;
  }

  // Calculated Real Metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => ['Planning', 'In Progress', 'Review'].includes(p.status)).length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const pendingInquiries = inquiries.filter((i) => ['New', 'Contacted', 'Qualified'].includes(i.status)).length;

  // Chart data from real projects
  const chartData = projects.map((p) => ({
    name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
    progress: p.progress || 0,
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-[#0AE3DA]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-bold text-[#03A094] tracking-wider">
              {user?.company || 'Client Workspace'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#E5E7E7]/70">
              Track real-time milestones, view deliverables, and communicate directly with your engineering team.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/portal/inquiries">
              <Button variant="primary" size="sm">
                Submit New Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#E5E7E7]/60 font-medium">Assigned Projects</span>
            <p className="text-2xl font-bold font-display text-white">{totalProjects}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#06161B] text-[#0AE3DA] flex items-center justify-center border border-[#143542]">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#E5E7E7]/60 font-medium">Active Sprints</span>
            <p className="text-2xl font-bold font-display text-[#0AE3DA]">{activeProjects}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#06161B] text-[#0AE3DA] flex items-center justify-center border border-[#143542]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#E5E7E7]/60 font-medium">Completed Projects</span>
            <p className="text-2xl font-bold font-display text-emerald-400">{completedProjects}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#06161B] text-emerald-400 flex items-center justify-center border border-[#143542]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#E5E7E7]/60 font-medium">Active Inquiries</span>
            <p className="text-2xl font-bold font-display text-amber-400">{pendingInquiries}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#06161B] text-amber-400 flex items-center justify-center border border-[#143542]">
            <FileQuestion className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Progress Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Progress Chart */}
        <div className="lg:col-span-7 bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#143542] pb-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0AE3DA]" />
              Project Progress Completion (%)
            </h3>
            <span className="text-xs text-[#03A094]">Live MongoDB Data</span>
          </div>

          {chartData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-[#E5E7E7]/50">
              No active projects to graph.
            </div>
          ) : (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#06161B', borderColor: '#143542', borderRadius: '12px' }}
                    itemStyle={{ color: '#0AE3DA', fontSize: '12px' }}
                  />
                  <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#0AE3DA" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Assigned Projects List */}
        <div className="lg:col-span-5 bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#143542] pb-3">
            <h3 className="text-sm font-bold text-white font-display">My Projects</h3>
            <Link to="/portal/projects" className="text-xs font-semibold text-[#0AE3DA] hover:underline">
              View All
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-xs text-[#E5E7E7]/60 py-6 text-center">No projects assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 3).map((proj) => (
                <Link
                  key={proj._id}
                  to={`/portal/projects/${proj._id}`}
                  className="p-4 rounded-2xl bg-[#06161B] border border-[#143542] hover:border-[#0AE3DA]/50 transition-all block space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#03A094]">{proj.projectReference}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#0AE3DA] transition-colors truncate">
                        {proj.title}
                      </h4>
                    </div>
                    <StatusBadge status={proj.status} size="sm" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#E5E7E7]/60">
                      <span>Progress</span>
                      <span className="font-bold text-[#0AE3DA]">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#143542] overflow-hidden">
                      <div
                        className="h-full cydex-gradient transition-all duration-500 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Messages & Activity */}
      <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#143542] pb-4">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#03A094]" />
            Recent Communications
          </h3>
          <Link to="/portal/messages" className="text-xs font-semibold text-[#0AE3DA] hover:underline">
            Go to Messaging
          </Link>
        </div>

        {conversations.length === 0 ? (
          <p className="text-xs text-[#E5E7E7]/60 py-4">No active conversations yet.</p>
        ) : (
          <div className="divide-y divide-[#143542]/50">
            {conversations.slice(0, 3).map((conv) => (
              <Link
                key={conv._id}
                to={`/portal/messages/${conv._id}`}
                className="py-3.5 flex items-center justify-between hover:bg-[#143542]/20 px-3 rounded-xl transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{conv.subject}</h4>
                  <p className="text-xs text-[#E5E7E7]/60 truncate max-w-md">{conv.lastMessage}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-[#E5E7E7]/40">
                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0AE3DA]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalDashboard;

