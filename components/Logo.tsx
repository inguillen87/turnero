import { CalendarCheck2 } from "lucide-react";

export function Logo({ className = "w-8 h-8", textClassName = "text-xl" }: { className?: string, textClassName?: string }) {
  return (
    <div className="flex items-center gap-2 font-bold select-none">
      <div className={`bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ${className}`}>
        <CalendarCheck2 className="w-2/3 h-2/3" />
      </div>
      <span className={`tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 ${textClassName}`}>
        Turnero<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
      </span>
    </div>
  );
}
