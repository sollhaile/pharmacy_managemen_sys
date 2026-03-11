import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { customerService } from '../../services/api/customer.service';
import { Customer, CustomerDetails } from '../../types/customer.types';
import { useDebounce } from '../../hooks/useDebounce';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll(debouncedSearch);
      if (response.success) {
        setCustomers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (phone: string) => {
    try {
      setModalLoading(true);
      setShowCustomerModal(true);
      const response = await customerService.getCustomerDetails(phone);
      if (response.success && response.data) {
        setSelectedCustomer(response.data);
      } else {
        toast.error('Failed to load customer details');
      }
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
      toast.error('Failed to load customer details');
    } finally {
      setModalLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          View customer history, purchases, and prescriptions
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search by name or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
        />
      </Card>

      {/* Customers Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : customers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Customers will appear here after their first purchase'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.customer_id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
                <Badge variant="info">{customer.total_visits} visits</Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Last visit: {formatDate(customer.last_visit)}</span>
                </div>
                {customer.address && (
                  <div className="text-gray-600 truncate">
                    📍 {customer.address}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleViewCustomer(customer.phone)}
                >
                  View History
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Customer Details Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          setSelectedCustomer(null);
        }}
        title="Customer History"
        size="xl"
      >
        {modalLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-blue-600">Name</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Total Visits</p>
                  <p className="font-medium">{selectedCustomer.total_visits}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Last Visit</p>
                  <p className="font-medium">{formatDate(selectedCustomer.last_visit)}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(selectedCustomer.total_spent)}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-500">Average Purchase</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(selectedCustomer.average_purchase)}
                </p>
              </Card>
            </div>

            {/* Purchase History */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase History</h3>
              {selectedCustomer.sales.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No purchases yet</p>
              ) : (
                <div className="space-y-4">
                  {selectedCustomer.sales.map((sale) => (
                    <div key={sale.sale_id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Link 
                            to={`/sales/invoice/${sale.invoice_number}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {sale.invoice_number}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {formatDate(sale.sale_date)}
                          </p>
                        </div>
                        <Badge variant="success">
                          {formatCurrency(sale.total_amount)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium">Prescription: {sale.prescription_id}</p>
                        {sale.doctor_name && (
                          <p className="text-gray-600">Dr. {sale.doctor_name}</p>
                        )}
                      </div>

                      {sale.items && sale.items.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-500 mb-2">Items:</p>
                          <div className="space-y-1">
                            {sale.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{item.medicine_name} x{item.quantity}</span>
                                <span className="font-medium">
                                  {formatCurrency(item.total_price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
