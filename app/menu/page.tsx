"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/features/cart/store";
import { Plus, Search, Filter, X, Star, MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { getReviewsForMenuItem, createReview } from "@/app/actions/reviews";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableNum, setTableNum] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    import("@/app/actions/menu").then(m => m.getLiveMenu().then(data => {
      setMenuItems(data);
      setLoading(false);
    }));
    
    // Check for table in URL or localStorage
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table") || localStorage.getItem("golden_fork_table");
    if (t) setTableNum(t);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      getReviewsForMenuItem(selectedItem.id).then(setReviews);
    } else {
      document.body.style.overflow = "unset";
      setReviewFormOpen(false);
    }
  }, [selectedItem]);

  const handleReviewSubmit = async () => {
    if (!newName || !newComment) return;
    setSubmittingReview(true);
    const res = await createReview(selectedItem.id, newRating, newComment, newName);
    setSubmittingReview(false);
    if (res.success) {
      setReviewFormOpen(false);
      setNewName("");
      setNewComment("");
      setNewRating(5);
      // Refresh reviews
      getReviewsForMenuItem(selectedItem.id).then(setReviews);
    }
  };

  const MOCK_CATEGORIES = ["All", ...Array.from(new Set(menuItems.map(i => i.category?.name || "General")))];

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || (item.category?.name || "General") === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0A0A0A] text-[#F5F0E8] min-h-screen pb-24 relative overflow-hidden">
      {/* Subtle background image/pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }}></div>
      
      <div className="container mx-auto px-6 pt-32 pb-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Our <span className="underline decoration-[#C9A84C] decoration-4 underline-offset-8">Menu</span>
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">Carefully curated dishes from our award-winning culinary team, prepared with the finest seasonal ingredients.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#2A1A1F] rounded-full focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm transition-all text-[#F5F0E8] placeholder-gray-500 shadow-inner"
              />
            </div>
            <button 
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="flex items-center justify-center px-6 py-3 bg-[#111111] border border-[#2A1A1F] rounded-full hover:border-[#C9A84C] transition-colors text-sm text-[#C9A84C]"
            >
              <Filter className="w-4 h-4 mr-2" /> Reset
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-6 mb-8 space-x-3 scrollbar-hide">
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border tracking-wide ${
                activeCategory === cat 
                  ? "bg-[#7C1D35] text-[#C9A84C] border-[#7C1D35] shadow-lg shadow-[#7C1D35]/20" 
                  : "bg-[#111111] text-gray-400 border-[#2A1A1F] hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#111111] border border-[#2A1A1F] overflow-hidden animate-pulse">
                <div className="h-56 bg-white/5"></div>
                <div className="p-6">
                  <div className="h-3 w-1/4 bg-white/10 rounded mb-4"></div>
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 w-full bg-white/5 rounded mb-1"></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded mt-4"></div>
                  <div className="h-12 w-full bg-white/10 rounded-xl mt-6"></div>
                </div>
              </div>
            ))
          ) : filteredMenu.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={item.id} 
              layoutId={`card-${item.id}`}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111111] border border-[#2A1A1F] hover:border-[#C9A84C]/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <motion.img layoutId={`image-${item.id}`} src={item.image || "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80"} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 px-4 py-1.5 bg-[#C9A84C] rounded-full text-xs font-bold text-[#0A0A0A] shadow-lg">
                    ${Number(item.price).toFixed(2)}
                  </div>
                </div>
                <div className="p-6 pb-2 relative z-10 -mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest drop-shadow-md">{item.category?.name || "General"}</div>
                    <div className="flex items-center text-[#C9A84C] text-xs font-bold bg-[#111111] px-2 py-1 rounded-md border border-[#2A1A1F]">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      4.8 (24)
                    </div>
                  </div>
                  <motion.h3 layoutId={`title-${item.id}`} className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-3 text-[#F5F0E8] leading-tight group-hover:text-[#C9A84C] transition-colors">{item.name}</motion.h3>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
              <div className="p-6 pt-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: Number(item.price),
                      image: item.image
                    });
                  }}
                  className="w-full py-3.5 bg-white/5 border border-[#2A1A1F] group-hover:bg-[#7C1D35] group-hover:border-[#7C1D35] text-[#F5F0E8] rounded-xl font-medium transition-all flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {!loading && filteredMenu.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#111111] border border-[#2A1A1F] flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#C9A84C] mb-2">No dishes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </motion.div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <React.Fragment>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
              />
              <motion.div
                layoutId={`card-${selectedItem.id}`}
                className="fixed inset-x-4 md:inset-x-auto md:w-full md:max-w-4xl md:h-[650px] top-1/2 -translate-y-1/2 bg-[#111111] border border-[#2A1A1F] rounded-3xl overflow-hidden z-50 flex flex-col md:flex-row mx-auto shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2.5 bg-[#7C1D35] text-[#F5F0E8] rounded-full hover:bg-white hover:text-[#7C1D35] transition-colors z-10 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="w-full md:w-1/2 h-64 md:h-full relative">
                  <motion.img 
                    layoutId={`image-${selectedItem.id}`} 
                    src={selectedItem.image || "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80"} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111] hidden md:block"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent md:hidden"></div>
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs text-[#C9A84C] font-bold uppercase tracking-widest">{selectedItem.category?.name || "General"}</div>
                      {tableNum && <div className="text-xs text-[#C9A84C] bg-[#7C1D35]/20 px-3 py-1 rounded-full border border-[#7C1D35]/50">Ordering for Table #{tableNum}</div>}
                    </div>
                    <motion.h3 layoutId={`title-${selectedItem.id}`} className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold mb-6 text-[#F5F0E8] leading-tight">
                      {selectedItem.name}
                    </motion.h3>
                    <p className="font-[family-name:var(--font-playfair)] text-3xl italic text-[#C9A84C] mb-8">
                      ${Number(selectedItem.price).toFixed(2)}
                    </p>
                    <div className="h-px w-full bg-gradient-to-r from-[#2A1A1F] via-[#2A1A1F] to-transparent mb-8" />
                    <div className="max-h-64 overflow-y-auto pr-4 scrollbar-hide">
                      <p className="text-gray-400 text-base leading-relaxed mb-8">
                        {selectedItem.description}
                      </p>
                      
                      {/* Reviews Section */}
                      <div className="mt-8 border-t border-[#2A1A1F] pt-6">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="font-[family-name:var(--font-playfair)] text-2xl text-[#F5F0E8]">Customer Reviews</h4>
                          <button onClick={() => setReviewFormOpen(!reviewFormOpen)} className="text-sm text-[#C9A84C] hover:text-[#F5F0E8] transition flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" /> Leave a Review
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {reviewFormOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
                              <div className="bg-black/50 border border-[#2A1A1F] rounded-xl p-4">
                                <div className="flex mb-4 gap-1">
                                  {[1,2,3,4,5].map(star => (
                                    <Star key={star} onClick={() => setNewRating(star)} className={`w-6 h-6 cursor-pointer ${star <= newRating ? "text-[#C9A84C] fill-current" : "text-gray-600"}`} />
                                  ))}
                                </div>
                                <input type="text" placeholder="Your Name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black/50 border border-[#2A1A1F] rounded-lg px-4 py-2 mb-4 text-[#F5F0E8] focus:border-[#C9A84C] outline-none" />
                                <textarea placeholder="Share your thoughts on this dish..." value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full bg-black/50 border border-[#2A1A1F] rounded-lg px-4 py-2 mb-4 text-[#F5F0E8] focus:border-[#C9A84C] outline-none resize-none" rows={3} />
                                <button onClick={handleReviewSubmit} disabled={submittingReview} className="w-full py-2 bg-[#C9A84C] text-[#0A0A0A] font-bold rounded-lg hover:bg-white transition flex justify-center items-center">
                                  {submittingReview ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Review</>}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-4">
                          {reviews.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No reviews yet. Be the first!</p>
                          ) : (
                            reviews.map((rev, i) => (
                              <div key={i} className="bg-white/5 border border-[#2A1A1F] rounded-lg p-4">
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? "text-[#C9A84C] fill-current" : "text-gray-600"}`} />
                                  ))}
                                </div>
                                <p className="text-gray-300 text-sm mb-1">{rev.comment.replace(/\[Item: .*?\] \[User: (.*?)\] (.*)/, (match: string, p1: string, p2: string) => `"${p2}" - ${p1}`)}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      addItem({
                        id: selectedItem.id,
                        name: selectedItem.name,
                        price: Number(selectedItem.price),
                        image: selectedItem.image
                      });
                      setSelectedItem(null);
                    }}
                    className="w-full py-5 bg-[#7C1D35] text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] rounded-xl font-bold transition-colors flex items-center justify-center text-lg shadow-lg shadow-[#7C1D35]/20"
                  >
                    <Plus className="w-6 h-6 mr-2" /> Add to Order
                  </button>
                </div>
              </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
