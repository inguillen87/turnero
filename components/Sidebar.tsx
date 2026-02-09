"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { FaInbox, FaCalendar, FaUserGroup, FaChartPie, FaGear } from "react-icons/fa6";
import { clsx } from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string || "demo";

  const links = [
    { name: "Recepción", href: `/t/${slug}/dashboard`, icon: FaInbox },
    { name: "Agenda", href: `/t/${slug}/calendar`, icon: FaCalendar },
    { name: "Pacientes", href: `/t/${slug}/clients`, icon: FaUserGroup },
    { name: "Reportes", href: `/t/${slug}/reports`, icon: FaChartPie },
    { name: "Configuración", href: `/t/${slug}/settings`, icon: FaGear },
  ];

  return (
    <div className="w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 transition-colors duration-300 h-full shrink-0">
      <div className="mb-8 flex items-center gap-3">
         <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 dark:shadow-none shrink-0">
             <span className="text-lg">TP</span>
         </div>
         <h1 className="font-bold text-slate-800 dark:text-white text-xl hidden lg:block">Turnero<span className="text-blue-600 dark:text-blue-400">Pro</span></h1>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500 dark:bg-slate-800 dark:text-blue-400 dark:border-blue-400"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              <link.icon className="w-5 h-5" />
              <span className="hidden lg:block">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 hidden lg:block">
          <div className="text-xs text-slate-400">
              <p>v1.0.0 SaaS</p>
              <p className="text-[10px] mt-1 opacity-70">Tenant: {slug}</p>
          </div>
      </div>
    </div>
  );
}
