import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Ny state for loading
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Hei! Jeg er din frisør-assistent. Hvordan kan jeg hjelpe deg i dag? 😊',
      isFirst: true 
    }
  ]);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]); // Scroll også når loading endres

  const handleSend = async () => {
    if (!input.trim() || isLoading) return; // Hindre sending hvis loading

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const textToSend = input;
    setInput("");
    setIsLoading(true); // Start animasjon

    try {
      const response = await fetch('https://frisor-ai-model.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Beklager, jeg mistet kontakten med serveren. Prøv igjen senere.' }]);
    } finally {
      setIsLoading(false); // Stopp animasjon uansett utfall
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-red-800 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${isLoading ? 'bg-yellow-400' : 'bg-green-400'} rounded-full animate-pulse`}></div>
                <h4 className="font-bold tracking-wide">Frisør AI</h4>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-zinc-300 transition-colors">✕</button>
            </div>

            {/* Meldingsvindu */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-zinc-50 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                      msg.role === 'user' 
                      ? 'bg-red-700 text-white rounded-tr-none' 
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>

                  {msg.isFirst && (
                    <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm ml-2 mr-8">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Dette kan jeg hjelpe med:</p>
                      <ul className="text-xs text-zinc-600 space-y-2">
                        <li className="flex items-center gap-2">💰 <span>Pris</span></li>
                        <li className="flex items-center gap-2">📅 <span>Når er avtalen min?</span></li>
                        <li className="flex items-center gap-2">📍 <span>Lokasjon</span></li>
                        <li className="flex items-center gap-2">🕒 <span>Åpningstider</span></li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indikator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inputfelt */}
            <div className="p-3 bg-white border-t border-zinc-100 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isLoading ? "Venter på svar..." : "Skriv til oss..."}
                disabled={isLoading}
                className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-800 outline-none transition-all disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-red-800 text-white p-2 rounded-xl hover:bg-red-900 transition-colors shadow-md disabled:bg-zinc-400"
              >
                {isLoading ? '...' : '➤'}
              </button>
            </div>
          </motion.div>
          
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-red-800 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-red-900 transition-all border-4 border-white"
      >
        {isOpen ? '↓' : '💬'}
      </motion.button>
    </div>
  );
};

export default ChatBot;