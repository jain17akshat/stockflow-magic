
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/contexts/InventoryContext';
import { useNavigate } from 'react-router-dom';

const AddStock: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { items, updateStock } = useInventory();
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: '',
    unitPrice: '',
    supplier: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any items available
    if (items.length === 0) {
      toast({
        title: "No Items Available",
        description: "Please add items to inventory first before adding stock",
        variant: "destructive"
      });
      return;
    }
    
    // Basic validation
    if (!formData.itemId || !formData.quantity || !formData.unitPrice || !formData.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Find the selected item to get its name
    const selectedItem = items.find(item => item.id === formData.itemId);
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "Selected item not found",
        variant: "destructive"
      });
      return;
    }

    // Update the stock using the inventory context
    updateStock(
      formData.itemId, 
      parseInt(formData.quantity), 
      'add', 
      parseFloat(formData.unitPrice)
    );
    
    // Show success message
    toast({
      title: "Stock Added",
      description: `Successfully added ${formData.quantity} units of ${selectedItem.name} to inventory.`,
    });
    
    // Reset form
    setFormData({
      itemId: '',
      quantity: '',
      unitPrice: '',
      supplier: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Stock</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>New Stock Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              
                <div className="space-y-2">
                  <Label htmlFor="itemId">Select Item</Label>
                  <Select
                    value={formData.itemId}
                    onValueChange={(value) => handleSelectChange('itemId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={items.length === 0 ? "No items available" : "Select an item"} />
                    </SelectTrigger>
                    <SelectContent>
                      {items.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <p>No items available</p>
                          <p className="text-sm">Add items to inventory first</p>
                        </div>
                      ) : (
                        items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - SKU: {item.sku}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Purchase Price (per unit)</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  placeholder="Enter price per unit"
                  value={formData.unitPrice}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
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
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate('/inventory')}>Cancel</Button>
              <Button type="submit">Add Stock</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStock;
