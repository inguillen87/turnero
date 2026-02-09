"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: `/t/${slug}/dashboard`, label: "Recepción", icon: LayoutDashboard },
    { href: `/t/${slug}/calendar`, label: "Agenda", icon: Calendar },
    { href: `/t/${slug}/clients`, label: "Pacientes", icon: Users },
    { href: `/t/${slug}/settings`, label: "Configuración", icon: Settings },
  ];

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 transition-all duration-300">
         <Logo className="w-6 h-6" textClassName="text-lg" />
         <button
           onClick={() => setIsOpen(!isOpen)}
           className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
           aria-label="Menu"
         >
           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
            <Logo className="w-7 h-7" textClassName="text-lg" />
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scroll">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                    ${active
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-200 dark:ring-transparent"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-colors ${active ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-700 shadow-sm">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {slug?.substring(0, 2).toUpperCase()}
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-slate-700 dark:text-slate-200">{slug}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">Pro Plan</p>
               </div>
            </div>

            <div className="flex items-center justify-between gap-2">
               <ModeToggle />
               <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                  <LogOut className="w-4 h-4" /> Salir
               </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}
    </>
  );
}
