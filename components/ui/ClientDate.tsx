"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientDateProps {
  formatString?: string;
  className?: string;
}

export function ClientDate({ formatString = "EEEE, d MMMM", className }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
    setMounted(true);
  }, []);

  if (!mounted || !date) {
    // Render a placeholder or nothing to avoid mismatch
    return <span className={className}>...</span>;
  }

  return (
    <span className={className}>
      {format(date, formatString, { locale: es })}
    </span>
  );
}
