import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { publicService } from '../../services/publicService';
import {
  Menu,
  X,
  Mail,
  Phone,
} from 'lucide-react';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [hasBlogs, setHasBlogs] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Load site settings
  useEffect(() => {
    publicService
      .getSettings()
      .then((res) => {
        if (res.success && res.data) setSettings(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Check if any blog articles are published (Blog link hidden when 0 published)
  useEffect(() => {
    publicService
      .getBlogPosts({ limit: 1 })
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setHasBlogs(true);
        } else {
          setHasBlogs(false);
        }
      })
      .catch(() => setHasBlogs(false));
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    ...(hasBlogs ? [{ name: 'Blog', path: '/blog' }] : []),
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col selection:bg-[#0AE3DA] selection:text-[#06161B] antialiased">
      {/* ─── Fixed Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-[72px] bg-[#06161B] border-b border-[#143542]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Logo on the left */}
            <div className="flex items-center">
              <Logo size="default" />
            </div>

            {/* Navigation links centered */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm tracking-normal transition-colors py-1 relative ${
                      isActive
                        ? 'text-white font-medium border-b-2 border-[#0AE3DA]'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: Login / Admin / Client + Start a Project CTA */}
            <div className="hidden sm:flex items-center space-x-3">
              {isAuthenticated ? (
                isAdmin ? (
                  <>
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        Admin Console
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#9CA3AF] hover:text-white">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#08181F] border border-[#143542] text-xs font-mono text-[#9CA3AF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0AE3DA]"></span>
                      <span className="truncate max-w-[120px] text-white font-medium">{user?.name || 'Client'}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}

              <Link to="/contact">
                <Button variant="primary" size="sm">
                  Start a Project
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white focus:outline-none"
                aria-label="Toggle Navigation"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden fixed top-16 inset-x-0 bg-[#06161B] border-b border-[#143542] px-4 py-5 space-y-4 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto z-50">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`py-2 px-3 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'text-[#0AE3DA] font-semibold bg-[#08181F]'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#143542] flex flex-col space-y-2">
              {isAuthenticated ? (
                isAdmin ? (
                  <>
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="w-full">
                        Admin Console
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full text-[#9CA3AF] hover:text-white">
                      Logout Admin
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-1.5 text-xs text-[#9CA3AF] bg-[#08181F] border border-[#143542] rounded-md font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0AE3DA]"></span>
                      <span>Signed in as <strong className="text-white">{user?.name || 'Client'}</strong></span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
              <Link to="/contact" className="pt-1">
                <Button variant="primary" size="sm" className="w-full">
                  Start a Project
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content with top spacing for fixed header */}
      <main className="flex-1 w-full pt-16 sm:pt-[72px]">
        <Outlet />
      </main>

      {/* ─── SOBER, CONTENT-FIRST FOOTER ─── */}
      <footer className="bg-[#08181F] border-t border-[#143542] pt-12 sm:pt-20 pb-8 sm:pb-12 text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-8 sm:pb-12 border-b border-[#143542]">
            {/* Brand column */}
            <div className="lg:col-span-5 space-y-4">
              <Logo size="default" />
              <p className="text-sm leading-relaxed text-[#9CA3AF] max-w-md pt-2">
                {settings?.footerDescription ||
                  'CYDEX DIGITAL builds high-performance websites, custom software, mobile apps, and refined UI/UX designs for modern businesses worldwide.'}
              </p>
              <div className="text-xs text-[#9CA3AF] pt-1">
                <span className="font-medium text-white">Mission: </span>
                <span>Ideas • Technology • Growth</span>
              </div>
            </div>

            {/* Services Links */}
            <div className="lg:col-span-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-4">
                Services
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/services/website-development" className="hover:text-[#0AE3DA] transition-colors">
                    Website Development
                  </Link>
                </li>
                <li>
                  <Link to="/services/mobile-app-development" className="hover:text-[#0AE3DA] transition-colors">
                    Mobile App Development
                  </Link>
                </li>
                <li>
                  <Link to="/services/ui-ux-design" className="hover:text-[#0AE3DA] transition-colors">
                    UI/UX & Design Systems
                  </Link>
                </li>
                <li>
                  <Link to="/services/custom-software-development" className="hover:text-[#0AE3DA] transition-colors">
                    Custom Software Development
                  </Link>
                </li>
                <li>
                  <Link to="/services/content-writing" className="hover:text-[#0AE3DA] transition-colors">
                    Content Strategy
                  </Link>
                </li>
                <li>
                  <Link to="/services/video-editing" className="hover:text-[#0AE3DA] transition-colors">
                    Video & Motion Graphics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Navigation */}
            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="hover:text-[#0AE3DA] transition-colors">
                    About CYDEX
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-[#0AE3DA] transition-colors">
                    Featured Work
                  </Link>
                </li>
                {hasBlogs && (
                  <li>
                    <Link to="/blog" className="hover:text-[#0AE3DA] transition-colors">
                      Engineering Blog
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/contact" className="hover:text-[#0AE3DA] transition-colors">
                    Request a Quote
                  </Link>
                </li>
              </ul>
            </div>

            {/* Direct Contact info (TASK 4) */}
            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-4">
                Contact
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[#0AE3DA] shrink-0 mt-0.5" />
                  <a
                    href="mailto:cydexdigital@gmail.com"
                    className="hover:text-[#0AE3DA] transition-colors break-all"
                  >
                    cydexdigital@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0AE3DA] shrink-0" />
                  <a
                    href="tel:+923162088436"
                    className="hover:text-[#0AE3DA] transition-colors whitespace-nowrap"
                  >
                    +92 3162088436
                  </a>
                </li>
                <li className="pt-2 text-xs text-[#9CA3AF]">
                  Karachi, Pakistan (Serving Globally)
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
            <p>
              © {new Date().getFullYear()} CYDEX DIGITAL. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
