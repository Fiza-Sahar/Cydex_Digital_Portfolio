import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalService } from '../../services/portalService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Bell, CheckCheck, ExternalLink, Calendar } from 'lucide-react';

export const PortalNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    portalService
      .getNotifications()
      .then((res) => {
        if (res.success) setNotifications(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await portalService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await portalService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143542]">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Notifications</h1>
          <p className="text-xs text-[#E5E7E7]/70 mt-1">
            Real-time updates regarding milestones, messages, and inquiry status changes.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" icon={CheckCheck} onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-16 text-center space-y-3">
          <Bell className="w-10 h-10 text-[#0AE3DA] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Notifications</h3>
          <p className="text-xs text-[#E5E7E7]/60">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-[#0c222a]/40 border-[#143542]/60 opacity-80'
                  : 'bg-[#0c222a] border-[#0AE3DA]/40 shadow-[0_0_20px_rgba(10,227,218,0.08)]'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#0AE3DA] animate-pulse" />
                  )}
                  <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                </div>
                <p className="text-xs text-[#E5E7E7]/80 leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#03A094]">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {notif.link && (
                  <Link
                    to={notif.link}
                    className="p-2 rounded-lg bg-[#06161B] text-[#0AE3DA] hover:text-white border border-[#143542] text-xs font-semibold flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif._id)}
                    className="p-2 text-xs text-[#E5E7E7]/50 hover:text-[#0AE3DA]"
                    title="Mark Read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalNotifications;

