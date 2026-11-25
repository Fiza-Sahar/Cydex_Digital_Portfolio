import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  FolderGit2,
  FileQuestion,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export const PortalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch live badges
    const fetchBadges = async () => {
      try {
        const [msgRes, notifRes] = await Promise.all([
          portalService.getUnreadMessageCount(),
          portalService.getNotifications(),
        ]);
        if (msgRes.success) setUnreadMsgCount(msgRes.data.unreadCount || 0);
        if (notifRes.success) setUnreadNotifCount(notifRes.unreadCount || 0);
      } catch (err) {
        // silent
      }
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/portal', icon: LayoutDashboard },
    { name: 'My Projects', path: '/portal/projects', icon: FolderGit2 },
    { name: 'Project Inquiries', path: '/portal/inquiries', icon: FileQuestion },
    { name: 'Messages', path: '/portal/messages', icon: MessageSquare, badge: unreadMsgCount },
    { name: 'Notifications', path: '/portal/notifications', icon: Bell, badge: unreadNotifCount },
    { name: 'Profile & Settings', path: '/portal/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#06161B] text-[#E5E7E7] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0c222a] border-r border-[#143542] shrink-0 select-none">
        <div className="p-6 border-b border-[#143542]">
          <Logo to="/portal" />
          <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-[#03A094]">
            Client Portal
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === '/portal'
                ? location.pathname === '/portal'
                : location.pathname.startsWith(item.path);

            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'cydex-gradient text-[#06161B] shadow-[0_0_15px_rgba(10,227,218,0.3)]'
                    : 'text-[#E5E7E7]/70 hover:text-white hover:bg-[#143542]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-[#06161B] text-[#0AE3DA]' : 'bg-[#0AE3DA] text-[#06161B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#143542] bg-[#06161B]/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl cydex-gradient flex items-center justify-center font-bold text-[#06161B]">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-[#03A094] truncate">{user?.company || 'Client'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/"
              target="_blank"
              className="flex-1 text-center py-1.5 text-xs font-medium text-[#E5E7E7]/60 hover:text-[#0AE3DA] flex items-center justify-center gap-1.5 rounded-lg hover:bg-[#143542]/40"
            >
              Public Site <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#E5E7E7]/60 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-[#06161B]/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-72 bg-[#0c222a] border-r border-[#143542] z-10 p-6">
            <div className="flex items-center justify-between pb-6 border-b border-[#143542]">
              <Logo to="/portal" />
              <button onClick={() => setSidebarOpen(false)} className="text-[#E5E7E7]/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/portal'
                    ? location.pathname === '/portal'
                    : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive ? 'cydex-gradient text-[#06161B]' : 'text-[#E5E7E7]/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#0AE3DA] text-[#06161B]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 py-2 border-t border-[#143542]"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#06161B]/90 backdrop-blur-md border-b border-[#143542] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#E5E7E7] hover:text-[#0AE3DA] border border-[#143542] rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-[#03A094] uppercase tracking-wider font-bold">Client Dashboard</span>
              <h1 className="text-sm font-bold text-white truncate">
                Welcome back, {user?.name?.split(' ')[0] || 'Client'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/portal/notifications"
              className="relative p-2 text-[#E5E7E7]/70 hover:text-[#0AE3DA] hover:bg-[#143542]/50 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0AE3DA] ring-2 ring-[#06161B]" />
              )}
            </Link>

            <Link
              to="/portal/messages"
              className="relative p-2 text-[#E5E7E7]/70 hover:text-[#0AE3DA] hover:bg-[#143542]/50 rounded-xl transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMsgCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0AE3DA] ring-2 ring-[#06161B]" />
              )}
            </Link>

            <Link to="/portal/profile" className="flex items-center gap-2 pl-2 border-l border-[#143542]">
              <div className="w-8 h-8 rounded-lg cydex-gradient flex items-center justify-center font-bold text-[#06161B] text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Link>
          </div>
        </header>

        {/* Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;

