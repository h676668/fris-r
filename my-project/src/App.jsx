import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import Hero from './Components/Hero';
import Contact from './Components/Contact';
import OmOss from './Components/OmOss';
import Tjenester from './Components/Tjenester';
import Bestilling from './Components/Bestilling';

function App() {
  const [showModal, setShowModal] = useState(false);

  //Hindrer scrolling av selve nettsiden når modalen er åpen
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header får funksjonen som åpner modalen */}
      <Header onBookingClick={() => setShowModal(true)} />
      
      <main className="pt-20 lg:pt-24">
        <Hero onBookingClick={() => setShowModal(true)}/>
        <Tjenester />
        <OmOss />
        <Contact />
      </main>

      {/* --- MODAL LOGIKK --- */}
      {showModal && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Bakgrunns-overlay (klikker man her, lukkes modalen) */}
          <div 
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal-vinduet */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in duration-300">
            
            {/* Lukkeknapp øverst i hjørnet */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-red-800 hover:text-white transition-colors"
              aria-label="Lukk"
            >
              <span className="text-2xl font-light">×</span>
            </button>

            {/* Selve Bestilling-komponenten */}
            <div className="p-2">
               <Bestilling />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default App;