"use client";

// lib/offline-sync.ts
// Enterprise Offline-First IndexedDB/localStorage Sync Engine for POS & Table Service

export interface OfflineOrderPayload {
  localId: string;
  items: { id: string; quantity: number; price: number; name?: string }[];
  total: number;
  deliveryAdd?: string; // table note
  createdAt: string;
  status: "QUEUED" | "SYNCING" | "SYNCED" | "FAILED";
}

const STORAGE_KEY = "golden_fork_offline_queue_v1";

export function getOfflineOrders(): OfflineOrderPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse offline orders queue:", e);
    return [];
  }
}

export function saveOfflineOrder(order: Omit<OfflineOrderPayload, "localId" | "status" | "createdAt">): OfflineOrderPayload {
  const current = getOfflineOrders();
  const newOrder: OfflineOrderPayload = {
    ...order,
    localId: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: "QUEUED"
  };
  
  const updated = [newOrder, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // Dispatch custom event so UI indicators immediately refresh
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("golden_fork_offline_change", { detail: updated }));
  }
  return newOrder;
}

export function removeOfflineOrder(localId: string) {
  const current = getOfflineOrders();
  const updated = current.filter(o => o.localId !== localId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("golden_fork_offline_change", { detail: updated }));
  }
}

export function clearSyncedOfflineOrders() {
  const current = getOfflineOrders();
  const updated = current.filter(o => o.status !== "SYNCED");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("golden_fork_offline_change", { detail: updated }));
  }
}

export async function syncAllOfflineOrders(createOrderAction: (items: any[], total: number, deliveryAdd?: string) => Promise<any>): Promise<{ synced: number; failed: number }> {
  const current = getOfflineOrders();
  const queued = current.filter(o => o.status === "QUEUED" || o.status === "FAILED");
  if (queued.length === 0) return { synced: 0, failed: 0 };

  let syncedCount = 0;
  let failedCount = 0;

  for (const order of queued) {
    try {
      // Mark syncing
      const updatedList = getOfflineOrders().map(o => o.localId === order.localId ? { ...o, status: "SYNCING" as const } : o);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent("golden_fork_offline_change", { detail: updatedList }));

      const res = await createOrderAction(order.items, order.total, order.deliveryAdd);
      if (res && res.success) {
        removeOfflineOrder(order.localId);
        syncedCount++;
      } else {
        const failedList = getOfflineOrders().map(o => o.localId === order.localId ? { ...o, status: "FAILED" as const } : o);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(failedList));
        window.dispatchEvent(new CustomEvent("golden_fork_offline_change", { detail: failedList }));
        failedCount++;
      }
    } catch (err) {
      console.error("Offline sync failed for order:", order.localId, err);
      const failedList = getOfflineOrders().map(o => o.localId === order.localId ? { ...o, status: "FAILED" as const } : o);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(failedList));
      window.dispatchEvent(new CustomEvent("golden_fork_offline_change", { detail: failedList }));
      failedCount++;
    }
  }

  return { synced: syncedCount, failed: failedCount };
}
