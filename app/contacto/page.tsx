import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Turnero Pro',
  description: 'Canales oficiales de contacto de Turnero Pro by Inmovar.',
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Contacto</h1>
        <p className="text-slate-600 dark:text-slate-300">¿Querés una demo guiada o hablar con el equipo? Escribinos y te respondemos con una propuesta a medida.</p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
          <p><span className="font-semibold">Email:</span> hola@inmov.ar</p>
          <p><span className="font-semibold">Sitio:</span> <a className="text-indigo-600 hover:underline" href="https://inmov.ar" target="_blank" rel="noreferrer">inmov.ar</a></p>
          <p><span className="font-semibold">Atención:</span> Lunes a Viernes, horario comercial (LATAM)</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="mailto:hola@inmov.ar?subject=Consulta%20Turnero%20Pro" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
            Enviar email
          </a>
          <a href="https://inmov.ar" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Visitar inmov.ar
          </a>
        </div>

        <Link href="/" className="inline-block text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
      </div>
    </main>
  );
}
