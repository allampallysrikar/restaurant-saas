"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface TableServiceCall {
  id: string;
  tableId: string;
  requestType: "CALL_WAITER" | "REFILL_WATER" | "REQUEST_BILL" | "CALL_MANAGER";
  status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED";
  createdAt: Date;
}

// In-memory global store fallback for high-speed live server requests if table session schema isn't yet migrated
let activeServiceCalls: TableServiceCall[] = [
  {
    id: "call-demo-1",
    tableId: "Table 4",
    requestType: "CALL_WAITER",
    status: "PENDING",
    createdAt: new Date(Date.now() - 3 * 60000)
  },
  {
    id: "call-demo-2",
    tableId: "VIP Room 1",
    requestType: "REQUEST_BILL",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1 * 60000)
  }
];

export async function requestTableService(tableId: string, requestType: TableServiceCall["requestType"]) {
  const newCall: TableServiceCall = {
    id: `call-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tableId: tableId.startsWith("Table") || tableId.toLowerCase().includes("vip") || tableId.startsWith("Bar") ? tableId : `Table ${tableId}`,
    requestType,
    status: "PENDING",
    createdAt: new Date()
  };

  // Prepend to active calls
  activeServiceCalls = [newCall, ...activeServiceCalls];

  revalidatePath("/admin/pos");
  revalidatePath("/admin/qr");
  revalidatePath(`/table/${tableId}`);
  revalidatePath("/menu");

  return { success: true, callId: newCall.id };
}

export async function getLiveServiceCalls() {
  // Return only non-resolved calls or recent ones
  const active = activeServiceCalls.filter(c => c.status !== "RESOLVED");
  return active;
}

export async function acknowledgeServiceCall(callId: string) {
  activeServiceCalls = activeServiceCalls.map(c => 
    c.id === callId ? { ...c, status: "ACKNOWLEDGED" } : c
  );
  revalidatePath("/admin/pos");
  revalidatePath("/admin/qr");
  return { success: true };
}

export async function resolveServiceCall(callId: string) {
  activeServiceCalls = activeServiceCalls.map(c => 
    c.id === callId ? { ...c, status: "RESOLVED" } : c
  );
  revalidatePath("/admin/pos");
  revalidatePath("/admin/qr");
  return { success: true };
}
