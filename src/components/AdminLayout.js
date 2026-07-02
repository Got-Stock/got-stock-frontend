import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/button';
import Logo from './Logo';
import {
  LayoutDashboard, FileCheck, Users, Package, Truck, BarChart3, Tag, Settings,
  LogOut, Menu, X, ExternalLink
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Shared shell for the admin console: a persistent left sidebar on desktop
 * (hamburger drawer on mobile) with live pending-count badges, a top bar, and
 * the correct brand mark. Route-aware active highlighting.
 *
 * Usage:  <AdminLayout title="Overview"> ...page content... </AdminLayout>
 */
const NAV = [
  { key: 'overview',    label: 'Overview',    icon: LayoutDashboard, to: '/admin' },
  { key: 'submissions', label: 'Submissions', icon: FileCheck,       to: '/admin/submissions', badge: 'submissions' },
  { key: 'sellers',     label: 'Sellers',     icon: Users,           to: '/admin/sellers',     badge: 'sellers' },
  { key: 'products',    label: 'Products',    icon: Package,         to: '/admin/products' },
  { key: 'orders',      label: 'Orders',      icon: Truck,           to: '/admin/orders' },
  { key: 'analytics',   label: 'Analytics',   icon: BarChart3,       to: '/admin/analytics-dashboard' },
  { key: 'categories',  label: 'Categories',  icon: Tag,             to: '/admin/category-manager' },
  { key: 'settings',    label: 'Settings',    icon: Settings,        to: '/admin/settings' },
];

function activeKeyFrom(pathname) {
  if (pathname.startsWith('/admin/submissions')) return 'submissions';
  if (pathname.startsWith('/admin/sellers')) return 'sellers';
  if (pathname.startsWith('/admin/products')) return 'products';
  if (pathname.startsWith('/admin/orders') || pathname.startsWith('/admin/tracking')) return 'orders';
  if (pathname.startsWith('/admin/analytics')) return 'analytics';
  if (pathname.startsWith('/admin/category')) return 'categories';
  if (pathname.startsWith('/admin/settings')) return 'settings';
  return 'overview';
}

export default function AdminLayout({ title, children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({ submissions: 0, sellers: 0 });

  const activeKey = activeKeyFrom(location.pathname);

  useEffect(() => {
    let cancelled = false;
    axios.get(`${API}/stats`, { withCredentials: true })
      .then((res) => {
        if (cancelled) return;
        setCounts({
          submissions: res.data?.pending_approval || 0,
          sellers: res.data?.pending_sellers || 0,
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'A';

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-100 px-6 py-6">
        <Logo to="/" size="sm" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#FF3CFE]">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = activeKey === item.key;
          const badge = item.badge ? counts[item.badge] : 0;
          return (
            <button
              key={item.key}
              onClick={() => { setMobileMenuOpen(false); navigate(item.to); }}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3CFE]/40 ${
                active ? 'bg-[#FF3CFE]/10 text-[#FF3CFE]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#FF3CFE]" />}
              <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-[#FF3CFE]' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {badge > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF3CFE] px-1.5 text-[11px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-100 p-3">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View site
        </Button>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3CFE] to-black text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          data-testid="logout-btn"
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <SidebarContent />
          </div>
        </aside>

        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-gray-200 bg-white shadow-xl">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute right-3 top-4 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3CFE]/40"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent />
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3CFE]/40 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs capitalize text-gray-500">{user?.role || 'admin'}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3CFE] to-black text-sm font-bold text-white">
                {initial}
              </div>
            </div>
          </header>

          <main key={location.pathname} className="gs-fade-up mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
