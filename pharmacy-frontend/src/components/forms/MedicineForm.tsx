import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { Medicine, MedicineFormData } from '../../services/api/medicine.service';

interface MedicineFormProps {
  initialData?: Medicine;
  onSubmit: (data: MedicineFormData) => Promise<void>;
  onCancel: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [customCategory, setCustomCategory] = useState('');
  const [customForm, setCustomForm] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showCustomUnit, setShowCustomUnit] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MedicineFormData>({
    defaultValues: {
      name: initialData?.name || '',
      generic_name: initialData?.generic_name || '',
      brand: initialData?.brand || '',
      category: initialData?.category || '',
      form: initialData?.form || '',
      strength: initialData?.strength || '',
      unit: initialData?.unit || '',
      barcode: initialData?.barcode || '',
      reorder_level: initialData?.reorder_level || 10,
    },
  });

  const selectedCategory = watch('category');
  const selectedForm = watch('form');
  const selectedUnit = watch('unit');

  // Initialize custom values if initialData contains custom values
  useEffect(() => {
    if (initialData) {
      // Check if category is not in predefined list
      if (initialData.category && !categories.includes(initialData.category)) {
        setCustomCategory(initialData.category);
        setShowCustomCategory(true);
        setValue('category', initialData.category);
      }
      
      // Check if form is not in predefined list
      if (initialData.form && !forms.includes(initialData.form)) {
        setCustomForm(initialData.form);
        setShowCustomForm(true);
        setValue('form', initialData.form);
      }
      
      // Check if unit is not in predefined list
      if (initialData.unit && !units.includes(initialData.unit)) {
        setCustomUnit(initialData.unit);
        setShowCustomUnit(true);
        setValue('unit', initialData.unit);
      }
    }
  }, [initialData]);

  // Handle category selection
  useEffect(() => {
    if (selectedCategory === 'Other') {
      setShowCustomCategory(true);
      // Don't set value here, wait for user to type
    } else if (selectedCategory && selectedCategory !== 'Other' && !categories.includes(selectedCategory)) {
      // This is a custom category that was already set
      setShowCustomCategory(true);
      setCustomCategory(selectedCategory);
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  }, [selectedCategory]);

  // Handle form selection
  useEffect(() => {
    if (selectedForm === 'Other') {
      setShowCustomForm(true);
    } else if (selectedForm && selectedForm !== 'Other' && !forms.includes(selectedForm)) {
      setShowCustomForm(true);
      setCustomForm(selectedForm);
    } else {
      setShowCustomForm(false);
      setCustomForm('');
    }
  }, [selectedForm]);

  // Handle unit selection
  useEffect(() => {
    if (selectedUnit === 'Other') {
      setShowCustomUnit(true);
    } else if (selectedUnit && selectedUnit !== 'Other' && !units.includes(selectedUnit)) {
      setShowCustomUnit(true);
      setCustomUnit(selectedUnit);
    } else {
      setShowCustomUnit(false);
      setCustomUnit('');
    }
  }, [selectedUnit]);

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCategory(value);
    setValue('category', value, { shouldValidate: true });
  };

  const handleCustomFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomForm(value);
    setValue('form', value, { shouldValidate: true });
  };

  const handleCustomUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomUnit(value);
    setValue('unit', value, { shouldValidate: true });
  };

  const categories = [
    'Analgesic', 'Antibiotic', 'Anti-diabetic', 'Cardiovascular',
    'Respiratory', 'Gastrointestinal', 'Dermatological',
    'Vitamins', 'Antiseptic', 'Other'
  ];

  const forms = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 
    'Ointment', 'Inhaler', 'Drops', 'Other'
  ];

  const units = ['mg', 'mcg', 'g', 'ml', 'L', 'IU', '%', 'Other'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Medicine Name *"
              {...register('name', { required: 'Medicine name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Generic Name"
              {...register('generic_name')}
            />
          </div>
        </div>

        {/* Classification */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900">Classification</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...register('category')}
                value={selectedCategory}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Custom Category Input - always shown when "Other" is selected */}
          {showCustomCategory && (
            <div className="mt-2">
              <Input
                label="Custom Category"
                placeholder="Enter custom category name"
                value={customCategory}
                onChange={handleCustomCategoryChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your custom category name
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Form Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...register('form')}
                value={selectedForm}
              >
                <option value="">Select Form</option>
                {forms.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Brand Input */}
            <Input
              label="Brand"
              {...register('brand')}
            />
          </div>

          {/* Custom Form Input - appears when "Other" is selected */}
          {showCustomForm && (
            <div className="mt-2">
              <Input
                label="Custom Form"
                placeholder="Enter custom form"
                value={customForm}
                onChange={handleCustomFormChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your custom form
              </p>
            </div>
          )}
        </div>

        {/* Strength & Dosage */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900">Strength & Dosage</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Strength"
              {...register('strength')}
              placeholder="e.g., 500"
            />
            
            {/* Unit Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...register('unit')}
                value={selectedUnit}
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <Input
              label="Reorder Level *"
              type="number"
              {...register('reorder_level', { 
                required: 'Reorder level is required',
                min: { value: 1, message: 'Minimum reorder level is 1' }
              })}
              error={errors.reorder_level?.message}
            />
          </div>

          {/* Custom Unit Input - appears when "Other" is selected */}
          {showCustomUnit && (
            <div className="mt-2">
              <Input
                label="Custom Unit"
                placeholder="Enter custom unit"
                value={customUnit}
                onChange={handleCustomUnitChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your custom unit
              </p>
            </div>
          )}
        </div>

        {/* Identification */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900">Identification</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Barcode"
              {...register('barcode')}
              placeholder="8-13 digits"
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
          {initialData ? 'Update Medicine' : 'Add Medicine'}
        </Button>
      </div>
    </form>
  );
};

export default MedicineForm;
