import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/contexts/InventoryContext';

const generateSKU = (name: string, category: string) => {
  const prefix = category.substring(0, 3).toUpperCase();
  const namePart = name.substring(0, 3).toUpperCase();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${namePart}-${random}`;
};

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem, suppliers, addSupplier } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    currentStock: 0,
    lowStockThreshold: 10,
    purchasePrice: 0,
    sellingPrice: 0,
    supplier: ''
  });
  const [newSupplier, setNewSupplier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.sku || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Add new supplier if provided
    if (newSupplier.trim()) {
      addSupplier(newSupplier.trim());
      formData.supplier = newSupplier.trim();
    }

    addItem(formData);
    
    toast({
      title: "Item Added",
      description: `${formData.name} has been added to inventory successfully`,
    });

    // Reset form
    setFormData({
      name: '',
      sku: '',
      category: '',
      currentStock: 0,
      lowStockThreshold: 10,
      purchasePrice: 0,
      sellingPrice: 0,
      supplier: ''
    });
    setNewSupplier('');
    
    navigate('/inventory');
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate SKU when both name and category are provided
    if ((field === 'name' || field === 'category') && formData.name && formData.category) {
      const name = field === 'name' ? value as string : formData.name;
      const category = field === 'category' ? value as string : formData.category;
      if (name && category) {
        const sku = generateSKU(name, category);
        setFormData(prev => ({ ...prev, sku }));
      }
    }
  };

  const categories = ['Grains', 'Oils', 'Sweeteners', 'Condiments', 'Spices', 'Lentils'];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Item</h1>
        <p className="text-gray-500">Add a new item to your inventory</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Enter SKU or auto-generate"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentStock">Initial Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                  placeholder="Initial stock quantity"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                  placeholder="Low stock alert threshold"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) => handleInputChange('supplier', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newSupplier">Add New Supplier (Optional)</Label>
              <Input
                id="newSupplier"
                value={newSupplier}
                onChange={(e) => setNewSupplier(e.target.value)}
                placeholder="Enter new supplier name"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Item
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/inventory')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddItem;