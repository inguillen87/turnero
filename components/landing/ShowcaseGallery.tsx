"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Tone = "indigo" | "emerald" | "violet";

const ITEMS = [
  {
    title: "Admin Bot Inteligente",
    subtitle: "Consultas rápidas para organizar tu semana",
    imageSrc: "/demo-previews/admin-bot.svg",
    bullets: [
      "¿Qué día me conviene tomarme libre?",
      "Si cierro al mediodía, ¿cuántos turnos impacto?",
      "¿Cómo armo mini vacaciones sin romper agenda?",
    ],
    tone: "indigo" as Tone,
  },
  {
    title: "Agenda Operativa Nativa",
    subtitle: "Bloqueos, conflictos y huecos sugeridos",
    imageSrc: "/demo-previews/agenda.svg",
    bullets: [
      "Bloqueos por vacaciones/remodelación",
      "Sugerencias automáticas de horarios libres",
      "Turno rápido en 1 click desde calendario",
    ],
    tone: "emerald" as Tone,
  },
  {
    title: "Marketing + CRM",
    subtitle: "Campañas y journeys con control total",
    imageSrc: "/demo-previews/crm.svg",
    bullets: [
      "Plantillas y envíos programados",
      "Journeys de reactivación / pago pendiente",
      "Exportes PDF y Excel para operación",
    ],
    tone: "violet" as Tone,
  },
];

export function ShowcaseGallery() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<null | number>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const current = ITEMS[active];
  const toneClass = useMemo(
    () =>
      ({
        indigo: "from-indigo-500/15 to-indigo-100/70 dark:from-indigo-900/30 dark:to-indigo-800/10 border-indigo-200/80 dark:border-indigo-800",
        emerald: "from-emerald-500/15 to-emerald-100/70 dark:from-emerald-900/30 dark:to-emerald-800/10 border-emerald-200/80 dark:border-emerald-800",
        violet: "from-violet-500/15 to-violet-100/70 dark:from-violet-900/30 dark:to-violet-800/10 border-violet-200/80 dark:border-violet-800",
      })[current.tone],
    [current.tone]
  );

  const go = (next: number) => setActive((next + ITEMS.length) % ITEMS.length);

  return (
    <>
      <div className="hidden md:grid md:grid-cols-3 gap-6 mb-10">
        {ITEMS.map((item) => (
          <ShowcaseCard key={item.title} item={item} onPreviewClick={() => setLightbox(ITEMS.findIndex((x) => x.title === item.title))} />
        ))}
      </div>

      <div className="md:hidden mb-10">
        <div
          className={`rounded-2xl border bg-gradient-to-br ${toneClass} p-5 shadow-sm transition-all duration-300`}
          onTouchStart={(e) => setTouchStartX(e.changedTouches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (delta > 40) go(active - 1);
            if (delta < -40) go(active + 1);
            setTouchStartX(null);
          }}
        >
          <ShowcaseCard item={current} onPreviewClick={() => setLightbox(active)} compact />
          <div className="mt-4 flex items-center justify-between">
            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700" onClick={() => go(active - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {ITEMS.map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i === active ? "bg-indigo-500" : "bg-slate-300"}`} />
              ))}
            </div>
            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700" onClick={() => go(active + 1)}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <button className="absolute inset-0" onClick={() => setLightbox(null)} aria-label="Cerrar preview" />
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl border border-slate-700 p-3">
            <button className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full p-2" onClick={() => setLightbox(null)}>
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden">
              <Image src={ITEMS[lightbox].imageSrc} alt={ITEMS[lightbox].title} fill className="object-cover" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShowcaseCard({
  item,
  onPreviewClick,
  compact = false,
}: {
  item: (typeof ITEMS)[number];
  onPreviewClick: () => void;
  compact?: boolean;
}) {
  const toneClass = {
    indigo: "from-indigo-500/15 to-indigo-100/70 dark:from-indigo-900/30 dark:to-indigo-800/10 border-indigo-200/80 dark:border-indigo-800",
    emerald: "from-emerald-500/15 to-emerald-100/70 dark:from-emerald-900/30 dark:to-emerald-800/10 border-emerald-200/80 dark:border-emerald-800",
    violet: "from-violet-500/15 to-violet-100/70 dark:from-violet-900/30 dark:to-violet-800/10 border-violet-200/80 dark:border-violet-800",
  }[item.tone];

  return (
    <div className={`${compact ? "" : `rounded-2xl border bg-gradient-to-br ${toneClass} p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}`}>
      <button onClick={onPreviewClick} className="rounded-xl border border-white/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 p-2 mb-4 w-full text-left group">
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-slate-200/70 dark:border-slate-700">
          <Image src={item.imageSrc} alt={`Preview ${item.title}`} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
        </div>
      </button>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{item.subtitle}</p>
      <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
        {item.bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}
