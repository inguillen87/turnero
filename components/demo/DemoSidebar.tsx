import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Megaphone,
  CreditCard,
  LogOut
} from "lucide-react";

interface DemoSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DemoSidebar({ activeTab, setActiveTab }: DemoSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'finance', label: 'Finanzas', icon: CreditCard },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl z-20">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 font-bold text-white shadow-lg shadow-indigo-500/20">
          T
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Turnero Pro</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Clinic Edition</p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scroll">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Principal</p>
        {menuItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            {item.label}
          </button>
        ))}

        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Gestión</p>
        {menuItems.slice(3, 6).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            {item.label}
          </button>
        ))}

        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Sistema</p>
        {menuItems.slice(6).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            {item.label}
          </button>
        ))}
      </div>

      {/* User / Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Dr+Admin&background=random" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Dr. Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@clinica.com</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 hover:text-red-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}
