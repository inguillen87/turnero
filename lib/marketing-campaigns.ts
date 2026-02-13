export type CampaignTemplate = {
  id: string;
  name: string;
  rubro?: string;
  message: string;
  flyerUrl?: string;
  createdAt: string;
};

export type CampaignHistoryItem = {
  id: string;
  status: "sent" | "scheduled";
  message: string;
  flyerUrl?: string;
  sent: number;
  failed: number;
  attempted: number;
  createdAt: string;
  scheduledAt?: string;
  segmentation?: {
    rubro?: string;
    tag?: string;
    lastSeenDays?: number;
  };
};

export type CampaignStorage = {
  templates: CampaignTemplate[];
  history: CampaignHistoryItem[];
  scheduled: CampaignHistoryItem[];
  optOutPhones: string[];
};

export function defaultCampaignStorage(): CampaignStorage {
  return { templates: [], history: [], scheduled: [], optOutPhones: [] };
}

export function parseCampaignStorage(raw?: string | null): CampaignStorage {
  if (!raw) return defaultCampaignStorage();
  try {
    const parsed = JSON.parse(raw);
    return {
      templates: Array.isArray(parsed.templates) ? parsed.templates : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      scheduled: Array.isArray(parsed.scheduled) ? parsed.scheduled : [],
      optOutPhones: Array.isArray(parsed.optOutPhones) ? parsed.optOutPhones : [],
    };
  } catch {
    return defaultCampaignStorage();
  }
}

export function isOptOutMessage(message: string) {
  const m = (message || "").trim().toLowerCase();
  return ["baja", "stop", "unsubscribe", "salir", "cancelar suscripcion"].includes(m);
}

export function normalizePhone(phone: string) {
  const p = (phone || "").trim();
  if (!p) return "";
  return p.startsWith("+") ? p : `+${p.replace(/[^\d]/g, "")}`;
}

export function matchesSegmentation(
  contact: { phoneE164: string; tags?: string | null; lastSeen?: Date | null; meta?: string | null },
  segmentation: { rubro?: string; tag?: string; lastSeenDays?: number },
  optOutPhones: string[]
) {
  const normalizedPhone = normalizePhone(contact.phoneE164);
  if (!normalizedPhone || optOutPhones.includes(normalizedPhone)) return false;

  if (segmentation.lastSeenDays && contact.lastSeen) {
    const threshold = new Date(Date.now() - segmentation.lastSeenDays * 24 * 60 * 60 * 1000);
    if (contact.lastSeen < threshold) return false;
  }

  if (segmentation.tag) {
    const tagNeedle = segmentation.tag.toLowerCase();
    const tagsRaw = contact.tags || "";
    if (!tagsRaw.toLowerCase().includes(tagNeedle)) return false;
  }

  if (segmentation.rubro) {
    const meta = contact.meta || "";
    if (!meta.toLowerCase().includes(segmentation.rubro.toLowerCase())) return false;
  }

  return true;
}

export function buildCampaignStats(history: CampaignHistoryItem[]) {
  const totals = history.reduce(
    (acc, h) => {
      acc.sent += h.sent || 0;
      acc.failed += h.failed || 0;
      acc.campaigns += 1;
      return acc;
    },
    { sent: 0, failed: 0, campaigns: 0 }
  );

  const deliveryRate = totals.sent + totals.failed > 0 ? Math.round((totals.sent / (totals.sent + totals.failed)) * 100) : 0;
  return { ...totals, deliveryRate };
}
