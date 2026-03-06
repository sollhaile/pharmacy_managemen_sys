import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { useCart } from '../../context/CartContext';
import { saleService } from '../../services/api/sale.service';

const CheckoutSimple: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();
  
  // Customer info
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [loading, setLoading] = useState(false);

  // Load last used customer info from localStorage
  useEffect(() => {
    const lastCustomer = localStorage.getItem('lastCustomer');
    if (lastCustomer) {
      try {
        const { phone, name } = JSON.parse(lastCustomer);
        setCustomerPhone(phone || '');
        setCustomerName(name || '');
      } catch (e) {
        console.error('Failed to load last customer');
      }
    }
  }, []);

  const handleCheckout = async () => {
    if (!customerPhone || !customerName || !prescriptionId) {
      toast.error('Please fill all customer fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      // Remove any spaces from phone number
      const cleanPhone = customerPhone.trim().replace(/\s+/g, '');
      
      const checkoutData = {
        phone: cleanPhone,
        name: customerName,
        prescription_id: prescriptionId,
        items: items.map(item => ({
          batch_id: item.batch_id,
          quantity: item.quantity
        })),
        payment_method: 'cash' as const
      };

      const response = await saleService.checkout(checkoutData);
      
      if (response.success) {
        // Save customer info for next time
        localStorage.setItem('lastCustomer', JSON.stringify({
          phone: customerPhone,
          name: customerName
        }));
        
        toast.success('Checkout successful!');
        clearCart();
        navigate(`/sales/invoice/${response.data.invoice_number}`);
      }
    } catch (error: any) {
      console.error('Checkout failed:', error);
      toast.error(error.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (batchId: number, newQuantity: number) => {
    const item = items.find(i => i.batch_id === batchId);
    if (!item) return;

    if (newQuantity > item.available_quantity) {
      toast.error(`Only ${item.available_quantity} units available`);
      return;
    }

    if (newQuantity < 1) {
      removeFromCart(batchId);
    } else {
      updateQuantity(batchId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some medicines from the medicines page to get started.</p>
        <Link to="/medicines">
          <Button variant="primary" icon={<ArrowLeftIcon className="w-4 h-4" />}>
            Browse Medicines
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/medicines">
            <Button variant="secondary" size="sm" icon={<ArrowLeftIcon className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500">{totalItems} items in cart</p>
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.batch_id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.medicine_name}</h3>
                      <p className="text-sm text-gray-500">Batch: {item.batch_number}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<TrashIcon className="w-4 h-4 text-red-600" />}
                      onClick={() => removeFromCart(item.batch_id)}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.batch_id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-l-lg"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.batch_id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                          disabled={item.quantity >= item.available_quantity}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        @ ETB {item.unit_price.toFixed(2)} each
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ETB {item.total_price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.available_quantity - item.quantity} left in stock
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={
                      new Date(item.expiry_date) > new Date() ? 'success' : 'danger'
                    } size="sm">
                      Expires: {new Date(item.expiry_date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Cart Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-2xl font-bold text-gray-900">ETB {totalAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{totalItems} items</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">+ Tax</p>
                <p className="text-sm text-gray-600">- Discount</p>
                <p className="text-sm font-medium text-gray-900 mt-2">Calculated at checkout</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input
                label="Phone Number *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+251911223344"
                helpText="Enter without spaces"
              />
              <Input
                label="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
              />
              <Input
                label="Prescription ID *"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                placeholder="RX-2024-001"
              />
            </div>
          </Card>

          {/* Checkout Button */}
          <Card>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={<ShoppingCartIcon className="w-5 h-5" />}
              onClick={handleCheckout}
              loading={loading}
              disabled={items.length === 0 || !customerPhone || !customerName || !prescriptionId}
            >
              Complete Checkout
            </Button>
            <p className="text-xs text-gray-500 text-center mt-3">
              By completing checkout, you confirm that the prescription is valid
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSimple;
