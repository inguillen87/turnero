import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Política de Privacidad</h1>
        <p className="text-slate-600 dark:text-slate-300">En Turnero Pro protegemos la información de usuarios y clientes con medidas técnicas y organizativas acordes al servicio.</p>
        <section>
          <h2 className="text-xl font-semibold mb-2">Datos que procesamos</h2>
          <p className="text-slate-600 dark:text-slate-300">Procesamos datos necesarios para operar agendas, comunicaciones y reportes. No vendemos información personal a terceros.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Seguridad</h2>
          <p className="text-slate-600 dark:text-slate-300">Aplicamos controles de acceso, monitoreo y políticas de protección para resguardar la confidencialidad e integridad de los datos.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Contacto de privacidad</h2>
          <p className="text-slate-600 dark:text-slate-300">Para consultas sobre privacidad podés escribirnos desde la página de contacto.</p>
        </section>
        <Link href="/" className="inline-block text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
      </div>
    </main>
  );
}
