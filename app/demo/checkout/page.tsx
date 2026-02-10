"use client";

import { Check, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DemoCheckout() {
  const [status, setStatus] = useState('pending'); // pending | processing | success

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
        setStatus('success');
    }, 2000);
  };

  if (status === 'success') {
      return (
          <div className="min-h-screen bg-[#009EE3] flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Pago Exitoso!</h2>
                  <p className="text-slate-500 mb-6">Tu seña de $1.000 ha sido acreditada.</p>
                  <p className="text-sm text-slate-400 mb-8">Redirigiendo a Turnero Pro...</p>

                  <Link href="/demo/clinica" className="block w-full bg-[#009EE3] text-white font-bold py-3 rounded-md hover:bg-[#008CC9] transition-colors">
                      Volver al Sitio
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex items-center justify-center p-4">
       <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden border-t-4 border-[#009EE3]">
           {/* Header MP */}
           <div className="bg-[#009EE3] p-4 flex justify-between items-center text-white">
               <span className="font-bold text-lg">Mercado Pago</span>
               <ShieldCheck className="w-6 h-6" />
           </div>

           <div className="p-8">
               <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                   <div>
                       <h3 className="text-xl font-bold text-slate-800">Seña de Turno</h3>
                       <p className="text-slate-500">Clínica Dental Demo</p>
                   </div>
                   <div className="text-right">
                       <p className="text-2xl font-black text-slate-800">$ 1.000</p>
                   </div>
               </div>

               <div className="space-y-4 mb-8">
                   <h4 className="font-bold text-slate-700 text-sm uppercase">Elige tu medio de pago</h4>

                   <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-[#009EE3] transition-all group">
                       <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
                       <div className="text-left flex-1">
                           <p className="font-bold text-slate-700 group-hover:text-[#009EE3]">Tarjeta de Débito/Crédito</p>
                           <p className="text-xs text-slate-400">Acreditación instantánea</p>
                       </div>
                   </button>

                   <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-[#009EE3] transition-all group">
                        <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-xs font-bold text-white">MP</div>
                       <div className="text-left flex-1">
                           <p className="font-bold text-slate-700 group-hover:text-[#009EE3]">Dinero en Cuenta</p>
                           <p className="text-xs text-slate-400">Saldo disponible: $45.200</p>
                       </div>
                   </button>
               </div>

               <button
                onClick={handlePay}
                disabled={status === 'processing'}
                className="w-full bg-[#009EE3] text-white font-bold py-4 rounded-md text-lg hover:bg-[#008CC9] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
               >
                   {status === 'processing' ? 'Procesando...' : 'Pagar $ 1.000'}
               </button>
           </div>

           <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
               Pagás seguro con Mercado Pago
           </div>
       </div>
    </div>
  );
}
