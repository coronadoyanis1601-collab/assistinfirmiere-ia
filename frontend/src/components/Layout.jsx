import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { LayoutDashboard, PhoneCall, Settings, LogOut, Menu, X, Stethoscope, Bell } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { to: '/app', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/app/appels', label: 'Appels reçus', icon: PhoneCall },
    { to: '/app/configuration', label: 'Mon assistant', icon: Settings },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-5 border-b border-teal-700">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-teal-700" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">Assist&apos;Infirmière IA</div>
          <div className="text-teal-200 text-xs">Tableau de bord</div>
        </div>
      </div>

      <div className="px-3 py-4 flex-1">
        <div className="text-teal-300 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Navigation</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-teal-800' : 'text-teal-100 hover:bg-teal-700'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="border-t border-teal-700 p-4">
        <div className="text-teal-200 text-xs mb-3">
          <div className="font-medium text-white">{user?.prenom} {user?.nom}</div>
          <div className="truncate">{user?.email}</div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-teal-200 hover:text-white text-sm transition-colors">
          <LogOut className="w-4 h-4" />Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-teal-800 flex-shrink-0">
        <NavContent />
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-teal-800 flex flex-col z-10">
            <button className="absolute top-4 right-4 text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <span className="font-semibold text-teal-800 text-sm">Assist&apos;Infirmière IA</span>
          </div>
          <div className="w-5" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
