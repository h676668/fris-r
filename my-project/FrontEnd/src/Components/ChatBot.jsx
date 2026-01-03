import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Hei! Jeg er din frisør-assistent. Hvordan kan jeg hjelpe deg i dag? 😊',
      isFirst: true // Markør for å vise infokortet
    }
  ]);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const textToSend = input;
    setInput("");

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Beklager, jeg mistet kontakten med serveren. Prøv igjen senere.' }]);
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
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
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

                  {/* Viser "Dette kan du spørre om" kun etter den aller første bot-meldingen */}
                  {msg.isFirst && (
                    <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm ml-2 mr-8">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Dette kan jeg hjelpe med:</p>
                      <ul className="text-xs text-zinc-600 space-y-2">
                        <li className="flex items-center gap-2">💰 <span>Pris</span></li>
                        <li className="flex items-center gap-2">📅 <span>Når var avtalen min?</span></li>
                        <li className="flex items-center gap-2">📍 <span>Lokasjon</span></li>
                        <li className="flex items-center gap-2">🕒 <span>Åpningstider</span></li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Inputfelt */}
            <div className="p-3 bg-white border-t border-zinc-100 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Skriv til oss..."
                className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-800 outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                className="bg-red-800 text-white p-2 rounded-xl hover:bg-red-900 transition-colors shadow-md"
              >
                ➤
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