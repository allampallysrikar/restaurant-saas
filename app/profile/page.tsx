import React from "react";
import { Star, Gift, Trophy, ArrowRight } from "lucide-react";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  return neon(url);
}

export default async function ProfilePage() {
  const sql = getDb();
  
  // Demo mode: sum of ALL orders since we don't have auth
  const result = await sql`SELECT SUM("totalAmount") as total FROM "Order"`;
  const totalAmount = result[0]?.total || 0;
  const points = Math.floor(Number(totalAmount));

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your <span className="bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">Rewards</span>
          </h1>
          <p className="text-gray-400">Earn points on every order. Redeem for exclusive culinary experiences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Points Card */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border border-yellow-500/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Trophy className="w-32 h-32 text-yellow-500" />
            </div>
            
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Available Points</h3>
            <div className="text-6xl font-bold mb-4">{points}</div>
            <p className="text-gray-300">Demo Mode: Showing total points from all orders across the platform.</p>
            
            <div className="mt-8">
              <a href="/menu" className="inline-flex items-center px-6 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition">
                Order to Earn More <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" /> How It Works
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold">Earn Points</h4>
                  <p className="text-sm text-gray-400">Get 1 point for every $1 spent on orders.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold">Reach Milestones</h4>
                  <p className="text-sm text-gray-400">Unlock special tiers as you accumulate points.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-bold">Redeem Rewards</h4>
                  <p className="text-sm text-yellow-400 font-medium bg-yellow-500/10 inline-block px-2 py-1 rounded mt-1">
                    100 points = $10 off your next order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <h2 className="text-2xl font-bold mb-6">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50 grayscale">
            <Gift className="w-8 h-8 mb-4 text-gray-400" />
            <h4 className="font-bold mb-1">Free Appetizer</h4>
            <p className="text-sm text-gray-400 mb-4">Choice of any appetizer under $15</p>
            <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full inline-block">150 Points needed</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50 grayscale">
            <Gift className="w-8 h-8 mb-4 text-gray-400" />
            <h4 className="font-bold mb-1">Dessert on Us</h4>
            <p className="text-sm text-gray-400 mb-4">Any dessert from our premium menu</p>
            <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full inline-block">200 Points needed</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50 grayscale">
            <Gift className="w-8 h-8 mb-4 text-gray-400" />
            <h4 className="font-bold mb-1">Chef's Tasting Menu</h4>
            <p className="text-sm text-gray-400 mb-4">Exclusive 5-course tasting experience</p>
            <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full inline-block">1000 Points needed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
