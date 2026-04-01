import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import API_BASE_URL from '../../services/apiConfig';
import michelinIcon from '../../assets/logo/michelin_icon.png';
import michelinZoomIcon from '../../assets/logo/michelin_zoom.png';
import nietoLogoN from '../../assets/logo/nieto_n.png';

const ChatBot = ({ onFilterUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [message, setMessage] = useState('');
  
  // Cargar historial persistente o inicializar
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'BIENVENIDO A MULTILLANTAS NIETO ¿En qué puedo ayudarte el día hoy?', timestamp: Date.now() }
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Guardar historial en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Forzar scroll al fondo al abrir el chat
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }
  }, [isOpen]);

  // Lógica de separador de fechas
  const formatDateDivider = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'HOY';
    if (isYesterday) return 'AYER';
    
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  };

  // Intervalo para el mensaje "Necesitas Ayuda??" cada 7 segundos
  useEffect(() => {
    if (isOpen) {
      setShowHelp(false);
      return;
    }

    const interval = setInterval(() => {
      // Solo mostrar si sigue cerrado
      if (!isOpen) {
        setShowHelp(true);
        setTimeout(() => setShowHelp(false), 5000);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const userMsg = message.trim();
    setMessage('');
    
    const timestamp = Date.now();
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg, timestamp }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          history: chatHistory.length > 1 ? chatHistory.slice(1, 7).map(({role, content}) => ({role, content})) : [] 
        })
      });
      const data = await response.json();
      
      if (data.error) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.error, timestamp: Date.now() }]);
        setIsLoading(false);
        return;
      }

      const aiResponse = data.response;
      if (!aiResponse) {
        throw new Error('Sin respuesta del servidor');
      }

      const jsonMatch = aiResponse.match(/\{[\s\S]*"filters"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.filters && Object.values(parsed.filters).some(v => v !== "" && (Array.isArray(v) ? v.length > 0 : true))) {
            onFilterUpdate(parsed.filters);
          }
        } catch (e) { console.error("Error AI filters:", e); }
      }
      const cleanContent = aiResponse.replace(/```json[\s\S]*?```/g, '').replace(/\{[\s\S]*"filters"[\s\S]*\}/, '').trim();
      setChatHistory(prev => [...prev, { role: 'assistant', content: cleanContent, timestamp: Date.now() }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Cerca de una interrupción. ¿Repetir consulta?', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans text-slate-700">
      {!isOpen && (
        <div className="relative group">
          {/* Globo de Ayuda Discreto */}
          {showHelp && (
            <div className="absolute bottom-16 right-0 bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-100 animate-bounce-subtle whitespace-nowrap z-[110]">
              <p className="text-[12px] font-bold text-[#003d7a]">¿Necesitas Ayuda??</p>
              <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 bg-[#ffce00] rounded-full shadow-[0_12px_45px_rgba(255,206,0,0.4)] flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative border-2 border-white"
          >
            {/* Efecto de Ondas Azul Nieto Atenuadas (Ahora visibles) */}
            <div className="absolute inset-0 bg-[#003d7a]/25 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-[#003d7a]/15 rounded-full animate-ping [animation-delay:0.8s]"></div>
            <div className="absolute inset-0 bg-[#003d7a]/10 rounded-full animate-pulse scale-105"></div>

            <img
              src={michelinZoomIcon}
              alt="Michelin"
              className="w-full h-full object-cover rounded-full relative z-10 border-none"
            />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          ref={chatWindowRef}
          className="w-[330px] sm:w-[350px] h-[500px] bg-white rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-slate-100 animate-slide-up"
        >
          {/* Header Contrast Blue & White Body */}
          <div className="p-4 bg-gradient-to-r from-[#003d7a] to-[#005bb7] flex items-center justify-between relative shadow-md">
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ffce00]"></div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-inner border border-slate-100 overflow-hidden">
                  <img src={michelinZoomIcon} alt="Michelin Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[15px] font-black uppercase tracking-tight text-white leading-none italic">
                  Asesor <span className="text-[#ffce00]">Nieto</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-[9px] font-bold text-blue-100/70 uppercase tracking-widest leading-none">En Linea</span>
                </div>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all">
              <X className="w-6 h-6 text-[#ffce00]" />
            </button>
          </div>

          {/* Chat Area Limpia (Blanca) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white custom-scrollbar" ref={scrollRef}>
            {chatHistory.map((chat, i) => {
              const currentDivider = formatDateDivider(chat.timestamp);
              const prevDivider = i > 0 ? formatDateDivider(chatHistory[i-1].timestamp) : null;
              const showDivider = currentDivider !== prevDivider;

              return (
                <React.Fragment key={i}>
                  {showDivider && (
                    <div className="flex justify-center my-6">
                      <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-50">
                        {currentDivider}
                      </span>
                    </div>
                  )}
                  <div className={`flex items-start ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {chat.role === 'assistant' && (
                      <div className="w-6 h-6 mr-3 mt-1 overflow-hidden rounded-md">
                        <img src={michelinZoomIcon} alt="N" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed relative ${chat.role === 'user'
                      ? 'bg-[#003d7a] text-white rounded-[1.2rem] rounded-tr-none shadow-md shadow-blue-100'
                      : 'bg-slate-50 text-slate-700 rounded-[1.2rem] rounded-tl-none border border-slate-100'
                      }`}>
                      <div className="whitespace-pre-wrap">{chat.content}</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            {isLoading && (
              <div className="flex justify-start items-center">
                <div className="w-6 h-6 mr-3 overflow-hidden rounded-md opacity-50">
                  <img src={michelinZoomIcon} alt="N" className="w-full h-full object-contain animate-pulse" />
                </div>
                <div className="bg-slate-50 px-4 py-3 rounded-[1.2rem] rounded-tl-none border border-slate-100 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#003d7a] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#ffce00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#003d7a] rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area Simple */}
          <div className="p-4 bg-white border-t border-slate-50">
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[1.5rem] overflow-hidden focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-[#003d7a]/30 focus-within:bg-white transition-all shadow-inner">
              <input
                type="text"
                placeholder="Escribe tu consulta aquí..."
                className="w-full bg-transparent border-none pl-5 pr-14 py-4 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none font-medium"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className={`absolute right-1 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isLoading || !message.trim()
                  ? 'text-slate-200'
                  : 'bg-[#003d7a] text-[#ffce00] shadow-sm hover:bg-[#002d5a] active:scale-95'
                  }`}
                disabled={isLoading || !message.trim()}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest leading-none">Multillantas Nieto © 2026</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
