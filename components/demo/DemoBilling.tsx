"use client";

import { CreditCard, Zap, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DemoBilling() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // In a real app, this would use the authenticated user's email and tenant
            const res = await fetch('/api/saas/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantSlug: 'demo-clinica', // Demo Context
                    userEmail: 'demo@user.com'
                })
            });
            const data = await res.json();

            if (data.init_point) {
                // Redirect to MercadoPago
                window.location.href = data.init_point;
            } else {
                alert("Error: No se pudo generar el link de pago.");
            }
        } catch (error) {
            console.error("Upgrade failed:", error);
            alert("Error al iniciar el pago. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-4xl mx-auto py-4">
             <div className="text-center mb-8">
                 <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Planes y Facturación</h2>
                 <p className="text-slate-500 text-sm">Elige el plan que mejor se adapte a tu negocio.</p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                 {/* Free Plan */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col opacity-75 grayscale hover:grayscale-0 transition-all">
                     <div className="mb-4">
                         <h3 className="font-bold text-slate-800 text-lg">Plan Gratuito</h3>
                         <p className="text-xs text-slate-500 mt-1">Ideal para empezar</p>
                     </div>
                     <div className="mb-4">
                         <span className="text-3xl font-black text-slate-800">$0</span>
                         <span className="text-slate-400 font-medium text-sm">/mes</span>
                     </div>

                     <ul className="space-y-3 mb-6 flex-1">
                         <li className="flex items-center gap-2 text-xs text-slate-600">
                             <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Hasta 50 turnos/mes
                         </li>
                         <li className="flex items-center gap-2 text-xs text-slate-600">
                             <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Agenda Básica
                         </li>
                         <li className="flex items-center gap-2 text-xs text-slate-600">
                             <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Chatbot Demo (Limitado)
                         </li>
                     </ul>

                     <button disabled className="w-full py-2 rounded-lg bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed border border-slate-200">
                         Plan Actual
                     </button>
                 </div>

                 {/* Pro Plan */}
                 <div className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ring-4 ring-indigo-500/20 flex flex-col">
                     <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-lg">
                         Recomendado
                     </div>

                     <div className="mb-4 relative z-10">
                         <h3 className="font-bold text-white text-lg flex items-center gap-2">
                             <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" /> Plan Full Pro
                         </h3>
                         <p className="text-xs text-slate-400 mt-1">Todo lo que necesitas para crecer</p>
                     </div>

                     <div className="mb-4 relative z-10">
                         <span className="text-3xl font-black text-white">$15.000</span>
                         <span className="text-slate-500 font-medium text-sm">/mes</span>
                     </div>

                     <ul className="space-y-3 mb-6 relative z-10 flex-1">
                         <li className="flex items-center gap-2 text-xs text-slate-300">
                             <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" /> Turnos Ilimitados
                         </li>
                         <li className="flex items-center gap-2 text-xs text-slate-300">
                             <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" /> Chatbot WhatsApp Inteligente
                         </li>
                         <li className="flex items-center gap-2 text-xs text-slate-300">
                             <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" /> Integración Google Calendar
                         </li>
                         <li className="flex items-center gap-2 text-xs text-slate-300">
                             <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" /> Pagos con MercadoPago
                         </li>
                     </ul>

                     <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 relative z-10 disabled:opacity-70 group"
                     >
                         {loading ? (
                             <span className="animate-pulse">Redirigiendo...</span>
                         ) : (
                             <>Activar Plan Full <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" /></>
                         )}
                     </button>

                     {/* Decorative Blob */}
                     <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                 </div>
             </div>
        </div>
    );
}
