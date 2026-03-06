import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { saleService, Sale, CustomerSalesResponse } from '../../services/api/sale.service';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string; total_visits: number; last_visit: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'invoice' | 'phone'>('phone');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      setCustomerInfo(null);
      
      if (searchType === 'invoice') {
        // Search by invoice number
        const response = await saleService.getByInvoice(searchQuery.trim());
        if (response.success) {
          setSales(response.data ? [response.data] : []);
        } else {
          setSales([]);
        }
      } else {
        // Search by phone number - REMOVE ALL SPACES
        const cleanPhone = searchQuery.trim().replace(/\s+/g, '');
        const response: CustomerSalesResponse = await saleService.getCustomerSales(cleanPhone);
        
        if (response.success) {
          // Set customer info if available
          if (response.customer) {
            setCustomerInfo(response.customer);
          }
          // Set sales data - backend returns array in 'data' field
          setSales(response.data || []);
          
          if (!response.data || response.data.length === 0) {
            toast.success('Customer found but no purchase history');
          }
        } else {
          setSales([]);
          setCustomerInfo(null);
        }
      }
      
    } catch (error: any) {
      console.error('Search failed:', error);
      setSales([]);
      setCustomerInfo(null);
      
      if (error.response?.status === 404) {
        toast.error(searchType === 'invoice' ? 'Invoice not found' : 'Customer not found');
      } else {
        toast.error('Search failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const variants: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
      cash: 'success',
      transfer: 'info',
      card: 'warning',
      insurance: 'default'
    };
    return <Badge variant={variants[method] || 'default'}>{method.toUpperCase()}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      paid: 'success',
      pending: 'warning',
      cancelled: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search and view customer purchases and invoices
          </p>
        </div>
        <Link to="/sales/checkout">
          <Button
            variant="primary"
            icon={<ShoppingCartIcon className="w-5 h-5" />}
          >
            New Sale
          </Button>
        </Link>
      </div>

      {/* Search Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  searchType === 'invoice' 
                    ? "Enter invoice number (e.g., INV-31290270)" 
                    : "Enter customer phone number (e.g., +251911223344)"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              loading={loading}
            >
              Search
            </Button>
          </div>

          {/* Search Type Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Search by:</span>
            <div className="flex gap-2">
              <button
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg border
                  ${searchType === 'phone' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
                onClick={() => setSearchType('phone')}
              >
                <UserIcon className="w-4 h-4 inline mr-2" />
                Phone Number
              </button>
              <button
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg border
                  ${searchType === 'invoice' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
                onClick={() => setSearchType('invoice')}
              >
                <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                Invoice Number
              </button>
            </div>
          </div>

          {/* Search Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Tip:</strong> Enter phone number without spaces: <code className="bg-blue-100 px-1 py-0.5 rounded">+251911223344</code>
            </p>
          </div>
        </div>
      </Card>

      {/* Results */}
      {searched && (
        <Card className="p-0 overflow-hidden">
          {/* Customer Info Header (only for phone search) */}
          {searchType === 'phone' && customerInfo && (
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Customer: {customerInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {customerInfo.phone} • Total Visits: {customerInfo.total_visits} • Last Visit: {new Date(customerInfo.last_visit).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="success" size = "lg">
                  {sales.length} Transactions
                </Badge>
              </div>
            </div>
          )}

          {/* Invoice Header (for invoice search) */}
          {searchType === 'invoice' && sales.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <h3 className="text-lg font-medium text-gray-900">
                Invoice: {sales[0].invoice_number}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Customer: {sales[0].customer_name} • Date: {new Date(sales[0].sale_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No sales found</p>
              <p className="text-sm text-gray-500">
                {searchType === 'phone' 
                  ? customerInfo 
                    ? 'This customer has no purchase history yet.'
                    : 'Customer not found.'
                  : 'No transaction found with this invoice number.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prescription</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.sale_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <Link to={`/sales/invoice/${sale.invoice_number}`}>
                          {sale.invoice_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.customer_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.prescription_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        ETB {Number(sale.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentMethodBadge(sale.payment_method)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(sale.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          to={`/sales/invoice/${sale.invoice_number}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Quick Tips */}
      {!searched && (
        <Card>
          <div className="text-center py-8">
            <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search Transactions</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Enter a customer's phone number to view their complete purchase history, 
              or enter an invoice number to view a specific transaction.
            </p>
            <div className="mt-6 flex flex-col items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>Phone: <code className="bg-gray-100 px-2 py-1 rounded">+251911223344</code></span>
              </div>
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4" />
                <span>Invoice: <code className="bg-gray-100 px-2 py-1 rounded">INV-31290270</code></span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Sales;
