import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Users, Search, Eye, ShieldAlert, CheckCircle, Ban, Mail, Phone, Building2 } from 'lucide-react';

export const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await adminService.getClients({ search });
      if (res.success) setClients(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleToggleStatus = async (client) => {
    const nextStatus = client.status === 'suspended' ? 'active' : 'suspended';
    if (!confirm(`Are you sure you want to change ${client.name}'s account status to ${nextStatus}?`)) return;

    try {
      const res = await adminService.updateClientStatus(client._id, nextStatus);
      if (res.success) {
        setClients((prev) =>
          prev.map((c) => (c._id === client._id ? { ...c, status: nextStatus } : c))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleViewDetails = async (client) => {
    setDetailsLoading(true);
    try {
      const res = await adminService.getClientDetails(client._id);
      if (res.success) {
        setSelectedClient(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to fetch client details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const columns = [
    {
      header: 'Client Name',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-white text-xs">{row.name}</div>
          <div className="text-[11px] text-[#03A094]">{row.company || 'Individual Client'}</div>
        </div>
      ),
    },
    {
      header: 'Email / Phone',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <div className="text-[#E5E7E7]/90">{row.email}</div>
          <div className="text-[11px] text-[#E5E7E7]/50">{row.phone || 'No phone'}</div>
        </div>
      ),
    },
    {
      header: 'Projects',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-[#0AE3DA]">
          {row.projectCount || 0} active
        </span>
      ),
    },
    {
      header: 'Inquiries',
      render: (row) => (
        <span className="font-mono text-xs text-[#E5E7E7]/70">
          {row.inquiryCount || 0} briefs
        </span>
      ),
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
            onClick={() => handleViewDetails(row)}
            className="p-1.5 rounded-lg bg-[#06161B] border border-[#143542] text-[#E5E7E7]/80 hover:text-[#0AE3DA]"
            title="Inspect Client Profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className={`p-1.5 rounded-lg border text-xs font-semibold ${
              row.status === 'suspended'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
            }`}
            title={row.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
          >
            {row.status === 'suspended' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Client Management</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            View registered client accounts, inspect their linked project histories, and manage login authorization.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadClients()}
            placeholder="Search clients..."
            className="w-full bg-[#0c222a] border border-[#143542] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#E5E7E7]/40 focus:outline-none focus:border-[#0AE3DA]"
          />
          <Search className="w-4 h-4 text-[#E5E7E7]/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <DataTable columns={columns} data={clients} isLoading={loading} emptyMessage="No clients registered." />

      {/* Client Overview Modal */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={`Client Profile: ${selectedClient.client.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#06161B] border border-[#143542] text-xs">
              <div>
                <span className="text-[#E5E7E7]/50 block">Email Address:</span>
                <span className="text-white font-bold">{selectedClient.client.email}</span>
              </div>
              <div>
                <span className="text-[#E5E7E7]/50 block">Company:</span>
                <span className="text-white font-bold">{selectedClient.client.company || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[#E5E7E7]/50 block">Phone:</span>
                <span className="text-white">{selectedClient.client.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[#E5E7E7]/50 block">Joined Date:</span>
                <span className="text-white">{new Date(selectedClient.client.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Client Projects */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0AE3DA]">
                Assigned Projects ({selectedClient.projects?.length || 0})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedClient.projects?.map((p) => (
                  <div
                    key={p._id}
                    className="p-3 rounded-xl bg-[#06161B] border border-[#143542] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{p.title}</p>
                      <span className="text-[10px] text-[#03A094]">{p.projectReference}</span>
                    </div>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Client Inquiries */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#03A094]">
                Inquiry History ({selectedClient.inquiries?.length || 0})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedClient.inquiries?.map((inq) => (
                  <div
                    key={inq._id}
                    className="p-3 rounded-xl bg-[#06161B] border border-[#143542] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{inq.projectTitle}</p>
                      <span className="text-[10px] text-[#0AE3DA]">{inq.service}</span>
                    </div>
                    <StatusBadge status={inq.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminClients;

