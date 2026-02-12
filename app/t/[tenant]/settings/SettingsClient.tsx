"use client";

import { useState } from "react";
import {
  Settings,
  Users,
  Briefcase,
  Globe,
  CreditCard,
  Bot,
  ShoppingBag,
  Check
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { GeneralSettings } from "./components/GeneralSettings";
import { BotSettings } from "./components/BotSettings";
import { ServicesSettings } from "./components/ServicesSettings";
import { TeamSettings } from "./components/TeamSettings";
import { IntegrationsSettings } from "./components/IntegrationsSettings";
import { BillingSettings } from "./components/BillingSettings";

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
