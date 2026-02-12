"use client";

import { useState } from "react";
import {
  Settings,
  Users,
  Calendar,
  MessageCircle,
  Check,
  AlertTriangle,
  Briefcase,
  Globe,
  Clock,
  Shield,
  CreditCard,
  Bot,
  Sparkles,
  ShoppingBag,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRouter } from "next/navigation";

export default function SettingsClient({ tenant, services, professionals, integrations }: any) {
  const [activeTab, setActiveTab] = useState("general");
  const router = useRouter();

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="w-4 h-4" /> },
    { id: "bot", label: "Bot AI", icon: <Bot className="w-4 h-4" /> },
    { id: "services", label: "Servicios", icon: <Briefcase className="w-4 h-4" /> },
    { id: "catalog", label: "Catálogo", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "team", label: "Equipo", icon: <Users className="w-4 h-4" /> },
    { id: "integrations", label: "Integraciones", icon: <Globe className="w-4 h-4" /> },
    { id: "billing", label: "Facturación", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Configuración</h2>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Administra tu clínica y preferencias.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
           <Check className="w-4 h-4" /> Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm sticky top-24">
              <nav className="space-y-1">
                 {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                          if (tab.id === 'catalog') {
                              router.push(`/t/${tenant.slug}/catalog`);
                          } else {
                              setActiveTab(tab.id);
                          }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                       {tab.icon}
                       {tab.label}
                    </button>
                 ))}
              </nav>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
           {activeTab === "general" && <GeneralSettings tenant={tenant} />}
           {activeTab === "bot" && <BotSettings tenant={tenant} integrations={integrations} />}
           {activeTab === "services" && <ServicesSettings services={services} tenant={tenant} />}
           {activeTab === "team" && <TeamSettings professionals={professionals} />}
           {activeTab === "integrations" && <IntegrationsSettings integrations={integrations} slug={tenant.slug} />}
           {activeTab === "billing" && <BillingSettings tenant={tenant} />}
        </div>
      </div>
    </div>
  );
}

