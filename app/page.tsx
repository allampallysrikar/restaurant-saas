"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  return (
    <div className="bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/70 via-black/50 to-[#0A0A0A]" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <motion.div variants={fadeIn} className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm tracking-[0.2em]">EST. 2019</span>
            <div className="h-[1px] w-12 bg-[#C9A84C]" />
          </motion.div>
          
          <motion.h1 
            variants={fadeIn}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight"
          >
            Where Every Bite<br />Tells a Story
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-[#F5F0E8]/80 text-lg md:text-xl font-light max-w-2xl mx-auto mb-10"
          >
            Award-winning fine dining experience in the heart of the city
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/menu" 
              className="bg-[#7C1D35] text-[#C9A84C] px-8 py-4 uppercase tracking-widest text-sm hover:bg-[#5A1224] transition-colors w-full sm:w-auto"
            >
              Explore Our Menu
            </Link>
            <Link 
              href="/reservations" 
              className="bg-transparent border border-[#C9A84C] text-[#C9A84C] px-8 py-4 uppercase tracking-widest text-sm hover:bg-[#C9A84C]/10 transition-colors w-full sm:w-auto"
            >
              Reserve Your Table
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        >
          <svg className="w-6 h-6 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* About Snippet Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="relative h-[600px] w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80" 
              alt="Our Chef" 
              className="w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#111111] border border-[#C9A84C]/20 p-6 flex flex-col justify-center items-center text-center hidden md:flex">
              <span className="font-playfair text-4xl text-[#C9A84C] mb-2">3</span>
              <span className="text-xs uppercase tracking-widest text-[#F5F0E8]/70">Michelin Stars</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.span variants={fadeIn} className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-4 block">
              Our Story
            </motion.span>
            <motion.h2 variants={fadeIn} className="font-playfair text-4xl md:text-5xl mb-8">
              Crafted with Passion,<br />Served with Excellence
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#F5F0E8]/70 leading-relaxed mb-6 font-light">
              Founded on the principle that dining should be a transformative experience, 
              The Golden Fork brings together global culinary techniques and locally sourced 
              ingredients to create dishes that challenge expectations and delight the senses.
            </motion.p>
            <motion.p variants={fadeIn} className="text-[#F5F0E8]/70 leading-relaxed mb-10 font-light">
              Led by acclaimed Chef Marcus Laurent, our team is dedicated to pushing the boundaries 
              of modern gastronomy while maintaining a deep respect for culinary traditions.
            </motion.p>
            
            <motion.div variants={fadeIn} className="mb-12">
              <Link href="/about" className="text-[#C9A84C] hover:text-white transition-colors border-b border-[#C9A84C] pb-1 inline-flex items-center gap-2">
                Meet Our Team <span>→</span>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex gap-8 items-center border-t border-[#2A1A1F] pt-8">
              <div className="text-center">
                <p className="font-playfair text-[#C9A84C] text-xl">Michelin</p>
                <p className="text-[10px] uppercase tracking-wider text-[#F5F0E8]/50">3 Stars 2023</p>
              </div>
              <div className="w-[1px] h-8 bg-[#2A1A1F]" />
              <div className="text-center">
                <p className="font-playfair text-[#C9A84C] text-xl">Wine Spec</p>
                <p className="text-[10px] uppercase tracking-wider text-[#F5F0E8]/50">Grand Award</p>
              </div>
              <div className="w-[1px] h-8 bg-[#2A1A1F]" />
              <div className="text-center">
                <p className="font-playfair text-[#C9A84C] text-xl">TripAdvisor</p>
                <p className="text-[10px] uppercase tracking-wider text-[#F5F0E8]/50">Traveler's Choice</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Signature Dishes Section */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-4 block">The Menu</span>
            <h2 className="font-playfair text-4xl md:text-5xl">Signature Dishes</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { name: "Truffle Risotto", price: "$45", img: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&auto=format&fit=crop&q=80" },
              { name: "Wagyu A5 Striploin", price: "$120", img: "https://images.unsplash.com/photo-1544025162-83503b878f1d?w=800&auto=format&fit=crop&q=80" },
              { name: "Lobster Thermidor", price: "$85", img: "https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop&q=80" }
            ].map((dish, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer"
              >
                <img 
                  src={dish.img} 
                  alt={dish.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm px-4 py-2 border border-[#C9A84C]/30">
                  <span className="text-[#C9A84C] font-playfair">{dish.price}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-playfair text-2xl mb-2">{dish.name}</h3>
                  <div className="h-[1px] w-12 bg-[#7C1D35] group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/menu" className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#C9A84C] text-[#C9A84C] px-8 py-4 uppercase tracking-widest text-sm hover:bg-[#C9A84C] hover:text-black transition-all">
              View Full Menu <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Private Dining / Events CTA */}
      <section className="relative py-32">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 z-1 bg-black/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="border border-[#C9A84C]/30 p-12 md:p-16 backdrop-blur-sm bg-black/40"
          >
            <h2 className="font-playfair text-4xl md:text-5xl mb-6 text-white">Host Your Special Moments</h2>
            <p className="text-[#F5F0E8]/80 mb-10 max-w-2xl mx-auto font-light text-lg">
              From intimate gatherings to grand celebrations, our exclusive private dining rooms offer the perfect setting for unforgettable events with bespoke menus.
            </p>
            <Link href="/private-dining" className="bg-[#7C1D35] text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-[#5A1224] transition-colors inline-block">
              Enquire Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
          <h2 className="font-playfair text-4xl md:text-5xl">What Our Guests Say</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { text: "An absolute triumph of culinary art. Every dish was a masterpiece, perfectly paired with selections from an exceptional wine list.", name: "Eleanor Vance", title: "Food Critic" },
            { text: "The ambiance is stunning, but the service is what truly sets The Golden Fork apart. They anticipated our every need before we did.", name: "James Sterling", title: "Regular Guest" },
            { text: "We celebrated our anniversary here and it was magical. The chef's tasting menu is a journey you won't want to end.", name: "Sarah & David", title: "Local Foodies" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[#111111] p-8 border border-[#2A1A1F] flex flex-col items-center text-center"
            >
              <div className="flex gap-1 text-[#C9A84C] mb-6">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="font-playfair italic text-lg text-[#F5F0E8]/90 mb-8 flex-grow">"{item.text}"</p>
              <div>
                <p className="text-[#C9A84C] font-medium tracking-wide">{item.name}</p>
                <p className="text-xs uppercase tracking-wider text-[#F5F0E8]/50 mt-1">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Opening Hours & Location */}
      <section className="py-24 bg-[#111111] border-t border-[#2A1A1F]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-0 border border-[#2A1A1F]">
            <div className="p-12 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#2A1A1F]">
              <h3 className="font-playfair text-3xl mb-8">Opening Hours</h3>
              <ul className="space-y-4 text-[#F5F0E8]/80 font-light">
                <li className="flex justify-between border-b border-[#2A1A1F] pb-2">
                  <span>Monday - Friday</span>
                  <span>12:00 PM - 10:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-[#2A1A1F] pb-2">
                  <span>Saturday - Sunday</span>
                  <span>11:00 AM - 11:00 PM</span>
                </li>
              </ul>
              <div className="mt-8">
                <span className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#2A1A1F] px-4 py-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Open Now
                </span>
              </div>
            </div>
            
            <div className="p-12 md:p-16 flex flex-col justify-center bg-[#0A0A0A]">
              <h3 className="font-playfair text-3xl mb-8">Find Us</h3>
              <p className="text-[#F5F0E8]/80 font-light mb-2">123 Culinary Avenue, Food District</p>
              <p className="text-[#F5F0E8]/80 font-light mb-8">New York, NY 10001</p>
              
              <p className="text-[#C9A84C] font-playfair text-xl mb-8">+1 (555) 123-4567</p>
              
              <Link href="https://maps.google.com" target="_blank" className="text-white border-b border-[#7C1D35] pb-1 inline-flex items-center gap-2 w-max hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
                Get Directions <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C9A84C]/30 bg-[#0A0A0A] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="font-playfair text-2xl text-white mb-4">The Golden Fork</h4>
            <p className="text-[#F5F0E8]/60 text-sm mb-6 font-light">Where every bite tells a story of passion, tradition, and innovation.</p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'TripAdvisor'].map(social => (
                <a key={social} href="#" className="text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors text-sm uppercase tracking-wider">
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-playfair text-xl text-white mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-[#F5F0E8]/60 font-light">
              <li><Link href="/menu" className="hover:text-[#C9A84C] transition-colors">Our Menu</Link></li>
              <li><Link href="/about" className="hover:text-[#C9A84C] transition-colors">Our Story</Link></li>
              <li><Link href="/reservations" className="hover:text-[#C9A84C] transition-colors">Reservations</Link></li>
              <li><Link href="/private-dining" className="hover:text-[#C9A84C] transition-colors">Private Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-xl text-white mb-6">Contact Info</h4>
            <ul className="space-y-3 text-sm text-[#F5F0E8]/60 font-light">
              <li>hello@goldenfork.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Culinary Avenue, NY 10001</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-xl text-white mb-6">Newsletter</h4>
            <p className="text-[#F5F0E8]/60 text-sm mb-4 font-light">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Email Address" className="bg-[#111111] border border-[#2A1A1F] px-4 py-2 w-full text-sm focus:outline-none focus:border-[#C9A84C] text-white" />
              <button className="bg-[#7C1D35] px-4 py-2 text-white hover:bg-[#5A1224] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-[#2A1A1F] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#F5F0E8]/40 uppercase tracking-widest">
          <p>© 2024 The Golden Fork. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
