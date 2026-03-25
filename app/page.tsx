import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { WhatsAppDemo } from '@/components/WhatsAppDemo';

export const dynamic = 'force-static';
import { Logo } from '@/components/Logo';
import { Calendar, Users, BarChart3, Star, MessageSquare, Briefcase, Zap, Bot, PanelTop, ShieldCheck, Smartphone, Sparkles, Workflow, Rocket, MonitorPlay, BellRing, HandCoins, Gauge, ClipboardCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/demo/clinica"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 animate-pulse"
            >
              Probar Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <WhatsAppDemo />
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/40 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-slate-950 dark:to-slate-950 blur-3xl opacity-50"></div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100 dark:border-indigo-800 animate-fade-in shadow-sm">
              <Star className="w-3 h-3 fill-current" /> Software propio. Innovación continua.
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 drop-shadow-sm animate-fade-in leading-tight">
              Escala tu negocio con<br className="hidden md:block"/> <span className="text-indigo-600 dark:text-indigo-500">tecnología de clase mundial.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in delay-100 font-medium">
              Construimos nuestras propias herramientas enterprise: agenda operativa, bot admin inteligente, CRM y automatización por WhatsApp en una sola plataforma.
              Sin depender de integraciones externas para el core de tu negocio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
              <Link
                href="/demo/clinica"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Probar Demo Interactiva <MessageSquare className="w-6 h-6" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-lg rounded-2xl transition-all shadow-sm hover:shadow-md"
              >
                Explorar Features
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto animate-fade-in delay-300">
              {[
                { label: 'UX conversacional', value: '100%' },
                { label: 'Diseño Mobile First', value: 'PWA' },
                { label: 'Demostraciones guiadas', value: 'Live' },
                { label: 'Arquitectura moderna', value: 'Next + AI' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-4 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-300">{metric.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/70 dark:border-slate-800">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
                <Zap className="w-3 h-3" /> Hecho por Turnero (first-party)
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">No dependas de terceros para operar.</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Tu clínica puede funcionar con nuestro stack nativo: calendario propio, planificación de bloqueos y bot admin que responde consultas reales como
                “¿qué día me conviene tomarme libre?” o “si cierro mañana al mediodía, ¿cuántos turnos impacto?”.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>✅ Calendario operativo con bloqueos, conflictos y sugerencias inteligentes.</li>
                <li>✅ Bot interno que analiza próximos 3 días y te propone el día más liviano.</li>
                <li>✅ Simulación de impacto si cerrás por almuerzo, familiar o mini vacaciones.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <PanelTop className="w-4 h-4" /> Admin Panel + Bot Interno
              </div>
              <div className="p-5 space-y-4">
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200">
                  <p className="font-semibold mb-1 flex items-center gap-2"><Bot className="w-4 h-4 text-indigo-500" /> Consulta rápida</p>
                  <p>“Boti, si cierro mañana al mediodía para ir a comer con mi familia, ¿qué impacto tengo?”</p>
                </div>
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-3 text-sm text-indigo-900 dark:text-indigo-100 border border-indigo-100 dark:border-indigo-800">
                  <p className="font-semibold mb-1">Respuesta sugerida por Turnero AI</p>
                  <p>
                    “Impactarías 3 turnos entre 12:00 y 15:00. El día más liviano de las próximas 2 semanas es el jueves (1 turno). Te conviene bloquear esa ventana y reprogramar automáticamente por WhatsApp.”
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-2"><p className="font-bold text-lg">3</p><p>Turnos impactados</p></div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-2"><p className="font-bold text-lg">1</p><p>Día más liviano</p></div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-2"><p className="font-bold text-lg">14d</p><p>Horizonte IA</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              No somos una integradora de apps de terceros.
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              En Turnero desarrollamos producto real: diseñamos, construimos y mejoramos nuestras herramientas internas todos los meses.
              Innovar es nuestro motor y por eso cada release trae mejoras concretas en agenda, bot admin, automatizaciones y operación diaria.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/40">
                <p className="font-bold text-indigo-600 dark:text-indigo-300">Producto first-party</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Control total de UX, performance y roadmap.</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/40">
                <p className="font-bold text-indigo-600 dark:text-indigo-300">Mejora continua</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Iteración semanal con foco en valor operativo real.</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/40">
                <p className="font-bold text-indigo-600 dark:text-indigo-300">Innovación aplicada</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">No copiamos features: las evolucionamos para LATAM y global.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <p className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                Rubros y nichos que ya estamos potenciando
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Una misma plataforma, múltiples industrias</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">El widget comercial y la UX de la landing ahora están sincronizados para conversar por vertical desde el primer clic.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                "Odontología", "Psicología", "Estética", "Gimnasio", "Nutrición", "Preparación Física", "Estudio Jurídico", "Escribanía", "Contable", "Inmobiliaria", "Educación", "Veterinaria", "Hotelería", "Kinesiología", "Barbería", "Spa"
              ].map((tag) => (
                <div key={tag} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-indigo-50/60 dark:from-slate-800 dark:to-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {tag}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-indigo-200/70 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-900/10 px-4 py-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">Sales Copilot del widget:</span>
              <span className="px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800">Diagnóstico por rubro</span>
              <span className="px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800">Propuesta modular o full</span>
              <span className="px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800">Salida directa a ventas</span>
            </div>
          </div>
        </section>

        <section className="py-12 bg-indigo-50/60 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/40">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300 mb-3">White-label ready • expansión global</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Listo para franquiciar y escalar por país/idioma</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Turnero Pro ya está preparado para operar en <strong>Español, English y Português</strong>, con demo enterprise completa para SuperAdmin + tenant.
              Ideal para partners que quieran revender white-label en nuevos mercados.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800">Franquicias por país</span>
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800">Asociaciones con grupos grandes</span>
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800">Operación multi-idioma nativa</span>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Mirá lo que podés probar en la demo enterprise
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Probá en vivo nuestras herramientas propias: Admin Bot, agenda operativa y automatizaciones.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <ShowcaseCard
                title="Admin Bot Inteligente"
                subtitle="Consultas rápidas para organizar tu semana"
                bullets={[
                  "¿Qué día me conviene tomarme libre?",
                  "Si cierro al mediodía, ¿cuántos turnos impacto?",
                  "¿Cómo armo mini vacaciones sin romper agenda?",
                ]}
                tone="indigo"
              />
              <ShowcaseCard
                title="Agenda Operativa Nativa"
                subtitle="Bloqueos, conflictos y huecos sugeridos"
                bullets={[
                  "Bloqueos por vacaciones/remodelación",
                  "Sugerencias automáticas de horarios libres",
                  "Turno rápido en 1 click desde calendario",
                ]}
                tone="emerald"
              />
              <ShowcaseCard
                title="Marketing + CRM"
                subtitle="Campañas y journeys con control total"
                bullets={[
                  "Plantillas y envíos programados",
                  "Journeys de reactivación / pago pendiente",
                  "Exportes PDF y Excel para operación",
                ]}
                tone="violet"
              />
            </div>

            <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-900/10 p-5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">Demo abierta, con límites inteligentes</p>
                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                  Mostramos experiencia enterprise completa para enganchar clientes, pero protegemos costos y seguridad con permisos, rate-limits y restricciones de uso en funciones IA.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-emerald-50/60 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/40">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 mb-2">PWA Ready</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Turnero en el bolsillo del equipo</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Instalación tipo app desde navegador para usar en recepción, tablets y celulares sin fricción.
              Ideal para operación diaria sin depender de notebook.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">Add to Home Screen</span>
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">Uso en tablets de mostrador</span>
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">Experiencia mobile-first</span>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300 font-bold mb-3">Mejoras proactivas para SaaS de servicios</p>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Playbooks listos para convertir más en cada rubro</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Sumamos bloques de alto impacto que suelen acelerar adopción en clínicas, estética, bienestar y servicios profesionales.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <PlaybookCard
                icon={<BellRing className="w-5 h-5" />}
                title="Reactivación automática"
                description="Flujos para pacientes inactivos con mensajes inteligentes según historial y frecuencia esperada."
                impact="Más retorno sin depender de campañas manuales."
              />
              <PlaybookCard
                icon={<HandCoins className="w-5 h-5" />}
                title="Recupero de ingresos"
                description="Secuencias para pago pendiente, no-shows y huecos de agenda con propuestas de reprogramación."
                impact="Mejor ocupación y menos facturación perdida."
              />
              <PlaybookCard
                icon={<Gauge className="w-5 h-5" />}
                title="Panel de eficiencia"
                description="Indicadores accionables por sede/profesional para decidir rápido qué ajustar cada semana."
                impact="Operación más predecible y escalable."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300 mb-3">Sin fricción comercial</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Te guiamos a la mejor solución para tu negocio
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Empezamos por tu operación real: diagnóstico, demo guiada y propuesta a medida para que implementes con confianza.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <DynamicStepCard icon={<MessageSquare className="w-5 h-5" />} title="1. Descubrimos tu operación" description="Revisamos volumen, equipo y objetivos para entender dónde está la oportunidad real." />
              <DynamicStepCard icon={<MonitorPlay className="w-5 h-5" />} title="2. Demo dinámica por rubro" description="Mostramos flujos reales con animaciones e historias visuales según tu negocio." />
              <DynamicStepCard icon={<Rocket className="w-5 h-5" />} title="3. Plan personalizado" description="Te entregamos una propuesta modular o full sin obligarte a un plan rígido." />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300 mb-2">FAQ estratégico</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Dudas clave para decidir más rápido</h3>
            </div>
            <div className="space-y-3">
              <FaqItem
                question="¿Pueden personalizar el flujo según mi rubro?"
                answer="Sí. El enfoque comercial y de implementación ahora prioriza diagnóstico + demo + propuesta a medida para adaptar automatizaciones, agenda y CRM a tu operación real."
              />
              <FaqItem
                question="¿Qué tan rápido puedo ver resultados?"
                answer="Normalmente en las primeras semanas ya se observa mejora en confirmaciones, ausentismo y velocidad de respuesta comercial gracias a automatizaciones y flujos guiados."
              />
              <FaqItem
                question="¿Es usable desde celular para mi equipo?"
                answer="Sí. Reforzamos el enfoque mobile-first y mensajes PWA-ready para garantizar experiencia fluida en operaciones del día a día desde teléfono."
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-white dark:bg-slate-900/50 relative border-y border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">Potencia sin límites</h2>
               <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl">Diseñado para clínicas, centros de estética y profesionales que no se conforman con herramientas básicas.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Calendar className="w-8 h-8 text-indigo-500" />}
                  title="Agenda Avanzada"
                  description="Gestión multi-profesional, bloqueo de horarios, reglas de disponibilidad complejas y vista semanal/mensual fluida."
                />
                <FeatureCard
                  icon={<MessageSquare className="w-8 h-8 text-green-500" />}
                  title="WhatsApp Automation"
                  description="Confirmaciones, recordatorios y seguimientos automáticos. Reduce el ausentismo a cero sin mover un dedo."
                />
                <FeatureCard
                  icon={<Briefcase className="w-8 h-8 text-blue-500" />}
                  title="CRM Profesional"
                  description="Perfil 360° de cada paciente. Historial clínico, preferencias, notas privadas y ciclo de vida del cliente."
                />
                <FeatureCard
                  icon={<BarChart3 className="w-8 h-8 text-orange-500" />}
                  title="Analytics & ROI"
                  description="Reportes financieros detallados. Conoce tu facturación, tasa de ocupación y rendimiento por profesional."
                />
                 <FeatureCard
                  icon={<Zap className="w-8 h-8 text-yellow-500" />}
                  title="Velocidad Rayo"
                  description="Infraestructura Serverless de última generación. Carga instantánea, sin esperas, 99.9% uptime garantizado."
                />
                 <FeatureCard
                  icon={<Users className="w-8 h-8 text-pink-500" />}
                  title="Multi-Tenant Real"
                  description="Gestiona múltiples sucursales o franquicias desde un solo panel maestro. Escalabilidad infinita."
                />
             </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                <Smartphone className="w-3.5 h-3.5" /> UX/UI renovado
              </p>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Landing mobile-first, PWA-ready y con demos más claras
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Mejoramos estructura, mensajes y jerarquía visual para que cada visita entienda rápido cómo funciona Turnero, incluso desde celular.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Pill text="Animaciones ligeras y dinámicas" icon={<Sparkles className="w-4 h-4" />} />
                <Pill text="Explicaciones por flujo real" icon={<Workflow className="w-4 h-4" />} />
                <Pill text="Iconografía consistente" icon={<Star className="w-4 h-4" />} />
                <Pill text="Performance orientada a conversión" icon={<Zap className="w-4 h-4" />} />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xl">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
                <p className="text-xs text-slate-500">Demo preview • respuesta en tiempo real</p>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full w-3/4 bg-indigo-500 animate-pulse" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <MetricOrb label="Tiempo de comprensión" value="-42%" />
                  <MetricOrb label="Interacción demo" value="+68%" />
                  <MetricOrb label="Leads calificados" value="+35%" />
                </div>
              </div>
              <Link href="/demo/clinica" className="mt-4 w-full inline-flex justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 transition-colors">
                Quiero mi demo personalizada
              </Link>
            </div>
          </div>
        </section>

         {/* Social Proof Footer */}
        <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 text-center">
                 <p className="text-slate-500 font-semibold uppercase tracking-widest mb-8 text-sm">Empresas líderes que confían en Turnero Pro</p>
                 <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                     {/* Fake Logos for Demo */}
                     <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2"><Zap className="fill-current"/> DENTAL<span className="text-indigo-500">CORP</span></div>
                     <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2"><Star className="fill-current"/> MEDI<span className="text-indigo-500">PLUS</span></div>
                     <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2"><Briefcase className="fill-current"/> CLINIC<span className="text-indigo-500">OS</span></div>
                     <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2"><Users className="fill-current"/> ESTETICA<span className="text-indigo-500">PRO</span></div>
                 </div>
            </div>
        </section>
      </main>

      <div className="fixed md:hidden bottom-4 left-4 right-4 z-50 [padding-bottom:env(safe-area-inset-bottom)]">
        <Link
          href="/demo/clinica"
          className="w-full rounded-2xl bg-indigo-600 text-white font-bold py-3 px-4 shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <ClipboardCheck className="w-4 h-4" />
          Reservar demo guiada
        </Link>
      </div>

      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Turnero Pro. Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Términos</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Privacidad</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300 group">
      <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 w-fit shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-slate-100 dark:border-slate-700">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">{description}</p>
    </div>
  )
}

function DynamicStepCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 p-5 shadow-sm hover:shadow-lg transition-all">
      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function ShowcaseCard({
  title,
  subtitle,
  bullets,
  tone,
}: {
  title: string;
  subtitle: string;
  bullets: string[];
  tone: "indigo" | "emerald" | "violet";
}) {
  const toneClass = {
    indigo: "from-indigo-500/15 to-indigo-100/70 dark:from-indigo-900/30 dark:to-indigo-800/10 border-indigo-200/80 dark:border-indigo-800",
    emerald: "from-emerald-500/15 to-emerald-100/70 dark:from-emerald-900/30 dark:to-emerald-800/10 border-emerald-200/80 dark:border-emerald-800",
    violet: "from-violet-500/15 to-violet-100/70 dark:from-violet-900/30 dark:to-violet-800/10 border-violet-200/80 dark:border-violet-800",
  }[tone];

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${toneClass} p-5 shadow-sm`}>
      <div className="rounded-xl border border-white/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 p-3 mb-4 text-xs text-slate-500">
        <p className="font-semibold">Vista previa del panel</p>
        <div className="mt-2 space-y-1">
          <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-2 rounded bg-slate-200 dark:bg-slate-700 w-4/5" />
          <div className="h-2 rounded bg-slate-200 dark:bg-slate-700 w-3/5" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{subtitle}</p>
      <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
      <span className="text-indigo-600 dark:text-indigo-300">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function MetricOrb({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-center">
      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{value}</p>
      <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function PlaybookCard({
  icon,
  title,
  description,
  impact,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-5 hover:shadow-lg transition-all">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{description}</p>
      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{impact}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4">
      <summary className="cursor-pointer list-none font-semibold text-slate-900 dark:text-white flex items-center justify-between">
        {question}
        <span className="text-indigo-500 group-open:rotate-45 transition-transform">+</span>
      </summary>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{answer}</p>
    </details>
  );
}
