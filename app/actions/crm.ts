"use server";

// app/actions/crm.ts
// Enterprise VIP Customer Relationship Management (CRM) & Dietary Dossier Engine

export interface VIPGuestDossier {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tier: "ROYAL_PLATINUM" | "BLACK_DIAMOND" | "GOLD_AMBASSADOR" | "SILVER";
  lifetimeSpendUSD: number;
  totalVisits: number;
  lastVisited: string;
  favoriteTable: string;
  sommelierWinePreference: string;
  dietaryAllergyDossier: string;
  specialNotes: string;
  loyaltyPointsBalance: number;
  isSeatedRightNow: boolean;
  currentTableAssigned?: string;
}

let crmStore: VIPGuestDossier[] = [
  {
    id: "crm-1",
    fullName: "Marcus Aurelius Sterling",
    email: "marcus.aurelius@sterlingholdings.com",
    phone: "+1 (212) 555-0199",
    tier: "ROYAL_PLATINUM",
    lifetimeSpendUSD: 24850.00,
    totalVisits: 42,
    lastVisited: "2026-07-16",
    favoriteTable: "Table 4 (Floor-to-Ceiling Window View)",
    sommelierWinePreference: "2018 Barolo D.O.C.G. & Dom Pérignon Vintage 2012 Champagne",
    dietaryAllergyDossier: "CRITICAL: Severe Walnut & Pecan Allergy. Must use separate sauté pan.",
    specialNotes: "Celebrates annual wedding anniversary mid-July. Always present complimentary truffle amuse-bouche upon arrival.",
    loyaltyPointsBalance: 2480,
    isSeatedRightNow: true,
    currentTableAssigned: "Table 4"
  },
  {
    id: "crm-2",
    fullName: "Sophia Vance-Montgomery",
    email: "sophia.vance@vancemedia.io",
    phone: "+1 (310) 555-0842",
    tier: "BLACK_DIAMOND",
    lifetimeSpendUSD: 18400.00,
    totalVisits: 31,
    lastVisited: "2026-07-14",
    favoriteTable: "VIP Private Room 1",
    sommelierWinePreference: "Grand Cru Burgundy White & Franciacorta Brut",
    dietaryAllergyDossier: "Strict Pescatarian (No Poultry or Red Meat). Prefers Scottish King Salmon well-seared.",
    specialNotes: "Prefers quiet corner seating. Often hosts private celebrity investors.",
    loyaltyPointsBalance: 1840,
    isSeatedRightNow: false
  },
  {
    id: "crm-3",
    fullName: "Lord Henry Cavendish",
    email: "h.cavendish@mayfaircapital.co.uk",
    phone: "+44 20 7946 0911",
    tier: "ROYAL_PLATINUM",
    lifetimeSpendUSD: 36200.00,
    totalVisits: 58,
    lastVisited: "2026-07-18",
    favoriteTable: "Table 8 (Center Chandelier)",
    sommelierWinePreference: "Bordeaux First Growth (Château Margaux) & Royal Osetra Caviar pairing",
    dietaryAllergyDossier: "Mild Shellfish Sensitivity (Can eat Osetra caviar safely, avoid lobster/crab).",
    specialNotes: "Prefers head sommelier Elena Rostova to personally open all vintages table-side.",
    loyaltyPointsBalance: 3620,
    isSeatedRightNow: true,
    currentTableAssigned: "Table 8"
  },
  {
    id: "crm-4",
    fullName: "Elena Rostova (VIP Profile)",
    email: "elena.r@sommeliersociety.org",
    phone: "+1 (415) 555-0321",
    tier: "GOLD_AMBASSADOR",
    lifetimeSpendUSD: 8900.00,
    totalVisits: 19,
    lastVisited: "2026-07-10",
    favoriteTable: "Bar Seat 1",
    sommelierWinePreference: "Piedmont & Sancerre Whites",
    dietaryAllergyDossier: "No Allergies. Loves extra truffles.",
    specialNotes: "Master Sommelier guest judge. Always offer complimentary new wine flight tastings.",
    loyaltyPointsBalance: 890,
    isSeatedRightNow: false
  }
];

export async function getVIPGuestList(): Promise<VIPGuestDossier[]> {
  return crmStore;
}

export async function toggleGuestSeatedStatus(guestId: string, tableAssigned?: string): Promise<{ success: boolean; guest?: VIPGuestDossier }> {
  const target = crmStore.find(g => g.id === guestId);
  if (!target) return { success: false };

  target.isSeatedRightNow = !target.isSeatedRightNow;
  if (target.isSeatedRightNow) {
    target.currentTableAssigned = tableAssigned || target.favoriteTable.split(" ")[0] || "Table 1";
    target.totalVisits += 1;
    target.lastVisited = new Date().toISOString().split("T")[0];
  } else {
    delete target.currentTableAssigned;
  }

  return { success: true, guest: target };
}

export async function addLoyaltyPoints(guestId: string, points: number): Promise<{ success: boolean; newBalance?: number }> {
  const target = crmStore.find(g => g.id === guestId);
  if (!target) return { success: false };
  target.loyaltyPointsBalance += points;
  return { success: true, newBalance: target.loyaltyPointsBalance };
}
