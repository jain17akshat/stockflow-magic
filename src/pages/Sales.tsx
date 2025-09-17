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

// Format INR currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const Sales: React.FC = () => {
  const { toast } = useToast();
  const currentDate = new Date();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  // ✅ Placeholder inventory items
  const items = [
    { id: '1', name: 'Notebook', category: 'Stationery' },
    { id: '2', name: 'Ball Pen', category: 'Stationery' },
    { id: '3', name: 'Coffee Mug', category: 'Kitchen' },
    { id: '4', name: 'T-shirt', category: 'Clothing' }
  ];

  // ✅ Placeholder sales transactions
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

  const salesTransactions = transactions.filter(t => t.type === 'sell');

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

  const totalRevenue = filteredSales.reduce((total, sale) => total + sale.totalPrice, 0);
  const totalUnitsSold = filteredSales.reduce((total, sale) => total + sale.quantity, 0);
  const averageSaleValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  const salesByCategory: Record<string, number> = {};
  filteredSales.forEach(sale => {
    const item = items.find(i => i.id === sale.itemId);
    if (item) {
      if (!salesByCategory[item.category]) salesByCategory[item.category] = 0;
      salesByCategory[item.category] += sale.totalPrice;
    }
  });

  const categoryChartData = Object.entries(salesByCategory).map(([category, value]) => ({
    category, revenue: value
  }));

  const salesByDate: Record<string, number> = {};
  filteredSales.forEach(sale => {
    const date = new Date(sale.date);
    const dateString = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    if (!salesByDate[dateString]) salesByDate[dateString] = 0;
    salesByDate[dateString] += sale.totalPrice;
  });

  const dateChartData = Object.entries(salesByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleExportSales = () => {
    toast({ title: "Export Started", description: "Your sales data is being exported" });
    setTimeout(() => {
      toast({ title: "Export Complete", description: "Your sales data has been exported successfully" });
    }, 1500);
  };

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-gray-500">View and analyze your sales data</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-1" onClick={handleExportSales}>
            <Download className="h-4 w-4" /> Export Sales
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Sales Filters
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              {timeRange !== 'all' && (
                <>
                  {timeRange === 'month' && (
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month, index) => (
                          <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2023, 2024, 2025].map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
        </CardContent></Card>

        <Card><CardContent className="p-6">
          <p className="text-sm text-gray-500">Units Sold</p>
          <h3 className="text-2xl font-bold">{totalUnitsSold}</h3>
        </CardContent></Card>

        <Card><CardContent className="p-6">
          <p className="text-sm text-gray-500">Avg Sale Value</p>
          <h3 className="text-2xl font-bold">{formatCurrency(averageSaleValue)}</h3>
        </CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Sales Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dateChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(v) => [formatCurrency(v as number), 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(v) => [formatCurrency(v as number), 'Revenue']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Table */}
      <Card>
        <CardHeader><CardTitle>Recent Sales</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No sales found for this period.
                    </TableCell>
                  </TableRow>
                ) : filteredSales.map(sale => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date.toLocaleDateString()}</TableCell>
                    <TableCell>{sale.itemName}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell className="text-right">{sale.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Sales;
