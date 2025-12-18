import React from 'react';

const RingOssBox = ({ isOpen, onClose }) => {
  // Hvis isOpen er false, ikke tegn noe som helst
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Mørk bakgrunn som lukker modalen ved klikk */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Selve boksen */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl z-10 max-w-sm w-full text-center animate-fade-up">
        <div className="w-16 h-16 bg-red-100 text-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold mb-2">Ring oss direkte</h3>
        <p className="text-zinc-500 mb-6">Vi svarer så raskt vi kan!</p>
        
        <a 
          href="tel:+4712345678" 
          className="block text-red-800 font-black text-3xl mb-8 hover:scale-105 transition-transform"
        >
          12345678
        </a>
        
        <button 
          onClick={onClose}
          className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors"
        >
          Lukk
        </button>
      </div>
    </div>
  );
};

export default RingOssBox;