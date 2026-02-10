import { Search, Bell, HelpCircle, Sun, Moon } from "lucide-react";
import { ClientDate } from "@/components/ui/ClientDate";

interface DemoTopbarProps {
  title: string;
}

export function DemoTopbar({ title }: DemoTopbarProps) {
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

        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors hidden md:flex">
            <HelpCircle className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
