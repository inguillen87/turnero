"use client";

import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type EventMessage = {
  seq?: number;
  type: string;
  title: string;
  body: string;
  createdAt: string;
};

export function RealtimeBell({ tenantSlug }: { tenantSlug: string }) {
  const [items, setItems] = useState<EventMessage[]>([]);

  useEffect(() => {
    const source = new EventSource(`/api/t/${tenantSlug}/events`);

    source.addEventListener("message", (raw) => {
      const payload = JSON.parse((raw as MessageEvent).data) as EventMessage;
      setItems((prev) => [payload, ...prev].slice(0, 10));
      toast(payload.title, { description: payload.body });
    });

    source.onerror = () => {
      // keep connection; EventSource handles retries automatically
    };

    return () => source.close();
  }, [tenantSlug]);

  const unread = useMemo(() => items.length, [items]);

  return (
    <button
      type="button"
      className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-300 shadow-sm"
      title={items[0] ? `${items[0].title}: ${items[0].body}` : "Sin notificaciones"}
    >
      <Bell className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
          {unread}
        </span>
      )}
    </button>
  );
}
