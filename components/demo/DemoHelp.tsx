"use client";

import { X, HelpCircle, LayoutDashboard, Calendar, Users, Megaphone, Settings, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export function DemoHelp({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  // Reset step when opened
  useEffect(() => {
      if (isOpen) setStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
      {
          title: "Bienvenido a Turnero Pro",
          desc: "Esta es una demo interactiva completa. Aquí podrás simular la gestión de tu clínica, barbería o negocio de servicios.",
          icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
          color: "bg-green-50"
      },
      {
          title: "Panel de Control (Dashboard)",
          desc: "Visualiza tus métricas clave: turnos del día, ingresos estimados y nuevos pacientes en tiempo real.",
          icon: <LayoutDashboard className="w-12 h-12 text-indigo-500" />,
          color: "bg-indigo-50"
      },
      {
          title: "Agenda Inteligente",
          desc: "Gestiona tus citas con vistas de lista o grilla. Los turnos confirmados por el bot aparecen aquí automáticamente.",
          icon: <Calendar className="w-12 h-12 text-blue-500" />,
          color: "bg-blue-50"
      },
      {
          title: "Base de Pacientes",
          desc: "Accede al historial clínico, notas y estadísticas de cada cliente. Haz clic en un paciente para ver su ficha completa.",
          icon: <Users className="w-12 h-12 text-orange-500" />,
          color: "bg-orange-50"
      },
      {
          title: "Marketing Automatizado",
          desc: "Crea campañas por WhatsApp o Email para reactivar clientes inactivos o promocionar ofertas.",
          icon: <Megaphone className="w-12 h-12 text-pink-500" />,
          color: "bg-pink-50"
      },
      {
          title: "Configuración y Bot",
          desc: "Personaliza tus servicios y horarios. ¡Prueba agregar un servicio nuevo y verás cómo aparece en el chat al instante!",
          icon: <Settings className="w-12 h-12 text-slate-500" />,
          color: "bg-slate-50"
      }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            <div className={`h-48 ${steps[step].color} flex items-center justify-center relative transition-colors duration-500`}>
                <div className="bg-white p-4 rounded-2xl shadow-sm scale-110">
                    {steps[step].icon}
                </div>
            </div>

            <div className="p-8 text-center">
                <h3 className="text-2xl font-black text-slate-800 mb-3">{steps[step].title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    {steps[step].desc}
                </p>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1.5">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-indigo-600 w-6' : 'bg-slate-200'}`}></div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Atrás
                            </button>
                        )}

                        {step < steps.length - 1 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-sm font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                            >
                                ¡Entendido!
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
