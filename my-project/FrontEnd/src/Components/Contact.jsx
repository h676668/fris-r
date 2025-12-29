import React from 'react';
import BakgrunnElementer from './BakgrunnElementer';

const Contact = () => {
  return (
    <section id="Kontakt" className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* VENSTRE SIDE: Inneholder både tekst og kart */}
        <div className="relative flex flex-col space-y-14">
          
          {/* Tekst-del */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold text-black tracking-tight">
              Kontakt oss
            </h2>
            <p className="text-xl text-gray-800 leading-relaxed max-w-sm">
              Har du spørsmål eller trenger hjelp? Send oss en melding, så hører du fra oss snart.
            </p>
          </div>

          {/* Kart-del (Ligger nå under teksten, i samme kolonne) */}
          <div className="w-full max-w-sm h-72 bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-200 relative group transition-transform duration-500 hover:shadow-xl">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1971.956740636306!2d5.328251856167095!3d60.390362518317225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sno!2sno!4v1710000000000!5m2!1sno!2sno"
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                filter: 'grayscale(10%) contrast(1.1) brightness(0.9)',
              }}
              allowFullScreen=""
              loading="lazy"
              className="transition-all duration-700 group-hover:filter-none group-hover:scale-105"
            ></iframe>

            <a 
              href="https://www.google.com/maps/search/?api=1&query=60.390362518317225,5.328251856167095" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 cursor-pointer"
            >
              <span className="sr-only">Åpne kart i Google Maps</span>
            </a>
            
            <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white shadow-2xl pointer-events-none group-hover:bg-black transition-colors">
              Se i Google Maps
            </div>
          </div>

          <BakgrunnElementer position='bottom-0.5 left-5' color='text-zinc-500' />
        </div>



        {/* Høyre side: Skjema */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Navn felt */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Navn <span className="text-gray-400 font-normal">(påkrevd)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fornavn</label>
                <input type="text" className="w-full border border-black rounded-3xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Etternavn</label>
                <input type="text" className="w-full border border-black rounded-3xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400" />
              </div>
            </div>
          </div>

          {/* Email felt */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              E-post <span className="text-gray-400 font-normal">(påkrevd)</span>
            </label>
            <input type="email" className="w-full border border-black rounded-3xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          {/* Melding felt */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Melding <span className="text-gray-400 font-normal">(påkrevd)</span>
            </label>
            <textarea rows="6" className="w-full border border-black rounded-3xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"></textarea>
          </div>

          {/* Send knapp */}
          <button type="submit" className="bg-black text-white text-sm font-bold tracking-widest uppercase px-10 py-5 rounded-full hover:bg-zinc-800 transition-colors active:scale-95">
            Send
          </button>
          
        </form>
      </div>
    </section>
  );
};

export default Contact;