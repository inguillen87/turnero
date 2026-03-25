import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidad | Turnero Pro',
  description: 'Política de privacidad de Turnero Pro: tratamiento de datos, seguridad, retención y contacto.',
};

const UPDATED_AT = '25 de marzo de 2026';

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Política de Privacidad</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Última actualización: {UPDATED_AT}</p>
        <p className="text-slate-600 dark:text-slate-300">En Turnero Pro priorizamos la protección de datos personales y operativos de nuestros clientes.</p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1) Datos que tratamos</h2>
          <p className="text-slate-600 dark:text-slate-300">Procesamos datos de cuenta, agenda, comunicaciones y facturación necesarios para prestar el servicio. El cliente es responsable de la licitud de los datos que carga en la plataforma.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2) Finalidades</h2>
          <p className="text-slate-600 dark:text-slate-300">Utilizamos la información para operar turnos, enviar recordatorios, habilitar reportes, procesar pagos y brindar soporte técnico/comercial.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3) Seguridad y acceso</h2>
          <p className="text-slate-600 dark:text-slate-300">Aplicamos controles de acceso por roles, segmentación por tenant, trazabilidad y buenas prácticas de seguridad para preservar confidencialidad, integridad y disponibilidad.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4) Conservación</h2>
          <p className="text-slate-600 dark:text-slate-300">Conservamos los datos durante la vigencia contractual y/o los plazos exigidos por normativa aplicable o necesidades legítimas de auditoría y soporte.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5) Derechos y contacto</h2>
          <p className="text-slate-600 dark:text-slate-300">Para ejercer derechos de acceso, rectificación o supresión, o realizar consultas de privacidad, podés escribir a hola@inmov.ar.</p>
        </section>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/terminos" className="text-indigo-600 font-semibold hover:underline">Ver términos</Link>
          <Link href="/contacto" className="text-indigo-600 font-semibold hover:underline">Contacto</Link>
          <Link href="/" className="text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}
