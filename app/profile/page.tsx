import React from "react";
import { Star, Gift, Trophy, ArrowRight, Award } from "lucide-react";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  return neon(url);
}

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const sql = getDb();
  
  const result = await sql`SELECT COALESCE(SUM("totalAmount"), 0) as total FROM "Order"`;
  const totalPoints = Math.floor(Number(result[0].total));

  // Determine Tier
  let tier = "Bronze Diner";
  let nextTier = "Silver Connoisseur";
  let pointsToNext = 500 - totalPoints;
  let progress = Math.min((totalPoints / 500) * 100, 100);

  if (totalPoints >= 1000) {
    tier = "Gold Member";
    nextTier = "Max Tier";
    pointsToNext = 0;
    progress = 100;
  } else if (totalPoints >= 500) {
    tier = "Silver Connoisseur";
    nextTier = "Gold Member";
    pointsToNext = 1000 - totalPoints;
    progress = ((totalPoints - 500) / 500) * 100;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24 pt-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#7C1D35]/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold tracking-tight mb-4 text-[#F5F0E8]">
            Your <span className="text-[#C9A84C]">Rewards</span>
          </h1>
          <p className="text-gray-400 text-lg">Elevate your dining experience. Earn points, unlock exclusive privileges.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Points Card */}
          <div className="lg:col-span-8 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-[#C9A84C]/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="w-48 h-48 text-[#C9A84C]" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full mb-8">
                <Award className="w-4 h-4 text-[#C9A84C] mr-2" />
                <span className="text-sm font-bold text-[#C9A84C] uppercase tracking-widest">{tier}</span>
              </div>

              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Available Balance</h3>
              <div className="font-[family-name:var(--font-playfair)] text-7xl md:text-8xl font-bold text-[#C9A84C] mb-8 drop-shadow-lg">
                {totalPoints} <span className="text-3xl text-gray-500 font-sans tracking-normal">pts</span>
              </div>
              
              {/* Progress bar */}
              <div className="max-w-md">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-[#C9A84C]">{tier}</span>
                  <span className="text-gray-500">{nextTier}</span>
                </div>
                <div className="h-2 w-full bg-[#2A1A1F] rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-[#7C1D35] to-[#C9A84C] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                {pointsToNext > 0 && (
                  <p className="text-xs text-gray-500 text-right">{pointsToNext} points to {nextTier}</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-4 bg-[#111111] border border-[#2A1A1F] rounded-3xl p-8 flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-[#F5F0E8] border-b border-[#2A1A1F] pb-4">Recent Activity</h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
              <Star className="w-12 h-12 text-[#7C1D35] mb-4" />
              <p className="text-gray-400 leading-relaxed text-sm">Orders placed on this platform earn you points automatically.</p>
            </div>
            <a href="/menu" className="mt-8 w-full py-4 bg-[#7C1D35] text-[#F5F0E8] font-bold rounded-xl hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors text-center shadow-lg block">
              Earn More Points
            </a>
          </div>
        </div>

        {/* Redemption Table */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-8 text-center text-[#F5F0E8]">Redemption Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-[#2A1A1F] hover:border-[#C9A84C]/50 transition-colors rounded-2xl p-8 text-center group">
              <div className="w-16 h-16 bg-[#2A1A1F] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7C1D35] transition-colors">
                <Gift className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h4 className="font-bold text-2xl text-[#F5F0E8] mb-2">$10 Off</h4>
              <p className="text-gray-400 mb-6 text-sm">Your next dining experience</p>
              <div className="text-[#C9A84C] font-bold uppercase tracking-widest text-sm bg-[#0A0A0A] py-2 rounded-lg border border-[#2A1A1F]">100 Points</div>
            </div>
            
            <div className="bg-[#111111] border border-[#2A1A1F] hover:border-[#C9A84C]/50 transition-colors rounded-2xl p-8 text-center group relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"></div>
              <div className="w-16 h-16 bg-[#2A1A1F] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7C1D35] transition-colors">
                <Gift className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h4 className="font-bold text-2xl text-[#F5F0E8] mb-2">$25 Off</h4>
              <p className="text-gray-400 mb-6 text-sm">Your next dining experience</p>
              <div className="text-[#C9A84C] font-bold uppercase tracking-widest text-sm bg-[#0A0A0A] py-2 rounded-lg border border-[#2A1A1F]">250 Points</div>
            </div>
            
            <div className="bg-[#111111] border border-[#2A1A1F] hover:border-[#C9A84C]/50 transition-colors rounded-2xl p-8 text-center group relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#7C1D35] to-transparent"></div>
              <div className="w-16 h-16 bg-[#2A1A1F] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7C1D35] transition-colors">
                <Gift className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h4 className="font-bold text-2xl text-[#F5F0E8] mb-2">$60 Off</h4>
              <p className="text-gray-400 mb-6 text-sm">Premium tasting menu</p>
              <div className="text-[#C9A84C] font-bold uppercase tracking-widest text-sm bg-[#0A0A0A] py-2 rounded-lg border border-[#2A1A1F]">500 Points</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
