// Mock Petpooja POS Service
// In a real scenario, this would communicate via REST with Petpooja APIs

export const syncMenuFromPOS = async () => {
  console.log("Syncing menu from Petpooja POS...");
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 1000));
  
  return {
    success: true,
    itemsSynced: 42,
    message: "Menu synced successfully with POS",
  };
};

export const pushOrderToPOS = async (orderId: string, items: any[]) => {
  console.log(`Pushing Order ${orderId} to Petpooja POS...`);
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 1500));
  
  return {
    success: true,
    posOrderId: `POS-${Math.floor(Math.random() * 10000)}`,
    status: "Accepted by Restaurant",
  };
};
