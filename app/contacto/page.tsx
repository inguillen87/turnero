import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Turnero Pro',
  description: 'Contactá al equipo de Turnero Pro para una demo guiada, propuesta por rubro o consultas técnicas.',
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Contacto comercial y técnico</h1>
        <p className="text-slate-600 dark:text-slate-300">Si querés evaluar Turnero Pro para tu operación, te ayudamos con diagnóstico, demo y propuesta a medida por rubro.</p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
          <p><span className="font-semibold">Email:</span> hola@inmov.ar</p>
          <p><span className="font-semibold">Sitio:</span> <a className="text-indigo-600 hover:underline" href="https://inmov.ar" target="_blank" rel="noreferrer">inmov.ar</a></p>
          <p><span className="font-semibold">Atención:</span> Lunes a Viernes, horario comercial (LATAM)</p>
          <p><span className="font-semibold">Qué incluir en tu mensaje:</span> rubro, ciudad/país, volumen mensual de turnos y objetivo principal.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="mailto:hola@inmov.ar?subject=Demo%20Turnero%20Pro&body=Hola%20equipo%2C%20quiero%20evaluar%20Turnero%20Pro.%0A%0ARubro%3A%0ACiudad%2FPa%C3%ADs%3A%0ATurnos%20mensuales%20aprox%3A%0AObjetivo%20principal%3A" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
            Pedir demo guiada
          </a>
          <Link href="/sugerencias" className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Enviar sugerencias
          </Link>
          <Link href="/" className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
