import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { Logo } from '@/components/Logo';
import { ArrowRight, Calendar, Users, BarChart3, Clock, CheckCircle2, Star } from 'lucide-react';

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
              href="/t/demo/dashboard"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              Demo Gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/40 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-slate-950 dark:to-slate-950 blur-3xl opacity-50"></div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100 dark:border-indigo-800 animate-fade-in">
              <Star className="w-3 h-3 fill-current" /> Nuevo Sistema 2.0
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 drop-shadow-sm animate-fade-in">
              Gestiona tu negocio,<br className="hidden md:block"/> <span className="text-indigo-600 dark:text-indigo-500">no tu agenda.</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-100">
              La plataforma todo-en-uno para profesionales independientes y clínicas.
              Turnos, recordatorios por WhatsApp y reportes financieros en un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
              <Link
                href="/t/demo/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Empezar Ahora <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl transition-all"
              >
                Ver Funcionalidades
              </Link>
            </div>

            {/* Social Proof / Trust */}
            <div className="mt-12 flex flex-col items-center gap-2 text-sm text-slate-500 animate-fade-in delay-300">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                    </div>
                 ))}
              </div>
              <p>Más de <span className="font-bold text-slate-800 dark:text-white">500+ profesionales</span> confían en nosotros.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900 relative">
          <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para crecer</h2>
               <p className="text-slate-600 dark:text-slate-400 text-lg">Deja de perder tiempo en WhatsApp coordinando horarios. Automatiza tu flujo de trabajo.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Calendar className="w-8 h-8 text-indigo-500" />}
                  title="Agenda Inteligente"
                  description="Visualiza tu semana de un vistazo. Arrastra y suelta turnos, bloquea horarios y evita superposiciones."
                />
                <FeatureCard
                  icon={<Users className="w-8 h-8 text-pink-500" />}
                  title="Gestión de Pacientes"
                  description="Historial completo de visitas, notas privadas y datos de contacto. Conoce a tus clientes como nunca antes."
                />
                <FeatureCard
                  icon={<Clock className="w-8 h-8 text-emerald-500" />}
                  title="Recordatorios Auto"
                  description="Reduce el ausentismo hasta un 80% con recordatorios automáticos por WhatsApp y Email."
                />
                <FeatureCard
                  icon={<BarChart3 className="w-8 h-8 text-orange-500" />}
                  title="Reportes Financieros"
                  description="Entiende tus ingresos diarios, semanales y mensuales. Toma decisiones basadas en datos reales."
                />
             </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-24">
           <div className="container mx-auto px-4">
             <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">Planes Simples</h2>
               <p className="text-slate-600 dark:text-slate-400">Sin comisiones por turno. Solo una suscripción mensual fija.</p>
             </div>

             <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                   <h3 className="text-xl font-bold text-slate-500">Starter</h3>
                   <div className="text-4xl font-extrabold my-4">$0 <span className="text-base font-medium text-slate-400">/mes</span></div>
                   <p className="text-slate-600 dark:text-slate-400 mb-6">Ideal para empezar a organizar tu consultorio.</p>
                   <ul className="space-y-3 mb-8 flex-1">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> 1 Profesional</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> 100 Turnos/mes</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Agenda Básica</li>
                   </ul>
                   <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Comenzar Gratis</button>
                </div>

                <div className="p-8 rounded-3xl border-2 border-indigo-500 bg-slate-900 text-white relative flex flex-col shadow-2xl shadow-indigo-500/20">
                   <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                   <h3 className="text-xl font-bold text-indigo-300">Pro</h3>
                   <div className="text-4xl font-extrabold my-4">$29 <span className="text-base font-medium text-indigo-200">/mes</span></div>
                   <p className="text-indigo-100 mb-6">Para clínicas y profesionales con alto volumen.</p>
                   <ul className="space-y-3 mb-8 flex-1 text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-400"/> Profesionales Ilimitados</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-400"/> Turnos Ilimitados</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-400"/> Recordatorios WhatsApp</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-400"/> Soporte Prioritario</li>
                   </ul>
                   <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-colors shadow-lg shadow-indigo-600/40">Obtener Pro</button>
                </div>
             </div>
           </div>
        </section>
      </main>

      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Turnero Pro. Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-600">Términos</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600">Privacidad</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all group">
      <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
