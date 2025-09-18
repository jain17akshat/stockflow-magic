import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download, Filter, FileText, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/contexts/InventoryContext';
import { formatCurrency } from '@/utils/inventoryUtils';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports: React.FC = () => {
  const { toast } = useToast();
  const { items, transactions } = useInventory();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [reportType, setReportType] = useState<'overview' | 'transactions'>('overview');

  // Hardcoded transactions and report data
  const hardcodedTransactions = [
    {
      id: 'tx-1',
      date: new Date('2024-01-15'),
      itemName: 'Wireless Bluetooth Headphones',
      type: 'sell' as const,
      quantity: 2,
      unitPrice: 2500,
      totalPrice: 5000,
      customer: 'John Doe',
      category: 'Electronics'
    },
    {
      id: 'tx-2',
      date: new Date('2024-01-14'),
      itemName: 'USB-C Charging Cable',
      type: 'add' as const,
      quantity: 50,
      unitPrice: 200,
      totalPrice: 10000,
      supplier: 'Cable World',
      category: 'Electronics'
    },
    {
      id: 'tx-3',
      date: new Date('2024-01-13'),
      itemName: 'Organic Green Tea',
      type: 'sell' as const,
      quantity: 10,
      unitPrice: 250,
      totalPrice: 2500,
      customer: 'Walk-in Customer',
      category: 'Food & Beverages'
    },
    {
      id: 'tx-4',
      date: new Date('2024-01-12'),
      itemName: 'Cotton T-Shirt',
      type: 'add' as const,
      quantity: 20,
      unitPrice: 300,
      totalPrice: 6000,
      supplier: 'Fashion Hub',
      category: 'Clothing'
    }
  ];

  // Filter transactions by selected month and year
  const filteredTx = hardcodedTransactions.filter(t => {
    const d = new Date(t.date);
    return (
      d.getMonth() === parseInt(selectedMonth) &&
      d.getFullYear() === parseInt(selectedYear)
    );
  });

  // Calculate report metrics from hardcoded data
  const revenue = 17500; // Total sales revenue
  const expenditure = 16000; // Total purchase expenditure
  const profit = 1500; // Net profit
  const stockAdded = 70; // Total units added
  const stockSold = 12; // Total units sold
  const inventoryValue = 285000; // Current inventory value

  const stockMovementData = [
    { name: 'Stock Added', value: stockAdded },
    { name: 'Stock Sold', value: stockSold },
  ];

  const financialData = [
    { name: 'Revenue', value: revenue },
    { name: 'Expenditure', value: expenditure },
    { name: 'Profit', value: profit },
  ];

  // Category sales with hardcoded data
  const categorySalesData = [
    { name: 'Electronics', value: 15250 },
    { name: 'Food & Beverages', value: 2500 },
    { name: 'Clothing', value: 1797 }
  ];

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
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-500">View and analyze inventory and sales data</p>
        </div>
        <Button onClick={handleExportReport} className="gap-1">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Report Filters
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m,i)=><SelectItem key={i} value={i.toString()}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[2024,2025].map(y=><SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={reportType} onValueChange={(v:any)=>setReportType(v)}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {reportType === 'overview' ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Revenue', value: revenue, color: 'green' },
              { label: 'Expenditure', value: expenditure, color: 'red' },
              { label: 'Profit', value: profit, color: 'blue' },
              { label: 'Inventory Value', value: inventoryValue, color: 'amber' },
            ].map((d,idx)=>(
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">{d.label}</p>
                      <h3 className="text-2xl font-bold mt-1">{formatCurrency(d.value)}</h3>
                    </div>
                    <div className={`p-2 rounded-full bg-${d.color}-100`}>
                      <FileText className={`h-6 w-6 text-${d.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/>Stock Movement</CardTitle></CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockMovementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                      <Bar dataKey="value" fill="#1e3a8a" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/>Financial Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                      <Bar dataKey="value" fill="#0088FE" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5"/>Sales by Category</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categorySalesData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                      {categorySalesData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Pie>
                    <Legend /><Tooltip formatter={(v)=>[formatCurrency(v as number),'Sales']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader><CardTitle><FileText className="h-5 w-5"/> Transactions</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Party</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTx.length===0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-4">No data</TableCell></TableRow>
                  ) : filteredTx.map(t=>(
                     <TableRow key={t.id}>
                       <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                       <TableCell>{t.itemName}</TableCell>
                       <TableCell>
                         <span className={`px-2 py-1 rounded-full text-xs ${
                           t.type==='add'?'bg-green-100 text-green-800':'bg-amber-100 text-amber-800'
                         }`}>
                           {t.type==='add'?'Stock Added':'Stock Sold'}
                         </span>
                       </TableCell>
                       <TableCell className="text-right">{t.quantity}</TableCell>
                       <TableCell className="text-right">{formatCurrency(t.unitPrice)}</TableCell>
                       <TableCell className="text-right">{formatCurrency(t.totalPrice)}</TableCell>
                       <TableCell>{t.type==='add'?t.supplier:(t.customer || 'Walk-in Customer')}</TableCell>
                     </TableRow>
                  ))}
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