// ... (Other components remain same: BotSettings, GeneralSettings, ServicesSettings, TeamSettings, IntegrationsSettings)
function BotSettings({ tenant, integrations }: any) {
  // Try to find existing bot settings or use defaults
  const botSettings = integrations?.find((i: any) => i.type === 'bot_settings')?.config
      ? JSON.parse(integrations.find((i: any) => i.type === 'bot_settings').config)
      : { personality: 'professional', tenantType: 'general', customInstructions: '' };

  const [settings, setSettings] = useState(botSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
      setSaving(true);
      try {
          await fetch(`/api/t/${tenant.slug}/settings/bot`, {
              method: 'POST',
              body: JSON.stringify(settings)
          });
          // Mock success toast
          alert("Configuración del Bot guardada.");
      } catch (e) {
          alert("Error al guardar.");
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
       <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 ring-4 ring-teal-50/50 dark:ring-teal-900/10">
                <Sparkles className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inteligencia Artificial</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Personaliza la personalidad de tu asistente.</p>
            </div>
         </div>
         <button
           onClick={handleSave}
           disabled={saving}
           className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
         >
           {saving ? 'Guardando...' : 'Guardar Cambios'}
         </button>
       </div>

       <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

             <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Personalidad</label>
                <select
                    value={settings.personality}
                    onChange={(e) => setSettings({...settings, personality: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 text-sm outline-none transition-all"
                >
                    <option value="professional">Profesional & Eficiente</option>
                    <option value="friendly">Amigable & Entusiasta</option>
                    <option value="empathetic">Empático & Cuidadoso</option>
                    <option value="sales">Vendedor & Persuasivo</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Define el tono de las respuestas.</p>
             </div>

             <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipo de Negocio</label>
                <select
                    value={settings.tenantType}
                    onChange={(e) => setSettings({...settings, tenantType: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 text-sm outline-none transition-all"
                >
                    <option value="general">General / Servicios</option>
                    <option value="medical">Clínica Médica / Salud</option>
                    <option value="beauty">Estética / Spa / Belleza</option>
                    <option value="legal">Legal / Consultoría</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Adapta el contexto del asistente.</p>
             </div>

             <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Instrucciones Especiales</label>
                <textarea
                    value={settings.customInstructions}
                    onChange={(e) => setSettings({...settings, customInstructions: e.target.value})}
                    placeholder="Ej: Menciona que los viernes tenemos 20% de descuento. Si preguntan por Dr. House, decir que solo atiende urgencias."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 text-sm outline-none transition-all resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">Instrucciones específicas que el bot debe seguir siempre.</p>
             </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl flex gap-3">
             <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
             <p className="text-sm text-yellow-700 dark:text-yellow-400">
               Nota: El bot utiliza inteligencia artificial generativa. Aunque sigue tus instrucciones, las respuestas pueden variar. Revisa periódicamente las conversaciones.
             </p>
          </div>
       </div>
    </div>
  )
}

function GeneralSettings({ tenant }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
       <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
         <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-50/50 dark:ring-indigo-900/10">
           <Settings className="w-6 h-6" />
         </div>
         <div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Información General</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400">Datos básicos de tu organización.</p>
         </div>
       </div>

       <div className="space-y-6 max-w-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre Comercial</label>
                <input type="text" defaultValue={tenant.name} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white" />
             </div>

             <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Slug (URL)</label>
                <div className="relative">
                   <span className="absolute left-4 top-2.5 text-slate-400 text-sm font-mono">/t/</span>
                   <input type="text" value={tenant.slug} disabled className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 text-sm cursor-not-allowed font-mono" />
                </div>
             </div>

             <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Teléfono</label>
                <input type="tel" defaultValue={tenant.phone || "+54 9 11 ..."} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white" />
             </div>

             <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Dirección</label>
                <input type="text" defaultValue={tenant.address || ""} placeholder="Calle 123, Ciudad" className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white" />
             </div>

             <div className="col-span-2">
               <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Zona Horaria</label>
               <select className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white appearance-none">
                 <option>America/Argentina/Buenos_Aires (GMT-3)</option>
                 <option>America/Santiago (GMT-4)</option>
                 <option>America/Mexico_City (GMT-6)</option>
               </select>
             </div>
          </div>
       </div>
    </div>
  )
}

function ServicesSettings({ services, tenant }: any) {
  // Simple formatter
  const formatPrice = (value: number, currency: string) => {
    // DB stores integer units (e.g. 18000 for $18,000)
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency || 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
       <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 ring-4 ring-blue-50/50 dark:ring-blue-900/10">
                <Briefcase className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Servicios Ofrecidos</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona el catálogo de prestaciones.</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">+ Agregar Servicio</button>
       </div>

       <div className="space-y-3">
          {(services || []).map((s: any) => (
             <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">
                      {s.name.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{s.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                         <Clock className="w-3 h-3" /> {s.durationMin} min • {formatPrice(s.price, s.currency || tenant.currency)}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 transition-all">Editar</button>
                </div>
             </div>
          ))}
          {(!services || services.length === 0) && <p className="text-slate-400 text-center py-8">No hay servicios configurados.</p>}
       </div>
    </div>
  )
}

function TeamSettings({ professionals }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
       <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 ring-4 ring-purple-50/50 dark:ring-purple-900/10">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipo Médico</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Profesionales y sus agendas.</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">+ Agregar Profesional</button>
       </div>

       <div className="grid gap-4">
          {(professionals || []).map((p: any) => (
             <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                    {p.name.charAt(0)}
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.specialty || "General"}</p>
                 </div>
                 <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                 </span>
             </div>
          ))}
       </div>
    </div>
  )
}

function IntegrationsSettings({ integrations, slug }: any) {
  const google = integrations?.find((i: any) => i.type === 'google_calendar');
  const whatsapp = integrations?.find((i: any) => i.type === 'whatsapp') || { status: 'active' }; // Mock WA as active for demo

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 ring-4 ring-green-50/50 dark:ring-green-900/10">
                <Globe className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Integraciones</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Conecta herramientas externas.</p>
             </div>
          </div>

          <div className="space-y-4">
             {/* WhatsApp */}
             <div className="flex items-start justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                      <MessageCircle className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                         WhatsApp Business
                         {whatsapp ? <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] uppercase">Conectado</span> : null}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">El bot responde automáticamente mensajes y gestiona turnos 24/7.</p>
                   </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all">Configurar</button>
             </div>

             {/* Google Calendar */}
             <div className="flex items-start justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                      <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                         Google Calendar
                         {google ? <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] uppercase">Sincronizado</span> :
                         <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] uppercase">Desconectado</span>}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">Sincroniza tus turnos con tu calendario personal para evitar conflictos.</p>
                   </div>
                </div>
                {google ? (
                   <button className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all">Desconectar</button>
                ) : (
                   <a href={`/api/integrations/google-calendar/connect?slug=${slug}`} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all">Conectar</a>
                )}
             </div>
          </div>
       </div>
    </div>
  )
}

function BillingSettings({ tenant }: any) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
      setLoading(true);
      try {
          // Dynamic Link Creation via API
          const res = await fetch(`/api/t/${tenant.slug}/billing/subscribe`, { method: 'POST' });
          if (res.ok) {
              const data = await res.json();
              if (data.init_point) {
                  window.location.href = data.init_point;
              } else {
                  alert("Error al generar link de pago.");
              }
          }
      } catch (e) {
          alert("Error de conexión");
      } finally {
          setLoading(false);
      }
  };

  const isEnterprise = tenant.plan === 'enterprise' && tenant.planStatus === 'active';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ring-4 ${isEnterprise ? 'bg-indigo-50 text-indigo-600 ring-indigo-50' : 'bg-orange-50 text-orange-600 ring-orange-50'}`}>
                <CreditCard className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Facturación y Planes</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona tu suscripción.</p>
            </div>
        </div>

        {isEnterprise ? (
            <div className="p-6 rounded-xl border border-green-100 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800">
                <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="font-bold text-lg text-green-900 dark:text-green-100">Plan Enterprise Activo</h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Disfruta de todas las funciones premium.</p>
                <div className="mt-4 text-xs text-green-600 font-mono">
                   Renueva el: {tenant.planRenewsAt ? new Date(tenant.planRenewsAt).toLocaleDateString() : 'N/A'}
                </div>
            </div>
        ) : (
            <div className="p-6 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:bg-indigo-900/10 dark:border-indigo-800">
                <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">Plan Actual: Free Demo</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">Estás utilizando la versión gratuita limitada.</p>

                <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-3 bg-[#009EE3] hover:bg-[#008ED6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {loading ? "Generando Link..." : "Actualizar a Enterprise"}
                        {!loading && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Recomendado</span>}
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Procesado de forma segura por MercadoPago.
                    </p>
                </div>
            </div>
        )}
    </div>
  );
}
