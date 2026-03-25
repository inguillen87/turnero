"use client";

import { AlertTriangle, Filter, MoreHorizontal, Phone, Plus, Search, ShieldCheck, SquarePen, Trash2, UserRoundSearch, MessageCircleWarning, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type DemoPatient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "Active" | "New" | "Inactive";
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  totalVisits: number;
  lastVisit: string;
  notes?: string;
};

const FALLBACK_PATIENTS: DemoPatient[] = [
  {
    id: "demo-p-1",
    name: "Juan Perez (Demo)",
    phone: "+5491112345678",
    email: "juan@demo.com",
    status: "Active",
    riskLevel: "LOW",
    totalVisits: 5,
    lastVisit: "Hace 2 días",
    notes: "Paciente regular. Prefiere turnos por la tarde.",
  },
  {
    id: "demo-p-2",
    name: "Maria Garcia (Demo)",
    phone: "+5491187654321",
    email: "maria@demo.com",
    status: "Active",
    riskLevel: "LOW",
    totalVisits: 12,
    lastVisit: "Hoy",
    notes: "Tratamiento de ortodoncia en curso.",
  },
];

function mapApiPatient(row: any): DemoPatient {
  const risk = String(row?.risk || "LOW").toUpperCase();
  const riskLevel: DemoPatient["riskLevel"] = risk === "HIGH" ? "HIGH" : risk === "MEDIUM" ? "MEDIUM" : "LOW";
  const totalVisits = Number(row?.totalAppointments || 0);
  return {
    id: String(row?.id || crypto.randomUUID()),
    name: String(row?.name || "Sin nombre"),
    phone: String(row?.phone || row?.phoneE164 || ""),
    email: String(row?.email || ""),
    status: totalVisits > 0 ? "Active" : "New",
    riskLevel,
    totalVisits,
    lastVisit: row?.lastSeen ? new Date(row.lastSeen).toLocaleDateString("es-AR") : "Nunca",
    notes: riskLevel === "HIGH" ? "Paciente con riesgo alto de no-show." : "Paciente estable.",
  };
}

