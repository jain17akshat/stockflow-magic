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

  // 💾 Hardcoded sales data for grocery-like items
  const hardcodedSales = [
    {
      id: 'sale-1',
      date: new Date('2025-09-12'),
      itemName: ':contentReference[oaicite:0]{index=0} Basmati Rice (5kg)',
      customer: 'Ramesh Kumar',
      quantity: 3,
      unitPrice: 550,
      totalPrice: 1650,
      category: 'Rice'
    },
    {
      id: 'sale-2',
      date: new Date('2025-09-11'),
      itemName: ':contentReference[oaicite:1]{index=1} Gold Oil (1L)',
      customer: 'Seema Patel',
      quantity: 6,
      unitPrice: 180,
      totalPrice: 1080,
      category: 'Oils'
    },
    {
      id: 'sale-3',
      date: new Date('2025-09-10'),
      itemName: ':contentReference[oaicite:2]{index=2} Garam Masala (100g)',
      customer: 'Walk-in Customer',
      quantity: 10,
      unitPrice: 85,
      totalPrice: 850,
      category: 'Spices'
    },
    {
      id: 'sale-4',
      date: new Date('2025-09-09'),
      itemName: ':contentReference[oaicite:3]{index=3} Brown Rice (1kg)',
      customer: 'Vikas Sharma',
      quantity: 4,
      unitPrice: 120,
      totalPrice: 480,
      category: 'Rice'
    },
    {
      id: 'sale-5',
      date: new Date('2025-09-08'),
      itemName: ':contentReference[oaicite:4]{index=4} Sunflower Oil (1L)',
      customer: 'Neha Singh',
      quantity: 5,
      unitPrice: 160,
      totalPrice: 800,
      category: 'Oils'
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
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-gray-500">Track and analyze your sales performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSaleDialogOpen(true)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Record Sale
          </Button>
          <Button className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4"/> Export Sales
          </Button>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5"/> Filters</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              {timeRange === 'month' && (
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Month" /></SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => <SelectItem key={i} value={i.toString()}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}

              {timeRange !== 'all' && (
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025].map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ===== Summary ===== */}
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
          <h3 className="text-2xl font-bold">{formatCurrency(avgSaleValue)}</h3>
        </CardContent></Card>
      </div>

      {/* ===== Charts ===== */}
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
                  <Tooltip formatter={v => [formatCurrency(v as number),'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{r:8}}/>
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
                  <Tooltip formatter={v => [formatCurrency(v as number),'Revenue']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== Table ===== */}
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
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">No sales found</TableCell>
                  </TableRow>
                 ) : filteredSales.map(s => (
                   <TableRow key={s.id}>
                     <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                     <TableCell>{s.itemName}</TableCell>
                     <TableCell>{s.customer || 'Walk-in Customer'}</TableCell>
                     <TableCell className="text-right">{s.quantity}</TableCell>
                     <TableCell className="text-right">{formatCurrency(s.unitPrice)}</TableCell>
                     <TableCell className="text-right">{formatCurrency(s.totalPrice)}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
         </CardContent>
       </Card>

       <RecordSaleDialog
         open={isSaleDialogOpen}
         onOpenChange={setIsSaleDialogOpen}
       />
     </div>
   );
 };

export default Sales;
