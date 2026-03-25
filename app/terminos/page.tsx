import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos | Turnero Pro',
  description: 'Términos y condiciones de uso de Turnero Pro: alcance del servicio, responsabilidades y límites.',
};

const UPDATED_AT = '25 de marzo de 2026';

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Términos y Condiciones</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Última actualización: {UPDATED_AT}</p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1) Objeto del servicio</h2>
          <p className="text-slate-600 dark:text-slate-300">Turnero Pro provee herramientas SaaS para gestión de agenda, comunicación, automatización, cobros y analítica operativa.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2) Uso permitido</h2>
          <p className="text-slate-600 dark:text-slate-300">El cliente se compromete a utilizar la plataforma de forma lícita, evitando fraude, spam o cualquier práctica que perjudique a terceros o al servicio.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3) Responsabilidades del cliente</h2>
          <p className="text-slate-600 dark:text-slate-300">El cliente administra sus usuarios internos, define permisos, resguarda credenciales y valida que la información cargada sea correcta y legalmente tratable.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4) Disponibilidad y mantenimiento</h2>
          <p className="text-slate-600 dark:text-slate-300">Trabajamos para mantener alta disponibilidad. Puede haber mantenimientos programados o interrupciones por causas externas fuera de control razonable.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5) Cambios y vigencia</h2>
          <p className="text-slate-600 dark:text-slate-300">Podemos actualizar estos términos cuando evolucionan el producto, los proveedores o el marco normativo. La versión vigente estará publicada en esta página.</p>
        </section>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/privacidad" className="text-indigo-600 font-semibold hover:underline">Política de privacidad</Link>
          <Link href="/faqs" className="text-indigo-600 font-semibold hover:underline">FAQs</Link>
          <Link href="/" className="text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}
