import React, { useState } from 'react';

const FullRegistreringBox = ({ isOpen, onClose, onConfirm, melding }) => {
  const [navn, setNavn] = useState("");
  const [mobilnummer, setMobilnummer] = useState("");
  const [epost, setEpost] = useState("");

  if (!isOpen) return null;

  const handleRegisterClick = () => {
    // Sender alle tre verdiene som et objekt til funksjonen som lagrer i DB
    onConfirm({
      navn: navn,
      mobilnummer: mobilnummer,
      epost: epost
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Bakgrunn - klikk her for å lukke */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl z-10 max-w-sm w-full text-center animate-fade-up">
        {/* Ikon for ny registrering */}
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-black text-zinc-900 mb-2">Bli kunde</h3>
        <p className="text-zinc-500 mb-8 text-sm">{melding}</p>
      
        <div className="space-y-5">
          {/* Navn Input */}
          <div className="relative">
            <input 
              type="text"
              value={navn}
              onChange={(e) => setNavn(e.target.value)}
              placeholder="Fullt navn"
              className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors placeholder:text-zinc-300"
            />
          </div>

          {/* Mobilnummer Input */}
          <div className="relative">
            <input 
              type="tel"
              value={mobilnummer}
              onChange={(e) => setMobilnummer(e.target.value)}
              placeholder="Mobilnummer"
              className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors placeholder:text-zinc-300"
            />
          </div>

          {/* E-post Input */}
          <div className="relative">
            <input 
              type="email"
              value={epost}
              onChange={(e) => setEpost(e.target.value)}
              placeholder="E-postadresse"
              className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors placeholder:text-zinc-300"
            />
          </div>
          
          <button 
            onClick={handleRegisterClick}
            disabled={!navn || !mobilnummer || !epost}
            className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg mt-4
              ${(!navn || !mobilnummer || !epost) 
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                : 'bg-red-700 text-white hover:bg-red-800 active:scale-95'}`}
          >
            Fullfør registrering
          </button>

          <button 
            onClick={onClose}
            className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors pt-2"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullRegistreringBox;