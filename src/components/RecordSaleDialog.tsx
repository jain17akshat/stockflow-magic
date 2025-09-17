import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/contexts/InventoryContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface RecordSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecordSaleDialog: React.FC<RecordSaleDialogProps> = ({ open, onOpenChange }) => {
  const { items, recordSale } = useInventory();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 1,
    unitPrice: 0,
    customer: ''
  });

  const selectedItem = items.find(item => item.id === formData.itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.itemId || formData.quantity <= 0 || formData.unitPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    if (selectedItem && formData.quantity > selectedItem.currentStock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${selectedItem.currentStock} units available`,
        variant: "destructive"
      });
      return;
    }

    recordSale(formData.itemId, formData.quantity, formData.unitPrice, formData.customer || undefined);
    
    toast({
      title: "Sale Recorded",
      description: `Sale of ${formData.quantity} units recorded successfully`,
    });

    // Reset form
    setFormData({
      itemId: '',
      quantity: 1,
      unitPrice: 0,
      customer: ''
    });

    onOpenChange(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set unit price when item is selected
    if (field === 'itemId' && typeof value === 'string') {
      const item = items.find(i => i.id === value);
      if (item) {
        setFormData(prev => ({ ...prev, unitPrice: item.sellingPrice }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Record Sale
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemId">Select Item *</Label>
            <Select
              value={formData.itemId}
              onValueChange={(value) => handleInputChange('itemId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an item to sell" />
              </SelectTrigger>
              <SelectContent>
                {items.filter(item => item.currentStock > 0).map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - Stock: {item.currentStock} - ₹{item.sellingPrice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItem && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Available Stock: <span className="font-medium">{selectedItem.currentStock} units</span>
              </p>
              <p className="text-sm text-gray-600">
                Suggested Price: <span className="font-medium">₹{selectedItem.sellingPrice}</span>
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedItem?.currentStock || 1}
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              placeholder="Enter quantity"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer">Customer (Optional)</Label>
            <Input
              id="customer"
              value={formData.customer}
              onChange={(e) => handleInputChange('customer', e.target.value)}
              placeholder="Customer name"
            />
          </div>

          {formData.quantity > 0 && formData.unitPrice > 0 && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Total Amount: ₹{(formData.quantity * formData.unitPrice).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={items.length === 0}>
              Record Sale
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

export default RecordSaleDialog;