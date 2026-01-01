import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';// ferdiglaget kalenderverktøy 
import "react-datepicker/dist/react-datepicker.css";
import { ledigeTider } from '../constants';
import BakgrunnElementer from './BakgrunnElementer';
import RegistrerKundeBox from './RegistrerKundeBox';



const Bestilling = () => {
  const [selectedDate, setSelectedDate] = useState(null); //Variabel som lagrer dato
  const [selectedTime, setSelectedTime] = useState(null);
  const [bekreftet, setBekreftet] = useState(false);
  const [visBoks, setVisBoks] = useState(false);
  const [boksMelding, setBoksMelding] = useState("Skriv inn ditt mobilnummer for å fortsette.");
  const [erFeil, setErFeil] = useState(false);

  const nullstillBoks = () => {
    setErFeil(false); 
    setBoksMelding("Skriv inn ditt mobilnummer for å fortsette.");
  };


  //Database connection
  const fullforBestilling = async (mobilnummer) => {
    const response = await fetch(`http://localhost:8080/kunder/${mobilnummer}`);
  
    if (response.ok) {
      const kundeData = await response.json();
      console.log("Kunde funnet i databasen:", kundeData);
       //viktig å nullstille state hvis det mobilnummer finnes i database
      setErFeil(false);
      //vise den grønnbox (bekreftelse)
      setBekreftet(true); 
      //lukker den gamlebox (som har inputfelt)
      setVisBoks(false);
    } else if (response.status === 404) {
      setErFeil(true);
      setBoksMelding("Vi finner ingen registrert kunde med dette mobilnummeret !");
      setVisBoks(true);
      
      //dette bytter rød farge på skrift hvis mobilnummer ikke finnes på database
      

    }
  };
  

const handleBookingClick = () => {
  if (selectedDate && selectedTime) {
    setVisBoks(true); 
  } else {
    alert("Vennligst velg både dato og tidspunkt.");
  }
};

  return (
    //style og animasjon på title 
    <section id="BestillTime" className="py-24 bg-zinc-100 overflow-hidden ">
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

       {/* viser bekreftelse hvis bekreftet variabel = true*/}
        {bekreftet ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-lg max-w-md mx-auto"
          >
            <h4 className="text-2xl font-bold mb-3">Time bekreftet!</h4>
            <p className="text-lg">Du har bestilt time:</p>
            <p className="text-xl font-semibold mt-2">{selectedDate.toLocaleDateString('nb-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} kl. {selectedTime}</p>
            <p className="mt-4">Vi gleder oss til å se deg!</p>
            <button
              onClick={() => setBekreftet(false)}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Bestill ny time
            </button>
          </motion.div>
        ) :
         (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Dato Velger Boks */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-zinc-200 relative z-10 w-full max-w-sm"
            >
              {/* Rød prikkete bakgrunn */}
              <BakgrunnElementer position='-top-6 -left-6' size='text-3xl'/>

              <h4 className="text-xl font-bold mb-4 text-left text-zinc-800">Velg Dato</h4>
              <div className="datepicker-container">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null); // Nullstill tid når dato endres
                  }}
                  inline // Viser kalenderen direkte
                  minDate={new Date()} // Kan ikke velge fortid
                  dateFormat="dd/MM/yyyy"
                  className="w-full"
                />
              </div>
              {selectedDate && (
                <p className="text-sm text-left text-zinc-500 mt-4">
                  Valgt: {selectedDate.toLocaleDateString('nb-NO', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              )}
            </motion.div>

            {/* Tid Velger Boks */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`bg-white p-6 rounded-2xl shadow-xl border border-zinc-200 relative z-10 w-full max-w-sm
                          ${selectedDate ? 'border-red-600' : ''}`} // Rød ramme når dato er valgt
            >
              {/* Rød prikkete bakgrunn */}
              <BakgrunnElementer position='-bottom-6 -right-6' size='text-3xl'/>

              <h4 className="text-xl font-bold mb-4 text-left text-zinc-800">Velg Tidspunkt</h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedDate ? (
                  ledigeTider.map((time, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                  ${selectedTime === time
                                    ? 'bg-red-700 text-white shadow-md'
                                    : 'bg-zinc-100 text-zinc-700 hover:bg-red-100 hover:text-red-700'
                                  }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-zinc-500">Velg en dato først for å se ledige tider.</p>
                )}
              </div>
              {selectedTime && (
                <p className="text-sm text-left text-zinc-500 mt-4">
                  Valgt: {selectedTime}
                </p>
              )}
            </motion.div>
          </div>
        )}

        {/* Bekreft Knapp */}
        {!bekreftet && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={handleBookingClick}
            disabled={!selectedDate || !selectedTime}
            className={`mt-12 px-10 py-4 rounded-xl text-white text-lg font-semibold tracking-wide shadow-lg transition-all duration-300
                        ${!selectedDate || !selectedTime
                          ? 'bg-zinc-400 cursor-not-allowed'
                          : 'bg-red-700 hover:bg-red-800 active:scale-98'
                        }`}
          >
            Bekreft bestilling
          </motion.button>
        )}
        <RegistrerKundeBox 
          isOpen={visBoks}               // Endret fra isModalOpen
          onClose={() => setVisBoks(false)} // Endret fra setIsModalOpen
          onConfirm={fullforBestilling} 
          onReset={nullstillBoks}
          melding={boksMelding}
          isError={erFeil}
        />
        
      </div>
    </section>
  );
};

export default Bestilling;