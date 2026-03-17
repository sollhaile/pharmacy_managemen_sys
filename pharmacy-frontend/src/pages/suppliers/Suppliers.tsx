import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import SupplierOrderModal from '../../components/forms/SupplierOrderModal';
import { supplierService } from '../../services/api/supplier.service';
import { Supplier, SupplierFormData } from '../../types/supplier.types';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedSupplierForOrder, setSelectedSupplierForOrder] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAll();
      if (response.success) {
        setSuppliers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = () => {
    setSelectedSupplier(null);
    setFormData({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    });
    setModalOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteModalOpen(true);
  };

  const handleOrder = (supplier: Supplier) => {
    if (!supplier.email) {
      toast.error('Supplier does not have an email address. Please add an email first.');
      return;
    }
    setSelectedSupplierForOrder(supplier);
    setOrderModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('Supplier name is required');
      return;
    }

    try {
      if (selectedSupplier) {
        const response = await supplierService.update(selectedSupplier.supplier_id, formData);
        if (response.success) {
          toast.success('Supplier updated successfully');
          setModalOpen(false);
          fetchSuppliers();
        }
      } else {
        const response = await supplierService.create(formData);
        if (response.success) {
          toast.success('Supplier added successfully');
          setModalOpen(false);
          fetchSuppliers();
        }
      }
    } catch (error) {
      console.error('Failed to save supplier:', error);
      toast.error('Failed to save supplier');
    }
  };

  const confirmDelete = async () => {
    if (!selectedSupplier) return;
    try {
      const response = await supplierService.delete(selectedSupplier.supplier_id);
      if (response.success) {
        toast.success('Supplier deleted successfully');
        setDeleteModalOpen(false);
        fetchSuppliers();
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      toast.error('Failed to delete supplier');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your medicine suppliers and vendors
          </p>
        </div>
        <Button
          variant="primary"
          icon={<PlusIcon className="w-5 h-5" />}
          onClick={handleAdd}
        >
          Add Supplier
        </Button>
      </div>

      {/* Suppliers Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : suppliers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-sm text-gray-500">Add your first supplier to get started</p>
            <Button
              variant="primary"
              icon={<PlusIcon className="w-5 h-5" />}
              onClick={handleAdd}
              className="mt-4"
            >
              Add Supplier
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.supplier_id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                    {supplier.contact_person && (
                      <p className="text-sm text-gray-500">{supplier.contact_person}</p>
                    )}
                  </div>
                </div>
                {!supplier.is_active && (
                  <Badge variant="default">Inactive</Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {supplier.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <EnvelopeIcon className="w-4 h-4" />
                    <a href={`mailto:${supplier.email}`} className="hover:text-blue-600">
                      {supplier.email}
                    </a>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">
                      {supplier.phone}
                    </a>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{supplier.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<EnvelopeIcon className="w-4 h-4" />}
                  onClick={() => handleOrder(supplier)}
                  disabled={!supplier.email}
                  title={!supplier.email ? "Supplier needs an email address" : "Send purchase order"}
                >
                  Order
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<PencilIcon className="w-4 h-4" />}
                  onClick={() => handleEdit(supplier)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<TrashIcon className="w-4 h-4 text-red-600" />}
                  onClick={() => handleDelete(supplier)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Supplier Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., ABC Pharmaceuticals"
          />
          <Input
            label="Contact Person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleInputChange}
            placeholder="e.g., John Smith"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="contact@supplier.com"
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+251911223344"
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Addis Ababa, Ethiopia"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedSupplier ? 'Update Supplier' : 'Add Supplier'}
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Supplier"
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
            {selectedSupplier?.name}
          </span>?
          This action cannot be undone.
        </p>
      </Modal>

      {/* Order Modal */}
      <SupplierOrderModal
        isOpen={orderModalOpen}
        onClose={() => {
          setOrderModalOpen(false);
          setSelectedSupplierForOrder(null);
        }}
        supplierId={selectedSupplierForOrder?.supplier_id || 0}
        supplierName={selectedSupplierForOrder?.name || ''}
        supplierEmail={selectedSupplierForOrder?.email || ''}
      />
    </div>
  );
};

export default Suppliers;