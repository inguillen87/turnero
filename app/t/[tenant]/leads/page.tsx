import { prisma } from "@/lib/db";
import { extractLeadTickets, LeadTicket } from "@/lib/leads";
import LeadsTableClient from "./LeadsTableClient";

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

      <LeadsTableClient leads={leads} />
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
