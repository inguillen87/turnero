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


function extractPhone(message: string): string | undefined {
  const m = message.match(/(\+?\d[\d\s\-()]{7,}\d)/);
  if (!m) return undefined;
  const normalized = m[1].replace(/[^\d+]/g, "");
  return normalized.length >= 8 ? normalized : undefined;
}

function extractName(message: string): string | undefined {
  const m = message.match(/(?:soy|me llamo|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,40})/i);
  return m?.[1]?.trim();
}

function extractCompany(message: string): string | undefined {
  const m = message.match(/(?:empresa|negocio|cl[ií]nica|estudio|gimnasio)\s*[:\-]?\s*([A-Za-z0-9ÁÉÍÓÚÑáéíóúñ\s]{2,60})/i);
  return m?.[1]?.trim();
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
  rubro?: string;
}) {
  const salesTenant = await ensureSalesTenant();
  const message = normalizeMessage(params.message);
  const email = extractEmail(message);
  const phone = extractPhone(message);
  const detectedName = extractName(message);
  const detectedCompany = extractCompany(message);
  const anonKey = `web:${params.anonId || randomId()}`;
  const contactKey = phone || anonKey;

  const contact = await prisma.contact.upsert({
    where: { tenantId_phoneE164: { tenantId: salesTenant.id, phoneE164: contactKey } },
    update: {
      lastSeen: new Date(),
      email: email || undefined,
      name: detectedName || undefined,
    },
    create: {
      tenantId: salesTenant.id,
      phoneE164: phone || contactKey,
      email: email || undefined,
      name: detectedName || "Prospecto Web",
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
    tenantRubros: ["clinica", "psicologia", "odontologia", "estetica", "gimnasio", "veterinaria", "educacion", "legal", "inmobiliaria", "general"],
  });

  const offerType = inferOfferType(message);
  const parsedMeta = (() => {
    try {
      return enriched.meta ? JSON.parse(enriched.meta) : {};
    } catch {
      return {};
    }
  })();

  const finalMeta = JSON.stringify({
    ...parsedMeta,
    offerType,
    rubro: params.rubro || parsedMeta?.rubro || "general",
    leadProfile: {
      name: detectedName || contact.name,
      email: email || contact.email,
      phone: phone || contact.phoneE164,
      company: detectedCompany || parsedMeta?.leadProfile?.company,
      source: params.source || "widget",
    },
  });

  await prisma.contact.update({
    where: { id: contact.id },
    data: { meta: finalMeta },
  });


  await prisma.message.create({
    data: {
      tenantId: salesTenant.id,
      conversationId: conversation.id,
      contactId: contact.id,
      direction: "OUT",
      body: `FOLLOWUP | Rubro: ${params.rubro || "general"} | Oferta: ${offerType} | Email: ${email || "n/d"} | Tel: ${phone || "n/d"}`,
      status: "queued",
    },
  });

  return { contactId: contact.id, offerType, ticket: enriched.leadTicket };
}

export { SALES_TENANT_SLUG };
