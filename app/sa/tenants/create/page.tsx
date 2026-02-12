"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Store, Mail, Lock, Phone } from "lucide-react";

export default function CreateTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tenantName: "",
    slug: "",
    email: "",
    password: "",
    plan: "demo"
  });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/sa/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Error creating tenant");
      }

      setMsg("Tenant created successfully!");
      router.refresh();
      setTimeout(() => router.push("/sa/tenants"), 1500);
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
         <h2 className="text-2xl font-bold text-slate-900">Provision New Tenant</h2>
         <p className="text-slate-500">Create a new workspace, admin user, and initial configuration.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400" /> Business Name
               </label>
               <input
                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                 placeholder="e.g. Clínica Dental Pro"
                 value={form.tenantName}
                 onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
                 required
               />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400" /> URL Slug
               </label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">turnero.pro/t/</span>
                  <input
                    className="w-full pl-28 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                    placeholder="clinica-dental"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                  />
               </div>
             </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
             <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Admin User</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> Admin Email
                 </label>
                 <input
                   type="email"
                   className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   placeholder="admin@example.com"
                   value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })}
                   required
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" /> Initial Password
                 </label>
                 <input
                   type="password"
                   className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   placeholder="••••••••"
                   value={form.password}
                   onChange={(e) => setForm({ ...form, password: e.target.value })}
                   required
                 />
               </div>
             </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Plan & Features</h3>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Subscription Plan</label>
                 <select
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                    value={form.plan}
                    onChange={(e) => setForm({...form, plan: e.target.value})}
                 >
                    <option value="demo">Demo (Trial)</option>
                    <option value="pro">Pro (Monthly)</option>
                    <option value="enterprise">Enterprise</option>
                 </select>
              </div>
          </div>

          {msg && (
            <div className={`p-4 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${msg.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
               {msg.includes("success") ? <CheckCircle className="w-4 h-4" /> : null}
               {msg}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={() => router.back()} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">
                Cancel
             </button>
             <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Create Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
