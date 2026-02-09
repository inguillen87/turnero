"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
        { label: '📅 Reservar Turno', value: 'book' },
        { label: '❓ Consultar Precios', value: 'prices' }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<'init' | 'service' | 'time' | 'confirm' | 'done'>('init');
  const [bookingData, setBookingData] = useState<any>({});
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

    // Simulate Bot Response
    setTimeout(async () => {
      let botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: '',
        timestamp: new Date()
      };

      if (step === 'init') {
        if (value === 'book') {
           botMsg.text = 'Perfecto. ¿Qué servicio estás buscando?';
           botMsg.options = [
             { label: '💇 Corte de Pelo ($1500)', value: 'corte' },
             { label: '💅 Manicura ($800)', value: 'manicura' },
             { label: '💆 Masaje ($2500)', value: 'masaje' }
           ];
           setStep('service');
        } else {
           botMsg.text = 'Nuestros precios varían según el profesional. ¿Te gustaría ver la lista completa en nuestra web?';
        }
      } else if (step === 'service') {
        setBookingData({ ...bookingData, service: text });
        botMsg.text = `Excelente elección (${text}). ¿Para cuándo te gustaría agendar?`;
        // Mock slots
        botMsg.options = [
          { label: 'Mañana 10:00', value: 'tomorrow_10' },
          { label: 'Mañana 16:30', value: 'tomorrow_16' },
          { label: 'Viernes 11:00', value: 'friday_11' }
        ];
        setStep('time');
      } else if (step === 'time') {
        setBookingData({ ...bookingData, time: text });
        botMsg.text = `Entendido. Confirmo turno para ${bookingData.service} el ${text}. ¿Es correcto?`;
        botMsg.options = [
          { label: '✅ Sí, confirmar', value: 'yes' },
          { label: '❌ No, cambiar', value: 'no' }
        ];
        setStep('confirm');
      } else if (step === 'confirm') {
        if (value === 'yes') {
          botMsg.text = '¡Listo! Tu turno ha sido confirmado. Te enviamos un recordatorio por WhatsApp un día antes. Gracias por elegirnos.';
          setStep('done');

          // Real API Call for Demo Effect
          const payload = { ...bookingData, status: 'confirmed', clientName: 'Demo User', startAt: new Date().toISOString() };
          try {
             await fetch('/api/t/demo/appointments', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(payload),
             });
             if (onBooking) onBooking(payload);
          } catch (e) {
             console.error("Failed to sync with demo backend", e);
          }

        } else {
          botMsg.text = 'Entendido, cancelemos. ¿Qué te gustaría hacer ahora?';
          botMsg.options = [{ label: '📅 Reservar Turno', value: 'book' }];
          setStep('init');
        }
      }

      setMessages(prev => [...prev, botMsg]);
    }, 1000);
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
             <h3 className="font-bold text-sm">Turnero Demo Bot</h3>
             <p className="text-xs text-green-100">En línea</p>
           </div>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scroll" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'soft-light' }}>
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm relative ${msg.sender === 'user' ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                 <p>{msg.text}</p>
                 <span className="text-[10px] text-slate-400 block text-right mt-1">
                   {format(msg.timestamp, 'HH:mm')}
                   {msg.sender === 'user' && <Check className="w-3 h-3 inline ml-1 text-blue-500" />}
                 </span>

                 {/* Options Chips */}
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

        {/* Input Area */}
        <div className="p-3 bg-[#f0f0f0] dark:bg-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 focus:outline-none focus:border-[#075E54] text-sm dark:bg-slate-700 dark:text-white"
          />
          <button
            onClick={() => handleSend(input)}
            className="p-2 bg-[#075E54] text-white rounded-full hover:bg-[#128C7E] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
