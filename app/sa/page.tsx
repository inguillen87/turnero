import { prisma } from "@/lib/db";
import { extractLeadTickets } from "@/lib/leads";
import { SALES_TENANT_SLUG } from "@/lib/sales-leads";
import { Users, Building, Activity, DollarSign, TrendingUp, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboard() {
  const tenantsCount = await prisma.tenant.count();
  const usersCount = await prisma.user.count();
  const activeTenants = await prisma.tenant.count({ where: { planStatus: "ACTIVE" } });

  // Mock revenue for demo
  const revenue = activeTenants * 30000;

  const recentTenants = await prisma.tenant.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true } } }
  });

  const contactsWithMeta = await prisma.contact.findMany({
    where: { meta: { not: null } },
    include: { tenant: { select: { slug: true, name: true } } },
    take: 120,
    orderBy: { lastSeen: "desc" },
  });

  const leadPool = contactsWithMeta.flatMap((contact) => {
    const meta = (() => {
      try {
        return contact.meta ? JSON.parse(contact.meta) : {};
      } catch {
        return {} as any;
      }
    })();

    return extractLeadTickets(contact.meta).map((lead) => ({
      ...lead,
      tenantName: contact.tenant.name,
      tenantSlug: contact.tenant.slug,
      phone: contact.phoneE164,
      contactName: contact.name || "Prospecto",
      offerType: meta.offerType || "unknown",
    }));
  });

  const salesOwnerLeads = leadPool.filter((l) => l.tenantSlug === SALES_TENANT_SLUG);
  const tenantOperationalLeads = leadPool.filter((l) => l.tenantSlug !== SALES_TENANT_SLUG);

  const totalLeads = tenantOperationalLeads.length;
  const hotLeads = tenantOperationalLeads.filter((l) => l.priority === "hot").length;

  const ownerFullSuite = salesOwnerLeads.filter((l) => l.offerType === "full_suite").length;
  const ownerModular = salesOwnerLeads.filter((l) => ["whatsapp_crm_agenda", "whatsapp_only", "crm_agenda"].includes(l.offerType)).length;

  const sellerWhatsapp = (process.env.SALES_WHATSAPP_E164 || "+5492613168608").replace(/\D/g, "");
  const sellerName = process.env.SALES_SELLER_NAME || "Marce";
  const sellerLink = `https://wa.me/${sellerWhatsapp}?text=${encodeURIComponent("Hola Marce, quiero cerrar una demo de Turnero Pro")}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
               Export Report
            </button>
            <a href={sellerLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
               💬 Contactar a {sellerName}
            </a>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
               + New Tenant
            </button>
         </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tenants"
          value={tenantsCount.toString()}
          change="+12% this month"
          icon={<Building className="w-6 h-6 text-indigo-600" />}
          color="indigo"
        />
        <MetricCard
          title="Active Subscriptions"
          value={activeTenants.toString()}
          change="+5% this week"
          icon={<Activity className="w-6 h-6 text-emerald-600" />}
          color="emerald"
        />
        <MetricCard
          title="Total Users"
          value={usersCount.toString()}
          change="+8% this month"
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Monthly Revenue (Est)"
          value={`$${revenue.toLocaleString()}`}
          change="+15% vs last month"
          icon={<DollarSign className="w-6 h-6 text-amber-600" />}
          color="amber"
        />
        <MetricCard
          title="Leads Clientes (Tenants)"
          value={totalLeads.toString()}
          change="pipeline operativo"
          icon={<Users className="w-6 h-6 text-fuchsia-600" />}
          color="fuchsia"
        />
        <MetricCard
          title="Leads Hot (Tenants)"
          value={hotLeads.toString()}
          change="oportunidades calientes"
          icon={<TrendingUp className="w-6 h-6 text-rose-600" />}
          color="rose"
        />
        <MetricCard
          title="Prospectos Dueño Full Suite"
          value={ownerFullSuite.toString()}
          change="bot comercial"
          icon={<Building className="w-6 h-6 text-cyan-600" />}
          color="cyan"
        />
        <MetricCard
          title="Prospectos Dueño Modular"
          value={ownerModular.toString()}
          change="WhatsApp/CRM/Agenda"
          icon={<Activity className="w-6 h-6 text-violet-600" />}
          color="violet"
        />
      </div>

      {/* Recent Tenants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" /> Recent Signups
           </h3>
           <a href="/sa/tenants" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</a>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Tenant Name</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Users</th>
              <th className="px-6 py-4">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentTenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                         {t.slug.substring(0, 2)}
                      </div>
                      <div>
                         <p>{t.name}</p>
                         <p className="text-xs text-slate-400 font-normal">{t.slug}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {t.plan || 'Free'}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      t.planStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      t.planStatus === 'DEMO' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                   }`}>
                      {t.planStatus || 'Unknown'}
                   </span>
                </td>
                <td className="px-6 py-4">{t._count.users}</td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Lead Tickets Operativos (Tenants clientes)</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Tenant</th>
              <th className="px-6 py-4">Prospecto</th>
              <th className="px-6 py-4">Rubro</th>
              <th className="px-6 py-4">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenantOperationalLeads.slice(0, 8).map((lead) => (
              <tr key={`${lead.id}-${lead.tenantSlug}`}>
                <td className="px-6 py-4">{lead.tenantName}</td>
                <td className="px-6 py-4">{lead.contactName} <span className="text-xs text-slate-400">{lead.phone}</span></td>
                <td className="px-6 py-4 capitalize">{lead.rubro}</td>
                <td className="px-6 py-4">{lead.score}</td>
              </tr>
            ))}
            {tenantOperationalLeads.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Sin leads cargados aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Prospectos Comerciales del Dueño (Bot IA)</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Prospecto</th>
              <th className="px-6 py-4">Rubro</th>
              <th className="px-6 py-4">Interés</th>
              <th className="px-6 py-4">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salesOwnerLeads.slice(0, 8).map((lead) => (
              <tr key={`${lead.id}-owner`}>
                <td className="px-6 py-4">{lead.contactName} <span className="text-xs text-slate-400">{lead.phone}</span></td>
                <td className="px-6 py-4 capitalize">{lead.rubro}</td>
                <td className="px-6 py-4 capitalize">{String(lead.offerType).replaceAll('_', ' ')}</td>
                <td className="px-6 py-4">{lead.score}</td>
              </tr>
            ))}
            {salesOwnerLeads.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Sin prospectos del bot comercial aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>
</div>
  );
}

function MetricCard({ title, value, change, icon, color }: any) {
   return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
         <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-${color}-50`}>
               {icon}
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
               <TrendingUp className="w-3 h-3" /> {change}
            </span>
         </div>
         <p className="text-slate-500 text-sm font-medium">{title}</p>
         <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
   );
}
