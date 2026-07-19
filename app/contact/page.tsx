"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("success");
    setTimeout(() => setFormStatus("idle"), 5000);
  };

  return (
    <div className="bg-[#0A0A0A] text-[#F5F0E8] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-16"
        >
          <span className="text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-4 block">Reach Out</span>
          <h1 className="font-playfair text-5xl md:text-6xl text-white">Get in Touch</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#111111] p-8 md:p-12 border border-[#2A1A1F]"
          >
            <h2 className="font-playfair text-3xl mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-[#F5F0E8]/70 mb-2 uppercase tracking-wider">Name</label>
                <input required type="text" className="w-full bg-[#0A0A0A] border border-[#2A1A1F] px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-[#F5F0E8]/70 mb-2 uppercase tracking-wider">Email</label>
                <input required type="email" className="w-full bg-[#0A0A0A] border border-[#2A1A1F] px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-[#F5F0E8]/70 mb-2 uppercase tracking-wider">Subject</label>
                <select className="w-full bg-[#0A0A0A] border border-[#2A1A1F] px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Private Events</option>
                  <option>Press & Media</option>
                  <option>Careers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#F5F0E8]/70 mb-2 uppercase tracking-wider">Message</label>
                <textarea required rows={5} className="w-full bg-[#0A0A0A] border border-[#2A1A1F] px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#7C1D35] text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-[#5A1224] transition-colors">
                Send Message
              </button>
              
              {formStatus === "success" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/20 text-green-400 border border-green-900/50 p-4 text-center text-sm"
                >
                  Thank you! Your message has been sent successfully. We will get back to you shortly.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-12"
          >
            <div>
              <h3 className="font-playfair text-2xl mb-4 text-[#C9A84C]">Location</h3>
              <p className="text-[#F5F0E8]/70 font-light text-lg">123 Culinary Avenue, Food District</p>
              <p className="text-[#F5F0E8]/70 font-light text-lg">New York, NY 10001</p>
            </div>
            
            <div>
              <h3 className="font-playfair text-2xl mb-4 text-[#C9A84C]">Reservations</h3>
              <p className="text-[#F5F0E8]/70 font-light text-lg mb-2">Phone: <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a></p>
              <p className="text-[#F5F0E8]/70 font-light text-lg">Email: <a href="mailto:hello@goldenfork.com" className="hover:text-white transition-colors">hello@goldenfork.com</a></p>
            </div>

            <div>
              <h3 className="font-playfair text-2xl mb-4 text-[#C9A84C]">Hours</h3>
              <div className="grid grid-cols-2 gap-4 text-[#F5F0E8]/70 font-light text-lg max-w-sm">
                <span>Mon - Fri</span>
                <span>12:00 PM - 10:00 PM</span>
                <span>Sat - Sun</span>
                <span>11:00 AM - 11:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-[500px] border border-[#2A1A1F] grayscale hover:grayscale-0 transition-all duration-700"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.909062369796!2d-73.98773958434255!3d40.751240379327576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9a3b83921%3A0x67fa54df24388836!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1621287955502!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
