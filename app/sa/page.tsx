import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Users, Building, CreditCard, Activity, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboard() {
  let tenants: any[] = [];
  try {
     tenants = await prisma.tenant.findMany({
       include: { plan: true, _count: { select: { users: true, appointments: true } } },
       orderBy: { createdAt: 'desc' },
     });
  } catch (e) {
      console.warn("DB connection failed in /sa/page, likely build time or no DB configured.", e);
      // Return empty or mock for build
      tenants = [];
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Turnero SA</h1>
          <p className="text-xs text-slate-400">Super Admin Console</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem href="/sa" icon={<Activity />} label="Dashboard" active />
          <NavItem href="/sa/tenants" icon={<Building />} label="Tenants" />
          <NavItem href="/sa/users" icon={<Users />} label="Usuarios" />
          <NavItem href="/sa/plans" icon={<CreditCard />} label="Planes" />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">A</div>
             <div className="text-sm">
               <p className="font-medium">Admin Global</p>
               <p className="text-xs text-slate-400">admin@turnero.com</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Overview Global</h2>
           <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
             New Tenant
           </button>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6 mb-8">
           <KpiCard title="Total Tenants" value={tenants.length} change="+2 this week" />
           <KpiCard title="Total Users" value={tenants.reduce((acc: any, t: any) => acc + t._count.users, 0)} change="+15 this week" />
           <KpiCard title="Active Appointments" value={tenants.reduce((acc: any, t: any) => acc + t._count.appointments, 0)} change="+120 today" />
           <KpiCard title="MRR (Est)" value={`$${tenants.reduce((acc: any, t: any) => acc + (t.plan?.priceCents || 0), 0) / 100}`} change="+5% vs last month" />
        </div>

        {/* Recent Tenants Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800 dark:text-white">Recent Tenants</h3>
             <Link href="/sa/tenants" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
           </div>
           <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase text-xs font-semibold">
               <tr>
                 <th className="px-6 py-3">Tenant</th>
                 <th className="px-6 py-3">Plan</th>
                 <th className="px-6 py-3">Status</th>
                 <th className="px-6 py-3">Users</th>
                 <th className="px-6 py-3">Created</th>
                 <th className="px-6 py-3 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
               {tenants.map((t: any) => (
                 <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                   <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <div>{t.name}</div>
                      <div className="text-xs text-slate-400">{t.slug}.turnero.com</div>
                   </td>
                   <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                        {t.plan?.name || 'No Plan'}
                      </span>
                   </td>
                   <td className="px-6 py-4">
                      <StatusBadge status={t.status} />
                   </td>
                   <td className="px-6 py-4 text-slate-500">{t._count.users}</td>
                   <td className="px-6 py-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                   <td className="px-6 py-4 text-right">
                      <Link href={`/t/${t.slug}/dashboard`} target="_blank" className="text-indigo-600 hover:underline font-medium">Impersonate</Link>
                   </td>
                 </tr>
               ))}
               {tenants.length === 0 && (
                   <tr>
                       <td colSpan={6} className="text-center py-8 text-slate-500">No tenants found (or DB not connected)</td>
                   </tr>
               )}
             </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

function KpiCard({ title, value, change }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{value}</div>
      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
        <Activity className="w-3 h-3" /> {change}
      </p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    active: 'bg-green-100 text-green-700 border-green-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
    demo: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.toUpperCase()}
    </span>
  )
}
