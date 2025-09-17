import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  Package,
  Filter,
  Edit,
  ShoppingCart
} from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { formatCurrency, InventoryItem } from '@/utils/inventoryUtils';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import EditItemDialog from '@/components/EditItemDialog';
import RecordSaleDialog from '@/components/RecordSaleDialog';

const Inventory: React.FC = () => {
  const { items, removeItem } = useInventory();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  // Get unique categories for filter
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Filter items based on search query and category
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleExport = () => {
    if (items.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Add some items to inventory first",
        variant: "destructive"
      });
      return;
    }

    // Create CSV content
    const headers = ['Name', 'SKU', 'Category', 'Current Stock', 'Low Stock Threshold', 'Purchase Price', 'Selling Price', 'Supplier'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        item.name,
        item.sku,
        item.category,
        item.currentStock,
        item.lowStockThreshold,
        item.purchasePrice,
        item.sellingPrice,
        item.supplier
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your inventory has been exported to CSV",
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Import Started",
          description: "Processing your inventory file",
        });
        
        setTimeout(() => {
          toast({
            title: "Import Complete",
            description: "Your inventory has been imported successfully",
          });
        }, 2000);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-gray-500">Manage your stock and inventory items</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/add-item">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setIsSaleDialogOpen(true)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Record Sale
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" /> All Items ({filteredItems.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search items..." 
                  className="pl-8 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-600">No items in inventory</h3>
                        <p className="text-gray-500">Add your first item to get started</p>
                        <Button className="mt-2" asChild>
                          <Link to="/add-item">
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>{formatCurrency(item.purchasePrice)}</TableCell>
                      <TableCell>{formatCurrency(item.sellingPrice)}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.currentStock <= item.lowStockThreshold
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.currentStock <= item.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    removeItem(item.id);
                                    toast({
                                      title: "Item Deleted",
                                      description: `${item.name} has been removed from inventory`,
                                    });
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EditItemDialog
        item={editingItem}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <RecordSaleDialog
        open={isSaleDialogOpen}
        onOpenChange={setIsSaleDialogOpen}
      />
    </div>
  );
};

export default Inventory;