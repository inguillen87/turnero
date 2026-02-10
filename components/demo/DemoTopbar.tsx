import { Search, Bell, HelpCircle, Sun, Moon, Check, X, CreditCard } from "lucide-react";
import { ClientDate } from "@/components/ui/ClientDate";
import { useState } from "react";

interface DemoTopbarProps {
  title: string;
}

export function DemoTopbar({ title }: DemoTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
      { id: 1, type: 'turno', message: 'Nuevo turno: Juan Perez', time: 'Hace 5 min', status: 'pending' },
      { id: 2, type: 'pago', message: 'Pago recibido: $3.500', time: 'Hace 1 hora', status: 'success' },
      { id: 3, type: 'recordatorio', message: 'Recordatorio enviado a Maria', time: 'Hace 2 horas', status: 'info' },
  ]);

  const handleAction = (id: number, action: 'confirm' | 'dismiss') => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      // In a real app, this would trigger an API call
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <span className="hidden md:flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Demo
        </span>
      </div>

      <div className="flex items-center gap-4 text-slate-500">
        <div className="hidden md:flex relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <input
                type="text"
                placeholder="Buscar paciente o turno..."
                className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <ClientDate />

        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors relative ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-600'}`}
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold animate-pulse">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="font-bold text-slate-700 text-sm">Notificaciones</h4>
                        <button
                            onClick={() => setNotifications([])}
                            className="text-[10px] text-indigo-600 hover:underline font-bold uppercase tracking-wide"
                        >
                            Marcar leídas
                        </button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No hay notificaciones nuevas.
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative">
                                    <div className="flex gap-3">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                                            n.type === 'turno' ? 'bg-indigo-500' :
                                            n.type === 'pago' ? 'bg-green-500' : 'bg-blue-400'
                                        }`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 leading-snug">{n.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">{n.time}</p>

                                            {/* Quick Actions */}
                                            {n.type === 'turno' && (
                                                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleAction(n.id, 'confirm')} className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> Confirmar
                                                    </button>
                                                    <button onClick={() => handleAction(n.id, 'dismiss')} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 flex items-center gap-1">
                                                        <X className="w-3 h-3" /> Descartar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors hidden md:flex">
            <HelpCircle className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
