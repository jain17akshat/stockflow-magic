
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
  const { addItem } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: '',
    purchasePrice: '',
    sellingPrice: '',
    supplier: '',
    lowStockThreshold: '10',
    sku: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Auto-generate SKU when both name and category are provided
    if (name === 'category' && formData.name) {
      const sku = generateSKU(formData.name, value);
      setFormData(prev => ({ ...prev, sku }));
    } else if (name === 'name' && formData.category) {
      const sku = generateSKU(value, formData.category);
      setFormData(prev => ({ ...prev, sku }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.category || !formData.currentStock || 
        !formData.purchasePrice || !formData.sellingPrice || !formData.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Add the item to inventory
    addItem({
      name: formData.name,
      sku: formData.sku || generateSKU(formData.name, formData.category),
      category: formData.category,
      currentStock: parseInt(formData.currentStock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      supplier: formData.supplier,
    });
    
    // Show success message
    toast({
      title: "Item Added",
      description: `Successfully added ${formData.name} to inventory.`,
    });
    
    // Navigate back to inventory page
    navigate('/inventory');
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name*</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Beverage">Beverage</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Home Goods">Home Goods</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Auto-generated)</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentStock">Initial Stock*</Label>
                <Input
                  id="currentStock"
                  name="currentStock"
                  type="number"
                  placeholder="Enter initial stock quantity"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price*</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  placeholder="Enter cost price per unit"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price*</Label>
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  placeholder="Enter selling price per unit"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier*</Label>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) => handleSelectChange('supplier', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Farm Fresh Supplies">Farm Fresh Supplies</SelectItem>
                    <SelectItem value="Organic Mills">Organic Mills</SelectItem>
                    <SelectItem value="Sweet Industries">Sweet Industries</SelectItem>
                    <SelectItem value="Pure Oils Ltd">Pure Oils Ltd</SelectItem>
                    <SelectItem value="Salt Factory">Salt Factory</SelectItem>
                    <SelectItem value="Electronics Wholesale">Electronics Wholesale</SelectItem>
                    <SelectItem value="Fashion Fabrics">Fashion Fabrics</SelectItem>
                    <SelectItem value="Home Essentials">Home Essentials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  type="number"
                  placeholder="Enter low stock threshold"
                  value={formData.lowStockThreshold}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter item description"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
              <Button type="submit">Add Item</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddItem;
