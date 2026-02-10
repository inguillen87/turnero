"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Check } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  options?: { label: string, value: string }[];
}

export function WhatsAppSimulator({ onAction }: { onAction: (action: any) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! 👋 Soy el asistente virtual de Turnero Pro. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      options: [
        { label: '📅 Reservar', value: '1' },
        { label: '💰 Precios', value: '2' },
        { label: '🔁 Cancelar', value: '3' },
        { label: '👤 Mis Turnos', value: '4' },
        { label: '🧑‍💼 Humano', value: '5' },
        { label: 'ℹ️ Info', value: '6' }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [metadata, setMetadata] = useState<any>({}); // Session State
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, value?: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // 2. Call Demo API
    try {
      const res = await fetch('/api/demo/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: 'demo-clinica',
          text: value || text,
          metadata: metadata // Send current state
        }),
      });
      const data = await res.json();

      if (data.metadata) {
        setMetadata(data.metadata); // Update state
      }

      if (data.messages) {
        setTimeout(() => {
          const botMsgs = data.messages.map((m: any, i: number) => ({
            id: (Date.now() + i).toString(),
            sender: 'bot',
            text: m.body,
            timestamp: new Date(),
            options: m.options
          }));
          setMessages(prev => [...prev, ...botMsgs]);

          if (data.action) {
            onAction(data.action);
          }
        }, 1000);
      }
    } catch (e) {
      console.error("Demo API Error", e);
    }
  };

  return (
    <div className="w-full h-full bg-[#ece5dd] flex flex-col relative overflow-hidden rounded-3xl border-8 border-slate-800 shadow-2xl">
        {/* Notch / Status Bar */}
        <div className="bg-[#075E54] h-14 flex items-center px-4 gap-3 shrink-0">
           <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
             <MessageCircle className="w-5 h-5" />
           </div>
           <div className="text-white">
             <h3 className="font-bold text-sm">Clínica Demo</h3>
             <p className="text-[10px] text-green-100">En línea</p>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'soft-light' }}>
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm relative ${msg.sender === 'user' ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                 <p>{msg.text}</p>
                 <span className="text-[10px] text-slate-400 block text-right mt-1">
                   {format(msg.timestamp, 'HH:mm')}
                   {msg.sender === 'user' && <Check className="w-3 h-3 inline ml-1 text-blue-500" />}
                 </span>

                 {/* Chips */}
                 {msg.options && (
                   <div className="mt-3 flex flex-wrap gap-2">
                     {msg.options.map((opt) => (
                       <button
                         key={opt.value}
                         onClick={() => handleSend(opt.label, opt.value)}
                         className="bg-white border border-slate-200 text-indigo-600 text-xs font-bold px-3 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors"
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

        {/* Input */}
        <div className="p-3 bg-[#f0f0f0] flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 rounded-full border border-slate-300 focus:outline-none text-sm bg-white"
          />
          <button
            onClick={() => handleSend(input)}
            className="p-2 bg-[#075E54] text-white rounded-full hover:bg-[#128C7E] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
    </div>
  );
}
