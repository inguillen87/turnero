import Link from 'next/link';

const FAQS = [
  {
    q: '¿Turnero Pro funciona en celular y tablet?',
    a: 'Sí. La experiencia está optimizada para uso diario en dispositivos móviles y escritorio.',
  },
  {
    q: '¿Puedo pedir una demo por mi rubro?',
    a: 'Sí. Armamos demos guiadas según operación, equipo y objetivos de tu negocio.',
  },
  {
    q: '¿Qué incluye el upgrade avanzado?',
    a: 'Incluye capacidades pro para automatización, integraciones y control operativo avanzado.',
  },
];

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Preguntas frecuentes</h1>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <summary className="font-semibold cursor-pointer">{faq.q}</summary>
              <p className="text-slate-600 dark:text-slate-300 mt-2">{faq.a}</p>
            </details>
          ))}
        </div>
        <Link href="/" className="inline-block text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
      </div>
    </main>
  );
}
