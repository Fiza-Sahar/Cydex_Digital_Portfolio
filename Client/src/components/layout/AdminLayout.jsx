import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Inbox,
  FolderGit2,
  Users,
  MessageSquare,
  BookOpen,
  Quote,
  UserCheck,
  Image,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('cydex_user');
      sessionStorage.clear();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Inquiries (CRM)', path: '/admin/inquiries', icon: Inbox },
    { name: 'Client Projects', path: '/admin/client-projects', icon: FolderGit2 },
    { name: 'Portfolio Projects', path: '/admin/portfolio', icon: Briefcase },
    { name: 'Services', path: '/admin/services', icon: Layers },
    { name: 'Clients', path: '/admin/clients', icon: Users },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Blog Posts', path: '/admin/blog', icon: BookOpen },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Quote },
    { name: 'Team Members', path: '/admin/team', icon: UserCheck },
    { name: 'Media Library', path: '/admin/media', icon: Image },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    { name: 'Audit Logs', path: '/admin/activity-logs', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#06161B] text-[#E5E7E7] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0c222a] border-r border-[#143542] shrink-0 select-none z-40">
        <div className="p-6 border-b border-[#143542]">
          <Logo to="/admin" />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#0AE3DA]">Admin Console</span>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'cydex-gradient text-[#06161B] shadow-[0_0_15px_rgba(10,227,218,0.3)] font-bold'
                    : 'text-[#E5E7E7]/70 hover:text-white hover:bg-[#143542]/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info and Logout in Sidebar */}
        <div className="p-4 border-t border-[#143542] bg-[#06161B]/60 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg cydex-gradient flex items-center justify-center font-bold text-[#06161B] text-xs shrink-0 shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-[#0AE3DA] truncate">Super Administrator</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <Link
              to="/"
              target="_blank"
              className="w-full py-1.5 px-3 text-xs text-[#E5E7E7]/60 hover:text-[#0AE3DA] flex items-center justify-between rounded-lg hover:bg-[#143542]/40 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Website</span>
              </span>
              <span className="text-[10px] text-[#E5E7E7]/40">↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/25 border border-red-500/25 hover:border-red-500/50 transition-all duration-200 shadow-sm"
              title="Logout from Admin Console"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-[#06161B]/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-72 bg-[#0c222a] border-r border-[#143542] z-10 p-5 h-full">
            <div className="flex items-center justify-between pb-4 border-b border-[#143542]">
              <Logo to="/admin" />
              <button onClick={() => setSidebarOpen(false)} className="text-[#E5E7E7]/60 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'cydex-gradient text-[#06161B]' : 'text-[#E5E7E7]/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-3 border-t border-[#143542] space-y-2">
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-8 h-8 rounded-lg cydex-gradient flex items-center justify-center font-bold text-[#06161B] text-xs">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-[#0AE3DA] truncate">Super Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Administrative Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-[#06161B]/95 backdrop-blur-md border-b border-[#143542] px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#E5E7E7] hover:text-[#0AE3DA] border border-[#143542] rounded-lg transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] text-[#03A094] uppercase tracking-wider font-bold">CYDEX CONTROL PANEL</span>
              <h1 className="text-xs sm:text-sm font-bold text-white">System Administration</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs text-[#0AE3DA] hover:text-white px-3 py-1.5 rounded-lg border border-[#143542] hover:border-[#0AE3DA]/50 transition-colors font-semibold"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg bg-[#0c222a] border border-[#143542]">
              <div className="w-7 h-7 rounded-md cydex-gradient flex items-center justify-center font-bold text-[#06161B] text-xs shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">{user?.name || 'Admin'}</p>
                <p className="text-[9px] text-[#0AE3DA] leading-tight">Super Admin</p>
              </div>
            </div>

            {/* Prominent Header Logout Button (Visible on both Desktop and Mobile) */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/60 transition-all duration-200 shadow-sm"
              title="Logout from Admin Console"
              id="admin-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

