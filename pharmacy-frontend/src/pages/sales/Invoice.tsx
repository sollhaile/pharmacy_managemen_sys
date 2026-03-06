import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PrinterIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { saleService } from '../../services/api/sale.service';
import { Sale } from '../../types/sale.types';

const Invoice: React.FC = () => {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceNumber) {
      fetchInvoice();
    }
  }, [invoiceNumber]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await saleService.getByInvoice(invoiceNumber!);
      if (response.success) {
        setSale(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
        <p className="text-gray-500 mb-6">The invoice you're looking for doesn't exist.</p>
        <Link to="/sales">
          <Button variant="primary">Back to Sales</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/sales">
            <Button variant="secondary" size="sm" icon={<ArrowLeftIcon className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice #{sale.invoice_number}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(sale.sale_date).toLocaleDateString()} at{' '}
              {new Date(sale.sale_date).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<PrinterIcon className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Link to="/sales/checkout">
            <Button variant="primary" icon={<ShoppingCartIcon className="w-4 h-4" />}>
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Invoice Content */}
      <Card className="print:shadow-none">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">PHARMACY MANAGEMENT SYSTEM</h2>
              <p className="text-sm text-gray-600 mt-1">123 Pharmacy Street, Addis Ababa, Ethiopia</p>
              <p className="text-sm text-gray-600">Phone: +251 911 223344</p>
            </div>
            <div className="text-right">
              <Badge variant="success" size="lg" className="mb-2">
                {sale.payment_status?.toUpperCase()}
              </Badge>
              <p className="text-sm text-gray-600">Invoice #: {sale.invoice_number}</p>
              <p className="text-sm text-gray-600">Date: {new Date(sale.sale_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Customer & Prescription Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
            <p className="text-base font-medium text-gray-900">{sale.customer_name}</p>
            <p className="text-sm text-gray-600">{sale.customer_phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Prescription Information</h3>
            <p className="text-base font-medium text-gray-900">{sale.prescription_id}</p>
            {sale.doctor_name && (
              <p className="text-sm text-gray-600">Dr. {sale.doctor_name}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sale.items?.map((item) => (
                <tr key={item.sale_item_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.medicine_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.batch_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ETB {Number(item.unit_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ETB {Number(item.total_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-72">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  ETB {Number(sale.items_total).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Discount:</span>
                <span className="text-sm font-medium text-red-600">
                  - ETB {Number(sale.discount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax:</span>
                <span className="text-sm font-medium text-gray-900">
                  + ETB {Number(sale.tax).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-base font-bold text-blue-600">
                    ETB {Number(sale.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Payment Method:</p>
              <p className="text-sm font-medium text-gray-900 uppercase">{sale.payment_method}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">Thank you for your purchase!</p>
          <p className="text-xs text-gray-400 mt-1">This is a computer generated invoice</p>
        </div>
      </Card>
    </div>
  );
};

export default Invoice;
