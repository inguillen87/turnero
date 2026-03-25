import { Search, Bell, HelpCircle, CheckCheck, PanelLeft, MessageSquare, Wifi, WifiOff } from "lucide-react";
import { ClientDate } from "@/components/ui/ClientDate";
import { useEffect, useMemo, useState } from "react";
import { DemoHelp } from "@/components/demo/DemoHelp";

type RealtimeNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

interface DemoTopbarProps {
  title: string;
  onOpenMenu?: () => void;
  onOpenSimulator?: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export function DemoTopbar({ title, onOpenMenu, onOpenSimulator, searchQuery, onSearchQueryChange }: DemoTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [connection, setConnection] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  useEffect(() => {
    const source = new EventSource('/api/t/demo-clinica/events');

    const onReady = () => setConnection('online');
    const onMessage = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data) as { seq?: number; type?: string; title?: string; body?: string; createdAt?: string };
        const item: RealtimeNotification = {
          id: String(payload.seq || `${Date.now()}-${Math.random()}`),
          type: payload.type || 'info',
          title: payload.title || 'Notificación',
          body: payload.body || 'Hay una actualización nueva.',
          createdAt: payload.createdAt || new Date().toISOString(),
          read: false,
        };
        setNotifications((prev) => [item, ...prev].slice(0, 30));
      } catch {
        // ignore malformed payload
      }
    };

    source.addEventListener('ready', onReady as EventListener);
    source.addEventListener('message', onMessage as EventListener);
    source.onerror = () => setConnection('offline');

    return () => {
      source.removeEventListener('ready', onReady as EventListener);
      source.removeEventListener('message', onMessage as EventListener);
      source.close();
    };
  }, []);

  useEffect(() => {
    if (showNotifications) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, [showNotifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <>
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onOpenMenu}
            className="md:hidden w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-600"
            aria-label="Abrir menú"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
          <span className="hidden md:flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Demo
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-slate-500">
          <div className="hidden md:flex relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Buscar paciente o turno..."
              className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

          <div className="hidden sm:block">
            <ClientDate />
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50">
            {connection === 'online' ? (
              <><Wifi className="w-3.5 h-3.5 text-emerald-600" /><span className="text-emerald-700 font-semibold">Realtime</span></>
            ) : connection === 'connecting' ? (
              <><Wifi className="w-3.5 h-3.5 text-amber-500 animate-pulse" /><span className="text-amber-700 font-semibold">Conectando</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5 text-red-500" /><span className="text-red-600 font-semibold">Offline</span></>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors relative ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-600'}`}
              aria-label="Abrir notificaciones"
            >
              <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 max-w-[92vw] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 text-sm">Notificaciones en vivo</h4>
                  <button
                    onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                    className="text-[10px] text-indigo-600 hover:underline font-bold uppercase tracking-wide inline-flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" /> Marcar leídas
                  </button>
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">Aún no llegaron eventos. Probá reservar desde el simulador.</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b border-slate-50 transition-colors ${n.read ? 'bg-white' : 'bg-indigo-50/40'}`}>
                        <div className="flex gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.read ? 'bg-slate-300' : 'bg-red-500 animate-pulse'}`}></div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 break-words">{n.body}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors hidden md:flex"
          >
            <HelpCircle className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={onOpenSimulator}
            className="md:hidden w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Abrir simulador"
          >
            <MessageSquare className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <DemoHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}
