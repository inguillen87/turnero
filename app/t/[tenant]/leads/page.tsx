import { prisma } from "@/lib/db";
import { extractLeadTickets, LeadTicket } from "@/lib/leads";

export const dynamic = "force-dynamic";

type LeadRow = LeadTicket & {
  contactName: string;
  phone: string;
};

export default async function LeadsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;

  let leads: LeadRow[] = [];

  try {
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (tenant) {
      const contacts = await prisma.contact.findMany({
        where: { tenantId: tenant.id },
        orderBy: { lastSeen: "desc" },
      });

      leads = contacts.flatMap((contact) =>
        extractLeadTickets(contact.meta).map((lead) => ({
          ...lead,
          contactName: contact.name || "Prospecto sin nombre",
          phone: contact.phoneE164,
        }))
      );
    }
  } catch {
    leads = [];
  }

  const open = leads.filter((l) => l.status === "open").length;
  const qualified = leads.filter((l) => l.status === "qualified").length;
  const hot = leads.filter((l) => l.priority === "hot").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tickets Leads CRM</h1>
        <p className="text-slate-500">Prospectos detectados por el BOT IA y clasificados por rubro e intención comercial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Leads abiertos" value={open} />
        <StatCard title="Leads calificados" value={qualified} />
        <StatCard title="Prioridad alta" value={hot} />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500">
            <tr>
              <th className="text-left px-4 py-3">Prospecto</th>
              <th className="text-left px-4 py-3">Rubro</th>
              <th className="text-left px-4 py-3">Intento</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Último mensaje</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">Aún no hay leads. Cuando entren consultas por WhatsApp o widget, aparecerán aquí.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{lead.contactName}</p>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{lead.rubro}</td>
                  <td className="px-4 py-3 capitalize">{lead.intent}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">{lead.score}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-md">{lead.lastMessage}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
