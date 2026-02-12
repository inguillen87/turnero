"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';

export function BillingSettings({ tenant }: any) {
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
