"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight, Building, User, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    tenantName: "",
    slug: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "tenantName" && !formData.slug) {
        setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
        if (!formData.tenantName || !formData.slug) {
            setError("Completa los datos de la clínica.");
            return;
        }
        setStep(2);
        setError("");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            tenantName: formData.tenantName,
            slug: formData.slug,
            email: formData.email,
            password: formData.password
        }),
      });

      if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Error al registrar.");
      }

      // Login immediately after register
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push(`/t/${formData.slug}/dashboard`);
        router.refresh();
      }

    } catch (error: any) {
      setError(error.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500"></div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-teal-500/30">
           <Building className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Crea tu Clínica</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Comienza gratis hoy mismo.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {step === 1 && (
            <div className="space-y-4 animate-fade-in">
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre de la Clínica</label>
                <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    name="tenantName"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="Ej: Dental Care"
                    value={formData.tenantName}
                    onChange={handleChange}
                    autoFocus
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">URL Personalizada (Slug)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">turnero.com/t/</span>
                    <input
                    name="slug"
                    required
                    className="w-full pl-28 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-mono text-sm"
                    placeholder="dental-care"
                    value={formData.slug}
                    onChange={handleChange}
                    />
                </div>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-4 animate-fade-in">
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Administrador</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="admin@clinica.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoFocus
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    type="password"
                    name="password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmar Contraseña</label>
                <div className="relative">
                    <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    />
                </div>
                </div>
            </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center font-medium border border-red-100 dark:border-red-800 animate-fade-in">
            {error}
          </div>
        )}

        <div className="flex gap-3">
            {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all"
                >
                  Atrás
                </button>
            )}
            <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : step === 1 ? "Continuar" : "Crear Cuenta"}
            {!loading && step === 1 && <ChevronRight className="w-5 h-5" />}
            {!loading && step === 2 && <Check className="w-5 h-5" />}
            </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
