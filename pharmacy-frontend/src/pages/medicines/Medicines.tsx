import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import MedicineForm from '../../components/forms/MedicineForm';
import { medicineService, Medicine, Batch } from '../../services/api/medicine.service';
import { useCart } from '../../context/CartContext';
import { useDebounce } from '../../hooks/useDebounce';

const Medicines: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expandedMedicine, setExpandedMedicine] = useState<number | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState<Record<number, boolean>>({});

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, [debouncedSearch, selectedCategory]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await medicineService.getAll(params);
      if (response.success) {
        setMedicines(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicineBatches = async (medicineId: number) => {
    try {
      setLoadingBatches(prev => ({ ...prev, [medicineId]: true }));
      const response = await medicineService.getBatches(medicineId);
      if (response.success && response.data?.batches) {
        setMedicines(prev => prev.map(m => 
          m.medicine_id === medicineId 
            ? { ...m, batches: response.data.batches }
            : m
        ));
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      toast.error('Failed to load batches');
    } finally {
      setLoadingBatches(prev => ({ ...prev, [medicineId]: false }));
    }
  };

  const toggleExpand = (medicineId: number) => {
    if (expandedMedicine === medicineId) {
      setExpandedMedicine(null);
    } else {
      setExpandedMedicine(medicineId);
      // Fetch batches if not already loaded
      const medicine = medicines.find(m => m.medicine_id === medicineId);
      if (!medicine?.batches) {
        fetchMedicineBatches(medicineId);
      }
    }
  };

  const handleAddToCartClick = (batch: Batch, medicineName: string) => {
    setSelectedBatch({
      ...batch,
      medicine_name: medicineName
    } as any);
    setQuantity(1);
    setShowAddToCart(true);
  };

  const handleAddToCart = () => {
    if (!selectedBatch) return;

    addToCart({
      batch_id: selectedBatch.batch_id,
      medicine_id: selectedBatch.medicine_id,
      medicine_name: (selectedBatch as any).medicine_name,
      batch_number: selectedBatch.batch_number,
      quantity,
      unit_price: Number(selectedBatch.selling_price),
      total_price: quantity * Number(selectedBatch.selling_price),
      available_quantity: selectedBatch.quantity,
      expiry_date: selectedBatch.expiry_date,
    });

    toast.success(`Added ${quantity} ${quantity > 1 ? 'units' : 'unit'} to cart`);
    setShowAddToCart(false);
    setSelectedBatch(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await medicineService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAdd = () => {
    setSelectedMedicine(null);
    setModalOpen(true);
  };

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setModalOpen(true);
  };

  const handleDelete = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedMedicine) {
        const response = await medicineService.update(selectedMedicine.medicine_id, data);
        if (response.success) {
          toast.success('Medicine updated successfully');
          setModalOpen(false);
          fetchMedicines();
        }
      } else {
        const response = await medicineService.create(data);
        if (response.success) {
          toast.success('Medicine added successfully');
          setModalOpen(false);
          fetchMedicines();
        }
      }
    } catch (error) {
      console.error('Failed to save medicine:', error);
      toast.error('Failed to save medicine');
    }
  };

  const confirmDelete = async () => {
    if (!selectedMedicine) return;
    try {
      const response = await medicineService.delete(selectedMedicine.medicine_id);
      if (response.success) {
        toast.success('Medicine deleted successfully');
        setDeleteModalOpen(false);
        fetchMedicines();
      }
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast.error('Failed to delete medicine');
    }
  };

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.total_stock === undefined) return null;
    if (medicine.total_stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (medicine.is_low_stock) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  const getExpiryStatusBadge = (days: number) => {
    if (days < 0) return <Badge variant="danger">Expired</Badge>;
    if (days <= 90) return <Badge variant="danger">Critical</Badge>;
    if (days <= 180) return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="success">Good</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicines</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your medicine inventory catalog
          </p>
        </div>
        <Button
          variant="primary"
          icon={<PlusIcon className="w-5 h-5" />}
          onClick={handleAdd}
        >
          Add Medicine
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or generic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
            />
          </div>
          <div className="sm:w-64">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Medicines List */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                      No medicines found
                    </td>
                  </tr>
                ) : (
                  medicines.map((medicine) => (
                    <React.Fragment key={medicine.medicine_id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleExpand(medicine.medicine_id)}
                              className="mr-2 p-1 hover:bg-gray-200 rounded focus:outline-none"
                              title={expandedMedicine === medicine.medicine_id ? "Hide batches" : "Show batches"}
                            >
                              {expandedMedicine === medicine.medicine_id ? (
                                <ChevronUpIcon className="w-5 h-5 text-blue-600" />
                              ) : (
                                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                            <div 
                              className="cursor-pointer hover:text-blue-600"
                              onClick={() => navigate(`/medicines/${medicine.medicine_id}`)}
                            >
                              <div className="text-sm font-medium text-gray-900">
                                {medicine.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {medicine.generic_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="info">
                            {medicine.category || 'Uncategorized'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {medicine.total_stock || 0} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStockStatus(medicine)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<PencilIcon className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(medicine);
                            }}
                            className="mr-2"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<TrashIcon className="w-4 h-4 text-red-600" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(medicine);
                            }}
                          />
                        </td>
                      </tr>
                      {expandedMedicine === medicine.medicine_id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="text-sm">
                              <h4 className="font-medium text-gray-900 mb-3">
                                Batches for {medicine.name}:
                              </h4>
                              
                              {loadingBatches[medicine.medicine_id] ? (
                                <div className="flex justify-center py-4">
                                  <Spinner size="sm" />
                                </div>
                              ) : medicine.batches && medicine.batches.length > 0 ? (
                                <div className="space-y-3">
                                  {medicine.batches.map((batch) => (
                                    <div key={batch.batch_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                      <div className="grid grid-cols-4 gap-6 flex-1">
                                        <div>
                                          <span className="text-xs text-gray-500 block">Batch Number</span>
                                          <span className="text-sm font-medium">{batch.batch_number}</span>
                                        </div>
                                        <div>
                                          <span className="text-xs text-gray-500 block">Quantity</span>
                                          <span className="text-sm font-medium">{batch.quantity} units</span>
                                        </div>
                                        <div>
                                          <span className="text-xs text-gray-500 block">Expiry Date</span>
                                          <span className="text-sm font-medium">
                                            {new Date(batch.expiry_date).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-xs text-gray-500 block">Price</span>
                                          <span className="text-sm font-medium">ETB {batch.selling_price}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {getExpiryStatusBadge(batch.days_until_expiry || 0)}
                                        {batch.quantity > 0 ? (
                                          <Button
                                            variant="primary"
                                            size="sm"
                                            icon={<ShoppingCartIcon className="w-4 h-4" />}
                                            onClick={() => handleAddToCartClick(batch, medicine.name)}
                                          >
                                            Add to Cart
                                          </Button>
                                        ) : (
                                          <Badge variant="default">Out of Stock</Badge>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500 mb-3">
                                    No batches available for this medicine.
                                  </p>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    icon={<PlusIcon className="w-4 h-4" />}
                                    onClick={() => navigate(`/medicines/${medicine.medicine_id}`)}
                                  >
                                    Add Batch
                                  </Button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add to Cart Modal */}
      <Modal
        isOpen={showAddToCart}
        onClose={() => {
          setShowAddToCart(false);
          setSelectedBatch(null);
        }}
        title="Add to Cart"
        size="sm"
      >
        {selectedBatch && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Medicine:</strong> {(selectedBatch as any).medicine_name}<br />
                <strong>Batch:</strong> {selectedBatch.batch_number}<br />
                <strong>Price:</strong> ETB {selectedBatch.selling_price}<br />
                <strong>Available:</strong> {selectedBatch.quantity} units<br />
                <strong>Expires:</strong> {new Date(selectedBatch.expiry_date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedBatch.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(selectedBatch.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="block w-24 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  onClick={() => setQuantity(Math.min(selectedBatch.quantity, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">/ {selectedBatch.quantity}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddToCart(false);
                  setSelectedBatch(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        size="lg"
      >
        <MedicineForm
          initialData={selectedMedicine || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Medicine"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900">
            {selectedMedicine?.name}
          </span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Medicines;
