
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
  sampleInventoryItems, 
  sampleTransactions, 
  formatCurrency,
  StockTransaction
} from '@/utils/inventoryUtils';
import { Download, ShoppingCart, DollarSign, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Sales: React.FC = () => {
  const { toast } = useToast();
  const currentDate = new Date();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  
  // Filter sales transactions (only sell type)
  const salesTransactions = sampleTransactions.filter(t => t.type === 'sell');
  
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
    const item = sampleInventoryItems.find(i => i.id === sale.itemId);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-gray-500">View and analyze your sales data</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="gap-1"
            onClick={handleExportSales}
          >
            <Download className="h-4 w-4" /> Export Sales
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Sales Filters
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
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
              </div>
              
              {timeRange !== 'all' && (
                <>
                  {timeRange === 'month' && (
                    <div className="flex items-center gap-2">
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2023, 2024, 2025].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</h3>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Units Sold</p>
                <h3 className="text-2xl font-bold mt-1">{totalUnitsSold}</h3>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Sale Value</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(averageSaleValue)}</h3>
              </div>
              <div className="p-2 rounded-full bg-amber-100">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dateChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Recent Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
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
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date.toLocaleDateString()}</TableCell>
                      <TableCell>{sale.itemName}</TableCell>
                      <TableCell>{sale.customer || 'Walk-in Customer'}</TableCell>
                      <TableCell className="text-right">{sale.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(sale.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(sale.totalPrice)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
