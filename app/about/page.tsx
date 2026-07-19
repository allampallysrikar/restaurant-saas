"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1920&auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 z-1 bg-black/70" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <motion.h1 
            variants={fadeIn}
            className="font-playfair text-5xl md:text-7xl text-white mb-6 leading-tight"
          >
            Our Story
          </motion.h1>
          <motion.p variants={fadeIn} className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase">
            Tradition meets Innovation
          </motion.p>
        </motion.div>
      </section>

      {/* The Narrative */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeIn} className="font-playfair text-3xl md:text-4xl mb-8">
            A Journey of Flavor and Passion
          </motion.h2>
          <motion.p variants={fadeIn} className="text-[#F5F0E8]/70 leading-relaxed font-light text-lg mb-6">
            Founded in 2019 by Chef Marcus Laurent, The Golden Fork began as a small vision to redefine fine dining. It wasn't just about serving food; it was about creating an immersive experience that engages all the senses. 
          </motion.p>
          <motion.p variants={fadeIn} className="text-[#F5F0E8]/70 leading-relaxed font-light text-lg">
            Over the years, we have grown, but our core philosophy remains unchanged: source the finest ingredients, treat them with utmost respect, and present them in ways that surprise and delight. Our journey is paved with passion, creativity, and an unwavering commitment to culinary excellence.
          </motion.p>
        </motion.div>
      </section>

      {/* Chef Section */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <span className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-4 block">The Visionary</span>
            <h2 className="font-playfair text-4xl md:text-5xl mb-6">Chef Marcus Laurent</h2>
            <p className="text-[#F5F0E8]/70 leading-relaxed font-light mb-6">
              With over two decades of experience in Michelin-starred kitchens across Paris, Tokyo, and New York, Chef Marcus brings a global perspective to local ingredients.
            </p>
            <p className="text-[#F5F0E8]/70 leading-relaxed font-light">
              "Cooking is an art form that speaks a universal language. My goal is to tell a story on every plate, creating memories that linger long after the final course."
            </p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Marcus_Samuelsson_by_David_Shankbone.jpg/640px-Marcus_Samuelsson_by_David_Shankbone.jpg" alt="Signature" className="h-16 mt-8 opacity-50 filter invert" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2 h-[500px] w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80" 
              alt="Chef Marcus Laurent" 
              className="w-full h-full object-cover grayscale"
            />
          </motion.div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-24 border-t border-b border-[#2A1A1F]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-playfair text-3xl mb-16 text-[#C9A84C]">Recognitions & Accolades</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Michelin Guide", subtitle: "3 Stars, 2023" },
              { title: "James Beard", subtitle: "Best Chef, 2022" },
              { title: "Wine Spectator", subtitle: "Grand Award" },
              { title: "World's 50 Best", subtitle: "Ranked #14" }
            ].map((award, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="p-6 border border-[#2A1A1F] bg-[#0A0A0A] hover:border-[#C9A84C]/50 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-[#111111] rounded-full flex items-center justify-center border border-[#C9A84C]/30">
                  <svg className="w-6 h-6 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h3 className="font-playfair text-lg mb-1">{award.title}</h3>
                <p className="text-xs text-[#F5F0E8]/50 uppercase tracking-widest">{award.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-4 block">The Artisans</span>
            <h2 className="font-playfair text-4xl">Meet Our Team</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Elena Rossi", role: "Head Sommelier", img: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=800&auto=format&fit=crop&q=80" },
              { name: "David Chen", role: "Sous Chef", img: "https://images.unsplash.com/photo-1578722883393-2746c19e53ce?w=800&auto=format&fit=crop&q=80" },
              { name: "Sarah Jenkins", role: "Pastry Chef", img: "https://images.unsplash.com/photo-1581084324492-c8076f130f86?w=800&auto=format&fit=crop&q=80" }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="group"
              >
                <div className="h-[400px] w-full overflow-hidden mb-6">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-playfair text-2xl text-center mb-1">{member.name}</h3>
                <p className="text-sm text-[#C9A84C] uppercase tracking-widest text-center">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#111111] border-t border-[#2A1A1F]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { title: "Sustainable Sourcing", desc: "We partner with local farmers and fishers who share our commitment to ethical, sustainable practices." },
              { title: "Local Ingredients", desc: "Our menu changes with the seasons, ensuring every dish reflects the peak flavor of our region's harvest." },
              { title: "Zero Waste", desc: "We utilize innovative techniques to minimize our environmental footprint, respecting every ingredient." }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[#0A0A0A] rounded-full border border-[#C9A84C]/50 flex items-center justify-center text-[#C9A84C] font-playfair text-xl">
                  0{idx + 1}
                </div>
                <h3 className="font-playfair text-2xl mb-4">{value.title}</h3>
                <p className="text-[#F5F0E8]/60 font-light leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
