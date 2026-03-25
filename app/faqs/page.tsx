import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs | Turnero Pro',
  description: 'Preguntas frecuentes sobre implementación, soporte, pagos, seguridad y escalabilidad de Turnero Pro.',
};

const FAQS = [
  {
    category: 'Implementación',
    q: '¿En cuánto tiempo puedo empezar a operar con Turnero Pro?',
    a: 'La mayoría de los equipos arranca con una configuración inicial en pocos días. Definimos servicios, horarios, profesionales y mensajes base para salir a producción de forma ordenada.',
  },
  {
    category: 'Operación diaria',
    q: '¿Puedo confirmar, reprogramar y recuperar no-shows automáticamente?',
    a: 'Sí. Turnero Pro permite flujos automáticos por WhatsApp y email para confirmaciones, recordatorios, reprogramaciones y seguimiento de ausencias.',
  },
  {
    category: 'Pagos',
    q: '¿Se puede cobrar seña o pago online antes del turno?',
    a: 'Sí. Podés enviar links de pago y asociarlos al turno para reducir ausentismo y mejorar previsibilidad de caja.',
  },
  {
    category: 'Seguridad',
    q: '¿Cómo protegen los datos de pacientes y clientes?',
    a: 'Aplicamos controles de acceso, segregación por tenant, monitoreo y prácticas de resguardo acordes a operación profesional.',
  },
  {
    category: 'Escalabilidad',
    q: '¿Sirve para una sola sede y también para cadenas/franquicias?',
    a: 'Sí. La plataforma contempla operación por profesional, por sede y escenarios multi-sucursal para acompañar crecimiento regional.',
  },
  {
    category: 'Soporte',
    q: '¿Tienen soporte y acompañamiento comercial/técnico?',
    a: 'Sí. El equipo acompaña el onboarding y la evolución con recomendaciones por rubro para mejorar ocupación, conversión y experiencia del paciente.',
  },
];

export default function FaqsPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <h1 className="text-3xl md:text-4xl font-bold">Preguntas frecuentes</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Respuestas rápidas para evaluar si Turnero Pro es un buen fit para tu clínica, centro o equipo de servicios.
        </p>

        <div className="grid gap-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <summary className="font-semibold cursor-pointer">{faq.q}</summary>
              <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300 mt-2">{faq.category}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/contacto" className="text-indigo-600 font-semibold hover:underline">Solicitar demo guiada</Link>
          <Link href="/sugerencias" className="text-indigo-600 font-semibold hover:underline">Enviar sugerencias</Link>
          <Link href="/" className="text-indigo-600 font-semibold hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}
