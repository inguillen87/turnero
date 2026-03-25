"use client";

import { useState, useEffect } from "react";
import { DemoSidebar } from "@/components/demo/DemoSidebar";
import { DemoTopbar } from "@/components/demo/DemoTopbar";
import { WhatsAppSimulator } from "@/components/demo/WhatsAppSimulator";
import { DemoDashboard } from "@/components/demo/DemoDashboard";
import { DemoAgenda } from "@/components/demo/DemoAgenda";
import { DemoPatients } from "@/components/demo/DemoPatients";
import { DemoReports } from "@/components/demo/DemoReports";
import { DemoMarketing } from "@/components/demo/DemoMarketing";
import { DemoFinance } from "@/components/demo/DemoFinance";
import { DemoSettings } from "@/components/demo/DemoSettings";
import { MessageSquare, LayoutDashboard, Calendar, Users, Megaphone, Settings } from "lucide-react";

const INITIAL_SERVICES = [
    { id: "consulta", name: "Consulta General", duration: '30 min', price: 50000, color: 'indigo' },
    { id: "limpieza", name: "Limpieza Dental", duration: '45 min', price: 35000, color: 'green' },
    { id: "ortodoncia", name: "Ortodoncia", duration: '20 min', price: 80000, color: 'blue' },
    { id: "blanqueamiento", name: "Blanqueamiento", duration: '60 min', price: 120000, color: 'orange' },
];

export default function DemoPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSimulator, setShowSimulator] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [services, setServices] = useState(INITIAL_SERVICES);

  // Initial Load
  useEffect(() => {
    fetch('/api/t/demo-clinica/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);

  const handleAction = (action: any) => {
    if (action?.type === 'APPOINTMENT_CREATED') {
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
    <div className="flex h-dvh bg-slate-100 font-sans overflow-hidden">
      {/* 1. Sidebar */}
      <DemoSidebar activeTab={activeTab} setActiveTab={setActiveTab} className="hidden md:flex" />

      {/* Mobile sidebar drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileMenu(false)}
            aria-label="Cerrar menú"
          />
          <DemoSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onItemSelect={() => setShowMobileMenu(false)}
            className="relative z-10 h-full"
          />
        </div>
      )}

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
         <DemoTopbar
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            onOpenMenu={() => setShowMobileMenu(true)}
            onOpenSimulator={() => setShowSimulator(true)}
         />

         <div className="flex-1 overflow-y-auto custom-scroll p-3 sm:p-4 md:p-8 pb-28 md:pb-8">
            {activeTab === 'dashboard' && <DemoDashboard appointments={appointments} />}
            {activeTab === 'agenda' && <DemoAgenda appointments={appointments} />}
            {activeTab === 'patients' && <DemoPatients />}
            {activeTab === 'marketing' && <DemoMarketing />}
            {activeTab === 'reports' && <DemoReports />}
            {activeTab === 'finance' && <DemoFinance />}
            {activeTab === 'settings' && <DemoSettings services={services} setServices={setServices} />}
         </div>

         {/* Floating Simulator Toggle */}
         {!showSimulator && (
             <button
                onClick={() => setShowSimulator(true)}
                className="absolute bottom-24 md:bottom-8 right-4 md:right-8 bg-indigo-600 text-white p-3 md:p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-transform hover:scale-105 z-40 flex items-center gap-2"
             >
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-bold pr-2 hidden sm:inline">Probar Bot</span>
             </button>
         )}
      </div>

      {/* 3. Simulator Panel (Right) */}
      <div
        className={`bg-white border-l border-slate-200 transition-all duration-500 ease-in-out flex flex-col z-30 shadow-2xl
        fixed md:relative right-0 top-0 h-dvh md:h-auto
        ${showSimulator ? 'w-full sm:w-[420px] translate-x-0 opacity-100' : 'w-0 md:w-0 translate-x-full opacity-0 overflow-hidden'}`}
      >
         <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-100 bg-slate-50/70 backdrop-blur-sm">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Simulador en Vivo
            </h3>
            <button
                onClick={() => setShowSimulator(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
            >
                ✕
            </button>
         </div>

         <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-100">
             <div className="w-full max-w-[380px] h-[78vh] sm:h-[680px] bg-black rounded-[2rem] sm:rounded-[3rem] border-6 sm:border-8 border-slate-900 shadow-2xl overflow-hidden transform scale-[0.96] sm:scale-95 relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
                <WhatsAppSimulator onAction={handleAction} services={services} />
             </div>
             <p className="text-xs text-slate-400 mt-6 text-center max-w-xs">
                Interactúa con el bot como si fueras un paciente. Los cambios se reflejarán en el Dashboard en tiempo real.
             </p>
         </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 py-2 [padding-bottom:calc(env(safe-area-inset-bottom)+0.5rem)]">
        <div className="grid grid-cols-5 gap-1 text-[10px]">
          {[
            { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
            { id: "agenda", label: "Agenda", icon: Calendar },
            { id: "patients", label: "Pacientes", icon: Users },
            { id: "marketing", label: "Mkt", icon: Megaphone },
            { id: "settings", label: "Config", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`rounded-xl py-2.5 flex flex-col items-center justify-center gap-1 ${activeTab === item.id ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
