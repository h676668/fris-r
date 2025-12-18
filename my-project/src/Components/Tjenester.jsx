import React from 'react';
import { motion } from 'framer-motion';
import { tjenester } from '../constants';



const Tjenester = () => {
  return (
    <section id="Tjenester" className="py-24 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Overskrift Seksjon */}
        <div className="mb-16 text-left">
          <h2 className="text-red-800 font-bold uppercase tracking-widest text-sm mb-2">Hva vi gjør</h2>
          <h3 className="text-4xl md:text-5xl font-black text-zinc-900">Våre Tjenester</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tjenester.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className={`group relative p-8 h-full min-h-80 flex flex-col justify-between transition-all duration-500 ${
                item.fremhevet 
                ? 'bg-red-900 text-white shadow-2xl rounded-tr-[4rem]' 
                : 'bg-white border border-zinc-200 hover:border-red-800/30 rounded-br-[4rem]'
              }`}
            >
              {/* Bakgrunnsnummer - subtil detalj */}
              <span className={`absolute top-4 right-6 text-6xl font-black opacity-5 select-none transition-opacity group-hover:opacity-10 ${item.fremhevet ? 'text-white' : 'text-zinc-900'}`}>
                {item.nummer}
              </span>

              <div>
                <div className={`w-12 h-1 mb-6 transition-all duration-500 group-hover:w-20 ${item.fremhevet ? 'bg-white' : 'bg-red-800'}`}></div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">{item.tittel}</h4>
                <p className={`text-sm leading-relaxed mb-6 ${item.fremhevet ? 'text-red-100' : 'text-zinc-500'}`}>
                  {item.beskrivelse}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-current/10">
                <span className="font-bold text-lg">{item.pris}</span>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tjenester;
