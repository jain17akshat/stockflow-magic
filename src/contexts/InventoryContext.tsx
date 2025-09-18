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
    if (saved) {
      return JSON.parse(saved);
    }
    // Placeholder data for demo purposes
    return [
      {
        id: 'demo-1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        category: 'Electronics',
        currentStock: 25,
        lowStockThreshold: 10,
        purchasePrice: 1500,
        sellingPrice: 2500,
        supplier: 'TechMart Electronics',
        lastUpdated: new Date()
      },
      {
        id: 'demo-2',
        name: 'USB-C Charging Cable',
        sku: 'UCC-002',
        category: 'Electronics',
        currentStock: 8,
        lowStockThreshold: 15,
        purchasePrice: 200,
        sellingPrice: 350,
        supplier: 'Cable World',
        lastUpdated: new Date()
      },
      {
        id: 'demo-3',
        name: 'Organic Green Tea',
        sku: 'OGT-003',
        category: 'Food & Beverages',
        currentStock: 50,
        lowStockThreshold: 20,
        purchasePrice: 150,
        sellingPrice: 250,
        supplier: 'Organic Supplies Ltd',
        lastUpdated: new Date()
      },
      {
        id: 'demo-4',
        name: 'Cotton T-Shirt',
        sku: 'CTS-004',
        category: 'Clothing',
        currentStock: 3,
        lowStockThreshold: 5,
        purchasePrice: 300,
        sellingPrice: 599,
        supplier: 'Fashion Hub',
        lastUpdated: new Date()
      }
    ];
  });
  
  const [transactions, setTransactions] = useState<StockTransaction[]>(() => {
    const saved = localStorage.getItem('inventory-transactions');
    if (saved) {
      return JSON.parse(saved).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
    }
    // Placeholder transactions for demo purposes
    return [
      {
        id: 'trans-1',
        date: new Date(Date.now() - 86400000), // Yesterday
        itemId: 'demo-1',
        itemName: 'Wireless Bluetooth Headphones',
        type: 'add',
        quantity: 30,
        unitPrice: 1500,
        totalPrice: 45000,
        supplier: 'TechMart Electronics'
      },
      {
        id: 'trans-2',
        date: new Date(Date.now() - 43200000), // 12 hours ago
        itemId: 'demo-1',
        itemName: 'Wireless Bluetooth Headphones',
        type: 'sell',
        quantity: 5,
        unitPrice: 2500,
        totalPrice: 12500,
        customer: 'John Doe'
      },
      {
        id: 'trans-3',
        date: new Date(),
        itemId: 'demo-2',
        itemName: 'USB-C Charging Cable',
        type: 'sell',
        quantity: 2,
        unitPrice: 350,
        totalPrice: 700,
        customer: 'Walk-in Customer'
      }
    ];
  });
  
  const [suppliers, setSuppliers] = useState<string[]>(() => {
    const saved = localStorage.getItem('inventory-suppliers');
    return saved ? JSON.parse(saved) : [
      'TechMart Electronics',
      'Cable World', 
      'Organic Supplies Ltd',
      'Fashion Hub',
      'Shree Ram Enterprises', 
      'Lakshmi Traders', 
      'Bharat Supply Co.'
    ];
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