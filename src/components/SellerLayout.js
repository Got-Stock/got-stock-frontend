import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/button';
import Logo from './Logo';
import {
  LayoutDashboard, Package, PlusCircle, ShoppingBag, TrendingUp, Truck, User,
  LogOut, Menu, X
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Shared shell for the seller portal: a persistent left sidebar on desktop
 * that collapses to a hamburger drawer on mobile, plus a top bar with the
 * page title and the signed-in user. Route-aware — it highlights the active
 * nav item from the current URL.
 *
 * Usage:  <SellerLayout title="My Products"> ...page content... </SellerLayout>
 */
const NAV = [
  { key: 'overview',  label: 'Overview',    icon: LayoutDashboard, to: '/dashboard' },
  { key: 'products',  label: 'My Products', icon: Package,         to: '/products' },
  { key: 'add',       label: 'Add Product', icon: PlusCircle,      to: '/products/new-v3', gated: true },
  { key: 'orders',    label: 'Orders',      icon: ShoppingBag,     to: '/seller/orders' },
  { key: 'analytics', label: 'Analytics',   icon: TrendingUp,      to: '/seller/analytics' },
  { key: 'tracking',  label: 'Tracking',    icon: Truck,           to: '/dashboard/tracking' },
  { key: 'profile',   label: 'Profile',     icon: User,            to: '/dashboard?tab=profile' },
];

function activeKeyFrom(pathname, search) {
  if (pathname === '/products') return 'products';
  if (pathname === '/products/new-v3' || pathname === '/products/new') return 'add';
  if (pathname === '/seller/orders') return 'orders';
  if (pathname === '/seller/analytics') return 'analytics';
  if (pathname.startsWith('/dashboard/tracking')) return 'tracking';
  if (pathname === '/dashboard' && search.includes('profile')) return 'profile';
  return 'overview';
}

export default function SellerLayout({ title, children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeKey = activeKeyFrom(location.pathname, location.search);
  const isApproved = user?.seller_status === 'approved';

  const go = (item) => {
    setMobileMenuOpen(false);
    if (item.gated && !isApproved) {
      toast.error('Product submission unlocks once your seller account is approved.');
      return;
    }
    navigate(item.to);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-100 px-6 py-6">
        <Logo to="/" size="sm" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#FF3CFE]">Seller Portal</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = activeKey === item.key;
          const locked = item.gated && !isApproved;
          return (
            <button
              key={item.key}
              onClick={() => go(item)}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3CFE]/40 ${
                active
                  ? 'bg-[#FF3CFE]/10 text-[#FF3CFE]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#FF3CFE]" />}
              <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-[#FF3CFE]' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {locked && <span className="text-[10px] font-semibold uppercase text-gray-400">Locked</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3CFE] to-black text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          data-testid="logout-btn"
          variant="ghost"
          className="mt-1 w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
        {/* Desktop sidebar (in-flow so the global footer isn't covered) */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
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

        {/* Content column */}
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
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs capitalize text-gray-500">{user?.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3CFE] to-black text-sm font-bold text-white">
                {initial}
              </div>
            </div>
          </header>

          <main key={location.pathname + location.search} className="gs-fade-up mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
