import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Activity, ShieldAlert, CheckCircle2, Clock, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getActivityLogs();
      setLogs(res.data || []);
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const action = log.action ? log.action.toLowerCase() : '';
    const details = log.details ? JSON.stringify(log.details).toLowerCase() : '';
    const userName = log.user?.name ? log.user.name.toLowerCase() : '';
    const userEmail = log.user?.email ? log.user.email.toLowerCase() : '';
    const ip = log.ipAddress || '';

    return (
      action.includes(term) ||
      details.includes(term) ||
      userName.includes(term) ||
      userEmail.includes(term) ||
      ip.includes(term)
    );
  });

  const columns = [
    {
      header: 'Action / Event',
      accessor: (log) => (
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded bg-[#06161B] text-cydex-turquoise border border-cydex-teal/20">
            <Activity className="w-3.5 h-3.5" />
          </span>
          <div>
            <p className="font-semibold text-white capitalize text-xs">
              {log.action ? log.action.replace(/_/g, ' ') : 'System Action'}
            </p>
            <p className="text-[11px] text-gray-400 truncate max-w-xs">
              {log.description || (log.details ? JSON.stringify(log.details) : 'Activity recorded')}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Performed By',
      accessor: (log) => (
        <div>
          <p className="text-xs font-medium text-white">{log.user?.name || 'System / Guest'}</p>
          <p className="text-[11px] text-gray-400">{log.user?.email || '-'}</p>
        </div>
      )
    },
    {
      header: 'IP & Client',
      accessor: (log) => (
        <div className="text-[11px] text-gray-400">
          <p>{log.ipAddress || '127.0.0.1'}</p>
          <p className="truncate max-w-[150px] text-gray-500">{log.userAgent || 'Web Browser'}</p>
        </div>
      )
    },
    {
      header: 'Timestamp',
      accessor: (log) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5 text-cydex-turquoise/60" />
          {new Date(log.createdAt).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cydex-turquoise" />
            Security & Activity Audit Logs
          </h1>
          <p className="text-sm text-gray-400">
            Immutable audit trail of administrator and client actions, updates, and access.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cydex-teal/30 text-xs text-gray-300 hover:text-white hover:border-cydex-turquoise transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by action, user, or IP..."
          className="w-full bg-[#0b1f26] border border-cydex-teal/20 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cydex-turquoise"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : (
        <div className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredLogs}
            emptyMessage="No activity logs recorded yet."
          />
        </div>
      )}
    </div>
  );
}
