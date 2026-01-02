import React, { useState } from 'react';

const FullRegistreringBox = ({ isOpen, onClose, onConfirm, melding }) => {
  const [navn, setNavn] = useState("");
  const [mobilnummer, setMobilnummer] = useState("");
  const [epost, setEpost] = useState("");
  
  // Nye tilstander for selve verifiseringen
  const [visVerifisering, setVisVerifisering] = useState(false);
  const [inputKode, setInputKode] = useState("");
  const [laster, setLaster] = useState(false);

  if (!isOpen) return null;

  // STEG 1: Send koden til e-posten via Java
  const handleSendKode = async () => {
    setLaster(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/send-kode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epost: epost }),
      });

      if (response.ok) {
        setVisVerifisering(true);
      } else {
        alert("Noe gikk galt ved sending av e-post.");
      }
    } catch (error) {
      console.error("Feil:", error);
    } finally {
      setLaster(false);
    }
  };

  // STEG 2: Sjekk koden og fullfør registrering
  const handleVerifiserOgFullfor = async () => {
    setLaster(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/verifiser-kode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epost: epost, kode: inputKode }),
      });

      if (response.ok) {
        // HVIS KODEN ER RIKTIG: Kjør den originale onConfirm-funksjonen din
        onConfirm({ navn, mobilnummer, epost });
      } else {
        alert("Feil kode! Vennligst sjekk e-posten din på nytt.");
      }
    } catch (error) {
      console.error("Feil:", error);
    } finally {
      setLaster(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl z-10 max-w-sm w-full text-center animate-fade-up">
        <h3 className="text-2xl font-black text-zinc-900 mb-2">
            {visVerifisering ? "Bekreft din e-post" : "Bli kunde"}
        </h3>
        <p className="text-zinc-500 mb-8 text-sm">
            {visVerifisering ? `Tast inn koden vi sendte til ${epost}` : melding}
        </p>
      
        <div className="space-y-5">
          {!visVerifisering ? (
            /* --- VISER REGISTRERINGSSKJEMA --- */
            <>
              <input type="text" value={navn} onChange={(e) => setNavn(e.target.value)} placeholder="Fullt navn" className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors placeholder:text-zinc-300" />
              <input type="tel" value={mobilnummer} onChange={(e) => setMobilnummer(e.target.value)} placeholder="Mobilnummer" className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors placeholder:text-zinc-300" />
              <input type="email" value={epost} onChange={(e) => setEpost(e.target.value)} placeholder="E-postadresse" className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors placeholder:text-zinc-300" />
              
              <button 
                onClick={handleSendKode}
                disabled={!navn || !mobilnummer || !epost || laster}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg mt-4 ${(!navn || !mobilnummer || !epost || laster) ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-red-700 text-white hover:bg-red-800'}`}
              >
                {laster ? "Sender..." : "Send verifiseringskode"}
              </button>
            </>
          ) : (
            /* --- VISER KODE-FELT --- */
            <>
              <input 
                type="text" 
                maxLength="6"
                value={inputKode} 
                onChange={(e) => setInputKode(e.target.value)} 
                placeholder="000000" 
                className="w-full text-center text-3xl font-bold py-3 border-b-2 border-red-600 outline-none tracking-widest"
              />
              <button 
                onClick={handleVerifiserOgFullfor}
                disabled={inputKode.length < 6 || laster}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg mt-4 ${(inputKode.length < 6 || laster) ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-red-700 text-white hover:bg-red-800'}`}
              >
                {laster ? "Sjekker..." : "Fullfør registrering"}
              </button>
              <button onClick={() => setVisVerifisering(false)} className="text-zinc-400 text-xs underline">Gå tilbake</button>
            </>
          )}

          <button onClick={onClose} className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors pt-2">Avbryt</button>
        </div>
      </div>
    </div>
  );
};

export default FullRegistreringBox;