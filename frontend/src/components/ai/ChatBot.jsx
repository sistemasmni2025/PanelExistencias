import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import API_BASE_URL from '../../services/apiConfig';

const ChatBot = ({ onFilterUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '¿Hola! Soy tu asistente técnico de Multillantas Nieto. ¿En qué información de llantas o stock puedo apoyarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          // Solo enviamos el historial DE VERDAD (omitimos el saludo inicial estático)
          history: chatHistory.length > 1 ? chatHistory.slice(1, 7) : [] 
        })
      });

      const data = await response.json();
      const aiResponse = data.response;

      // Extract JSON filters if present
      const jsonMatch = aiResponse.match(/\{[\s\S]*"filters"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          // Solo actualizamos si detectamos filtros REALES (evita resets accidentales)
          if (parsed.filters && Object.values(parsed.filters).some(v => v !== "" && (Array.isArray(v) ? v.length > 0 : true))) {
            onFilterUpdate(parsed.filters);
          }
        } catch (e) {
          console.error("Error parsing AI filters:", e);
        }
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse.replace(/```json[\s\S]*?```/g, '').trim() }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error al conectar con el cerebro de IA.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#003d7a] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative"
        >
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-[#003d7a] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">Asistente Nieto</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-white/60 uppercase">En línea</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar" ref={scrollRef}>
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  chat.role === 'user' 
                    ? 'bg-[#003d7a] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {chat.role === 'assistant' && <div className="text-[9px] font-black uppercase text-slate-400 mb-1 leading-none">IA Multillantas</div>}
                  {chat.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#003d7a] animate-spin" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Pensando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu consulta..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-[13px] focus:ring-2 focus:ring-[#003d7a] transition-all"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-[#003d7a] text-white p-2.5 rounded-xl hover:bg-blue-900 transition-all disabled:opacity-50"
              disabled={isLoading || !message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
