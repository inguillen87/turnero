"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, Settings, LogOut, CheckCircle2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function TenantLayoutClient({
  children,
  tenant,
  slug,
}: {
  children: React.ReactNode;
  tenant: { name: string; };
  slug: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-20">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
               {tenant.name.charAt(0)}
            </div>
            <span className="font-bold text-slate-800 dark:text-white truncate max-w-[140px]">{tenant.name}</span>
         </div>
         <button onClick={toggleMenu} className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      {/* Sidebar (Desktop + Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 pt-16 md:pt-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
             {tenant.name.charAt(0)}
          </div>
          <div>
             <h1 className="font-bold text-slate-800 dark:text-white truncate max-w-[140px]">{tenant.name}</h1>
             <p className="text-xs text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3" /> Online</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem href={`/t/${slug}/dashboard`} icon={<Home />} label="Inicio" active={pathname === `/t/${slug}/dashboard`} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href={`/t/${slug}/calendar`} icon={<Calendar />} label="Agenda" active={pathname === `/t/${slug}/calendar`} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href={`/t/${slug}/clients`} icon={<Users />} label="Pacientes" active={pathname === `/t/${slug}/clients`} onClick={() => setIsMobileMenuOpen(false)} />
          <div className="pt-4 pb-2">
             <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sistema</p>
          </div>
          <NavItem href={`/t/${slug}/settings`} icon={<Settings />} label="Configuración" active={pathname === `/t/${slug}/settings`} onClick={() => setIsMobileMenuOpen(false)} />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
           <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium">
             <LogOut className="w-4 h-4" /> Cerrar Sesión
           </Link>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-0 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full">
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm group ${active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400'}`}
    >
      <span className={`transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
