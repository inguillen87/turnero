import { Megaphone, MessageCircle, Mail, Send, History, Calendar, Clock, Repeat } from 'lucide-react';
import { useState } from 'react';

export function DemoMarketing() {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [scheduled, setScheduled] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Campañas de Marketing</h2>
                <p className="text-slate-500">Envía promociones y recordatorios masivos</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'create' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Megaphone className="w-4 h-4 inline-block mr-2" />
                    Crear Nueva
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <History className="w-4 h-4 inline-block mr-2" />
                    Historial
                </button>
            </div>
        </div>

        {activeTab === 'create' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-full min-h-[500px]">
                {/* Steps / Config */}
                <div className="w-full md:w-1/2 p-6 border-r border-slate-100 space-y-6 overflow-y-auto custom-scroll">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">1. Elige el Canal</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50 text-indigo-700 transition-all shadow-sm">
                                <MessageCircle className="w-6 h-6 mb-2" />
                                <span className="font-bold">WhatsApp</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all hover:border-slate-300">
                                <Mail className="w-6 h-6 mb-2" />
                                <span className="font-bold">Email</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">2. Selecciona Destinatarios</label>
                        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                            <option>Todos los Pacientes (142)</option>
                            <option>Pacientes Inactivos (+6 meses)</option>
                            <option>Pacientes de Ortodoncia</option>
                            <option>Lista VIP</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">3. Escribe el Mensaje</label>
                        <textarea
                            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
                            placeholder="Hola {{nombre}}, te recordamos que..."
                            defaultValue="Hola {{nombre}}, te invitamos a aprovechar un 20% de descuento en tu próxima limpieza dental si reservas esta semana! Responde SI para agendar."
                        ></textarea>
                        <p className="text-xs text-slate-400 mt-2 text-right">Caracteres: 145/1000</p>
                    </div>

                    {/* Schedule Options */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                             <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                 <Clock className="w-4 h-4 text-indigo-500" /> Programar Envío
                             </label>
                             <input type="checkbox" checked={scheduled} onChange={() => setScheduled(!scheduled)} className="toggle-checkbox" />
                        </div>

                        {scheduled && (
                            <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Fecha</label>
                                        <input type="date" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Hora</label>
                                        <input type="time" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                    </div>
                                </div>

                                <div>
                                     <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                                         <Repeat className="w-3 h-3" /> Frecuencia
                                     </label>
                                     <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm">
                                         <option>Una sola vez</option>
                                         <option>Diario (cada 24h)</option>
                                         <option>Semanal</option>
                                         <option>Mensual</option>
                                     </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group">
                        {scheduled ? <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        {scheduled ? 'Programar Campaña' : 'Enviar Campaña (Simulado)'}
                    </button>
                </div>

                {/* Preview */}
                <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center border-t md:border-t-0 border-slate-200">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Vista Previa</h3>
                    <div className="w-[300px] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 relative transform scale-95 md:scale-100 transition-transform">
                         {/* WhatsApp Header Fake */}
                         <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">TP</div>
                             <div>
                                 <p className="font-bold text-slate-800 text-sm">Turnero Pro</p>
                                 <p className="text-[10px] text-slate-400">Cuenta de Empresa</p>
                             </div>
                         </div>

                         {/* Message Bubble */}
                         <div className="bg-green-50 p-3 rounded-lg rounded-tl-none border border-green-100 text-sm text-slate-700 shadow-sm">
                             Hola <strong>Juan</strong>, te invitamos a aprovechar un 20% de descuento en tu próxima limpieza dental si reservas esta semana! Responde SI para agendar.
                             <div className="text-[10px] text-slate-400 text-right mt-1 flex justify-end gap-1">
                                 10:42 AM <span className="text-blue-400">✓✓</span>
                             </div>
                         </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 max-w-xs text-center">
                        Así se verá el mensaje en el teléfono de tus pacientes.
                    </p>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Nombre Campaña</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Canal</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Enviados</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Conversión</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { name: "Promo Fin de Año", channel: "WhatsApp", sent: 142, conv: "12%", status: "Completado" },
                            { name: "Recordatorio Semestral", channel: "Email", sent: 56, conv: "5%", status: "En curso" },
                            { name: "Bienvenida Nuevos", channel: "WhatsApp", sent: 12, conv: "45%", status: "Automático" },
                            { name: "Oferta Flash", channel: "Push", sent: 0, conv: "-", status: "Programado", date: "Mañana 10:00" },
                        ].map((c: any, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-700">{c.name}</p>
                                    {c.date && <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {c.date}</p>}
                                </td>
                                <td className="p-4 text-sm text-slate-600 flex items-center gap-2">
                                    {c.channel === 'WhatsApp' ? <MessageCircle className="w-4 h-4 text-green-500" /> :
                                     c.channel === 'Email' ? <Mail className="w-4 h-4 text-blue-500" /> :
                                     <Megaphone className="w-4 h-4 text-orange-500" />}
                                    {c.channel}
                                </td>
                                <td className="p-4 text-sm text-slate-600">{c.sent}</td>
                                <td className="p-4 text-sm text-green-600 font-bold">{c.conv}</td>
                                <td className="p-4 text-right">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                        c.status === 'Completado' ? 'bg-green-100 text-green-700' :
                                        c.status === 'En curso' ? 'bg-blue-100 text-blue-700' :
                                        c.status === 'Programado' ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>{c.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
}
