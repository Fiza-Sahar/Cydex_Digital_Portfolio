import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import {
  Briefcase,
  Layers,
  Inbox,
  FolderGit2,
  Users,
  BookOpen,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const STATUS_COLORS = {
  New: '#3b82f6',
  Contacted: '#a855f7',
  Qualified: '#0AE3DA',
  'Proposal Sent': '#f59e0b',
  Converted: '#10b981',
  Closed: '#64748b',
};

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading administrative analytics..." />;
  }

  const stats = data?.stats || {};
  const statusBreakdown = data?.inquiryStatusBreakdown || [];
  const recentInquiries = data?.recentInquiries || [];
  const recentProjects = data?.recentClientProjects || [];

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#03A094] tracking-widest">
            Executive Overview
          </span>
          <h1 className="text-2xl font-bold text-white font-display">System Analytics & Operations</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/inquiries">
            <Button variant="primary" size="sm">
              Manage Inquiries
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Stats Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E5E7E7]/60">
            <span>Total Inquiries</span>
            <Inbox className="w-4 h-4 text-[#0AE3DA]" />
          </div>
          <p className="text-2xl font-bold font-display text-white">{stats.totalInquiries || 0}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#03A094]">
            <span className="font-bold text-[#0AE3DA]">{stats.newInquiries || 0}</span>
            <span>new pending</span>
          </div>
        </div>

        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E5E7E7]/60">
            <span>Client Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#03A094]" />
          </div>
          <p className="text-2xl font-bold font-display text-[#0AE3DA]">{stats.activeClientProjects || 0}</p>
          <span className="text-[11px] text-[#E5E7E7]/50">Active production engagements</span>
        </div>

        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E5E7E7]/60">
            <span>Portfolio Works</span>
            <Briefcase className="w-4 h-4 text-[#027E71]" />
          </div>
          <p className="text-2xl font-bold font-display text-white">{stats.totalPortfolioProjects || 0}</p>
          <span className="text-[11px] text-emerald-400 font-medium">
            {stats.publishedPortfolioProjects || 0} published live
          </span>
        </div>

        <div className="bg-[#0c222a] border border-[#143542] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E5E7E7]/60">
            <span>Registered Clients</span>
            <Users className="w-4 h-4 text-[#0AE3DA]" />
          </div>
          <p className="text-2xl font-bold font-display text-white">{stats.registeredClients || 0}</p>
          <span className="text-[11px] text-[#E5E7E7]/50">Client portal user accounts</span>
        </div>
      </div>

      {/* Charts & Status Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Inquiry Status Breakdown Bar Chart */}
        <div className="lg:col-span-8 bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#143542] pb-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0AE3DA]" />
              Inquiry Pipeline Distribution
            </h3>
            <span className="text-xs text-[#03A094]">Aggregated from MongoDB</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#06161B', borderColor: '#143542', borderRadius: '12px' }}
                  itemStyle={{ color: '#0AE3DA', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#0AE3DA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary Pill Column */}
        <div className="lg:col-span-4 bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-white font-display border-b border-[#143542] pb-3">
            Pipeline Counts
          </h3>

          <div className="space-y-3">
            {statusBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#06161B] border border-[#143542]/50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.name] || '#0AE3DA' }}
                  />
                  <span className="text-white font-semibold">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-[#0AE3DA]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Inquiries & Projects Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#143542] pb-3">
            <h3 className="text-sm font-bold text-white font-display">Recent Inquiries</h3>
            <Link to="/admin/inquiries" className="text-xs text-[#0AE3DA] hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="divide-y divide-[#143542]/50">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-[#E5E7E7]/50 py-4">No recent inquiries.</p>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#03A094]">{inq.referenceId}</span>
                      <StatusBadge status={inq.status} size="sm" />
                    </div>
                    <p className="text-white font-bold truncate">{inq.projectTitle}</p>
                    <p className="text-[#E5E7E7]/50 text-[11px] truncate">{inq.name} ({inq.service})</p>
                  </div>
                  <Link
                    to={`/admin/inquiries`}
                    className="p-1.5 rounded-lg bg-[#06161B] text-[#0AE3DA] hover:text-white border border-[#143542]"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Client Projects */}
        <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#143542] pb-3">
            <h3 className="text-sm font-bold text-white font-display">Active Engagements</h3>
            <Link to="/admin/client-projects" className="text-xs text-[#0AE3DA] hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="divide-y divide-[#143542]/50">
            {recentProjects.length === 0 ? (
              <p className="text-xs text-[#E5E7E7]/50 py-4">No active client projects.</p>
            ) : (
              recentProjects.map((p) => (
                <div key={p._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#03A094]">{p.projectReference}</span>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                    <p className="text-white font-bold truncate">{p.title}</p>
                    <p className="text-[#0AE3DA] text-[11px] truncate">
                      Client: {p.client?.name} ({p.client?.company || 'Direct'})
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-white bg-[#06161B] px-2.5 py-1 rounded-lg border border-[#143542]">
                    {p.progress}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

