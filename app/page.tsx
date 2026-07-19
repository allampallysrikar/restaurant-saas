import { ArrowRight, Utensils, Clock, Star, Users } from "lucide-react";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-black text-white">
      {/* Background Gradients */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-zinc-800/50 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-zinc-900/50 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container px-6 relative z-10 text-center min-h-screen flex flex-col justify-center items-center pt-20"
      >
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
          <Utensils className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300 font-medium">Exceptional Culinary Experience</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight">
          Taste the Art of <br />
          <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-lg">
            Fine Dining.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
          Discover a symphony of flavors crafted by award-winning chefs. XYZ Restaurant brings you an unforgettable gastronomic journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/menu" className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all flex items-center group shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Order Online
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="/reservations" className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-semibold hover:bg-white/5 transition-all">
            Book a Table
          </a>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container px-6 py-24 z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <Clock className="w-10 h-10 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Fast Delivery</h3>
            <p className="text-gray-400">Enjoy our exquisite dishes from the comfort of your home, delivered fresh and fast.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <Star className="w-10 h-10 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Fine Dining Experience</h3>
            <p className="text-gray-400">An ambiance designed for elegance. Perfect for dates, celebrations, and gatherings.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <Users className="w-10 h-10 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Easy Reservations</h3>
            <p className="text-gray-400">Book your table in seconds with our seamless online reservation system.</p>
          </div>
        </div>
      </motion.section>

      {/* Gallery/Menu Preview Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container px-6 py-24 z-10"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">Signature Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80", name: "Truffle Pasta" },
            { img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=80", name: "Wagyu Steak" },
            { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", name: "Artisan Pizza" },
          ].map((item, idx) => (
            <div key={idx} className="relative h-72 rounded-3xl overflow-hidden group">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container px-6 py-24 z-10"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">What Our Guests Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Sarah Jenkins", role: "Food Critic", text: "The most phenomenal dining experience I've had this year. Every dish is a masterpiece." },
            { name: "Michael Chen", role: "Local Guide", text: "Absolutely stunning ambiance and the truffle pasta is to die for. Highly recommended!" },
            { name: "Emma Watson", role: "Regular Customer", text: "Fast delivery, incredible flavors, and top-notch service. XYZ Restaurant never disappoints." },
          ].map((review, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <div className="flex text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-300 mb-6 italic">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{review.name}</h4>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black py-12 z-10 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">XYZ Restaurant.</h2>
            <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} XYZ Restaurant. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/menu" className="hover:text-white transition-colors">Menu</a>
            <a href="/reservations" className="hover:text-white transition-colors">Reservations</a>
            <a href="/admin" className="hover:text-white transition-colors">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
