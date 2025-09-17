import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/contexts/InventoryContext';
import { InventoryItem } from '@/utils/inventoryUtils';
import { useToast } from '@/hooks/use-toast';

interface EditItemDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({ item, open, onOpenChange }) => {
  const { updateItem, suppliers, addSupplier } = useInventory();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    currentStock: 0,
    lowStockThreshold: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    supplier: ''
  });
  const [newSupplier, setNewSupplier] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku,
        category: item.category,
        currentStock: item.currentStock,
        lowStockThreshold: item.lowStockThreshold,
        purchasePrice: item.purchasePrice,
        sellingPrice: item.sellingPrice,
        supplier: item.supplier
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    // Validation
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

    updateItem(item.id, formData);
    
    toast({
      title: "Item Updated",
      description: `${formData.name} has been updated successfully`,
    });

    onOpenChange(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categories = ['Grains', 'Oils', 'Sweeteners', 'Condiments', 'Spices', 'Lentils'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        
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
                placeholder="Enter SKU"
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
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                placeholder="Current stock"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                placeholder="Threshold"
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
              Update Item
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;