"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, Settings, LogOut, CheckCircle2, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function TenantLayoutClient({
  children,
  tenant,
  slug,
}: {
  children: React.ReactNode;
  tenant: any; // Relaxed type to allow mocks and excess properties
  slug: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-20 shadow-sm">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
               {tenant?.name?.charAt(0) || 'T'}
            </div>
            <span className="font-bold text-slate-800 dark:text-white truncate max-w-[140px]">{tenant?.name || 'Tenant'}</span>
         </div>
         <button onClick={toggleMenu} className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      {/* Sidebar (Desktop + Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 pt-16 md:pt-0 shadow-xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 hidden md:flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
             {tenant?.name?.charAt(0) || 'T'}
          </div>
          <div className="min-w-0">
             <h1 className="font-bold text-slate-800 dark:text-white truncate max-w-[140px] text-sm leading-tight">{tenant?.name || 'Tenant'}</h1>
             <p className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 font-bold uppercase tracking-wider mt-0.5"><CheckCircle2 className="w-3 h-3" /> Online</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scroll">
          <NavItem href={`/t/${slug}/dashboard`} icon={<Home className="w-5 h-5" />} label="Inicio" active={pathname === `/t/${slug}/dashboard`} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href={`/t/${slug}/calendar`} icon={<Calendar className="w-5 h-5" />} label="Agenda" active={pathname === `/t/${slug}/calendar`} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href={`/t/${slug}/clients`} icon={<Users className="w-5 h-5" />} label="Pacientes" active={pathname === `/t/${slug}/clients`} onClick={() => setIsMobileMenuOpen(false)} />

          <div className="pt-6 pb-2">
             <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sistema</p>
          </div>
          <NavItem href={`/t/${slug}/settings`} icon={<Settings className="w-5 h-5" />} label="Configuración" active={pathname === `/t/${slug}/settings`} onClick={() => setIsMobileMenuOpen(false)} />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
           <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-sm border-2 border-white dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-slate-600 transition-colors">
                 <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Mi Cuenta</p>
                 <Link href="/api/auth/signout" className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors mt-0.5">
                    <LogOut className="w-3 h-3" /> Cerrar Sesión
                 </Link>
              </div>
           </div>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-[1600px] mx-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group relative overflow-hidden ${
        active
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-500/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full"></div>}
      <span className={`transition-transform duration-200 ${active ? 'scale-105' : 'group-hover:scale-110 group-hover:rotate-3'}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
