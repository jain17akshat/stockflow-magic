
// Represents an inventory item
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  lastUpdated: Date;
}

// Represents a stock transaction (add or sell)
export interface StockTransaction {
  id: string;
  date: Date;
  itemId: string;
  itemName: string;
  type: 'add' | 'sell';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier?: string;
  customer?: string;
}

// Calculate total inventory value
export const calculateInventoryValue = (items: InventoryItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.currentStock * item.purchasePrice);
  }, 0);
};

// Calculate total revenue from sales
export const calculateTotalRevenue = (transactions: StockTransaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'sell')
    .reduce((total, transaction) => {
      return total + transaction.totalPrice;
    }, 0);
};

// Calculate total expenditure from purchases
export const calculateTotalExpenditure = (transactions: StockTransaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'add')
    .reduce((total, transaction) => {
      return total + transaction.totalPrice;
    }, 0);
};

// Calculate profit
export const calculateProfit = (revenue: number, expenditure: number): number => {
  return revenue - expenditure;
};

// Identify low stock items
export const getLowStockItems = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter(item => item.currentStock <= item.lowStockThreshold);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Generate monthly report data
export const generateMonthlyReport = (
  items: InventoryItem[],
  transactions: StockTransaction[],
  month: number,
  year: number
) => {
  // Filter transactions for the specified month
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
  });

  // Calculate metrics
  const stockAdded = monthlyTransactions
    .filter(t => t.type === 'add')
    .reduce((total, t) => total + t.quantity, 0);

  const stockSold = monthlyTransactions
    .filter(t => t.type === 'sell')
    .reduce((total, t) => total + t.quantity, 0);

  const expenditure = calculateTotalExpenditure(monthlyTransactions);
  const revenue = calculateTotalRevenue(monthlyTransactions);
  const profit = calculateProfit(revenue, expenditure);

  return {
    month,
    year,
    stockAdded,
    stockSold,
    expenditure,
    revenue,
    profit,
    transactions: monthlyTransactions
  };
};

// Sample data for development
export const sampleInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Rice',
    sku: 'RICE001',
    category: 'Grains',
    currentStock: 250,
    lowStockThreshold: 50,
    purchasePrice: 2500,
    sellingPrice: 3200,
    supplier: 'Farm Fresh Supplies',
    lastUpdated: new Date('2023-09-15')
  },
  {
    id: '2',
    name: 'Wheat Flour',
    sku: 'WHEAT001',
    category: 'Grains',
    currentStock: 180,
    lowStockThreshold: 40,
    purchasePrice: 1800,
    sellingPrice: 2400,
    supplier: 'Organic Mills',
    lastUpdated: new Date('2023-09-12')
  },
  {
    id: '3',
    name: 'Sugar',
    sku: 'SUGAR001',
    category: 'Sweeteners',
    currentStock: 120,
    lowStockThreshold: 30,
    purchasePrice: 3000,
    sellingPrice: 3800,
    supplier: 'Sweet Industries',
    lastUpdated: new Date('2023-09-10')
  },
  {
    id: '4',
    name: 'Cooking Oil',
    sku: 'OIL001',
    category: 'Oils',
    currentStock: 28,
    lowStockThreshold: 30,
    purchasePrice: 9500,
    sellingPrice: 12000,
    supplier: 'Pure Oils Ltd',
    lastUpdated: new Date('2023-09-05')
  },
  {
    id: '5',
    name: 'Salt',
    sku: 'SALT001',
    category: 'Condiments',
    currentStock: 200,
    lowStockThreshold: 50,
    purchasePrice: 800,
    sellingPrice: 1200,
    supplier: 'Salt Factory',
    lastUpdated: new Date('2023-09-08')
  },
];

export const sampleTransactions: StockTransaction[] = [
  {
    id: '1',
    date: new Date('2023-09-01'),
    itemId: '1',
    itemName: 'Premium Rice',
    type: 'add',
    quantity: 100,
    unitPrice: 2500,
    totalPrice: 250000,
    supplier: 'Farm Fresh Supplies',
  },
  {
    id: '2',
    date: new Date('2023-09-02'),
    itemId: '2',
    itemName: 'Wheat Flour',
    type: 'add',
    quantity: 80,
    unitPrice: 1800,
    totalPrice: 144000,
    supplier: 'Organic Mills',
  },
  {
    id: '3',
    date: new Date('2023-09-05'),
    itemId: '1',
    itemName: 'Premium Rice',
    type: 'sell',
    quantity: 30,
    unitPrice: 3200,
    totalPrice: 96000,
    customer: 'Restaurant ABC',
  },
  {
    id: '4',
    date: new Date('2023-09-07'),
    itemId: '2',
    itemName: 'Wheat Flour',
    type: 'sell',
    quantity: 20,
    unitPrice: 2400,
    totalPrice: 48000,
    customer: 'Bakery XYZ',
  },
  {
    id: '5',
    date: new Date('2023-09-10'),
    itemId: '3',
    itemName: 'Sugar',
    type: 'add',
    quantity: 120,
    unitPrice: 3000,
    totalPrice: 360000,
    supplier: 'Sweet Industries',
  },
  {
    id: '6',
    date: new Date('2023-09-12'),
    itemId: '4',
    itemName: 'Cooking Oil',
    type: 'add',
    quantity: 50,
    unitPrice: 9500,
    totalPrice: 475000,
    supplier: 'Pure Oils Ltd',
  },
  {
    id: '7',
    date: new Date('2023-09-15'),
    itemId: '3',
    itemName: 'Sugar',
    type: 'sell',
    quantity: 40,
    unitPrice: 3800,
    totalPrice: 152000,
    customer: 'Sweet Shop',
  },
  {
    id: '8',
    date: new Date('2023-09-18'),
    itemId: '4',
    itemName: 'Cooking Oil',
    type: 'sell',
    quantity: 22,
    unitPrice: 12000,
    totalPrice: 264000,
    customer: 'Restaurant DEF',
  },
];
