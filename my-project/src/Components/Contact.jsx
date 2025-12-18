import React from 'react';

const Contact = () => {
  return (
    <section id="Kontakt" className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Venstre side: Tekst */}
        <div className="space-y-6">
          <h2 className="text-5xl md:text-7xl font-bold text-black tracking-tight">
            Contact Us
          </h2>
          <p className="text-xl text-gray-800 leading-relaxed max-w-sm">
            Interested in working together? Fill out some info and we will be in touch shortly. We can't wait to hear from you!
          </p>
        </div>

        {/* Høyre side: Skjema */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Navn felt */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">
              Name <span className="text-gray-400 font-normal">(required)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input type="text" className="w-full border border-black rounded-3xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input type="text" className="w-full border border-black rounded-3xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400" />
              </div>
            </div>
          </div>

          {/* Email felt */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Email <span className="text-gray-400 font-normal">(required)</span>
            </label>
            <input type="email" className="w-full border border-black rounded-3xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          {/* Melding felt */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Message <span className="text-gray-400 font-normal">(required)</span>
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