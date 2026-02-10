import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Check, MoreVertical, Phone, Video, Settings2 } from "lucide-react";
import Link from "next/link";

const INDUSTRIES = {
    clinica: {
        name: "Clínica Dental",
        services: [
            { id: '1', name: 'Consulta General', price: '$50', duration: '30 min' },
            { id: '2', name: 'Limpieza Dental', price: '$35', duration: '45 min' },
            { id: '3', name: 'Ortodoncia', price: '$80', duration: '20 min' },
        ],
        welcome: "¡Hola! 👋 Soy el asistente virtual de la Clínica. ¿En qué puedo ayudarte?",
        color: '#075e54'
    },
    barberia: {
        name: "Barbería Style",
        services: [
            { id: '1', name: 'Corte Fade', price: '$15', duration: '45 min' },
            { id: '2', name: 'Barba y Toalla', price: '$10', duration: '30 min' },
            { id: '3', name: 'Corte + Barba', price: '$22', duration: '60 min' },
        ],
        welcome: "¡Qué onda! 💈 Bienvenido a Barbería Style. ¿Te agendo un turno?",
        color: '#1a1a1a'
    },
    padel: {
        name: "Padel Center",
        services: [
            { id: '1', name: 'Cancha 1 (Cristal)', price: '$40', duration: '90 min' },
            { id: '2', name: 'Cancha 2 (Cemento)', price: '$30', duration: '90 min' },
            { id: '3', name: 'Clase Particular', price: '$25', duration: '60 min' },
        ],
        welcome: "¡Hola! 🎾 ¿Listo para jugar? Reservá tu cancha acá.",
        color: '#2563eb'
    }
};

export function WhatsAppSimulator({ onAction }: { onAction: (action: any) => void }) {
  const [industry, setIndustry] = useState<'clinica' | 'barberia' | 'padel'>('clinica');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConfig = INDUSTRIES[industry];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Reset chat when industry changes
    setMessages([
        {
          id: 1,
          sender: 'bot',
          text: INDUSTRIES[industry].welcome,
          time: '10:00',
          options: [
            { label: '📅 Reservar', value: 'Reservar' },
            { label: '💰 Precios', value: 'Precios' },
            { label: 'ℹ️ Info', value: 'Info' },
          ]
        }
    ]);
  }, [industry]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, value?: string) => {
    if (!text && !value) return;

    // 1. User Message
    const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: text || value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // 2. Simulate Bot Typing
    setTimeout(() => {
        let botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'Entendido, dame un momento...',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            options: [] as any[]
        };

        const lowerText = (value || text).toLowerCase();

        if (lowerText.includes('precio') || lowerText.includes('valor')) {
            const prices = currentConfig.services.map(s => `• ${s.name}: ${s.price}`).join('\n');
            botResponse.text = `Aquí tienes nuestra lista de precios:\n\n${prices}`;
        } else if (lowerText.includes('reservar') || lowerText.includes('turno')) {
            botResponse.text = '¡Perfecto! ¿Qué servicio estás buscando?';
            botResponse.options = currentConfig.services.map(s => ({
                label: s.name,
                value: s.name
            }));
        } else if (currentConfig.services.some(s => lowerText.includes(s.name.toLowerCase()))) {
             const service = currentConfig.services.find(s => lowerText.includes(s.name.toLowerCase()));
             botResponse.text = `Tengo estos horarios disponibles para ${service?.name}:\n\n• 10:00\n• 14:30\n• 16:00`;
             botResponse.options = [
                { label: '10:00', value: '10:00' },
                { label: '14:30', value: '14:30' },
                { label: '16:00', value: '16:00' }
             ];
        } else if (lowerText.match(/\d{2}:\d{2}/)) {
             botResponse.text = `¡Casi listo! Solo falta confirmar. Vas a reservar para mañana a las ${lowerText}.`;
             botResponse.options = [
                 { label: '✅ Confirmar', value: 'Confirmar' },
                 { label: '❌ Cancelar', value: 'Cancelar' }
             ];
        } else if (lowerText.includes('confirmar')) {
             botResponse.text = '¡Turno Agendado! 🎉\n\nPara asegurarlo, por favor realiza el pago de la seña ($1000) aquí:\n\n👉 [PAGAR SEÑA CON MERCADOPAGO](/demo/checkout)\n\n(Click en el link para probar la integración)';
             onAction({ type: 'APPOINTMENT_CREATED', payload: {
                 id: Date.now(),
                 startAt: new Date().toISOString(),
                 clientName: 'Usuario Demo',
                 status: 'confirmed',
                 serviceName: 'Servicio Demo'
             }});
        } else {
             botResponse.text = 'Disculpa, no entendí. ¿Podrías elegir una de estas opciones?';
             botResponse.options = [
                { label: '📅 Reservar', value: 'Reservar' },
                { label: '💰 Precios', value: 'Precios' },
                { label: 'ℹ️ Info', value: 'Info' },
            ];
        }

        setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#ece5dd] text-slate-900 font-sans relative overflow-hidden">
      {/* Industry Switcher (Hidden feature for demo) */}
      <div className="absolute top-16 right-4 z-20 group">
          <button className="bg-white/80 p-2 rounded-full shadow-lg backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors">
              <Settings2 className="w-4 h-4" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2">
              <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">Cambiar Rubro</div>
              {Object.entries(INDUSTRIES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setIndustry(key as any)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-50 transition-colors ${industry === key ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
                  >
                      {val.name}
                  </button>
              ))}
          </div>
      </div>

      {/* WhatsApp Header */}
      <div style={{ backgroundColor: currentConfig.color }} className="text-white p-3 flex items-center justify-between shadow-md z-10 transition-colors duration-500">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                 <MessageCircle className="w-6 h-6 text-white" />
             </div>
             <div>
                 <h3 className="font-bold text-sm leading-tight">{currentConfig.name}</h3>
                 <p className="text-[10px] text-white/80 opacity-90">En línea</p>
             </div>
         </div>
         <div className="flex items-center gap-4">
             <Video className="w-5 h-5" />
             <Phone className="w-5 h-5" />
             <MoreVertical className="w-5 h-5" />
         </div>
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: 'soft-light' }}
      >
          {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-2 px-3 rounded-lg shadow-sm text-sm relative ${
                        msg.sender === 'user'
                        ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none'
                    }`}
                  >
                      {msg.text.includes('/demo/checkout') ? (
                          <div className="whitespace-pre-line leading-relaxed">
                              {msg.text.split('/demo/checkout')[0]}
                              <Link
                                href="/demo/checkout"
                                target="_blank"
                                className="block mt-2 bg-[#009EE3] text-white font-bold text-center py-2 rounded-md hover:bg-[#008CC9] transition-colors no-underline"
                              >
                                  PAGAR SEÑA $1.000
                              </Link>
                              {msg.text.split('integration)')[1]}
                          </div>
                      ) : (
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      )}

                      <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                          {msg.sender === 'user' && <Check className="w-3 h-3 text-blue-400" />}
                      </div>
                  </div>
              </div>
          ))}
          {messages[messages.length - 1]?.sender === 'bot' && messages[messages.length - 1]?.options?.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
                  {messages[messages.length - 1].options.map((opt: any) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSend('', opt.value)}
                        className="bg-white text-slate-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                          {opt.label}
                      </button>
                  ))}
              </div>
          )}
          <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f0f0] p-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none border-none shadow-sm"
          />
          <button
            onClick={() => handleSend(input)}
            style={{ backgroundColor: currentConfig.color }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-colors"
          >
              <Send className="w-5 h-5 ml-0.5" />
          </button>
      </div>
    </div>
  );
}
