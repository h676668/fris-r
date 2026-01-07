import React, { useState, useEffect } from 'react';

const RegistrerKundeBox = ({ isOpen, onClose, onConfirm, onReset, melding, isError, onOpenFull }) => {
  const [mobilnummer, setMobilnummer] = useState("");
  const [lokalFeil, setLokalFeil] = useState("");

  useEffect(() => {
    if (isOpen && !isError) {
      setMobilnummer("");
      setLokalFeil("");
    }
  }, [isOpen, isError]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Hindrer at siden laster på nytt
    const rentNummer = mobilnummer.replace(/\s/g, "");
    if (/^\d{8}$/.test(rentNummer)) {
      setLokalFeil("");
      onConfirm(rentNummer);
    } else {
      setLokalFeil("Nummeret må være 8 siffer");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl z-10 max-w-sm w-full text-center animate-fade-up">
        <div className="w-16 h-16 bg-zinc-100 text-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        
        <h3 className={`text-1xl font-bold mb-2 transition-colors ${isError || lokalFeil ? 'text-red-600' : 'text-zinc-900'}`}>
          {lokalFeil || melding}
        </h3>
      
        {!isError ? (
          <form onSubmit={handleSubmit}>
            <input 
              type="tel"
              value={mobilnummer}
              onChange={(e) => {
                setMobilnummer(e.target.value);
                if (lokalFeil) setLokalFeil("");
              }}
              placeholder="Mobilnummer"
              className={`w-full text-center text-2xl font-bold py-4 mb-8 border-b-2 outline-none transition-colors ${lokalFeil ? 'border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
              autoFocus
            />
            <button 
              type="submit"
              disabled={mobilnummer.length < 8}
              className={`w-full font-bold py-4 rounded-xl transition-colors ${mobilnummer.length < 8 ? 'bg-zinc-200 text-zinc-400' : 'bg-zinc-900 text-white hover:bg-black'}`}
            >
              Bekreft
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <button onClick={() => { setMobilnummer(""); setLokalFeil(""); onReset(); }} className="w-full bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-900 transition-colors">
              Prøv på nytt
            </button>
            <button onClick={onOpenFull} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg">
              Registrer ny kunde
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrerKundeBox;