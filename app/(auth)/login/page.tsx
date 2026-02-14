"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Credenciales inválidas. Intenta nuevamente.");
      } else {
        router.push("/sa/tenants"); // Redirect to SA or Tenant Dashboard based on logic (hardcoded SA for now or we can check session)
        // Ideally, we redirect to /t/[tenant]/dashboard if user has a tenant
        router.refresh();
      }
    } catch (error) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
           <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Turnero Pro</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ingresa a tu panel de administración</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Profesional</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center font-medium border border-red-100 dark:border-red-800 animate-fade-in">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Crear Tenant Gratis
          </Link>
        </p>
      </div>

      {/* Demo Credentials Hint */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-3">
         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">Credenciales Demo</p>
         <div className="text-xs text-slate-600 dark:text-slate-300 font-mono space-y-2">
            <div className="flex justify-between gap-2"><span>SuperAdmin</span><span>admin@turnero.pro / SuperAdmin123!</span></div>
            <div className="flex justify-between gap-2"><span>Tenant Enterprise</span><span>admin@demo-dentista.com / Demo123!</span></div>
         </div>
      </div>
    </div>
  );
}
