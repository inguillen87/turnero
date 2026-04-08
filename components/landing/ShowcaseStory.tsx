"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, CalendarClock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: "friccion",
    title: "Fricción operativa",
    problem: "Agenda desordenada, huecos improductivos y decisiones a ciegas.",
    automation: "Turnero detecta capacidad real y propone bloques inteligentes.",
    result: "Operación estable y menos caos diario.",
    icon: CalendarClock,
  },
  {
    id: "automatizacion",
    title: "Automatización real",
    problem: "Confirmar por WhatsApp manualmente consume al equipo.",
    automation: "Flujos automáticos para confirmar, reprogramar y recuperar no-shows.",
    result: "Más ocupación sin sumar carga administrativa.",
    icon: Bot,
  },
  {
    id: "crecimiento",
    title: "Crecimiento medible",
    problem: "Sin métricas, no sabés qué mejorar cada semana.",
    automation: "Tablero financiero + conversacional con señales accionables.",
    result: "Más caja, mejor previsión y decisiones con datos.",
    icon: TrendingUp,
  },
];

export function ShowcaseStory() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.index ?? 0);
          setActive(idx);
        });
      },
      { threshold: 0.6, rootMargin: "-10% 0px -25% 0px" }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ActiveIcon = useMemo(() => STEPS[active].icon, [active]);
  const stepCta = useMemo(
    () => [
      {
        href: "/demo/clinica",
        label: "Ver agenda inteligente en vivo",
        helper: "Simulá bloqueos, huecos y decisiones operativas en tiempo real.",
      },
      {
        href: "/demo/clinica",
        label: "Probar automatizaciones por WhatsApp",
        helper: "Confirmación, reprogramación y recuperación de no-shows con 1 flujo.",
      },
      {
        href: "/contacto",
        label: "Pedir plan de crecimiento guiado",
        helper: "Te armamos un blueprint con métricas, caja y próximos 90 días.",
      },
    ][active],
    [active]
  );

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-start">
        <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/40 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300 mb-2">Story Flow</p>
          <h3 className="text-3xl font-bold text-white mb-3">Cómo se transforma el negocio en 3 pasos</h3>
          <p className="text-slate-300 mb-6">Narrativa de venta por scroll: problema real → automatización → resultado concreto.</p>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Paso activo</p>
                <p className="font-semibold text-white">{STEPS[active].title}</p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${((active + 1) / STEPS.length) * 100}%` }} />
            </div>
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
              <p className="text-xs uppercase tracking-wide text-indigo-300 font-bold mb-1">Acción recomendada</p>
              <p className="text-sm text-slate-300 mb-3">{stepCta.helper}</p>
              <div className="flex flex-wrap gap-2">
                <Link href={stepCta.href} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-3 py-2">
                  {stepCta.label}
                </Link>
                <Link href="/sugerencias" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 text-slate-200 font-semibold text-sm px-3 py-2 hover:bg-slate-800">
                  Enviar sugerencia pro
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === active;
            return (
              <div
                key={step.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                data-index={index}
                className={`rounded-2xl border p-5 transition-all duration-300 ${
                  isActive
                    ? "border-indigo-500/70 bg-indigo-500/10 shadow-lg shadow-indigo-900/40"
                    : "border-slate-800 bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-300"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{step.title}</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-slate-300"><span className="text-rose-300 font-semibold">Problema:</span> {step.problem}</p>
                  <p className="text-slate-300"><span className="text-indigo-300 font-semibold">Automatización:</span> {step.automation}</p>
                  <p className="text-slate-200 font-medium"><span className="text-emerald-300 font-semibold">Resultado:</span> {step.result}</p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" /> Slide narrativo por scroll
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
