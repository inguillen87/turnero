"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, addWeeks, endOfWeek, format, isSameDay, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, Copy, Lock, Save } from "lucide-react";

type Appointment = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  clientName?: string;
  service?: { name?: string };
};

type BlockedRange = {
  id: string;
  startAt: string;
  endAt: string;
  reason: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function CalendarClient({ tenantSlug }: { tenantSlug: string }) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newBlock, setNewBlock] = useState({ startAt: "", endAt: "", reason: "Vacaciones" });

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, runtimeRes] = await Promise.all([
          fetch(`/api/t/${tenantSlug}/appointments`),
          fetch(`/api/t/${tenantSlug}/settings/runtime`),
        ]);

        if (appointmentsRes.ok) {
          const apptData = await appointmentsRes.json();
          setAppointments(Array.isArray(apptData) ? apptData : []);
        }

        if (runtimeRes.ok) {
          const runtimeData = await runtimeRes.json();
          const ranges = runtimeData?.config?.calendar?.blockedRanges;
          setBlockedRanges(Array.isArray(ranges) ? ranges : []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tenantSlug]);

  const filteredAppointments = useMemo(
    () => appointments.filter((a) => {
      const start = new Date(a.startAt);
      return start >= weekStart && start <= weekEnd;
    }),
    [appointments, weekStart, weekEnd]
  );

  const dayAppointments = (day: Date) => filteredAppointments.filter((a) => isSameDay(new Date(a.startAt), day));
  const dayBlocks = (day: Date) => blockedRanges.filter((b) => isSameDay(new Date(b.startAt), day));

  const saveBlockedRanges = async (nextRanges: BlockedRange[]) => {
    setSaving(true);
    setMessage("");
    try {
      const runtimeRes = await fetch(`/api/t/${tenantSlug}/settings/runtime`);
      const runtimeData = runtimeRes.ok ? await runtimeRes.json() : { config: {} };
      const nextConfig = {
        ...(runtimeData?.config || {}),
        calendar: {
          ...(runtimeData?.config?.calendar || {}),
          blockedRanges: nextRanges,
        },
      };

      const saveRes = await fetch(`/api/t/${tenantSlug}/settings/runtime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextConfig),
      });

      if (!saveRes.ok) {
        setMessage("No se pudo guardar los bloqueos.");
        return;
      }

      setBlockedRanges(nextRanges);
      setMessage("Bloqueos guardados correctamente.");
    } catch {
      setMessage("Error guardando bloqueos.");
    } finally {
      setSaving(false);
    }
  };

  const addBlockedRange = async () => {
    if (!newBlock.startAt || !newBlock.endAt) {
      setMessage("Elegí fecha/hora inicio y fin para bloquear.");
      return;
    }

    const range: BlockedRange = {
      id: `block-${Date.now()}`,
      startAt: new Date(newBlock.startAt).toISOString(),
      endAt: new Date(newBlock.endAt).toISOString(),
      reason: newBlock.reason || "Bloqueo operativo",
    };

    await saveBlockedRanges([...blockedRanges, range]);
    setNewBlock({ startAt: "", endAt: "", reason: "Vacaciones" });
  };

  const removeBlockedRange = async (id: string) => {
    await saveBlockedRanges(blockedRanges.filter((r) => r.id !== id));
  };

  const conflicts = useMemo(() => {
    return blockedRanges.reduce((acc, block) => {
      const blockStart = new Date(block.startAt).getTime();
      const blockEnd = new Date(block.endAt).getTime();
      const overlaps = appointments.filter((appt) => {
        const apptStart = new Date(appt.startAt).getTime();
        const apptEnd = new Date(appt.endAt).getTime();
        return apptStart < blockEnd && apptEnd > blockStart;
      }).length;
      return acc + overlaps;
    }, 0);
  }, [blockedRanges, appointments]);

  const copyWhatsappStatus = async () => {
    const text = `Hola 👋 Te avisamos que tuvimos cambios de agenda. Esta semana tenemos ${blockedRanges.length} bloqueos operativos y estamos reprogramando turnos afectados. Si querés, respondé este mensaje y te ofrecemos nuevos horarios.`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Mensaje para WhatsApp copiado.");
    } catch {
      setMessage("No se pudo copiar el mensaje.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Calendario Operativo</h2>
          <p className="text-slate-500 dark:text-slate-400">Calendario propio con turnos, ocupación y bloqueos por vacaciones/remodelación.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))} className="rounded-lg border px-3 py-2 text-sm"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-medium px-3">{format(weekStart, "d MMM", { locale: es })} - {format(weekEnd, "d MMM", { locale: es })}</span>
          <button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))} className="rounded-lg border px-3 py-2 text-sm"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="p-3">Hora</div>
            {days.map((d) => (
              <div key={d.toISOString()} className="p-3 border-l border-slate-200 dark:border-slate-800">
                <p>{format(d, "EEE", { locale: es })}</p>
                <p className="text-[10px] opacity-70">{format(d, "d/MM")}</p>
              </div>
            ))}
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-500">Cargando calendario...</div>
          ) : (
            HOURS.map((h) => (
              <div key={h} className="grid grid-cols-8 min-h-[44px] border-b border-slate-100 dark:border-slate-800/70 text-xs">
                <div className="p-2 text-slate-500 border-r border-slate-100 dark:border-slate-800">{String(h).padStart(2, "0")}:00</div>
                {days.map((d) => {
                  const appt = dayAppointments(d).find((a) => new Date(a.startAt).getHours() === h);
                  const block = dayBlocks(d).find((b) => {
                    const s = new Date(b.startAt).getHours();
                    const e = new Date(b.endAt).getHours();
                    return h >= s && h < e;
                  });

                  return (
                    <div key={`${d.toISOString()}-${h}`} className="p-1 border-l border-slate-100 dark:border-slate-800 relative">
                      {block ? (
                        <div className="h-full rounded bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-1 py-0.5 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {block.reason}
                        </div>
                      ) : appt ? (
                        <div className="h-full rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-1 py-0.5">
                          <p className="font-semibold truncate">{appt.clientName || "Paciente"}</p>
                          <p className="truncate">{appt.service?.name || "Servicio"}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Bloquear ventana</h3>
            <input type="datetime-local" value={newBlock.startAt} onChange={(e) => setNewBlock((p) => ({ ...p, startAt: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm" />
            <input type="datetime-local" value={newBlock.endAt} onChange={(e) => setNewBlock((p) => ({ ...p, endAt: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm" />
            <input value={newBlock.reason} onChange={(e) => setNewBlock((p) => ({ ...p, reason: e.target.value }))} placeholder="Motivo (vacaciones/remodelación)" className="w-full rounded-lg border px-3 py-2 text-sm" />
            <button onClick={addBlockedRange} disabled={saving} className="w-full rounded-lg bg-indigo-600 text-white text-sm px-3 py-2 flex items-center justify-center gap-2 disabled:opacity-60"><Save className="w-4 h-4" /> Guardar bloqueo</button>
            {message && <p className="text-xs text-slate-500">{message}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <p className="text-sm font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Conflictos detectados: {conflicts}</p>
            <button onClick={copyWhatsappStatus} className="w-full rounded-lg border px-3 py-2 text-sm flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Copiar estado para WhatsApp</button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 max-h-[280px] overflow-auto">
            <p className="text-sm font-semibold">Bloqueos activos</p>
            {blockedRanges.length === 0 ? (
              <p className="text-xs text-slate-500">No hay bloqueos cargados.</p>
            ) : (
              blockedRanges.map((b) => (
                <div key={b.id} className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 p-2">
                  <p className="font-semibold">{b.reason}</p>
                  <p>{format(parseISO(b.startAt), "d/MM HH:mm")} → {format(parseISO(b.endAt), "d/MM HH:mm")}</p>
                  <button onClick={() => removeBlockedRange(b.id)} className="mt-1 text-rose-600">Eliminar</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
