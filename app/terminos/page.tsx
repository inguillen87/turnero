import Link from 'next/link';

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Términos y Condiciones</h1>
        <p className="text-slate-600 dark:text-slate-300">Al usar Turnero Pro aceptás estos términos de uso. Este documento regula el acceso a la plataforma, responsabilidades y buenas prácticas.</p>
        <section>
          <h2 className="text-xl font-semibold mb-2">Uso de la plataforma</h2>
          <p className="text-slate-600 dark:text-slate-300">El servicio debe utilizarse de forma lícita y profesional. Está prohibido el uso para spam, fraude o actividades que afecten la seguridad del sistema.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Disponibilidad</h2>
          <p className="text-slate-600 dark:text-slate-300">Trabajamos para mantener alta disponibilidad, aunque puede haber ventanas de mantenimiento o interrupciones por causas externas.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Cambios</h2>
          <p className="text-slate-600 dark:text-slate-300">Podemos actualizar estos términos para reflejar mejoras del servicio o cambios legales. Publicaremos siempre la versión vigente en esta página.</p>
        </section>
        <Link href="/" className="inline-block text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
      </div>
    </main>
  );
}
