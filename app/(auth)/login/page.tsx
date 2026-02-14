"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [locale, setLocale] = useState<"es" | "en" | "pt">("es");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const i18n = {
    es: {
      subtitle: "Ingresa a tu panel de administración",
      emailLabel: "Email Profesional",
      emailPlaceholder: "nombre@empresa.com",
      passLabel: "Contraseña",
      cta: "Iniciar Sesión",
      invalid: "Credenciales inválidas. Intenta nuevamente.",
      unexpected: "Ocurrió un error inesperado.",
      noAccount: "¿Aún no tienes cuenta?",
      create: "Crear Tenant Gratis",
      demo: "Credenciales Demo",
      enterprise: "Tenant Enterprise",
    },
    en: {
      subtitle: "Sign in to your admin panel",
      emailLabel: "Business Email",
      emailPlaceholder: "name@company.com",
      passLabel: "Password",
      cta: "Sign In",
      invalid: "Invalid credentials. Please try again.",
      unexpected: "An unexpected error occurred.",
      noAccount: "Don’t have an account yet?",
      create: "Create Free Tenant",
      demo: "Demo Credentials",
      enterprise: "Enterprise Tenant",
    },
    pt: {
      subtitle: "Acesse seu painel administrativo",
      emailLabel: "Email Profissional",
      emailPlaceholder: "nome@empresa.com",
      passLabel: "Senha",
      cta: "Entrar",
      invalid: "Credenciais inválidas. Tente novamente.",
      unexpected: "Ocorreu um erro inesperado.",
      noAccount: "Ainda não tem conta?",
      create: "Criar Tenant Grátis",
      demo: "Credenciais Demo",
      enterprise: "Tenant Enterprise",
    },
  }[locale];

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
        setError(i18n.invalid);
      } else {
        router.push("/sa/tenants"); // Redirect to SA or Tenant Dashboard based on logic (hardcoded SA for now or we can check session)
        // Ideally, we redirect to /t/[tenant]/dashboard if user has a tenant
        router.refresh();
      }
    } catch (error) {
      setError(i18n.unexpected);
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
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{i18n.subtitle}</p>
        <div className="mt-3 inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
          {(["es", "en", "pt"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`px-2.5 py-1 ${locale === l ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{i18n.emailLabel}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder={i18n.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{i18n.passLabel}</label>
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
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : i18n.cta}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {i18n.noAccount}{" "}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            {i18n.create}
          </Link>
        </p>
      </div>

      {/* Demo Credentials Hint */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-3">
         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">{i18n.demo}</p>
         <div className="text-xs text-slate-600 dark:text-slate-300 font-mono space-y-2">
            <div className="flex justify-between gap-2"><span>SuperAdmin</span><span>admin@turnero.pro / SuperAdmin123!</span></div>
            <div className="flex justify-between gap-2"><span>{i18n.enterprise}</span><span>admin@demo-dentista.com / Demo123!</span></div>
         </div>
      </div>
    </div>
  );
}