export function DemoPatients({ externalSearchTerm = "" }: { externalSearchTerm?: string }) {
  const [selectedPatient, setSelectedPatient] = useState<DemoPatient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<DemoPatient[]>(FALLBACK_PATIENTS);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ id: "", name: "", phoneE164: "", email: "" });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/t/demo-clinica/patients")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("patients_error"))))
      .then((rows) => {
        if (!mounted || !Array.isArray(rows)) return;
        const mapped = rows.map(mapApiPatient);
        if (mapped.length > 0) setPatients(mapped);
      })
      .catch(() => {
        // keep fallback for demo resilience
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPatients = useMemo(
    () =>
      patients.filter((p) => {
        const needle = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(needle) ||
          p.email.toLowerCase().includes(needle) ||
          p.phone.toLowerCase().includes(needle)
        );
      }),
    [patients, searchTerm]
  );

  const createPatient = async () => {
    if (!form.phoneE164.trim()) {
      setSaveError("El teléfono es obligatorio.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/t/demo-clinica/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phoneE164: form.phoneE164, email: form.email }),
      });

      if (!res.ok) throw new Error("No se pudo crear el paciente");
      const created = await res.json();

      const next: DemoPatient = {
        id: String(created.id || crypto.randomUUID()),
        name: String(created.name || form.name || "Paciente nuevo"),
        phone: String(created.phoneE164 || form.phoneE164),
        email: String(created.email || form.email || ""),
        status: "New",
        riskLevel: "MEDIUM",
        totalVisits: 0,
        lastVisit: "Hoy",
        notes: "Creado desde la sección Pacientes.",
      };

      setPatients((prev) => [next, ...prev]);
      setCreateOpen(false);
      setForm({ id: "", name: "", phoneE164: "", email: "" });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (patient: DemoPatient) => {
    setOpenMenuId(null);
    setForm({ id: patient.id, name: patient.name, phoneE164: patient.phone, email: patient.email });
    setSaveError(null);
    setEditOpen(true);
  };

  const updatePatient = async () => {
    if (!form.id) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/t/demo-clinica/patients/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el paciente");

      setPatients((prev) => prev.map((p) => (p.id === form.id ? { ...p, name: form.name || p.name, email: form.email || p.email } : p)));
      setEditOpen(false);
      setForm({ id: "", name: "", phoneE164: "", email: "" });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  const removePatient = async (patientId: string) => {
    setOpenMenuId(null);
    const previous = patients;
    setPatients((prev) => prev.filter((p) => p.id !== patientId));

    try {
      const res = await fetch(`/api/t/demo-clinica/patients/${patientId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
    } catch {
      setPatients(previous);
      setSaveError("No se pudo eliminar el paciente. Reintentá.");
    }
  };

  const toggleRisk = (patientId: string) => {
    setOpenMenuId(null);
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, riskLevel: p.riskLevel === "HIGH" ? "LOW" : "HIGH" } : p))
    );
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 w-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Pacientes</h3>
            <p className="text-slate-500 text-sm">Gestiona tu base de datos de clientes</p>
          </div>
          <button
            onClick={() => {
              setForm({ id: "", name: "", phoneE164: "", email: "" });
              setSaveError(null);
              setCreateOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Paciente
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>

        <div className="flex-1 overflow-auto custom-scroll">
          {loading && <div className="p-4 text-sm text-slate-400">Cargando pacientes...</div>}
          {saveError && <div className="px-4 py-2 text-xs text-red-600">{saveError}</div>}
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 pl-6">Nombre</th>
                <th className="py-3 hidden md:table-cell">Contacto</th>
                <th className="py-3 hidden lg:table-cell">Estado</th>
                <th className="py-3 hidden xl:table-cell">Riesgo</th>
                <th className="py-3 text-right pr-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((p) => (
                <tr key={p.id} onClick={() => setSelectedPatient(p)} className="hover:bg-indigo-50/50 transition-colors cursor-pointer group pl-6">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{p.name}</p>
                        <p className="text-xs text-slate-400 font-mono">ID: #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <div className="text-sm text-slate-600 flex flex-col gap-1">
                      <span className="flex items-center gap-1 font-medium"><Phone className="w-3 h-3 text-slate-400" /> {p.phone || "—"}</span>
                      <span className="text-xs text-slate-400">{p.email || "Sin email"}</span>
                    </div>
                  </td>
                  <td className="py-4 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      p.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : p.status === "New"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 hidden xl:table-cell">
                    {p.riskLevel === "HIGH" ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100 w-fit"><AlertTriangle className="w-3 h-3" /> Alto Riesgo</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 w-fit"><ShieldCheck className="w-3 h-3" /> Confiable</span>
                    )}
                  </td>
                  <td className="py-4 text-right pr-6 relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenuId((prev) => (prev === p.id ? null : p.id))}
                      className="text-slate-300 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-full"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {openMenuId === p.id && (
                      <div className="absolute right-6 top-12 z-30 w-52 rounded-xl bg-white border border-slate-200 shadow-xl p-1 text-sm">
                        <button onClick={() => { setSelectedPatient(p); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"><UserRoundSearch className="w-4 h-4" /> Ver ficha</button>
                        <button onClick={() => startEdit(p)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"><SquarePen className="w-4 h-4" /> Editar datos</button>
                        <button onClick={() => toggleRisk(p.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"><MessageCircleWarning className="w-4 h-4" /> {p.riskLevel === 'HIGH' ? 'Marcar confiable' : 'Marcar alto riesgo'}</button>
                        <button onClick={() => window.open(`https://wa.me/${p.phone.replace(/\D/g, '')}`, '_blank')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50">Enviar WhatsApp</button>
                        <button onClick={() => removePatient(p.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Eliminar</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(createOpen || editOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative">
            <button onClick={() => { setCreateOpen(false); setEditOpen(false); }} className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editOpen ? 'Editar paciente' : 'Nuevo paciente'}</h3>
            <div className="space-y-3">
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Nombre" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              <input disabled={editOpen} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm disabled:bg-slate-100" placeholder="Teléfono (+549...)" value={form.phoneE164} onChange={(e) => setForm((s) => ({ ...s, phoneE164: e.target.value }))} />
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
              {saveError && <p className="text-xs text-red-600">{saveError}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setCreateOpen(false); setEditOpen(false); }} className="px-4 py-2 rounded-lg border border-slate-200 text-sm">Cancelar</button>
              <button onClick={editOpen ? updatePatient : createPatient} disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Guardando..." : editOpen ? 'Guardar cambios' : 'Crear paciente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPatient && (
        <div className="fixed bottom-4 right-4 z-40 bg-white border border-slate-200 shadow-xl rounded-xl p-4 w-80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase">Paciente</p>
              <h4 className="font-bold text-slate-800">{selectedPatient.name}</h4>
              <p className="text-sm text-slate-500">{selectedPatient.phone || "Sin teléfono"}</p>
            </div>
            <button onClick={() => setSelectedPatient(null)} className="p-1 rounded hover:bg-slate-100"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Última visita: {selectedPatient.lastVisit}</p>
          <p className="text-xs text-slate-500">Turnos: {selectedPatient.totalVisits}</p>
          <p className="text-xs text-slate-600 mt-2">{selectedPatient.notes}</p>
        </div>
      )}
    </div>
  );
}
