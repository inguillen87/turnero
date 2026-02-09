import { Sidebar } from "@/components/Sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mock Sidebar for SA - in real app, separate component */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden lg:block">
         <div className="font-bold text-xl mb-8 flex items-center gap-2">
           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">S</div>
           Super Admin
         </div>
         <nav className="space-y-1">
            <div className="px-4 py-2 bg-white/10 rounded-lg font-medium text-sm">Tenants</div>
            <div className="px-4 py-2 text-slate-400 hover:text-white rounded-lg font-medium text-sm transition-colors">Usuarios</div>
            <div className="px-4 py-2 text-slate-400 hover:text-white rounded-lg font-medium text-sm transition-colors">Planes</div>
            <div className="px-4 py-2 text-slate-400 hover:text-white rounded-lg font-medium text-sm transition-colors">Audit Logs</div>
         </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
