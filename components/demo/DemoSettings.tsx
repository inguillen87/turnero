"use client";

import { useState } from "react";
import {
  Save,
  Building,
  Clock,
  Users,
  Wrench,
  CreditCard,
  Link as LinkIcon,
  Plus,
  Trash2,
  MessageCircle,
  Calendar,
  Check,
  RefreshCw,
  X,
  FileSpreadsheet
} from "lucide-react";

interface DemoSettingsProps {
    services?: any[];
    setServices?: (services: any[]) => void;
}

export function DemoSettings({ services, setServices }: DemoSettingsProps) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'schedule', label: 'Horarios', icon: Clock },
    { id: 'staff', label: 'Equipo', icon: Users },
    { id: 'services', label: 'Servicios', icon: Wrench },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
    { id: 'integrations', label: 'Integraciones', icon: LinkIcon },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Configuración</h2>
                <p className="text-slate-500">Personaliza tu clínica</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                <Save className="w-4 h-4" /> Guardar Cambios
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
            {/* Settings Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                    >
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto custom-scroll p-8">
                {activeTab === 'general' && <SettingsGeneral />}
                {activeTab === 'schedule' && <SettingsSchedule />}
                {activeTab === 'staff' && <SettingsStaff />}
                {activeTab === 'services' && <SettingsServices services={services} setServices={setServices} />}
                {activeTab === 'billing' && <SettingsBilling />}
                {activeTab === 'integrations' && <SettingsIntegrations />}
            </div>
        </div>
    </div>
  );
}

function SettingsGeneral() {
    return (
        <div className="space-y-6 max-w-2xl">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4">Información de la Clínica</h3>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Clínica</label>
                    <input type="text" defaultValue="Clínica Dental Demo" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label>
                        <input type="text" defaultValue="+54 9 11 1234 5678" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input type="email" defaultValue="contacto@clinicademo.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dirección</label>
                    <input type="text" defaultValue="Av. Corrientes 1234, CABA" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option>America/Argentina/Buenos_Aires (GMT-3)</option>
                        <option>America/Santiago (GMT-4)</option>
                        <option>Europe/Madrid (GMT+1)</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

function SettingsSchedule() {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return (
        <div className="space-y-6">
             <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4">Horarios de Atención</h3>
             <div className="space-y-4">
                 {days.map((day, i) => (
                     <div key={day} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                         <div className="w-32 font-bold text-slate-700">{day}</div>
                         <div className="flex-1 flex items-center gap-4">
                             <input type="time" defaultValue="09:00" className="p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-indigo-500" />
                             <span className="text-slate-400">-</span>
                             <input type="time" defaultValue={i === 5 ? "13:00" : "18:00"} className="p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-indigo-500" />
                         </div>
                         <div className="flex items-center gap-2">
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked={i !== 6} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                             </label>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    )
}

function SettingsStaff() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 text-lg">Profesionales</h3>
                <button className="text-indigo-600 text-sm font-bold hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Agregar
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { name: 'Dr. Admin', role: 'Dentista General', email: 'admin@clinica.com' },
                    { name: 'Dra. Ana Gomez', role: 'Ortodoncista', email: 'ana@clinica.com' },
                    { name: 'Dr. Pedro Lopez', role: 'Cirujano', email: 'pedro@clinica.com' },
                ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all group">
                         <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                             {s.name.charAt(0)}
                         </div>
                         <div className="flex-1">
                             <h4 className="font-bold text-slate-800">{s.name}</h4>
                             <p className="text-xs text-slate-500">{s.role}</p>
                             <p className="text-xs text-indigo-500 mt-1">{s.email}</p>
                         </div>
                         <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-2">
                             <Trash2 className="w-4 h-4" />
                         </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SettingsServices({ services, setServices }: { services?: any[], setServices?: (s: any[]) => void }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newService, setNewService] = useState({ name: '', duration: '30 min', price: 0, color: 'gray' });

    const handleAdd = () => {
        if (!setServices || !services) return;
        if (!newService.name) return;

        const serviceToAdd = {
            id: Date.now().toString(),
            name: newService.name,
            duration: newService.duration,
            price: Number(newService.price),
            color: newService.color
        };

        setServices([...services, serviceToAdd]);
        setIsAdding(false);
        setNewService({ name: '', duration: '30 min', price: 0, color: 'gray' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 text-lg">Servicios Ofrecidos</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-indigo-600 text-sm font-bold hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Agregar
                </button>
            </div>

            {isAdding && (
                <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                                placeholder="Ej: Implante"
                                value={newService.name}
                                onChange={(e) => setNewService({...newService, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Precio</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                                placeholder="5000"
                                value={newService.price || ''}
                                onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Duración</label>
                            <select
                                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                                value={newService.duration}
                                onChange={(e) => setNewService({...newService, duration: e.target.value})}
                            >
                                <option>15 min</option>
                                <option>30 min</option>
                                <option>45 min</option>
                                <option>60 min</option>
                                <option>90 min</option>
                                <option>120 min</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Color</label>
                            <select
                                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                                value={newService.color}
                                onChange={(e) => setNewService({...newService, color: e.target.value})}
                            >
                                <option value="indigo">Indigo</option>
                                <option value="green">Verde</option>
                                <option value="blue">Azul</option>
                                <option value="orange">Naranja</option>
                                <option value="red">Rojo</option>
                                <option value="purple">Violeta</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsAdding(false)} className="text-xs font-bold text-slate-500 px-3 py-2">Cancelar</button>
                        <button onClick={handleAdd} className="text-xs font-bold bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700">Guardar</button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {services?.map((s, i) => (
                    <div key={s.id || i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                             <div className={`w-4 h-4 rounded-full bg-${s.color}-500 border border-slate-200`}></div>
                             <div>
                                <h4 className="font-bold text-slate-800">{s.name}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {s.duration}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500">${s.price}</span>
                                </div>
                             </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-slate-300 hover:text-indigo-600 p-1"><Wrench className="w-4 h-4" /></button>
                            <button
                                onClick={() => setServices && setServices(services.filter(srv => srv.id !== s.id))}
                                className="text-slate-300 hover:text-red-600 p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SettingsBilling() {
    return <div className="text-center py-12 text-slate-400">Configuración de facturación (Demo)</div>
}

function SettingsIntegrations() {
    const [connectedCalendar, setConnectedCalendar] = useState(false);
    const [connectedSheets, setConnectedSheets] = useState(false);

    return (
        <div className="space-y-6">
             <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4">Integraciones Activas</h3>

             <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 border border-green-200 bg-green-50/50 rounded-2xl">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                             <MessageCircle className="w-6 h-6 text-green-600" />
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-800">WhatsApp Business</h4>
                             <p className="text-xs text-green-700 font-medium">Conectado y Activo</p>
                         </div>
                     </div>
                     <button className="text-xs font-bold bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">Configurar</button>
                 </div>

                 <div className={`flex items-center justify-between p-6 border rounded-2xl transition-all ${connectedCalendar ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200 opacity-75'}`}>
                     <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${connectedCalendar ? 'bg-blue-100' : 'bg-slate-50'}`}>
                             <Calendar className={`w-6 h-6 ${connectedCalendar ? 'text-blue-600' : 'text-slate-400'}`} />
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-800">Google Calendar</h4>
                             <p className="text-xs text-slate-500">{connectedCalendar ? 'Sincronizando bidireccionalmente' : 'Sincronización bidireccional'}</p>
                         </div>
                     </div>
                     <button
                        onClick={() => setConnectedCalendar(!connectedCalendar)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
                            connectedCalendar ? 'bg-white text-blue-600 border border-blue-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                     >
                         {connectedCalendar ? (
                             <><Check className="w-3 h-3" /> Conectado</>
                         ) : (
                             'Conectar'
                         )}
                     </button>
                 </div>

                  <div className={`flex items-center justify-between p-6 border rounded-2xl transition-all ${connectedSheets ? 'border-green-200 bg-green-50/50' : 'border-slate-200 opacity-75 grayscale hover:grayscale-0'}`}>
                     <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${connectedSheets ? 'bg-green-100' : 'bg-slate-50'}`}>
                             <FileSpreadsheet className={`w-6 h-6 ${connectedSheets ? 'text-green-600' : 'text-slate-400'}`} />
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-800">Google Sheets</h4>
                             <p className="text-xs text-slate-500">{connectedSheets ? 'Exportando datos en tiempo real' : 'Exportar turnos automáticamente'}</p>
                         </div>
                     </div>
                     <button
                        onClick={() => setConnectedSheets(!connectedSheets)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
                            connectedSheets ? 'bg-white text-green-600 border border-green-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                     >
                         {connectedSheets ? (
                             <><Check className="w-3 h-3" /> Conectado</>
                         ) : (
                             'Conectar'
                         )}
                     </button>
                 </div>
             </div>
        </div>
    )
}
