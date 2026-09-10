import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiRepeat,
  FiCheckSquare,
  FiBarChart2,
  FiBell,
  FiFolder,
  FiTag,
  FiMenu,
  FiX,
  FiActivity,
} from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', path: '/', icon: FiGrid },
  { label: 'Habits', path: '/habits', icon: FiRepeat },
  { label: 'Checkins', path: '/checkins', icon: FiCheckSquare },
  { label: 'Analytics', path: '/analytics', icon: FiBarChart2 },
  { label: 'Reminders', path: '/reminders', icon: FiBell },
  { label: 'Categories', path: '/categories', icon: FiFolder },
  { label: 'Tags', path: '/tags', icon: FiTag },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const sidebar = (
    <>
      <div className="px-5 py-5 flex items-center gap-2 border-b border-stone-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
          <FiActivity className="w-4 h-4" />
        </div>
        <span className="font-bold text-lg tracking-tight">Steadica</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-stone-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
          U
        </div>
        <div className="text-sm leading-tight">
          <div className="font-medium">User</div>
          <div className="text-stone-400 text-xs">Habit Tracker</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-stone-50 text-stone-800 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 h-screen flex-col bg-white border-r border-stone-200 shrink-0">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-60 h-screen flex flex-col bg-white z-10">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-200">
          <button onClick={() => setOpen(true)} className="text-stone-600">
            <FiMenu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg tracking-tight">Steadica</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;