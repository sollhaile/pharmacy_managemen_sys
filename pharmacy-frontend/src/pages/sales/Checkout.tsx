import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { saleService } from '../../services/api/sale.service';
import { batchService, Batch } from '../../services/api/batch.service';
import { medicineService, Medicine } from '../../services/api/medicine.service';

interface CartItem {
  batch_id: number;
  batch_number: string;
  medicine_id: number;
  medicine_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  available_quantity: number;
  expiry_date: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Customer info
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card' | 'insurance'>('cash');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchMedicines();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const searchMedicines = async () => {
    try {
      const response = await medicineService.getAll({ search: searchTerm });
      if (response.success) {
        setSearchResults(response.data || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to search medicines:', error);
    }
  };

  const handleSelectMedicine = async (medicine: Medicine) => {
    try {
      setLoading(true);
      const response = await batchService.getByMedicine(medicine.medicine_id);
      if (response.success && response.data?.batches) {
        const availableBatches = response.data.batches.filter(
          (b: Batch) => b.quantity > 0 && b.expiry_status !== 'EXPIRED'
        );
        setBatches(availableBatches);
        setSearchTerm(medicine.name);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      toast.error('Failed to load batch information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedBatch) {
      toast.error('Please select a batch');
      return;
    }

    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (quantity > selectedBatch.quantity) {
      toast.error(`Only ${selectedBatch.quantity} units available`);
      return;
    }

    const existingItem = cart.find(item => item.batch_id === selectedBatch.batch_id);
    
    if (existingItem) {
      if (existingItem.quantity + quantity > selectedBatch.quantity) {
        toast.error(`Only ${selectedBatch.quantity - existingItem.quantity} more units available`);
        return;
      }
      
      setCart(cart.map(item => 
        item.batch_id === selectedBatch.batch_id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              total_price: (item.quantity + quantity) * item.unit_price
            }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          batch_id: selectedBatch.batch_id,
          batch_number: selectedBatch.batch_number,
          medicine_id: selectedBatch.medicine_id,
          medicine_name: selectedBatch.medicine?.name || 'Unknown',
          quantity,
          unit_price: Number(selectedBatch.selling_price),
          total_price: quantity * Number(selectedBatch.selling_price),
          available_quantity: selectedBatch.quantity,
          expiry_date: selectedBatch.expiry_date,
        }
      ]);
    }

    // Reset selection
    setSelectedBatch(null);
    setBatches([]);
    setSearchTerm('');
    setQuantity(1);
  };

  const handleRemoveFromCart = (batchId: number) => {
    setCart(cart.filter(item => item.batch_id !== batchId));
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (batchId: number, newQuantity: number) => {
    const item = cart.find(i => i.batch_id === batchId);
    if (!item) return;

    if (newQuantity > item.available_quantity) {
      toast.error(`Only ${item.available_quantity} units available`);
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveFromCart(batchId);
      return;
    }

    setCart(cart.map(item =>
      item.batch_id === batchId
        ? {
            ...item,
            quantity: newQuantity,
            total_price: newQuantity * item.unit_price
          }
        : item
    ));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount + tax;
  };

  const handleCheckout = async () => {
    // Validation
    if (!customerPhone) {
      toast.error('Customer phone number is required');
      return;
    }

    if (!customerName) {
      toast.error('Customer name is required');
      return;
    }

    if (!prescriptionId) {
      toast.error('Prescription ID is required');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      const checkoutData = {
        phone: customerPhone,
        name: customerName,
        prescription_id: prescriptionId,
        doctor_name: doctorName || undefined,
        items: cart.map(item => ({
          batch_id: item.batch_id,
          quantity: item.quantity
        })),
        payment_method: paymentMethod,
        discount: discount || 0,
        tax: tax || 0
      };

      const response = await saleService.checkout(checkoutData);
      
      if (response.success) {
        toast.success('Checkout successful!');
        // Reset form
        setCart([]);
        setCustomerPhone('');
        setCustomerName('');
        setPrescriptionId('');
        setDoctorName('');
        setDiscount(0);
        setTax(0);
        // Navigate to invoice
        navigate(`/sales/invoice/${response.data?.invoice_number}`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-1 text-sm text-gray-500">
          Process customer sales and generate invoices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Search */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Products</h3>
            <div className="relative">
              <Input
                placeholder="Search medicines by name or generic name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
              />
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((medicine) => (
                    <button
                      key={medicine.medicine_id}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => handleSelectMedicine(medicine)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{medicine.name}</p>
                        <p className="text-xs text-gray-500">{medicine.generic_name}</p>
                      </div>
                      <Badge variant="info" size="sm">
                        {medicine.category || 'Uncategorized'}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Batch Selection */}
            {batches.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Select Batch</h4>
                <div className="space-y-2">
                  {batches.map((batch) => (
                    <div
                      key={batch.batch_id}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedBatch?.batch_id === batch.batch_id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                        }
                      `}
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Batch: {batch.batch_number}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires: {new Date(batch.expiry_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ETB {batch.selling_price}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {batch.quantity} units
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity and Add Button */}
                {selectedBatch && (
                  <div className="mt-4 flex items-end gap-4">
                    <div className="w-32">
                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        max={selectedBatch.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <Button
                      variant="primary"
                      icon={<PlusIcon className="w-5 h-5" />}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Cart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Shopping Cart</h3>
              <Badge variant="info">{cart.length} items</Badge>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCartIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">
                  Search and add products to begin checkout
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.batch_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.medicine_name}</p>
                          <p className="text-xs text-gray-500">Batch: {item.batch_number}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<TrashIcon className="w-4 h-4 text-red-600" />}
                          onClick={() => handleRemoveFromCart(item.batch_id)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Input
                              type="number"
                              min="1"
                              max={item.available_quantity}
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.batch_id, parseInt(e.target.value) || 1)}
                              className="text-sm"
                            />
                          </div>
                          <span className="text-sm text-gray-500">
                            × ETB {item.unit_price.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          ETB {item.total_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cart Summary */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium text-gray-900">ETB {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="text-sm font-medium text-red-600">- ETB {discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-sm font-medium text-gray-900">+ ETB {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-base font-bold text-blue-600">ETB {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Customer & Payment */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input
                label="Phone Number *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                leftIcon={<UserIcon className="w-5 h-5" />}
                placeholder="+251911223344"
              />
              <Input
                label="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
              />
            </div>
          </Card>

          {/* Prescription Information */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Prescription Information</h3>
            <div className="space-y-4">
              <Input
                label="Prescription ID *"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                leftIcon={<DocumentTextIcon className="w-5 h-5" />}
                placeholder="RX-2024-001"
              />
              <Input
                label="Doctor Name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. Name"
              />
            </div>
          </Card>

          {/* Payment Information */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium
                      ${paymentMethod === 'cash'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <BanknotesIcon className="w-5 h-5" />
                    Cash
                  </button>
                  <button
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium
                      ${paymentMethod === 'transfer'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    Transfer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  leftIcon={<span className="text-gray-500">ETB</span>}
                />
                <Input
                  label="Tax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  leftIcon={<span className="text-gray-500">ETB</span>}
                />
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ShoppingCartIcon className="w-5 h-5" />}
                  onClick={handleCheckout}
                  loading={loading}
                  disabled={cart.length === 0 || !customerPhone || !customerName || !prescriptionId}
                >
                  Complete Checkout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
