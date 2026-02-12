"use client";

import { Globe, MessageCircle, Calendar } from 'lucide-react';

export function IntegrationsSettings({ integrations, slug }: any) {
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
                   <a href="/api/integrations/google-calendar/connect" className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all">Conectar</a>
                )}
             </div>
          </div>
       </div>
    </div>
  )
}
