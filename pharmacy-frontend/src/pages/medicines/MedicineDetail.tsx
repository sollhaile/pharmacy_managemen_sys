import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import MedicineForm from '../../components/forms/MedicineForm';
import BatchForm from '../../components/forms/BatchForm';
import { medicineService, Medicine, Batch } from '../../services/api/medicine.service';
import { batchService, BatchFormData } from '../../services/api/batch.service';
import { useCart } from '../../context/CartContext';

// Helper function to calculate days until expiry
const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Helper function to determine if batch is sellable
const isBatchSellable = (batch: Batch): boolean => {
  // Can sell if:
  // 1. Has stock (quantity > 0)
  // 2. Not expired (days_until_expiry > 0)
  // 3. Not critical (days_until_expiry > 30)
  return batch.quantity > 0 && 
         (batch.days_until_expiry || 0) > 7;
};

// Helper function to get sellability reason
const getSellabilityReason = (batch: Batch): string => {
  if (batch.quantity === 0) return 'Out of stock';
  if ((batch.days_until_expiry || 0) <= 0) return 'Expired - cannot sell';
  if ((batch.days_until_expiry || 0) <= 7) return 'Expiring soon (within 30 days) - cannot sell';
  return 'Sellable';
};

const MedicineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addBatchModalOpen, setAddBatchModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddToCart, setShowAddToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMedicineDetails();
    }
  }, [id]);

  const fetchMedicineDetails = async () => {
    try {
      setLoading(true);
      const medicineRes = await medicineService.getById(Number(id));
      if (medicineRes.success) {
        setMedicine(medicineRes.data);
        
        // Process batches with correct expiry calculation
        if (medicineRes.data.batches) {
          const processedBatches = medicineRes.data.batches.map((batch: Batch) => {
            const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date);
            return {
              ...batch,
              days_until_expiry: daysUntilExpiry,
              sellable: isBatchSellable({ ...batch, days_until_expiry: daysUntilExpiry }),
              sellability_reason: getSellabilityReason({ ...batch, days_until_expiry: daysUntilExpiry })
            };
          });
          
          // Sort by expiry date (soonest first)
          const sortedBatches = processedBatches.sort(
            (a: Batch, b: Batch) => (a.days_until_expiry || 0) - (b.days_until_expiry || 0)
          );
          
          setBatches(sortedBatches);
        }
      }
    } catch (error) {
      console.error('Failed to fetch medicine details:', error);
      toast.error('Failed to load medicine details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (data: BatchFormData) => {
    try {
      const response = await batchService.create({
        ...data,
        medicine_id: Number(id)
      });
      if (response.success) {
        toast.success('Batch added successfully');
        setAddBatchModalOpen(false);
        fetchMedicineDetails();
      }
    } catch (error) {
      console.error('Failed to add batch:', error);
      toast.error('Failed to add batch');
    }
  };

  const handleAddToCart = () => {
    if (!selectedBatch) return;

    addToCart({
      batch_id: selectedBatch.batch_id,
      medicine_id: selectedBatch.medicine_id,
      medicine_name: medicine?.name || 'Unknown',
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
    setQuantity(1);
  };

  const getExpiryStatusBadge = (batch: Batch) => {
    const days = batch.days_until_expiry || 0;
    
    if (days <= 0) {
      return <Badge variant="danger">EXPIRED - {Math.abs(days)} days ago</Badge>;
    }
    if (days <= 90) {
      return <Badge variant="danger">CRITICAL - {days} days left (Cannot sell)</Badge>;
    }
    if (days <= 180) {
      return <Badge variant="warning">WARNING - {days} days left</Badge>;
    }
    return <Badge variant="success">GOOD - {days} days left</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Medicine not found</h2>
        <Link to="/medicines" className="mt-4 inline-block">
          <Button variant="primary">Back to Medicines</Button>
        </Link>
      </div>
    );
  }

  const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);
  const isLowStock = totalStock <= medicine.reorder_level;
  const sellableBatches = batches.filter(b => (b as any).sellable);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/medicines">
            <Button variant="secondary" size="sm" icon={<ArrowLeftIcon className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{medicine.name}</h1>
            <p className="text-sm text-gray-500">{medicine.generic_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setAddBatchModalOpen(true)}
          >
            Add Batch
          </Button>
          <Button
            variant="outline"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => setEditModalOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Sellable Batches Summary */}
      <Card className="bg-blue-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800">Available for Sale</h3>
            <p className="text-xs text-blue-700 mt-1">
              {sellableBatches.length} batch(es) available with {totalStock} total units
            </p>
          </div>
          <Badge variant="info">
            {sellableBatches.length} Sellable
          </Badge>
        </div>
      </Card>

      {/* Medicine Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Medicine Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Brand</p>
              <p className="text-sm font-medium text-gray-900">{medicine.brand || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-sm font-medium text-gray-900">{medicine.category || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Form</p>
              <p className="text-sm font-medium text-gray-900">{medicine.form || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Strength</p>
              <p className="text-sm font-medium text-gray-900">
                {medicine.strength ? `${medicine.strength} ${medicine.unit || ''}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Barcode</p>
              <p className="text-sm font-medium text-gray-900">{medicine.barcode || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reorder Level</p>
              <p className="text-sm font-medium text-gray-900">{medicine.reorder_level} units</p>
            </div>
          </div>
        </Card>

        {/* Stock Info */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Status</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className={`text-2xl font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                {totalStock} units
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              {isLowStock ? (
                <Badge variant="danger">Low Stock</Badge>
              ) : (
                <Badge variant="success">In Stock</Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Sellable Batches</p>
              <p className="text-lg font-medium text-gray-900">
                {sellableBatches.length} / {batches.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Batches Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">All Batches</h3>
          <Button
            variant="primary"
            size="sm"
            icon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setAddBatchModalOpen(true)}
          >
            Add New Batch
          </Button>
        </div>

        {batches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No batches added yet.</p>
            <Button
              variant="primary"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => setAddBatchModalOpen(true)}
            >
              Add First Batch
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {batches.map((batch) => {
              const sellable = (batch as any).sellable;
              const reason = (batch as any).sellability_reason;
              const days = batch.days_until_expiry || 0;
              
              return (
                <div
                  key={batch.batch_id}
                  className={`p-4 border rounded-lg ${
                    batch.quantity === 0 ? 'bg-gray-50 border-gray-200' : 
                    days <= 0 ? 'bg-red-50 border-red-200' :
                    days <= 30 ? 'bg-orange-50 border-orange-200' :
                    'hover:border-blue-300 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (sellable) {
                      setSelectedBatch(batch);
                      setShowAddToCart(true);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <Badge variant="info">Batch: {batch.batch_number}</Badge>
                        {getExpiryStatusBadge(batch)}
                        {batch.quantity === 0 && (
                          <Badge variant="default">Out of Stock</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>{' '}
                          <span className="font-medium">{batch.quantity} units</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Expiry:</span>{' '}
                          <span className="font-medium">
                            {new Date(batch.expiry_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>{' '}
                          <span className="font-medium">ETB {batch.selling_price}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>{' '}
                          <span className="font-medium">{reason}</span>
                        </div>
                      </div>
                    </div>
                    {sellable ? (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<ShoppingCartIcon className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBatch(batch);
                          setShowAddToCart(true);
                        }}
                        className="ml-4 whitespace-nowrap"
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        className="ml-4 whitespace-nowrap opacity-50 cursor-not-allowed"
                        title={reason}
                      >
                        Cannot Sell
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add to Cart Modal */}
      <Modal
        isOpen={showAddToCart && selectedBatch !== null}
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
                <strong>Medicine:</strong> {medicine?.name}<br />
                <strong>Batch:</strong> {selectedBatch.batch_number}<br />
                <strong>Price:</strong> ETB {selectedBatch.selling_price}<br />
                <strong>Available:</strong> {selectedBatch.quantity} units<br />
                <strong>Expires:</strong> {new Date(selectedBatch.expiry_date).toLocaleDateString()}<br />
                <strong>Days Left:</strong> {selectedBatch.days_until_expiry} days
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

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Medicine"
        size="lg"
      >
        <MedicineForm
          initialData={medicine}
          onSubmit={async (data) => {
            try {
              const response = await medicineService.update(Number(id), data);
              if (response.success) {
                toast.success('Medicine updated successfully');
                setEditModalOpen(false);
                fetchMedicineDetails();
              }
            } catch (error) {
              console.error('Failed to update medicine:', error);
              toast.error('Failed to update medicine');
            }
          }}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Add Batch Modal */}
      <Modal
        isOpen={addBatchModalOpen}
        onClose={() => setAddBatchModalOpen(false)}
        title="Add New Batch"
        size="lg"
      >
        <BatchForm
          medicineId={medicine.medicine_id}
          medicineName={medicine.name}
          onSubmit={handleAddBatch}
          onCancel={() => setAddBatchModalOpen(false)}
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
            <Button variant="danger" onClick={async () => {
              try {
                const response = await medicineService.delete(Number(id));
                if (response.success) {
                  toast.success('Medicine deleted successfully');
                  navigate('/medicines');
                }
              } catch (error) {
                console.error('Failed to delete medicine:', error);
                toast.error('Failed to delete medicine');
              }
            }}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-medium text-gray-900">{medicine.name}</span>?
          This will also delete all associated batches. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default MedicineDetail;
