import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ledigeTider } from '../constants';
import BakgrunnElementer from './BakgrunnElementer';
import RegistrerKundeBox from './RegistrerKundeBox';
import FullRegistreringBox from './FullRegistreringbox';

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

  // Formaterer dato til YYYY-MM-DD
  const formaterDato = (d) => {
    if (!d) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/Bestillinger/${formaterDato(selectedDate)}`);
        const data = await res.json();
        setOpptatteTider(res.ok ? data.map(b => b.tidspunkt) : []);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    })();
  }, [selectedDate]);

  const fullforBestilling = async (mobilnummer) => {
    const res = await fetch(`http://localhost:8080/kunder/${mobilnummer}`);
    if (res.ok) {
      // Lagre bestillingen
      const saveRes = await fetch("http://localhost:8080/Bestillinger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dato: formaterDato(selectedDate), tidspunkt: selectedTime, kunde: { mobilnummer } }),
      });
      if (saveRes.ok) {
        setBekreftet(true);
        setVisBoks(false);
      }
    } else {
      setErFeil(true);
      setBoksMelding("Vi finner ingen registrert kunde med dette mobilnummeret !");
    }
  };

  return (
    <section id="BestillTime" className="py-24 bg-zinc-100 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        {/* TITTEL - Samme tider som original */}
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
            {/* DATO BOKS */}
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

            {/* TID BOKS */}
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

        {/* BEKREFT KNAPP */}
        {!bekreftet && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={() => setVisBoks(true)}
            disabled={!selectedDate || !selectedTime}
            className={`mt-12 px-10 py-4 rounded-xl text-white text-lg font-semibold shadow-lg transition-all duration-300
              ${!selectedDate || !selectedTime ? 'bg-zinc-400' : 'bg-red-700 hover:bg-red-800 active:scale-95'}`}
          >
            Bekreft bestilling
          </motion.button>
        )}

        <RegistrerKundeBox 
          isOpen={visBoks} onClose={() => setVisBoks(false)} 
          onConfirm={fullforBestilling} onReset={() => {setErFeil(false); setBoksMelding("Skriv inn ditt mobilnummer for å fortsette.");}}
          melding={boksMelding} isError={erFeil} onOpenFull={() => {setVisBoks(false); setVisFullRegistrering(true);}} 
        />
        <FullRegistreringBox 
          isOpen={visFullRegistrering} onClose={() => setVisFullRegistrering(false)} 
          onConfirm={async (data) => {
            const res = await fetch("http://localhost:8080/kunder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            if (res.ok) { setVisFullRegistrering(false); setVisBoks(true); setBoksMelding("Konto opprettet! Vennligst skriv nummeret på nytt."); }
          }} 
        />
      </div>
    </section>
  );
};

export default Bestilling;