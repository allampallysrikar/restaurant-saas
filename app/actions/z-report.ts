"use server";

// app/actions/z-report.ts
// Enterprise End-of-Day (Z-Report) Cash Drawer Reconciliation & Shift Closing Ledger

export interface ZReportLedger {
  reportNumber: string;
  closingDate: string;
  openedAt: string;
  closedAt?: string;
  branchName: string;
  terminalId: string;
  managerOnDuty: string;
  
  // Sales Breakdown
  grossSales: number;
  managerCompsAndVoids: number;
  netSales: number;
  taxCollected: number;
  grandTotalReceipts: number;

  // Tender / Settlement Breakdown
  cashTendered: number;
  creditCardTendered: {
    visa: number;
    mastercard: number;
    amex: number;
  };
  totalCardTendered: number;
  houseAccountCharges: number;

  // Liabilities & Labor
  tipPoolLiability: number;
  totalLaborHours: number;
  estimatedLaborCost: number;

  // Cash Drawer Audit
  openingDrawerFloat: number;
  expectedClosingCash: number;
  actualCountedCash: number;
  overShortAmount: number;
  status: "OPEN_SHIFT" | "LOCKED_CLOSED";
}

let activeZReportStore: ZReportLedger = {
  reportNumber: `Z-REPORT-${new Date().toISOString().split("T")[0]}-001`,
  closingDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  openedAt: new Date(Date.now() - 14 * 3600 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  branchName: "Downtown Flagship (NYC)",
  terminalId: "Terminal #1 (Master POS)",
  managerOnDuty: "Victoria Sterling",

  grossSales: 15120.00,
  managerCompsAndVoids: 300.00,
  netSales: 14820.00,
  taxCollected: 1185.60, // 8% tax
  grandTotalReceipts: 16005.60,

  cashTendered: 3240.50,
  creditCardTendered: {
    visa: 6850.10,
    mastercard: 4120.00,
    amex: 1545.00
  },
  totalCardTendered: 12515.10,
  houseAccountCharges: 250.00,

  tipPoolLiability: 520.00,
  totalLaborHours: 35.5,
  estimatedLaborCost: 820.00,

  openingDrawerFloat: 500.00,
  expectedClosingCash: 3740.50, // opening float + cashTendered
  actualCountedCash: 3753.00,
  overShortAmount: 12.50, // +$12.50 Over
  status: "OPEN_SHIFT"
};

export async function getLiveZReportData(): Promise<ZReportLedger> {
  return activeZReportStore;
}

export async function updateCashCountAudit(actualCounted: number): Promise<{ success: boolean; overShort: number; ledger: ZReportLedger }> {
  activeZReportStore.actualCountedCash = Number(actualCounted.toFixed(2));
  activeZReportStore.overShortAmount = Number((activeZReportStore.actualCountedCash - activeZReportStore.expectedClosingCash).toFixed(2));
  return { success: true, overShort: activeZReportStore.overShortAmount, ledger: activeZReportStore };
}

export async function commitAndLockZReport(): Promise<{ success: boolean; closedLedger: ZReportLedger }> {
  activeZReportStore.status = "LOCKED_CLOSED";
  activeZReportStore.closedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return { success: true, closedLedger: activeZReportStore };
}

export async function reopenShiftForNewDay(): Promise<{ success: boolean; newLedger: ZReportLedger }> {
  activeZReportStore = {
    ...activeZReportStore,
    reportNumber: `Z-REPORT-${new Date().toISOString().split("T")[0]}-${Math.floor(Math.random() * 899 + 100)}`,
    openedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    closedAt: undefined,
    status: "OPEN_SHIFT",
    grossSales: 0,
    managerCompsAndVoids: 0,
    netSales: 0,
    taxCollected: 0,
    grandTotalReceipts: 0,
    cashTendered: 0,
    totalCardTendered: 0,
    expectedClosingCash: activeZReportStore.openingDrawerFloat,
    actualCountedCash: activeZReportStore.openingDrawerFloat,
    overShortAmount: 0
  };
  return { success: true, newLedger: activeZReportStore };
}
