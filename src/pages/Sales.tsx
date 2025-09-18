import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Download, Filter, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/contexts/InventoryContext';
import { formatCurrency } from '@/utils/inventoryUtils';
import RecordSaleDialog from '@/components/RecordSaleDialog';

const Sales: React.FC = () => {
  const { toast } = useToast();
  const { items, transactions } = useInventory();
  const now = new Date();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear().toString());
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  // --- Hardcoded grocery sales ---
  const hardcodedSales = [
    {
      id: 'sale-1',
      date: new Date('2024-01-15'),
      itemName: 'Basmati Rice (5kg)',
      customer: 'Ravi Kumar',
      quantity: 3,
      unitPrice: 600,
      totalPrice: 1800,
      category: 'Grains'
    },
    {
      id: 'sale-2',
      date: new Date('2024-01-14'),
      itemName: 'Sunflower Oil (1L)',
      customer: 'Anita Sharma',
      quantity: 6,
      unitPrice: 180,
      totalPrice: 1080,
      category: 'Oils'
    },
    {
      id: 'sale-3',
      date: new Date('2024-01-13'),
      itemName: 'Turmeric Powder (200g)',
      customer: 'Walk-in Customer',
      quantity: 10,
      unitPrice: 70,
      totalPrice: 700,
      category: 'Spices'
    },
    {
      id: 'sale-4',
      date: new Date('2024-01-12'),
      itemName: 'Wheat Flour (10kg)',
      customer: 'Meena Patel',
      quantity: 2,
      unitPrice: 450,
      totalPrice: 900,
      category: 'Grains'
    },
    {
      id: 'sale-5',
      date: new Date('2024-01-11'),
      itemName: 'Mustard Oil (1L)',
      customer: 'Arjun Singh',
      quantity: 4,
      unitPrice: 160,
      totalPrice: 640,
      category: 'Oils'
    },
    {
      id: 'sale-6',
      date: new Date('2024-01-10'),
      itemName: 'Red Chili Powder (100g)',
      customer: 'Ramesh Yadav',
      quantity: 8,
      unitPrice: 90,
      totalPrice: 720,
      category: 'Spices'
    },
    {
      id: 'sale-7',
      date: new Date('2024-01-09'),
      itemName: 'Raw Sugar (1kg)',
      customer: 'Walk-in Customer',
      quantity: 5,
      unitPrice: 55,
      totalPrice: 275,
      category: 'Staples'
    }
  ];

  const filteredSales = hardcodedSales.filter(s => {
    const d = new Date(s.date);
    if (timeRange === 'all') return true;
    if (timeRange === 'month')
      return d.getMonth() === parseInt(selectedMonth) && d.getFullYear() === parseInt(selectedYear);
    if (timeRange === 'year')
      return d.getFullYear() === parseInt(selectedYear);
    return true;
  });

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalUnitsSold = filteredSales.reduce((sum, s) => sum + s.quantity, 0);
  const avgSaleValue = filteredSales.length ? totalRevenue / filteredSales.length : 0;

  const salesByCategory: Record<string, number> = {};
  filteredSales.forEach(s => {
    salesByCategory[s.category] = (salesByCategory[s.category] || 0) + s.totalPrice;
  });

  const categoryChartData = Object.entries(salesByCategory)
    .map(([category, revenue]) => ({ category, revenue }));

  const salesByDate: Record<string, number> = {};
  filteredSales.forEach(s => {
    const dateStr = new Date(s.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    salesByDate[dateStr] = (salesByDate[dateStr] || 0) + s.totalPrice;
  });

  const dateChartData = Object.entries(salesByDate)
    .map(([date, revenue]) => ({ date, revenue }));

  const handleExport = () => {
    toast({ title: 'Exporting...', description: 'Sales data export started' });
    setTimeout(() => toast({ title: 'Export Complete', description: 'Sales data exported' }), 1500);
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    // --- JSX stays same as before ---
    // (filters, summary cards, charts, table, RecordSaleDialog)
    // -- keep your existing JSX here unchanged --
  );
};

export default Sales;
