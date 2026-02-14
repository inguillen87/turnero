"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Check, Sparkles, Bot, PhoneCall } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  options?: { label: string; value: string }[];
}

const STARTER_OPTIONS = [
  { label: "🦷 Odontología", value: "Somos una clínica odontológica y queremos automatizar agenda + recordatorios" },
  { label: "🧠 Psicología", value: "Somos un consultorio psicológico y necesitamos agenda y ausentismo bajo" },
  { label: "💅 Estética", value: "Somos centro de estética y buscamos whatsapp + CRM + campañas" },
  { label: "🏋️ Gimnasio", value: "Somos un gimnasio y queremos planes, renovaciones y gestión de clases" },
  { label: "⚖️ Estudio jurídico", value: "Tenemos un estudio jurídico y queremos ordenar turnos y seguimiento" },
  { label: "🏨 Hotelería", value: "Manejamos hotelería y buscamos automatizar reservas y conversaciones" },
  { label: "🧩 Quiero plan modular", value: "No quiero la plataforma completa, solo whatsapp crm agenda" },
  { label: "🚀 Quiero full plataforma", value: "Quiero la plataforma completa con todo" },
];

export function WhatsAppDemo({ onBooking }: { onBooking?: (data: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "¡Hola! 👋 Soy el asesor IA de Turnero Pro. Te ayudo a elegir setup por rubro (agenda + bot + CRM + automatizaciones).",
      timestamp: new Date(),
      options: STARTER_OPTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anonId] = useState(() => {
    if (typeof window === "undefined") return `anon-${Date.now()}`;
    const existing = window.localStorage.getItem("turnero_sales_anon_id");
    if (existing) return existing;
    const created = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem("turnero_sales_anon_id", created);
    return created;
  });
  const [sellerUrl, setSellerUrl] = useState(() => {
    const fallback = "5492613168608";
    const configured = process.env.NEXT_PUBLIC_SALES_WHATSAPP_E164 || fallback;
    const digits = configured.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent("Hola Marce, quiero avanzar con Turnero Pro.")}`;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (text: string, value?: string) => {
    if (!text.trim()) return;

    if (value === "contact_seller") {
      window.open(sellerUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const response = await fetch("/api/public/sales-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value || text, history, anonId }),
      });

      const data = await response.json();
      if (data?.seller?.url) {
        setSellerUrl(data.seller.url);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.message || "Lo siento, no entendí.",
        timestamp: new Date(),
        options: data.options || [],
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.intent === "confirmation" || data.intent === "booking_confirmed") {
        onBooking?.({
          status: "confirmed",
          clientName: "Demo User",
          startAt: new Date().toISOString(),
          ...data.entities,
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Tuve un problema de conexión. Si querés, podés hablar directo con el equipo.",
        timestamp: new Date(),
        options: [
          { label: "Reintentar", value: text },
          { label: "Hablar con ventas", value: "contact_seller" },
        ],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 rounded-2xl p-3.5 shadow-2xl transition-all duration-300 hover:scale-105 border ${
          isOpen
            ? "bg-slate-900 text-white border-slate-700"
            : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-indigo-400/30"
        }`}
      >
        <span className="absolute -top-2 -right-2 rounded-full bg-emerald-400 text-[10px] font-black text-emerald-950 px-1.5 py-0.5">
          AI
        </span>
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      <div
        className={`fixed bottom-24 right-6 z-50 w-[22rem] md:w-[25rem] rounded-3xl shadow-2xl border border-indigo-200/70 dark:border-slate-700/80 overflow-hidden transition-all duration-300 origin-bottom-right bg-white/95 dark:bg-slate-900/95 backdrop-blur ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Turnero Sales Copilot</h3>
                <div className="flex items-center gap-1.5 text-xs text-indigo-100">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-300 animate-pulse" : "bg-emerald-300"}`} />
                  {isLoading ? "Pensando propuesta..." : "Online · responde por rubro"}
                </div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-indigo-100" />
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),transparent_50%)]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-sm shadow-sm relative border ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white border-indigo-500 rounded-br-md"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200/70 dark:border-slate-700 rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <span
                  className={`text-[10px] block text-right mt-1 ${
                    msg.sender === "user" ? "text-indigo-100" : "text-slate-400"
                  }`}
                >
                  {format(msg.timestamp, "HH:mm")}
                  {msg.sender === "user" && <Check className="w-3 h-3 inline ml-1 text-cyan-200" />}
                </span>

                {msg.options && msg.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(opt.label, opt.value)}
                        disabled={isLoading}
                        className="bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-3 pt-2">
          <a
            href={sellerUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5"
          >
            <PhoneCall className="w-4 h-4" /> Hablar con ventas ahora
          </a>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Contame tu rubro, cantidad de turnos y objetivo..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-sm dark:bg-slate-800 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
