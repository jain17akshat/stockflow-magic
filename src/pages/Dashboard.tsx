import React from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/StatsCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  formatCurrency, 
  calculateInventoryValue,
  calculateTotalRevenue,
  calculateTotalExpenditure,
  calculateProfit,
  getLowStockItems
} from '@/utils/inventoryUtils';
import { useInventory } from '@/contexts/InventoryContext';

const Dashboard: React.FC = () => {
  const { items, transactions } = useInventory();
  
  // Calculate key metrics
  const inventoryValue = calculateInventoryValue(items);
  const monthlyRevenue = calculateTotalRevenue(transactions);
  const monthlyExpenditure = calculateTotalExpenditure(transactions);
  const profit = calculateProfit(monthlyRevenue, monthlyExpenditure);
  const lowStockItems = getLowStockItems(items);
  
  // ✅ Generate real-time monthly sales from transactions
  const monthlySalesMap = transactions.reduce((acc, tx) => {
    if (tx.type === 'sell') {
      const month = tx.date.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + tx.totalPrice;
    }
    return acc;
  }, {} as Record<string, number>);

  const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlySalesData = monthOrder
    .filter(m => monthlySalesMap[m])
    .map(m => ({ name: m, sales: monthlySalesMap[m] }));

  // Inventory by category from items
  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find(cat => cat.name === item.category);
    if (existing) {
      existing.value += item.currentStock;
    } else {
      acc.push({ name: item.category, value: item.currentStock });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to Aadish Trading Inventory System</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Inventory Value"
          value={formatCurrency(inventoryValue)}
          icon={<Package className="h-6 w-6 text-company-blue" />}
          trend="up"
          trendValue="8.2%"
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          icon={<DollarSign className="h-6 w-6 text-company-teal" />}
          trend="up"
          trendValue="12.5%"
        />
        <StatsCard
          title="Monthly Expenditure"
          value={formatCurrency(monthlyExpenditure)}
          icon={<ShoppingCart className="h-6 w-6 text-company-amber" />}
          trend="down"
          trendValue="3.1%"
        />
        <StatsCard
          title="Profit"
          value={formatCurrency(profit)}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
          trend="up"
          trendValue="24.3%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Sales']}
                  />
                  <Bar dataKey="sales" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory By Category */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{transaction.itemName}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span 
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          transaction.type === 'add' ? 'bg-green-500' : 'bg-amber-500'
                        }`} 
                      />
                      {transaction.type === 'add' ? 'Stock Added' : 'Stock Sold'} • {transaction.date.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.quantity} units</p>
                    <p className={`text-sm ${transaction.type === 'add' ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.type === 'add' ? '-' : '+'}{formatCurrency(transaction.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alerts</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No low stock items found!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">{item.currentStock} units left</p>
                      <p className="text-sm text-gray-500">Threshold: {item.lowStockThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
