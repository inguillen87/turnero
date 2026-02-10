"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, BarChart3, CheckCircle2, LayoutDashboard, Contact, Settings } from "lucide-react";
import { WhatsAppSimulator } from "@/components/demo/WhatsAppSimulator";
import { DemoAgenda } from "@/components/demo/DemoAgenda";
import { DemoPatients } from "@/components/demo/DemoPatients";
import { ClientDate } from "@/components/ui/ClientDate";

export default function DemoPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'agenda' | 'patients' | 'settings'>('agenda');

  // Initial Load
  useEffect(() => {
    fetch('/api/t/demo-clinica/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);

  const handleAction = (action: any) => {
    if (action?.type === 'APPOINTMENT_CREATED') {
       // Simulate realtime update or append directly
       const newAppt = {
         id: action.payload.id,
         startAt: action.payload.startAt,
         clientName: action.payload.clientName,
         status: action.payload.status,
         service: { name: action.payload.serviceName },
         professional: { name: 'Demo Pro' }
       };
       setAppointments(prev => [newAppt, ...prev].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 1. Left Panel (WhatsApp Simulator) */}
      <div className="w-1/3 min-w-[360px] bg-slate-100 border-r border-slate-200 flex flex-col items-center justify-center p-8 relative">
         <div className="absolute top-8 left-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Pruébalo ahora</h2>
            <p className="text-slate-500 text-sm max-w-xs">Simula ser un paciente. Envía un mensaje y mira cómo impacta en el sistema al instante.</p>
         </div>

         <div className="w-[320px] h-[640px] shadow-2xl rounded-[3rem] border-8 border-slate-900 bg-black overflow-hidden relative transform scale-90 md:scale-100 transition-transform">
            <WhatsAppSimulator onAction={handleAction} />
         </div>

         <div className="absolute bottom-8 text-center text-xs text-slate-400">
           <p>Sin Twilio. Sin Meta. 100% Simulado para Demos.</p>
         </div>
      </div>

      {/* 2. Right Panel (Dashboard View) */}
      <div className="flex-1 flex flex-col bg-slate-50">
         {/* Top Bar */}
         <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
               <span className="font-bold text-slate-700">Turnero Pro <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded ml-2">DEMO LIVE</span></span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
               <ClientDate />
               <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
            </div>
         </div>

         {/* Dashboard Content */}
         <div className="flex-1 overflow-y-auto p-8 custom-scroll">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Panel de Control</h1>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-6 mb-8">
               <KpiCard title="Turnos Hoy" value={appointments.length} icon={<Calendar className="text-indigo-500"/>} />
               <KpiCard title="Pacientes Nuevos" value="3" icon={<Users className="text-green-500"/>} />
               <KpiCard title="Ingresos (Est)" value="$45.000" icon={<BarChart3 className="text-blue-500"/>} />
               <KpiCard title="Tasa Ocupación" value="85%" icon={<CheckCircle2 className="text-orange-500"/>} />
            </div>

            <div className="grid grid-cols-3 gap-8 h-[600px]">
               {/* Agenda/Content Column */}
               <div className="col-span-2">
                  {activeTab === 'agenda' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-700">Agenda del Día</h3>
                            <button className="text-xs text-indigo-600 font-bold hover:underline">Ver Calendario Completo</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scroll">
                            <DemoAgenda appointments={appointments} />
                        </div>
                    </div>
                  )}

                  {activeTab === 'patients' && (
                    <div className="h-full">
                        <DemoPatients />
                    </div>
                  )}

                  {activeTab === 'settings' && (
                     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 h-full flex flex-col items-center justify-center text-center">
                        <Settings className="w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="font-bold text-lg text-slate-700">Configuración</h3>
                        <p className="text-slate-500 text-sm max-w-xs mb-6">Aquí podrás configurar tus servicios, horarios, integraciones y reglas de negocio.</p>
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors" disabled>
                            Próximamente en Demo
                        </button>
                     </div>
                  )}
               </div>

               {/* Quick Actions / Notifications */}
               <div className="col-span-1 space-y-6">
                  <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200">
                     <h3 className="font-bold text-lg mb-2">Automatización Activa</h3>
                     <p className="text-indigo-100 text-sm mb-4">El bot de WhatsApp está gestionando tus turnos automáticamente.</p>
                     <div className="flex items-center gap-2 text-xs font-mono bg-indigo-800/30 p-2 rounded">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Escuchando mensajes...
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-700 mb-4">Accesos Rápidos</h3>
                     <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('agenda')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium border transition-all ${activeTab === 'agenda' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'}`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Agenda / Turnos
                        </button>
                        <button
                            onClick={() => setActiveTab('patients')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium border transition-all ${activeTab === 'patients' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'}`}
                        >
                            <Contact className="w-4 h-4" />
                            Ver Pacientes
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium border transition-all ${activeTab === 'settings' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'}`}
                        >
                            <Settings className="w-4 h-4" />
                            Configurar Servicios
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
       <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
       <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-800">{value}</p>
       </div>
    </div>
  )
}
