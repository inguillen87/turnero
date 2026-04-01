import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sugerencias | Turnero Pro',
  description: 'Canal abierto para sugerencias de producto de Turnero Pro. Compartí ideas de mejora y prioridades.',
};

const areas = [
  'Agenda y disponibilidad',
  'WhatsApp y automatizaciones',
  'Pagos y cobranzas',
  'Reportes e indicadores',
  'Experiencia mobile/PWA',
  'Roles y permisos',
];

export default function SugerenciasPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Sugerencias de producto</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Queremos que Turnero Pro evolucione con necesidades reales de LATAM. Compartinos mejoras, fricciones y funcionalidades prioritarias para tu equipo.
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="font-semibold mb-3">Áreas donde más recibimos feedback</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
            {areas.map((area) => (
              <li key={area} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">{area}</li>
            ))}
          </ul>
        </div>

        <a
          href="mailto:hola@inmov.ar?subject=Sugerencia%20Turnero%20Pro&body=Hola%20equipo%2C%20les%20comparto%20una%20sugerencia.%0A%0A%C3%81rea%3A%0AProblema%20actual%3A%0AImpacto%20en%20mi%20operaci%C3%B3n%3A%0A%C3%89xito%20esperado%3A"
          className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
        >
          Enviar sugerencia por email
        </a>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/faqs" className="text-indigo-600 font-semibold hover:underline">Ir a FAQs</Link>
          <Link href="/contacto" className="text-indigo-600 font-semibold hover:underline">Contactar al equipo</Link>
          <Link href="/" className="text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}
