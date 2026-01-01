import React, { useState } from 'react';

const RegistrerKundeBox = ({ isOpen, onClose, onConfirm , onReset, melding , isError , onOpenFull }) => {
  const [mobilnummer, setMobilnummer] = useState("");
  


  if (!isOpen) return null;

  const handleConfirm = () => {
    // Her sender vi nummeret tilbake til funksjonen som lagrer i databasen
    //Dette er den grønnebox hvis kunden eksitere i database
    onConfirm(mobilnummer);
    
  };

  const provpånytt = () => {
    setMobilnummer(""); // Tømmer det gamle nummeret i input-feltet
    onReset();         // Sier til Bestilling.jsx at erFeil skal bli false
  };



  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl z-10 max-w-sm w-full text-center animate-fade-up">
        {/* Ikon */}
        <div className="w-16 h-16 bg-zinc-100 text-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        
        <h3 className={`text-1xl font-bold mb-2 transition-colors ${isError ? 'text-red-600' : 'text-zinc-900'}`}>
      {melding}
    </h3>
      
        
    {!isError ? (
          /* Dette vises når man skal skrive inn nummer */
          <>
            <input 
              type="tel"
              value={mobilnummer}
              onChange={(e) => setMobilnummer(e.target.value)}
              placeholder="Mobilnummer"
              className="w-full text-center text-2xl font-bold py-4 mb-8 border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
              autoFocus
            />
            <button 
              onClick={() => onConfirm(mobilnummer)}
              className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors"
            >
              Bekreft
            </button>
          </>
        ) : (
          /* Dette vises når kunden IKKE finnes (isError === true) */
          <div className="flex flex-col gap-3">
            <button 
              onClick={provpånytt} // Bruker funksjonen over
              className="w-full bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-900 transition-colors"
            >
              Prøv på nytt
            </button>

            <button 
              onClick={onOpenFull}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              Registrer ny kunde
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrerKundeBox;