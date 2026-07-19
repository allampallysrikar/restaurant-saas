"use server";

// app/actions/inventory.ts
// Enterprise Recipe Bill of Materials (BOM) & Raw Ingredient Procurement Engine

export interface RawIngredient {
  id: string;
  name: string;
  unit: string; // kg, L, units, g
  currentStock: number;
  parLevel: number;
  unitCost: number; // cost per unit in USD
  vendor: string;
  category: "Meat & Poultry" | "Seafood" | "Produce" | "Dairy" | "Dry & Pantry" | "Beverages/Wine";
  lastRestocked: string;
}

export interface RecipeBOMItem {
  menuItemId: string;
  menuItemName: string;
  ingredients: {
    ingredientId: string;
    ingredientName: string;
    quantityUsed: number;
    unit: string;
  }[];
}

// In-memory enterprise inventory state with real luxury fine dining BOM ingredients
let ingredientsStore: RawIngredient[] = [
  { id: "ing-1", name: "A5 Miyazaki Wagyu Beef Striploin", unit: "kg", currentStock: 3.4, parLevel: 10.0, unitCost: 185.00, vendor: "Prime Purveyors Ltd", category: "Meat & Poultry", lastRestocked: "2026-07-17" },
  { id: "ing-2", name: "French Perigord Black Truffles", unit: "g", currentStock: 240, parLevel: 500, unitCost: 2.40, vendor: "Truffle Co France", category: "Produce", lastRestocked: "2026-07-18" },
  { id: "ing-3", name: "Royal Osetra Caviar (Tin)", unit: "g", currentStock: 350, parLevel: 400, unitCost: 3.10, vendor: "Petrossian Caviar", category: "Seafood", lastRestocked: "2026-07-16" },
  { id: "ing-4", name: "Carnaroli Risotto Rice", unit: "kg", currentStock: 18.5, parLevel: 15.0, unitCost: 8.50, vendor: "Italian Dry Goods", category: "Dry & Pantry", lastRestocked: "2026-07-14" },
  { id: "ing-5", name: "Scottish King Salmon Side", unit: "kg", currentStock: 6.2, parLevel: 8.0, unitCost: 38.00, vendor: "Oceanic Seafoods", category: "Seafood", lastRestocked: "2026-07-18" },
  { id: "ing-6", name: "Barolo D.O.C.G. Red Wine", unit: "L", currentStock: 9.0, parLevel: 12.0, unitCost: 65.00, vendor: "Piedmont Wine Imports", category: "Beverages/Wine", lastRestocked: "2026-07-15" },
  { id: "ing-7", name: "Normandy Grass-Fed Butter", unit: "kg", currentStock: 14.0, parLevel: 10.0, unitCost: 16.00, vendor: "Euro Dairy", category: "Dairy", lastRestocked: "2026-07-18" },
  { id: "ing-8", name: "Mascarpone Cheese", unit: "kg", currentStock: 4.8, parLevel: 6.0, unitCost: 19.50, vendor: "Euro Dairy", category: "Dairy", lastRestocked: "2026-07-17" },
];

let recipeBOMStore: RecipeBOMItem[] = [
  {
    menuItemId: "cm6t10001",
    menuItemName: "Wagyu Ribeye Steak A5",
    ingredients: [
      { ingredientId: "ing-1", ingredientName: "A5 Miyazaki Wagyu Beef Striploin", quantityUsed: 0.28, unit: "kg" },
      { ingredientId: "ing-2", ingredientName: "French Perigord Black Truffles", quantityUsed: 8, unit: "g" },
      { ingredientId: "ing-7", ingredientName: "Normandy Grass-Fed Butter", quantityUsed: 0.04, unit: "kg" }
    ]
  },
  {
    menuItemId: "cm6t10002",
    menuItemName: "Black Truffle Arancini",
    ingredients: [
      { ingredientId: "ing-4", ingredientName: "Carnaroli Risotto Rice", quantityUsed: 0.12, unit: "kg" },
      { ingredientId: "ing-2", ingredientName: "French Perigord Black Truffles", quantityUsed: 12, unit: "g" },
      { ingredientId: "ing-7", ingredientName: "Normandy Grass-Fed Butter", quantityUsed: 0.03, unit: "kg" }
    ]
  },
  {
    menuItemId: "cm6t10003",
    menuItemName: "Royal Caviar Tasting",
    ingredients: [
      { ingredientId: "ing-3", ingredientName: "Royal Osetra Caviar (Tin)", quantityUsed: 30, unit: "g" },
      { ingredientId: "ing-7", ingredientName: "Normandy Grass-Fed Butter", quantityUsed: 0.02, unit: "kg" }
    ]
  },
  {
    menuItemId: "cm6t10004",
    menuItemName: "Pan-Seared Scottish Salmon",
    ingredients: [
      { ingredientId: "ing-5", ingredientName: "Scottish King Salmon Side", quantityUsed: 0.22, unit: "kg" },
      { ingredientId: "ing-7", ingredientName: "Normandy Grass-Fed Butter", quantityUsed: 0.03, unit: "kg" }
    ]
  },
  {
    menuItemId: "cm6t10005",
    menuItemName: "Classic Tiramisu",
    ingredients: [
      { ingredientId: "ing-8", ingredientName: "Mascarpone Cheese", quantityUsed: 0.12, unit: "kg" }
    ]
  }
];

export async function getInventoryStatus(): Promise<RawIngredient[]> {
  return ingredientsStore;
}

export async function getRecipeBOMList(): Promise<RecipeBOMItem[]> {
  return recipeBOMStore;
}

export async function restockIngredient(id: string, addedAmount: number): Promise<{ success: boolean; newStock?: number }> {
  const item = ingredientsStore.find(i => i.id === id);
  if (!item) return { success: false };
  item.currentStock = Number((item.currentStock + addedAmount).toFixed(2));
  item.lastRestocked = new Date().toISOString().split("T")[0];
  return { success: true, newStock: item.currentStock };
}

export async function deductBOMForOrder(orderedItemNames: string[]): Promise<void> {
  for (const name of orderedItemNames) {
    const bom = recipeBOMStore.find(b => b.menuItemName.toLowerCase() === name.toLowerCase());
    if (bom) {
      for (const ing of bom.ingredients) {
        const target = ingredientsStore.find(i => i.id === ing.ingredientId);
        if (target) {
          target.currentStock = Math.max(0, Number((target.currentStock - ing.quantityUsed).toFixed(2)));
        }
      }
    }
  }
}
