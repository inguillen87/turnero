import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Users, PlusCircle, Settings, LogOut, PieChart, Bell, Search, Activity, CreditCard } from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    // For demo purposes, we might allow non-super admins to see the landing or redirect strictly
    // redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col z-30 shadow-sm transition-all duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Turnero<span className="text-indigo-600">Pro</span></h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>

          <Link href="/sa" className="group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 active:scale-95">
            <PieChart className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Dashboard
          </Link>

          <Link href="/sa/tenants" className="group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 active:scale-95">
            <Users className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Tenants
            <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold group-hover:bg-indigo-100 group-hover:text-indigo-700">Active</span>
          </Link>

          <Link href="/sa/tenants/create" className="group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 active:scale-95">
            <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Provision Tenant
          </Link>

          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">System</p>

          <Link href="/sa/settings" className="group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 active:scale-95">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Settings
          </Link>

           <Link href="/sa/billing" className="group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 active:scale-95">
            <CreditCard className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Billing Overview
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">SA</div>
                 <div>
                    <p className="text-sm font-semibold text-slate-800">Super Admin</p>
                    <p className="text-xs text-slate-500">admin@turnero.pro</p>
                 </div>
              </div>
           </div>
          <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-600 cursor-pointer rounded-xl hover:bg-red-50 transition-colors">
             <LogOut className="w-5 h-5" /> Sign out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
           <div className="flex items-center gap-4 w-96">
              <div className="relative w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input
                   type="text"
                   placeholder="Search tenants, users..."
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-600 placeholder:text-slate-400"
                 />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
                 <Activity className="w-5 h-5" />
              </button>
           </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
