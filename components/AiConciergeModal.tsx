"use client";

import React, { useState } from "react";
import { Sparkles, Wine, ShieldCheck, UtensilsCrossed, Send, X, Bot, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "USER" | "AI";
  text: string;
  recommendedDishes?: { name: string; price: number; tag: string }[];
}

export default function AiConciergeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "AI",
      text: "Good evening, and welcome to The Golden Fork! I am your AI Dining Concierge & Sommelier. How may I assist your culinary journey today?",
      recommendedDishes: [
        { name: "Wagyu Ribeye Steak A5", price: 74, tag: "Signature Main" },
        { name: "Barolo D.O.C.G. Red Wine", price: 28, tag: "Sommelier Pairing" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    { label: "🍷 Wine Pairing for Wagyu Ribeye", prompt: "What is the best wine pairing for the Wagyu Ribeye Steak?" },
    { label: "🥜 Nut & Dairy Allergy Safe Options", prompt: "Which dishes on the menu are 100% safe for nut and dairy allergies?" },
    { label: "✨ Chef's 4-Course Tasting Menu", prompt: "Can you curate a romantic 4-course tasting menu experience under $150 per person?" },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "USER",
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsThinking(true);

    // Grounded intelligent simulation response based on menu knowledge
    setTimeout(() => {
      let reply = "I would be delighted to recommend options suited to your palate from our Michelin-inspired menu.";
      let dishes: { name: string; price: number; tag: string }[] | undefined = undefined;

      const lower = query.toLowerCase();
      if (lower.includes("wine") || lower.includes("ribeye") || lower.includes("pairing")) {
        reply = "For the A5 Miyazaki Wagyu Ribeye, our head sommelier Elena Rostova recommends our 2018 Barolo D.O.C.G. The firm tannins and earthy acidity slice effortlessly through the rich marbling of the Wagyu, leaving a lingering, velvet finish on the palate.";
        dishes = [
          { name: "Barolo D.O.C.G. Red Wine (Glass)", price: 28, tag: "Best Pairing" },
          { name: "Wagyu Ribeye Steak A5", price: 74, tag: "Main Course" }
        ];
      } else if (lower.includes("allergy") || lower.includes("nut") || lower.includes("dairy") || lower.includes("gluten") || lower.includes("safe")) {
        reply = "Your safety is our absolute priority. Our kitchen utilizes strict allergen separation protocols. For a completely nut-free and dairy-free experience, our Pan-Seared Scottish King Salmon prepared with virgin olive oil and our Citrus Cured Hamachi Crudo are certified flawless choices.";
        dishes = [
          { name: "Pan-Seared Scottish King Salmon", price: 42, tag: "Nut & Dairy Free" },
          { name: "Citrus Cured Hamachi Crudo", price: 26, tag: "Gluten & Dairy Free" }
        ];
      } else if (lower.includes("tasting") || lower.includes("course") || lower.includes("romantic") || lower.includes("chef")) {
        reply = "Here is our curated 4-Course Royal Tasting Journey: begin with the Royal Caviar Tasting, transition to the Black Truffle Arancini, indulge in the Wagyu Striploin Main, and conclude with our Classic Mascarpone Tiramisu.";
        dishes = [
          { name: "Royal Caviar Tasting", price: 55, tag: "Course 1" },
          { name: "Black Truffle Arancini", price: 22, tag: "Course 2" },
          { name: "Wagyu Ribeye Steak A5", price: 74, tag: "Course 3" },
          { name: "Classic Tiramisu", price: 16, tag: "Course 4" }
        ];
      } else {
        reply = `To accompany "${query}", our culinary team highly recommends starting with our Black Truffle Arancini and pairing it with our house craft cocktails. Would you like me to add a recommendation directly to your table ticket?`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "AI",
          text: reply,
          recommendedDishes: dishes
        }
      ]);
      setIsThinking(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Action Button on Customer Menu / Table Portal */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-[#7C1D35] to-[#C9A84C] text-[#0A0A0A] font-black shadow-2xl hover:scale-105 transition flex items-center gap-2 border-2 border-white/20 group"
      >
        <Sparkles className="w-6 h-6 text-[#0A0A0A] animate-spin" style={{ animationDuration: "6s" }} />
        <span className="hidden sm:inline font-bold text-sm text-[#0A0A0A] pr-1">AI Sommelier Concierge</span>
      </button>

      {/* Concierge Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end bg-black/75 backdrop-blur-sm p-0 sm:p-6"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }}
              className="bg-[#111111] border-2 border-[#C9A84C] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md h-[80vh] sm:h-[680px] flex flex-col shadow-2xl overflow-hidden text-[#F5F0E8]"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-[#7C1D35] to-[#181818] border-b border-[#2A1A1F] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C9A84C] text-[#0A0A0A] rounded-xl font-bold">
                    <Wine className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      AI Sommelier & Allergy Concierge <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    </h3>
                    <p className="text-[10px] text-gray-300 font-mono">Grounded in Live Golden Fork Database</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-xl transition text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Prompts */}
              <div className="p-3 bg-[#0A0A0A] border-b border-[#2A1A1F] flex gap-2 overflow-x-auto scrollbar-hide">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp.prompt)}
                    className="px-3 py-1.5 rounded-xl bg-[#181818] border border-white/5 hover:border-[#C9A84C] text-[11px] font-bold text-gray-300 hover:text-white whitespace-nowrap transition flex items-center gap-1 flex-shrink-0"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "USER" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                        msg.sender === "USER"
                          ? "bg-[#7C1D35] text-white rounded-br-none font-medium"
                          : "bg-[#181818] border border-[#2A1A1F] text-[#F5F0E8] rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px] font-mono">
                        {msg.sender === "AI" ? <Bot className="w-3 h-3 text-[#C9A84C]" /> : null}
                        <span>{msg.sender === "AI" ? "AI Sommelier" : "You"}</span>
                      </div>
                      {msg.text}
                    </div>

                    {/* Recommended Dishes Card inside chat */}
                    {msg.recommendedDishes && msg.recommendedDishes.length > 0 && (
                      <div className="mt-2 w-full max-w-[88%] space-y-1.5">
                        {msg.recommendedDishes.map((dish, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#C9A84C]/40 flex justify-between items-center text-xs"
                          >
                            <div>
                              <span className="font-bold text-white block">{dish.name}</span>
                              <span className="text-[10px] text-[#C9A84C] font-mono">{dish.tag}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-emerald-400">${dish.price}</span>
                              <a
                                href="/menu"
                                className="px-2 py-1 rounded bg-[#C9A84C] text-[#0A0A0A] font-bold text-[10px] hover:bg-white transition"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 p-3 bg-[#181818] rounded-2xl w-max border border-[#2A1A1F]">
                    <Sparkles className="w-4 h-4 text-[#C9A84C] animate-spin" />
                    <span>Sommelier is analyzing menu pairings & dietary records...</span>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-[#181818] border-t border-[#2A1A1F] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask about wines, allergies, tasting menus..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-[#C9A84C] text-[#0A0A0A] hover:bg-white disabled:opacity-40 transition font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
