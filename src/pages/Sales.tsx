import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  formatCurrency,
  StockTransaction
} from '@/utils/inventoryUtils';
import { useInventory } from '@/contexts/InventoryContext';
import { Download, ShoppingCart, DollarSign, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Sales: React.FC = () => {
  const { toast } = useToast();
  const { items, transactions } = useInventory();
  const currentDate = new Date();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  
  // ✅ Placeholder sales if no transactions exist
  const placeholderSales: StockTransaction[] = [
    {
      id: 't1',
      itemId: 'i1',
      itemName: 'Product A',
      type: 'sell',
      quantity: 10,
      unitPrice: 50,
      totalPrice: 500,
      customer: 'Customer 1',
      date: new Date('2025-04-15'),
    },
    {
      id: 't2',
      itemId: 'i2',
      itemName: 'Product B',
      type: 'sell',
      quantity: 5,
      unitPrice: 100,
      totalPrice: 500,
      customer: 'Customer 2',
      date: new Date('2025-05-02'),
    },
    {
      id: 't3',
      itemId: 'i1',
      itemName: 'Product A',
      type: 'sell',
      quantity: 8,
      unitPrice: 60,
      totalPrice: 480,
      customer: 'Customer 3',
      date: new Date('2025-05-21'),
    },
    {
      id: 't4',
      itemId: 'i3',
      itemName: 'Product C',
      type: 'sell',
      quantity: 3,
      unitPrice: 200,
      totalPrice: 600,
      customer: 'Customer 4',
      date: new Date('2025-06-10'),
    },
  ];

  const activeTransactions = transactions.length > 0 ? transactions : placeholderSales;
  
  // Filter sales transactions (only sell type)
  const salesTransactions = activeTransactions.filter(t => t.type === 'sell');
  
  // Filter by selected time period
  const filteredSales = salesTransactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    if (timeRange === 'all') return true;
    if (timeRange === 'month') {
      return transactionDate.getMonth() === parseInt(selectedMonth) && 
             transactionDate.getFullYear() === parseInt(selectedYear);
    }
    if (timeRange === 'year') {
      return transactionDate.getFullYear() === parseInt(selectedYear);
    }
    return true;
  });
  
  // Calculate total sales revenue
  const totalRevenue = filteredSales.reduce((total, sale) => total + sale.totalPrice, 0);
  
  // Calculate total units sold
  const totalUnitsSold = filteredSales.reduce((total, sale) => total + sale.quantity, 0);
  
  // Calculate average sales value
  const averageSaleValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;
  
  // Sales by category
  const salesByCategory: Record<string, number> = {};
  filteredSales.forEach(sale => {
    const item = items.find(i => i.id === sale.itemId);
    if (item) {
      if (!salesByCategory[item.category]) {
        salesByCategory[item.category] = 0;
      }
      salesByCategory[item.category] += sale.totalPrice;
    }
  });
  
  // Prepare chart data
  const categoryChartData = Object.entries(salesByCategory).map(([category, value]) => ({
    category,
    revenue: value
  }));
  
  // Prepare date-based sales data
  const salesByDate: Record<string, number> = {};
  filteredSales.forEach(sale => {
    const date = new Date(sale.date);
    const dateString = date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short'
    });
    if (!salesByDate[dateString]) {
      salesByDate[dateString] = 0;
    }
    salesByDate[dateString] += sale.totalPrice;
  });
  
  const dateChartData = Object.entries(salesByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  
  const handleExportSales = () => {
    toast({
      title: "Export Started",
      description: "Your sales data is being exported",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your sales data has been exported successfully",
      });
    }, 1500);
  };

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* --- the rest of your component stays the same --- */}
      {/* no other changes needed */}
    </div>
  );
};

export default Sales;
