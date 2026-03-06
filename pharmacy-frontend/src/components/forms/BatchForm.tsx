import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { Batch, BatchFormData } from '../../services/api/batch.service';
import { supplierService, Supplier } from '../../services/api/supplier.service';

interface BatchFormProps {
  medicineId: number;
  medicineName: string;
  initialData?: Batch;
  onSubmit: (data: BatchFormData) => Promise<void>;
  onCancel: () => void;
}

const BatchForm: React.FC<BatchFormProps> = ({
  medicineId,
  medicineName,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BatchFormData>({
    defaultValues: {
      batch_number: initialData?.batch_number || '',
      medicine_id: medicineId,
      expiry_date: initialData?.expiry_date?.split('T')[0] || '',
      manufacturing_date: initialData?.manufacturing_date?.split('T')[0] || '',
      supplier_id: initialData?.supplier_id || undefined,
      quantity: initialData?.quantity || 0,
      cost_price: initialData?.cost_price || undefined,
      selling_price: initialData?.selling_price || undefined,
    },
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAll();
      if (response.success) {
        setSuppliers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum expiry date (today + 1 day)
  const minExpiryDate = new Date();
  minExpiryDate.setDate(minExpiryDate.getDate() + 1);
  const minExpiryDateStr = minExpiryDate.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-700">
          <strong>Medicine:</strong> {medicineName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batch Information */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900">Batch Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Batch Number *"
              {...register('batch_number', { required: 'Batch number is required' })}
              error={errors.batch_number?.message}
              placeholder="e.g., BATCH-2024-001"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...register('supplier_id', { valueAsNumber: true })}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900">Expiry Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Expiry Date *"
              type="date"
              min={minExpiryDateStr}
              {...register('expiry_date', { 
                required: 'Expiry date is required',
                validate: value => {
                  const expiryDate = new Date(value);
                  const today = new Date();
                  if (expiryDate <= today) {
                    return 'Expiry date must be in the future';
                  }
                  return true;
                }
              })}
              error={errors.expiry_date?.message}
            />
            <Input
              label="Manufacturing Date"
              type="date"
              max={minExpiryDateStr}
              {...register('manufacturing_date')}
            />
          </div>
        </div>

        {/* Stock & Pricing */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900">Stock & Pricing</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Quantity *"
              type="number"
              min="0"
              step="1"
              {...register('quantity', { 
                required: 'Quantity is required',
                min: { value: 0, message: 'Quantity cannot be negative' }
              })}
              error={errors.quantity?.message}
            />
            <Input
              label="Cost Price"
              type="number"
              min="0"
              step="0.01"
              {...register('cost_price', { valueAsNumber: true })}
              placeholder="Purchase price"
            />
            <Input
              label="Selling Price"
              type="number"
              min="0"
              step="0.01"
              {...register('selling_price', { valueAsNumber: true })}
              placeholder="Retail price"
            />
          </div>
        </div>
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
          variant="primary"
          loading={isSubmitting}
        >
          {initialData ? 'Update Batch' : 'Add Batch'}
        </Button>
      </div>
    </form>
  );
};

export default BatchForm;
