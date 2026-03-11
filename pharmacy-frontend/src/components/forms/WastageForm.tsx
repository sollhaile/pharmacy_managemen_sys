import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { WastageFormData } from '../../services/api/wastage.service';
import { medicineService, Medicine } from '../../services/api/medicine.service';
import { batchService, Batch } from '../../services/api/batch.service';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface WastageFormProps {
  onSubmit: (data: WastageFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<WastageFormData>;
}

const WastageForm: React.FC<WastageFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WastageFormData>({
    defaultValues: {
      medicine_id: initialData?.medicine_id || 0,
      medicine_name: initialData?.medicine_name || '',
      batch_number: initialData?.batch_number || '',
      quantity: initialData?.quantity || 1,
      cost_price: initialData?.cost_price || 0,
      reason: initialData?.reason || 'DAMAGED',
      notes: initialData?.notes || '',
    }
  });

  const quantity = watch('quantity') || 0;
  const costPrice = watch('cost_price') || 0;

  // Calculate total loss
  const totalLoss = quantity * costPrice;

  // Search medicines
  useEffect(() => {
    if (searchTerm.length > 2) {
      searchMedicines();
    } else {
      setMedicines([]);
    }
  }, [searchTerm]);

  const searchMedicines = async () => {
    try {
      console.log('Searching medicines for:', searchTerm);
      const response = await medicineService.getAll({ search: searchTerm });
      console.log('Medicine search response:', response);
      if (response.success) {
        setMedicines(response.data || []);
        setShowMedicineSearch(true);
      }
    } catch (error) {
      console.error('Failed to search medicines:', error);
    }
  };

  const handleSelectMedicine = (medicine: Medicine) => {
    console.log('Selected medicine:', medicine);
    setSelectedMedicine(medicine);
    setValue('medicine_id', medicine.medicine_id);
    setValue('medicine_name', medicine.name);
    setSearchTerm(medicine.name);
    setShowMedicineSearch(false);
    
    // Fetch batches for this medicine
    fetchBatches(medicine.medicine_id);
  };

  const fetchBatches = async (medicineId: number) => {
    try {
      setLoading(true);
      console.log('Fetching batches for medicine ID:', medicineId);
      const response = await batchService.getByMedicine(medicineId);
      console.log('Batches response:', response);
      
      if (response.success) {
        // Check different possible response structures
        const batchesData = response.data?.batches || response.data || [];
        console.log('Batches data:', batchesData);
        setBatches(batchesData);
      } else {
        console.error('Failed to fetch batches:', response);
        setBatches([]);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      setBatches([]);
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBatch = (batch: Batch) => {
    console.log('Selected batch:', batch);
    setSelectedBatch(batch);
    setValue('batch_id', batch.batch_id);
    setValue('batch_number', batch.batch_number);
    setValue('cost_price', Number(batch.cost_price || 0));
    
    // Auto-fill reason if batch is expired
    if (batch.days_until_expiry && batch.days_until_expiry < 0) {
      setValue('reason', 'EXPIRED');
      toast.success('This batch is expired. Reason set to EXPIRED.', {
        icon: '⚠️',
        style: {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
        },
      });
    }
  };

  // Match exactly what's in your PostgreSQL enum
  const reasons = [
    'EXPIRED',
    'DAMAGED',
    'SPILLED',
    'BROKEN',
    'THEFT',
    'OTHER'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Medicine Search */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Medicine *
        </label>
        <div className="relative">
          <Input
            placeholder="Search medicine by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
          
          {showMedicineSearch && medicines.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {medicines.map((medicine) => (
                <button
                  key={medicine.medicine_id}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                  onClick={() => handleSelectMedicine(medicine)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{medicine.name}</p>
                    <p className="text-xs text-gray-500">{medicine.generic_name}</p>
                  </div>
                  <Badge variant="info" size="sm">
                    Stock: {medicine.total_stock || 0}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Medicine Info */}
      {selectedMedicine && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Selected Medicine:</strong> {selectedMedicine.name}
            {selectedMedicine.generic_name && ` (${selectedMedicine.generic_name})`}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Medicine ID: {selectedMedicine.medicine_id}
          </p>
        </div>
      )}

      {/* Batch Selection - Required (matches schema) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Batch *
        </label>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            <span className="ml-2 text-sm text-gray-500">Loading batches...</span>
          </div>
        ) : batches.length === 0 && selectedMedicine ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700">
              No batches found for this medicine. Please add a batch first.
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Debug: Medicine ID {selectedMedicine.medicine_id}
            </p>
          </div>
        ) : (
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            onChange={(e) => {
              const batch = batches.find(b => b.batch_id === Number(e.target.value));
              if (batch) handleSelectBatch(batch);
            }}
            value={selectedBatch?.batch_id || ''}
          >
            <option value="">-- Select a Batch --</option>
            {batches.map((batch) => (
              <option key={batch.batch_id} value={batch.batch_id}>
                {batch.batch_number} - Qty: {batch.quantity} - 
                Exp: {new Date(batch.expiry_date).toLocaleDateString()} - 
                Status: {batch.expiry_status || 'Unknown'}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Hidden fields for form data */}
      <input type="hidden" {...register('batch_id', { required: true, valueAsNumber: true })} />
      <input type="hidden" {...register('medicine_id')} />
      <input type="hidden" {...register('medicine_name')} />
      <input type="hidden" {...register('batch_number')} />

      {/* Quantity and Cost */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Quantity *"
          type="number"
          min="1"
          {...register('quantity', { 
            required: 'Quantity is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Quantity must be at least 1' }
          })}
          error={errors.quantity?.message}
        />

        <Input
          label="Cost Price per Unit (ETB) *"
          type="number"
          min="0"
          step="0.01"
          {...register('cost_price', { 
            required: 'Cost price is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost price cannot be negative' }
          })}
          error={errors.cost_price?.message}
        />
      </div>

      {/* Total Loss Calculation */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">
          <strong>Total Financial Loss:</strong>{' '}
          <span className="text-lg font-bold">
            {totalLoss.toFixed(2)} ETB
          </span>
        </p>
        <p className="text-xs text-red-600 mt-1">
          {quantity} units × {costPrice.toFixed(2)} ETB per unit
        </p>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason *
        </label>
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          {...register('reason', { required: 'Reason is required' })}
        >
          {reasons.map((reason) => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          {...register('notes')}
          placeholder="Add any additional details..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="danger"
          loading={isSubmitting}
          disabled={!selectedBatch}
        >
          Report Wastage
        </Button>
      </div>
    </form>
  );
};

export default WastageForm;
