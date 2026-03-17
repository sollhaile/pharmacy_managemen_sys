import React, { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Spinner from '../common/Spinner';
import { medicineService, Medicine } from '../../services/api/medicine.service';
import axiosInstance from '../../services/api/axios';
import toast from 'react-hot-toast';

interface SupplierOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
}

interface OrderItem {
  medicine_id: number;
  medicine_name: string;
  quantity: number;
  unit_price?: number;
}

const SupplierOrderModal: React.FC<SupplierOrderModalProps> = ({
  isOpen,
  onClose,
  supplierId,
  supplierName,
  supplierEmail
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [sendTelegram, setSendTelegram] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMedicines();
    }
  }, [isOpen]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineService.getAll();
      if (response.success) {
        setMedicines(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (medicine: Medicine) => {
    // Check if already added
    if (items.some(item => item.medicine_id === medicine.medicine_id)) {
      toast.error('Item already added');
      return;
    }

    setItems([
      ...items,
      {
        medicine_id: medicine.medicine_id,
        medicine_name: medicine.name,
        quantity: medicine.reorder_level || 10,
        unit_price: undefined
      }
    ]);
    setSearchTerm('');
    setShowMedicineSearch(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handlePriceChange = (index: number, price: number) => {
    const newItems = [...items];
    newItems[index].unit_price = price;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      if (item.unit_price) {
        return sum + (item.quantity * item.unit_price);
      }
      return sum;
    }, 0);
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      setSending(true);
      const response = await axiosInstance.post('/supplier-orders/email', {
        supplier_id: supplierId,
        items: items.map(item => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        })),
        notes,
        send_telegram: sendTelegram
      });

      if (response.data.success) {
        toast.success('Purchase order sent successfully!');
        // Reset form
        setItems([]);
        setNotes('');
        setSendTelegram(false);
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to send order:', error);
      toast.error(error.response?.data?.error || 'Failed to send order');
    } finally {
      setSending(false);
    }
  };

  const filteredMedicines = searchTerm.length > 2
    ? medicines.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.generic_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Send Order to ${supplierName}`}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<PaperAirplaneIcon className="w-4 h-4" />}
            onClick={handleSubmit}
            loading={sending}
            disabled={items.length === 0}
          >
            Send Order
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Supplier Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>Email:</strong> {supplierEmail}
          </p>
        </div>

        {/* Add Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Items
          </label>
          <div className="relative">
            <Input
              placeholder="Search medicine to add..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowMedicineSearch(true);
              }}
              leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
            />
            {showMedicineSearch && filteredMedicines.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredMedicines.slice(0, 5).map((medicine) => (
                  <button
                    key={medicine.medicine_id}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                    onClick={() => handleAddItem(medicine)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-xs text-gray-500">{medicine.generic_name}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Stock: {medicine.total_stock || 0}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.medicine_name}</p>
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                      placeholder="Qty"
                      className="text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price || ''}
                      onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Calculation */}
            {items.some(item => item.unit_price) && (
              <div className="mt-3 p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                <span className="font-medium">Estimated Total:</span>
                <span className="font-bold text-blue-600">
                  ETB {calculateTotal().toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add any special instructions or notes for the supplier..."
          />
        </div>

        {/* Telegram Option */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sendTelegram"
            checked={sendTelegram}
            onChange={(e) => setSendTelegram(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sendTelegram" className="text-sm text-gray-700">
            Also send notification via Telegram
          </label>
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-500">
          Items without prices will be sent as requests for quotation.
        </p>
      </div>
    </Modal>
  );
};

export default SupplierOrderModal;