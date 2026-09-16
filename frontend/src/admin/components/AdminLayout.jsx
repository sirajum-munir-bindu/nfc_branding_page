import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  MessageSquare, HelpCircle, Palette, Settings, 
  LogOut, ExternalLink, Menu, X, Radio, Bell, 
  Search, ShieldCheck 
} from 'lucide-react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Testimonials', path: '/admin/testimonials', icon: ShieldCheck },
    { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Card Designs', path: '/admin/card-designs', icon: Palette },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const active = navItems.find((item) => location.pathname === item.path);
    return active ? active.name : 'Admin Portal';
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0f1d] border-r border-white/[0.08] shrink-0 sticky top-0 h-screen z-30 justify-between">
        <div>
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <NavLink to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-[1.5px]">
                <div className="w-full h-full bg-[#070b13] rounded-[10px] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white leading-tight">
                  TapCard<span className="text-cyan-400 font-mono text-xs ml-1">OS</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Management Suite</span>
              </div>
            </NavLink>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
              {user?.first_name ? user.first_name[0] : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {user?.full_name || 'Admin User'}
              </p>
              <p className="text-[10px] font-mono text-slate-400 truncate">
                {user?.email || 'admin@tapcard.com'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#090e1b]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Public Store</span>
            </a>

            <div className="relative p-2 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
            </div>
          </div>
        </header>

        {mobileSidebarOpen && (
          <div className="md:hidden bg-[#0a0f1d] border-b border-white/10 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <div className="pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
