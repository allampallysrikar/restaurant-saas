"use server";

// app/actions/hq.ts
// Enterprise Corporate Headquarters (HQ) Multi-Branch Telemetry & Scoping Engine

export interface BranchStatus {
  id: string;
  name: string;
  code: string;
  city: string;
  currency: string;
  currencySymbol: string;
  dailyRevenue: number;
  yesterdayRevenue: number;
  ordersToday: number;
  avgTicketSize: number;
  laborCostPct: number;
  foodCostPct: number;
  tableTurnRate: number; // turns per table per day
  activeTables: number;
  totalTables: number;
  status: "ONLINE" | "BUSY" | "OFFLINE" | "MAINTENANCE";
  managerOnDuty: string;
}

let branchStore: BranchStatus[] = [
  {
    id: "branch-1",
    name: "Downtown Flagship (NYC)",
    code: "NYC-01",
    city: "New York",
    currency: "USD",
    currencySymbol: "$",
    dailyRevenue: 14820.50,
    yesterdayRevenue: 13400.00,
    ordersToday: 184,
    avgTicketSize: 80.55,
    laborCostPct: 24.2,
    foodCostPct: 28.5,
    tableTurnRate: 2.8,
    activeTables: 18,
    totalTables: 20,
    status: "BUSY",
    managerOnDuty: "Victoria Sterling"
  },
  {
    id: "branch-2",
    name: "Beverly Hills Rooftop",
    code: "LAX-02",
    city: "Los Angeles",
    currency: "USD",
    currencySymbol: "$",
    dailyRevenue: 18940.00,
    yesterdayRevenue: 19200.00,
    ordersToday: 162,
    avgTicketSize: 116.91,
    laborCostPct: 26.1,
    foodCostPct: 27.8,
    tableTurnRate: 2.4,
    activeTables: 15,
    totalTables: 16,
    status: "BUSY",
    managerOnDuty: "Julian Vance"
  },
  {
    id: "branch-3",
    name: "Mayfair Private Dining",
    code: "LDN-03",
    city: "London",
    currency: "GBP",
    currencySymbol: "£",
    dailyRevenue: 12450.00, // in GBP, approx $16,000 USD
    yesterdayRevenue: 11800.00,
    ordersToday: 120,
    avgTicketSize: 103.75,
    laborCostPct: 28.0,
    foodCostPct: 29.2,
    tableTurnRate: 2.1,
    activeTables: 12,
    totalTables: 14,
    status: "ONLINE",
    managerOnDuty: "Lord Alistair Finch"
  },
  {
    id: "branch-4",
    name: "Ginza Sky Fine Dining",
    code: "TYO-04",
    city: "Tokyo",
    currency: "JPY",
    currencySymbol: "¥",
    dailyRevenue: 2450000, // in JPY, approx $16,300 USD
    yesterdayRevenue: 2300000,
    ordersToday: 140,
    avgTicketSize: 17500, // in JPY
    laborCostPct: 22.4,
    foodCostPct: 31.0, // higher premium seafood cost
    tableTurnRate: 2.5,
    activeTables: 10,
    totalTables: 12,
    status: "ONLINE",
    managerOnDuty: "Kenji Sato"
  },
  {
    id: "branch-5",
    name: "Dubai Marina Waterfront",
    code: "DXB-05",
    city: "Dubai",
    currency: "AED",
    currencySymbol: "AED ",
    dailyRevenue: 68400.00, // in AED, approx $18,600 USD
    yesterdayRevenue: 64000.00,
    ordersToday: 195,
    avgTicketSize: 350.76, // in AED
    laborCostPct: 19.5,
    foodCostPct: 26.4,
    tableTurnRate: 3.2,
    activeTables: 22,
    totalTables: 24,
    status: "BUSY",
    managerOnDuty: "Amira Al-Maktoum"
  }
];

// Active scoped branch ID for session (in-memory simulation)
let activeScopedBranchId: string = "branch-1";

export async function getHQBranches(): Promise<{ branches: BranchStatus[]; activeBranchId: string }> {
  return { branches: branchStore, activeBranchId: activeScopedBranchId };
}

export async function setActiveBranchScope(branchId: string): Promise<{ success: boolean; branch?: BranchStatus }> {
  const target = branchStore.find(b => b.id === branchId);
  if (!target) return { success: false };
  activeScopedBranchId = branchId;
  return { success: true, branch: target };
}

export async function getConsolidatedGlobalHQMetrics(): Promise<{
  totalNormalizedUSDRevenue: number;
  totalOrders: number;
  avgLaborPct: number;
  avgFoodCostPct: number;
  totalActiveTables: number;
  totalCapacityTables: number;
}> {
  // Normalize currencies to USD for consolidated HQ roll-up
  const exchangeRates: Record<string, number> = {
    USD: 1.0,
    GBP: 1.28,
    JPY: 0.0067,
    AED: 0.272
  };

  let totalNormalizedUSDRevenue = 0;
  let totalOrders = 0;
  let weightedLaborSum = 0;
  let weightedFoodSum = 0;
  let totalActiveTables = 0;
  let totalCapacityTables = 0;

  for (const b of branchStore) {
    const rate = exchangeRates[b.currency] || 1.0;
    const usdRev = b.dailyRevenue * rate;
    totalNormalizedUSDRevenue += usdRev;
    totalOrders += b.ordersToday;
    weightedLaborSum += b.laborCostPct * usdRev;
    weightedFoodSum += b.foodCostPct * usdRev;
    totalActiveTables += b.activeTables;
    totalCapacityTables += b.totalTables;
  }

  return {
    totalNormalizedUSDRevenue: Number(totalNormalizedUSDRevenue.toFixed(2)),
    totalOrders,
    avgLaborPct: Number((weightedLaborSum / totalNormalizedUSDRevenue).toFixed(1)),
    avgFoodCostPct: Number((weightedFoodSum / totalNormalizedUSDRevenue).toFixed(1)),
    totalActiveTables,
    totalCapacityTables
  };
}
