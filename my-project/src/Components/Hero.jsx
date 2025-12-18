import React from 'react';

const Hero = () => {
  return (
    <section id="Hjem"className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white px-6 py-12">
    

      {/* Hovedbeholder med text-center */}
      <div className="container mx-auto z-10 flex flex-col items-center text-center space-y-8">
        
        <div className="space-y-4">
          <h2 className="text-red-800 font-bold text-lg md:text-xl uppercase tracking-widest">
            Drop-in og timebestilling i Bergen
          </h2>
          
          <h1 className="text-6xl md:text-9xl font-black text-black leading-tight">
            Bergen <span className="text-red-800">Frisør</span>
          </h1>
        </div>
        
     <p className="font-light uppercase text-[14px] md:text-[16px] tracking-[0.3em] text-zinc-500 mx-auto max-w-3xl transition-all duration-300 ease-in-out leading-loose">
  Opplev <span className="text-red-900 font-bold">kvalitet</span>, 
  <span className="text-red-900 font-bold"> komfort</span> og 
  <span className="text-red-900 font-bold"> profesjonalitet</span> hos oss.
</p>
        
        {/* Prisliste sentrert */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 py-4 border-y border-gray-100 w-full justify-center max-w-2xl">
          <p className="text-xl md:text-2xl font-bold italic">
            Drop-in: <span className="font-normal text-gray-500 ml-2">349,-</span>
          </p>
          <p className="text-xl md:text-2xl font-bold italic">
            Timebestilling: <span className="font-normal text-gray-500 ml-2">399,-</span>
          </p>
        </div>
        
        {/* Knapper sentrert */}
        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <button className="bg-red-900 hover:bg-red-800 text-white font-bold py-5 px-12 rounded-full transition-all shadow-xl active:scale-95 hover:scale-105
">
            Ring oss
          </button>
          <button className="bg-white border border-zinc-700 text-zinc-700 hover:border-red-800 hover:text-red-800 font-bold py-5 px-12 rounded-full transition-all active:scale-95 hover:scale-105
">
  Bestill time
</button>
        </div>
      </div>

      
    </section>
  );
};

export default Hero;