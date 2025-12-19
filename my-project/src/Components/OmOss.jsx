import React from 'react';
import { motion } from 'framer-motion';
import KontaktBilde from '../assets/Kontaktbildet.png'; 

const OmOss = () => {
  return (
    <section id="Omoss" className="min-h-screen bg-gray-50 flex items-center justify-center border-b overflow-hidden py-20 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* VENSTRE SIDE: Bilde med scroll- og hover-animasjon */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Selve bildet med profesjonelt filter og hover-effekt */}
            <motion.div 
              whileHover={{ scale: 1.03 }} // Forstørrer bildet litt
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative z-10 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
            >
              {/* Profesjonelt filter-overlay som blir borte på hover */}
              <motion.div 
                initial={{ opacity: 0.4 }}
                whileHover={{ opacity: 0 }}
                className="absolute inset-0 bg-red-900/10 z-20 pointer-events-none transition-opacity duration-500"
              />
              
              <motion.img 
                src={KontaktBilde} 
                alt="Kontakt oss på Bergen Frisør" 
                className="w-full h-auto object-cover max-h-150 brightness-[1] contrast-[1.1] grayscale-20"
                whileHover={{ grayscale: 0, brightness: 1 }} // Går fra "matted farge" til full farge på hover
                transition={{ duration: 0.4 }}
              />
            </motion.div>

            {/* Dekorativ rød sirkel som beveger seg litt når man peker på bildet */}
            <motion.div 
              whileHover={{ x: -10, y: 10, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-red-800/15 rounded-full z-0"
            />
          </motion.div>

          {/* HØYRE SIDE: Tekst - Løftet opp for en mer profesjonell layout */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-left -mt-12 md:-mt-24" 
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
              Om Oss
            </h2>
            
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Velkommen til <span className="text-red-800 font-semibold">Bergen Frisør</span>. 
                Vi holder til sentralt i Bergen og brenner for faget vårt. Hos oss er målet 
                alltid at du skal gå ut døren med en frisyre du elsker og en følelse av velvære.
              </p>
              <p>
                Vårt team består av erfarne frisører som holder seg oppdatert på de nyeste 
                trender og teknikker. Enten du trenger en rask drop-in klipp eller en 
                full fargeforvandling, er du i trygge hender.
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                <span className="w-16 h-0.5 bg-red-800"></span>
                <span className="font-bold uppercase tracking-[0.2em] text-xs text-zinc-400">
                  Etablert 2024
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default OmOss;