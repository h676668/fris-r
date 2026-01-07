import React, { useState } from 'react';

const FullRegistreringBox = ({ isOpen, onClose, onConfirm, melding }) => {
  const [navn, setNavn] = useState("");
  const [mobilnummer, setMobilnummer] = useState("");
  const [epost, setEpost] = useState("");
  
  const [visVerifisering, setVisVerifisering] = useState(false);
  const [inputKode, setInputKode] = useState("");
  const [laster, setLaster] = useState(false);
  const [feilmelding, setFeilmelding] = useState("");

  if (!isOpen) return null;

  // STEG 1: Send koden til e-post
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setFeilmelding("");

    const renEpost = epost.trim().toLowerCase();
    const renMobil = mobilnummer.replace(/\s/g, "");

    // Enkel frontend-validering
    if (navn.trim().length < 2) return setFeilmelding("Vennligst oppgi fullt navn.");
    if (!/^\d{8}$/.test(renMobil)) return setFeilmelding("Mobilnummer må være 8 siffer.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(renEpost)) return setFeilmelding("Ugyldig e-postadresse.");

    setLaster(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/send-kode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epost: renEpost }),
      });

      // Vi henter ut JSON uansett statuskode for å få tak i feilmeldinger fra Java
      const data = await response.json();

      if (response.ok) {
        setVisVerifisering(true);
      } else {
        // Her viser vi meldingen fra backenden (f.eks. "E-posten er allerede i bruk")
        setFeilmelding(data.message || "Kunne ikke sende verifiseringskode.");
      }
    } catch (err) {
      setFeilmelding("Nettverksfeil: Kunne ikke kontakte serveren.");
    } finally {
      setLaster(false);
    }
  };

  // STEG 2: Sjekk koden og fullfør registrering
  const handleSubmitKode = async (e) => {
    e.preventDefault();
    setFeilmelding("");
    setLaster(true);

    const renKode = inputKode.trim();
    const renEpost = epost.trim().toLowerCase();

    try {
      const response = await fetch('http://localhost:8080/api/auth/verifiser-kode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          epost: renEpost, 
          kode: renKode 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Suksess: Kall onConfirm for å lagre kunden i databasen
        onConfirm({ navn, mobilnummer, epost: renEpost });
      } else {
        setFeilmelding(data.message || "Feil eller utløpt kode.");
      }
    } catch (err) {
      setFeilmelding("Nettverksfeil under verifisering.");
    } finally {
      setLaster(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl z-10 max-w-sm w-full text-center animate-fade-up">
        <h3 className="text-2xl font-black text-zinc-900 mb-2">
            {visVerifisering ? "Bekreft e-post" : "Bli kunde"}
        </h3>
        <p className="text-zinc-500 mb-6 text-sm">
            {visVerifisering ? `Skriv inn koden sendt til ${epost}` : melding}
        </p>

        {feilmelding && (
          <p className="text-red-600 text-xs mb-4 font-bold bg-red-50 p-3 rounded-xl border border-red-100">
            {feilmelding}
          </p>
        )}
      
        <div className="space-y-4">
          {!visVerifisering ? (
            <form onSubmit={handleSubmitInfo} className="space-y-4">
              <input type="text" value={navn} onChange={(e) => setNavn(e.target.value)} placeholder="Fullt navn" className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors" />
              <input type="tel" value={mobilnummer} onChange={(e) => setMobilnummer(e.target.value)} placeholder="Mobilnummer" className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors" />
              <input type="email" value={epost} onChange={(e) => setEpost(e.target.value)} placeholder="E-postadresse" className="w-full text-center text-lg font-semibold py-3 border-b-2 border-zinc-200 focus:border-red-600 outline-none transition-colors" />
              
              <button 
                type="submit"
                disabled={!navn || !mobilnummer || !epost || laster}
                className={`w-full font-bold py-4 rounded-xl shadow-lg mt-4 transition-all ${(!navn || !mobilnummer || !epost || laster) ? 'bg-zinc-200 text-zinc-400' : 'bg-red-700 text-white hover:bg-red-800'}`}
              >
                {laster ? "Sender..." : "Send verifiseringskode"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitKode} className="space-y-4">
              <input 
                type="text" 
                maxLength="6"
                value={inputKode} 
                onChange={(e) => setInputKode(e.target.value)} 
                placeholder="000000" 
                className="w-full text-center text-3xl font-bold py-3 border-b-2 border-red-600 outline-none tracking-widest"
                autoFocus
              />
              <button 
                type="submit"
                disabled={inputKode.length < 6 || laster}
                className={`w-full font-bold py-4 rounded-xl shadow-lg mt-4 transition-all ${(inputKode.length < 6 || laster) ? 'bg-zinc-200 text-zinc-400' : 'bg-red-700 text-white hover:bg-red-800'}`}
              >
                {laster ? "Sjekker..." : "Fullfør registrering"}
              </button>
              <button type="button" onClick={() => {setVisVerifisering(false); setFeilmelding("");}} className="text-zinc-400 text-xs underline block mx-auto mt-2">
                Endre e-postadresse
              </button>
            </form>
          )}

          <button type="button" onClick={onClose} className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors pt-2">
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullRegistreringBox;