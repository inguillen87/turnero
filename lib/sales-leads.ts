import { prisma } from "@/lib/db";
import { enrichMetaWithLeadTicket } from "@/lib/leads";

const SALES_TENANT_SLUG = "turnero-sales-hub";

function randomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeMessage(value: string) {
  return (value || "").trim();
}

function extractEmail(message: string): string | undefined {
  const match = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0];
}

function inferOfferType(message: string): "full_suite" | "whatsapp_crm_agenda" | "whatsapp_only" | "crm_agenda" | "unknown" {
  const text = message.toLowerCase();
  if (text.includes("completa") || text.includes("full") || text.includes("todo")) return "full_suite";
  if (text.includes("solo whatsapp") || text.includes("solamente whatsapp")) return "whatsapp_only";
  if ((text.includes("crm") || text.includes("agenda")) && text.includes("whatsapp")) return "whatsapp_crm_agenda";
  if (text.includes("crm") || text.includes("agenda") || text.includes("turnos")) return "crm_agenda";
  return "unknown";
}

async function ensureSalesTenant() {
  return prisma.tenant.upsert({
    where: { slug: SALES_TENANT_SLUG },
    update: {},
    create: {
      slug: SALES_TENANT_SLUG,
      name: "Turnero Growth CRM",
      status: "active",
      plan: "enterprise",
      planStatus: "ACTIVE",
    },
  });
}

export async function registerSalesLead(params: {
  message: string;
  anonId?: string;
  source?: "widget" | "web";
}) {
  const salesTenant = await ensureSalesTenant();
  const message = normalizeMessage(params.message);
  const email = extractEmail(message);
  const contactKey = `web:${params.anonId || randomId()}`;

  const contact = await prisma.contact.upsert({
    where: { tenantId_phoneE164: { tenantId: salesTenant.id, phoneE164: contactKey } },
    update: {
      lastSeen: new Date(),
      email: email || undefined,
    },
    create: {
      tenantId: salesTenant.id,
      phoneE164: contactKey,
      email: email || undefined,
      name: "Prospecto Web",
      lastSeen: new Date(),
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      tenantId: salesTenant.id,
      contactId: contact.id,
      channel: "WIDGET",
      state: JSON.stringify({ pipeline: "superadmin_sales" }),
    },
  });

  await prisma.message.create({
    data: {
      tenantId: salesTenant.id,
      conversationId: conversation.id,
      contactId: contact.id,
      direction: "IN",
      body: message,
      status: "received",
    },
  });

  const enriched = enrichMetaWithLeadTicket({
    meta: contact.meta,
    message,
    source: params.source || "widget",
    channel: "WIDGET",
    tenantRubros: ["clinica", "psicologia", "pyme", "profesional"],
  });

  const offerType = inferOfferType(message);
  const parsedMeta = (() => {
    try {
      return enriched.meta ? JSON.parse(enriched.meta) : {};
    } catch {
      return {};
    }
  })();

  const finalMeta = JSON.stringify({ ...parsedMeta, offerType });

  await prisma.contact.update({
    where: { id: contact.id },
    data: { meta: finalMeta },
  });

  return { contactId: contact.id, offerType, ticket: enriched.leadTicket };
}

export { SALES_TENANT_SLUG };
