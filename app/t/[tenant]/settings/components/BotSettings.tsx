"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle } from 'lucide-react';

export function BotSettings({ tenant, integrations }: any) {
  // Try to find existing bot settings or use defaults
  const botSettingsConfig = integrations?.find((i: any) => i.type === 'bot_settings')?.config;
  const botSettings = botSettingsConfig
      ? JSON.parse(botSettingsConfig)
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
