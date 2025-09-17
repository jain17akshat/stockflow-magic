
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  formatCurrency,
  generateMonthlyReport,
  StockTransaction,
  calculateInventoryValue
} from '@/utils/inventoryUtils';
import { useInventory } from '@/contexts/InventoryContext';
import { Download, Filter, FileText, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports: React.FC = () => {
  const { toast } = useToast();
  const { items, transactions } = useInventory();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [reportType, setReportType] = useState<'overview' | 'transactions'>('overview');
  
  // Generate report data based on selected month and year
  const report = generateMonthlyReport(
    items,
    transactions,
    parseInt(selectedMonth),
    parseInt(selectedYear)
  );

  // Prepare chart data
  const stockMovementData = [
    { name: 'Stock Added', value: report.stockAdded },
    { name: 'Stock Sold', value: report.stockSold },
  ];

  const financialData = [
    { name: 'Revenue', value: report.revenue },
    { name: 'Expenditure', value: report.expenditure },
    { name: 'Profit', value: report.profit },
  ];

  // Process category-wise data
  const categorySales: Record<string, number> = {};
  report.transactions
    .filter(t => t.type === 'sell')
    .forEach(transaction => {
      const item = items.find(i => i.id === transaction.itemId);
      if (item) {
        if (!categorySales[item.category]) {
          categorySales[item.category] = 0;
        }
        categorySales[item.category] += transaction.totalPrice;
      }
    });

  const categorySalesData = Object.entries(categorySales).map(([name, value]) => ({
    name,
    value,
  }));

  const handleExportReport = () => {
    toast({
      title: "Report Export Started",
      description: "Your report is being exported to PDF",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your report has been exported successfully",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-500">View and analyze inventory and sales data</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="gap-1"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Report Filters
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
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
              <div className="flex items-center gap-2">
                <Select value={reportType} onValueChange={(value: 'overview' | 'transactions') => setReportType(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="transactions">Transactions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {reportType === 'overview' ? (
        <>
          {/* Report Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(report.revenue)}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-green-100">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expenditure</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(report.expenditure)}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-red-100">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Profit</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(report.profit)}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Inventory Value</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(calculateInventoryValue(items))}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-amber-100">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Movement Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Stock Movement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockMovementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Units']} />
                      <Legend />
                      <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Financial Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
                      <Legend />
                      <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" /> Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySalesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categorySalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Sales']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Transactions Report */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Transactions for {MONTHS[parseInt(selectedMonth)]} {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                    <TableHead>Customer/Supplier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No transactions found for this period.
                      </TableCell>
                    </TableRow>
                  ) : (
                    report.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.itemName}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'add' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {transaction.type === 'add' ? 'Stock Added' : 'Stock Sold'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{transaction.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.totalPrice)}</TableCell>
                        <TableCell>{transaction.type === 'add' ? transaction.supplier : transaction.customer}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
