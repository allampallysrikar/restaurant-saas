import { ArrowRight, Utensils } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-zinc-800/50 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-zinc-900/50 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="container px-6 relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
          <Utensils className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300 font-medium">Exceptional Culinary Experience</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
          Taste the Art of <br />
          <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">Fine Dining.</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          Discover a symphony of flavors crafted by award-winning chefs. XYZ Restaurant brings you an unforgettable gastronomic journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition flex items-center group">
            Order Online
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-medium hover:bg-white/5 transition">
            Book a Table
          </button>
        </div>
      </div>
    </div>
  );
}
