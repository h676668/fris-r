import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ledigeTider } from '../constants';
import BakgrunnElementer from './BakgrunnElementer';
import RegistrerKundeBox from './RegistrerKundeBox';
import FullRegistreringBox from "./FullRegistreringBox";

const Bestilling = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bekreftet, setBekreftet] = useState(false);
  const [visBoks, setVisBoks] = useState(false);
  const [visFullRegistrering, setVisFullRegistrering] = useState(false);
  const [boksMelding, setBoksMelding] = useState("Skriv inn ditt mobilnummer for å fortsette.");
  const [erFeil, setErFeil] = useState(false);
  const [opptatteTider, setOpptatteTider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visValgBoks, setVisValgBoks] = useState(false);

  const formaterDato = (d) => {
    if (!d) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://frisor-backend.onrender.com/Bestillinger/${formaterDato(selectedDate)}`);

        if (res.ok && res.status !== 204) {
          const data = await res.json();
          setOpptatteTider(Array.isArray(data) ? data.map(b => b.tidspunkt) : []);
        } else {
          setOpptatteTider([]); 
        }
      } catch (err) { 
        console.error("Feil ved henting av tider:", err); 
        setOpptatteTider([]);
      } finally { 
        setIsLoading(false); 
      }
    })();
  }, [selectedDate]);

  const fullforBestilling = async (mobilnummer) => {
    setErFeil(false);
    // Vi setter en melding mens vi venter, slik at brukeren ser at noe skjer
    setBoksMelding("Lagrer din bestilling..."); 
    
    try {
      // STEG 1: Sjekk om kunden eksisterer
      const res = await fetch(`https://frisor-backend.onrender.com/kunder/${mobilnummer}`);
      
      if (res.ok) {
        // STEG 2: Send selve bestillingen
        const saveRes = await fetch("https://frisor-backend.onrender.com/Bestillinger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            dato: formaterDato(selectedDate), 
            tidspunkt: selectedTime, 
            kunde: { mobilnummer: mobilnummer } 
          }),
        });

        // STEG 3: Sjekk om vi fikk JSON tilbake før vi leser den (Dette stopper krasjen!)
        let data = {};
        const contentType = saveRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await saveRes.json();
        }

        if (saveRes.ok) {
          setBekreftet(true);
          setVisBoks(false);
        } else {
          setErFeil(true);
          // Nå bruker vi feilmeldingen fra Java-BindingResult hvis den finnes
          setBoksMelding(data.message || "Tiden er kanskje opptatt, vennligst prøv en annen.");
        }
      } else {
        setErFeil(true);
        setBoksMelding("Vi finner ingen registrert kunde med dette mobilnummeret!");
      }
    } catch (err) {
      console.error("Nettverksfeil:", err);
      setErFeil(true);
      setBoksMelding("Nettverksfeil: Kunne ikke kontakte serveren.");
    }
  };

  return (
    <section id="BestillTime" className="py-24 bg-zinc-100 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-red-800 font-bold uppercase tracking-widest text-sm mb-2">Velg tid og dato</h2>
          <h3 className="text-4xl md:text-5xl font-black text-zinc-900 mb-16">Bestill din time</h3>
        </motion.div>

        {bekreftet ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-lg max-w-md mx-auto"
          >
            <h4 className="text-2xl font-bold mb-3">Time bekreftet!</h4>
            <p className="text-xl font-semibold">{selectedDate.toLocaleDateString('nb-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} kl. {selectedTime}</p>
            <button onClick={() => setBekreftet(false)} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg">Bestill ny time</button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-zinc-200 relative z-10 w-full max-w-sm"
            >
              <BakgrunnElementer position='-top-6 -left-6' size='text-3xl'/>
              <h4 className="text-xl font-bold mb-4 text-left">Velg Dato</h4>
              <DatePicker selected={selectedDate} onChange={(d) => { setOpptatteTider([]); setSelectedDate(d); setSelectedTime(null); }} inline minDate={new Date()} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`bg-white p-6 rounded-2xl shadow-xl border border-zinc-200 relative z-10 w-full max-w-sm ${selectedDate ? 'border-red-600' : ''}`}
            >
              <BakgrunnElementer position='-bottom-6 -right-6' size='text-3xl'/>
              <h4 className="text-xl font-bold mb-4 text-left">Velg Tidspunkt</h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedDate ? ledigeTider.map((t, i) => (
                  <button
                    key={i}
                    disabled={opptatteTider.includes(t) || isLoading}
                    onClick={() => setSelectedTime(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                      ${selectedTime === t ? 'bg-red-700 text-white shadow-md' : 'bg-zinc-100 text-zinc-700 hover:bg-red-100'} 
                      ${opptatteTider.includes(t) ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    {t}
                  </button>
                )) : <p className="col-span-3 text-zinc-500">Velg en dato først.</p>}
              </div>
            </motion.div>
          </div>
        )}

        {!bekreftet && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={() => setVisValgBoks(true)}
            disabled={!selectedDate || !selectedTime}
            className={`mt-12 px-10 py-4 rounded-xl text-white text-lg font-semibold shadow-lg transition-all duration-300
              ${!selectedDate || !selectedTime ? 'bg-zinc-400' : 'bg-red-700 hover:bg-red-800 active:scale-95'}`}
          >
            Bekreft bestilling
          </motion.button>
        )}

        <AnimatePresence>
          {visValgBoks && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setVisValgBoks(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl z-10 max-w-sm w-full text-center"
              >
                <h3 className="text-2xl font-black text-zinc-900 mb-6">Velkommen</h3>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => { setVisValgBoks(false); setVisBoks(true); }}
                    className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all"
                  >
                    Jeg har en profil
                  </button>
                  <button 
                    onClick={() => { setVisValgBoks(false); setVisFullRegistrering(true); }}
                    className="w-full border-2 border-zinc-200 text-zinc-900 font-bold py-4 rounded-xl hover:bg-zinc-50 transition-all"
                  >
                    Opprett ny profil
                  </button>
                  <button onClick={() => setVisValgBoks(false)} className="text-zinc-400 text-sm mt-2">
                    Avbryt
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <RegistrerKundeBox 
          isOpen={visBoks} onClose={() => setVisBoks(false)} 
          onConfirm={fullforBestilling} onReset={() => {setErFeil(false); setBoksMelding("Skriv inn ditt mobilnummer for å fortsette.");}}
          melding={boksMelding} isError={erFeil} onOpenFull={() => {setVisBoks(false); setVisFullRegistrering(true);}} 
        />

        <FullRegistreringBox 
          isOpen={visFullRegistrering} 
          onClose={() => setVisFullRegistrering(false)} 
          onConfirm={async (data) => {
            const res = await fetch("https://frisor-backend.onrender.com/kunder", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(data) 
            });

            if (res.ok) { 
              setVisFullRegistrering(false); 
              setErFeil(false); // SIKRER SVART SKRIFT
              setBoksMelding("Konto opprettet! Vennligst skriv nummeret på nytt."); 
              setVisBoks(true); 
            }
          }} 
        />
      </div>
    </section>
  );
};

export default Bestilling;