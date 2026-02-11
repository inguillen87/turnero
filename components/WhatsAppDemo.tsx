"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Check } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  options?: { label: string, value: string }[];
}

export function WhatsAppDemo({ onBooking }: { onBooking?: (data: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! 👋 Soy el asistente virtual de Turnero Pro. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      options: [
        { label: '📅 Reservar Turno', value: 'Quiero reservar un turno' },
        { label: '❓ Consultar Precios', value: '¿Cuáles son los precios?' }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string, value?: string) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history for API
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // Call AI API
      const response = await fetch('/api/demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: value || text, history }),
      });

      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.message || "Lo siento, no entendí.",
        timestamp: new Date(),
        options: data.options || []
      };

      setMessages(prev => [...prev, botMsg]);

      // If booking confirmed (check intent or specific entities), we could call onBooking
      if (data.intent === 'confirmation' || data.intent === 'booking_confirmed') {
         if (onBooking) {
            onBooking({
                status: 'confirmed',
                clientName: 'Demo User',
                startAt: new Date().toISOString(),
                ...data.entities
            });
         }
         // Optional: Fire a real "save" to the demo backend if needed
         // await fetch('/api/t/demo/appointments', ...);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Lo siento, tuve un problema de conexión. Intenta de nuevo.",
        timestamp: new Date(),
        options: [{ label: "Reintentar", value: text }]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-[#ece5dd] dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>

        {/* Header */}
        <div className="bg-[#075E54] p-4 text-white flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
             <MessageCircle className="w-6 h-6" />
           </div>
           <div>
             <h3 className="font-bold text-sm">Turnero AI Bot</h3>
             <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                <p className="text-xs text-green-100">{isLoading ? 'Escribiendo...' : 'En línea'}</p>
             </div>
           </div>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scroll relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'soft-light' }}>
           {/* Loading Indicator Overlay (Optional, but subtle is better) */}

           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm relative ${msg.sender === 'user' ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                 <p className="whitespace-pre-wrap">{msg.text}</p>
                 <span className="text-[10px] text-slate-400 block text-right mt-1">
                   {format(msg.timestamp, 'HH:mm')}
                   {msg.sender === 'user' && <Check className="w-3 h-3 inline ml-1 text-blue-500" />}
                 </span>

                 {/* Options Chips */}
                 {msg.options && msg.options.length > 0 && (
                   <div className="mt-3 flex flex-wrap gap-2">
                     {msg.options.map((opt, idx) => (
                       <button
                         key={idx}
                         onClick={() => handleSend(opt.label, opt.value)} // Send label as text, value as hidden payload/context? Actually simple chat just sends text usually.
                         disabled={isLoading}
                         className="bg-white border border-slate-200 text-indigo-600 text-xs font-bold px-3 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
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

        {/* Input Area */}
        <div className="p-3 bg-[#f0f0f0] dark:bg-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Escribe un mensaje..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 focus:outline-none focus:border-[#075E54] text-sm dark:bg-slate-700 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-[#075E54] text-white rounded-full hover:bg-[#128C7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
