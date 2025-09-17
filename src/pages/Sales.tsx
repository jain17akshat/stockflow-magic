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
import { Download, ShoppingCart, DollarSign, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Simple util to format currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const Sales: React.FC = () => {
  const { toast } = useToast();
  const currentDate = new Date();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  
  // ---------------------------
  // ✅ Placeholder Data
  // ---------------------------
  const items = [
    { id: '1', name: 'Notebook', category: 'Stationery' },
    { id: '2', name: 'Ball Pen', category: 'Stationery' },
    { id: '3', name: 'Coffee Mug', category: 'Kitchen' },
    { id: '4', name: 'T-shirt', category: 'Clothing' }
  ];

  const transactions = [
    {
      id: 't1',
      type: 'sell',
      date: new Date('2025-09-01'),
      itemId: '1',
      itemName: 'Notebook',
      quantity: 10,
      unitPrice: 50,
      totalPrice: 500,
      customer: 'Ravi'
    },
    {
      id: 't2',
      type: 'sell',
      date: new Date('2025-09-05'),
      itemId: '2',
      itemName: 'Ball Pen',
      quantity: 20,
      unitPrice: 10,
      totalPrice: 200,
      customer: 'Sneha'
    },
    {
      id: 't3',
      type: 'sell',
      date: new Date('2025-09-08'),
      itemId: '3',
      itemName: 'Coffee Mug',
      quantity: 5,
      unitPrice: 150,
      totalPrice: 750,
      customer: 'Walk-in Customer'
    },
    {
      id: 't4',
      type: 'sell',
      date: new Date('2025-09-10'),
      itemId: '4',
      itemName: 'T-shirt',
      quantity: 3,
      unitPrice: 400,
      totalPrice: 1200,
      customer: 'Amit'
    }
  ];

  // Filter sales transactions (only sell type)
  const salesTransactions = transactions.filter(t => t.type === 'sell');
  
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
      // Sort by date
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
      {/* same UI content as your original code */}
      {/* ... */}
    </div>
  );
};

export default Sales;
