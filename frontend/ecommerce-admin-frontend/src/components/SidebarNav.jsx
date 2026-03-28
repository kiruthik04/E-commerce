import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, BarChart2,
  ShieldCheck, ChevronRight
} from 'lucide-react';

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sellers', icon: Store,           label: 'Sellers' },
  { to: '/users',   icon: Users,           label: 'Users' },
  { to: '/reports', icon: BarChart2,       label: 'Reports' },
];

const SidebarNav = () => (
  <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-40">
    {/* Logo */}
    <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-800">
      <span className="bg-violet-500/20 p-2.5 rounded-xl">
        <ShieldCheck className="h-5 w-5 text-violet-400" />
      </span>
      <div>
        <p className="font-bold text-white text-sm leading-tight">Admin Portal</p>
        <p className="text-[11px] text-gray-500">Smart E-commerce</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              isActive
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
          }>
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{label}</span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition" />
        </NavLink>
      ))}
    </nav>

    <div className="px-3 py-4 border-t border-gray-800">
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">A</span>
        <div>
          <p className="text-xs font-semibold text-white">Admin User</p>
          <p className="text-[10px] text-gray-500">Port 8094</p>
        </div>
      </div>
    </div>
  </aside>
);

export default SidebarNav;
