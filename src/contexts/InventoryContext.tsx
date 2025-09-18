import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { InventoryItem, StockTransaction } from '@/utils/inventoryUtils';

interface InventoryContextType {
  items: InventoryItem[];
  transactions: StockTransaction[];
  suppliers: string[];
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  addTransaction: (transaction: Omit<StockTransaction, 'id'>) => void;
  updateStock: (itemId: string, quantity: number, type: 'add' | 'sell', unitPrice?: number, customer?: string) => void;
  addSupplier: (supplier: string) => void;
  recordSale: (itemId: string, quantity: number, unitPrice: number, customer?: string) => void;
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
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventory-items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [transactions, setTransactions] = useState<StockTransaction[]>(() => {
    const saved = localStorage.getItem('inventory-transactions');
    return saved ? JSON.parse(saved).map((t: any) => ({
      ...t,
      date: new Date(t.date)
    })) : [];
  });
  
  const [suppliers, setSuppliers] = useState<string[]>(() => {
    const saved = localStorage.getItem('inventory-suppliers');
    return saved ? JSON.parse(saved) : ['Shree Ram Enterprises', 'Lakshmi Traders', 'Bharat Supply Co.'];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('inventory-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('inventory-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('inventory-suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

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

  const updateStock = (itemId: string, quantity: number, type: 'add' | 'sell', unitPrice?: number, customer?: string) => {
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
      ...(type === 'add' ? { supplier: item.supplier } : { customer: customer || 'Walk-in Customer' }),
    });
  };

  const addSupplier = (supplier: string) => {
    if (!suppliers.includes(supplier)) {
      setSuppliers(prev => [...prev, supplier]);
    }
  };

  const recordSale = (itemId: string, quantity: number, unitPrice: number, customer?: string) => {
    updateStock(itemId, quantity, 'sell', unitPrice, customer);
  };

  const value: InventoryContextType = {
    items,
    transactions,
    suppliers,
    addItem,
    updateItem,
    removeItem,
    addTransaction,
    updateStock,
    addSupplier,
    recordSale,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};