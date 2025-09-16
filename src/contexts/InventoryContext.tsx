import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InventoryItem, StockTransaction, sampleInventoryItems, sampleTransactions } from '@/utils/inventoryUtils';

interface InventoryContextType {
  items: InventoryItem[];
  transactions: StockTransaction[];
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  addTransaction: (transaction: Omit<StockTransaction, 'id'>) => void;
  updateStock: (itemId: string, quantity: number, type: 'add' | 'sell', unitPrice?: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>(sampleInventoryItems);
  const [transactions, setTransactions] = useState<StockTransaction[]>(sampleTransactions);

  const addItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, lastUpdated: new Date() }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addTransaction = (transactionData: Omit<StockTransaction, 'id'>) => {
    const newTransaction: StockTransaction = {
      ...transactionData,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateStock = (itemId: string, quantity: number, type: 'add' | 'sell', unitPrice?: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Update item stock
    const stockChange = type === 'add' ? quantity : -quantity;
    updateItem(itemId, {
      currentStock: Math.max(0, item.currentStock + stockChange)
    });

    // Add transaction
    addTransaction({
      date: new Date(),
      itemId,
      itemName: item.name,
      type,
      quantity,
      unitPrice: unitPrice || (type === 'add' ? item.purchasePrice : item.sellingPrice),
      totalPrice: quantity * (unitPrice || (type === 'add' ? item.purchasePrice : item.sellingPrice)),
    });
  };

  const value: InventoryContextType = {
    items,
    transactions,
    addItem,
    updateItem,
    removeItem,
    addTransaction,
    updateStock,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};