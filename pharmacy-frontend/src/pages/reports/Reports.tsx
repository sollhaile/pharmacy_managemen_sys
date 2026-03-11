import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const reportCategories = [
    {
      title: 'Sales Reports',
      icon: CurrencyDollarIcon,
      color: 'bg-green-100 text-green-600',
      reports: [
        { name: 'Daily Sales Summary', path: '/reports/sales/daily', description: 'View daily sales totals' },
        { name: 'Monthly Sales Report', path: '/reports/sales/monthly', description: 'Monthly revenue and profit' },
        { name: 'Sales by Medicine', path: '/reports/sales/by-medicine', description: 'Top selling products' },
        { name: 'Sales by Customer', path: '/reports/sales/by-customer', description: 'Customer purchase history' },
      ]
    },
    {
      title: 'Inventory Reports',
      icon: CubeIcon,
      color: 'bg-blue-100 text-blue-600',
      reports: [
        { name: 'Current Stock Levels', path: '/reports/inventory/stock', description: 'All current inventory' },
        { name: 'Low Stock Alert', path: '/reports/inventory/low-stock', description: 'Items below reorder level' },
        { name: 'Expiry Report', path: '/reports/inventory/expiry', description: 'Batches expiring soon' },
        { name: 'Inventory Valuation', path: '/reports/inventory/valuation', description: 'Total stock value' },
      ]
    },
    {
      title: 'Financial Reports',
      icon: DocumentChartBarIcon,
      color: 'bg-purple-100 text-purple-600',
      reports: [
        { name: 'Profit & Loss', path: '/reports/financial/pl', description: 'Revenue vs expenses' },
        { name: 'Cash Flow', path: '/reports/financial/cashflow', description: 'Money in and out' },
        { name: 'Wastage Losses', path: '/reports/financial/wastage', description: 'Loss from expired/damaged' },
        { name: 'Supplier Payments', path: '/reports/financial/suppliers', description: 'Amount owed to suppliers' },
      ]
    },
    {
      title: 'Expiry Reports',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-100 text-red-600',
      reports: [
        { name: 'Expiring Soon (30 days)', path: '/reports/expiry/30-days', description: 'Critical batches' },
        { name: 'Expiring Soon (90 days)', path: '/reports/expiry/90-days', description: 'Warning batches' },
        { name: 'Expired Batches', path: '/reports/expiry/expired', description: 'Already expired' },
        { name: 'Wastage History', path: '/reports/expiry/wastage', description: 'All written-off items' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and view business reports
        </p>
      </div>

      {/* Date Range Selector */}
      <Card>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <Button
            variant="primary"
            icon={<CalendarIcon className="w-4 h-4" />}
          >
            Apply
          </Button>
        </div>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category) => (
          <Card key={category.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${category.color.split(' ')[0]}`}>
                <category.icon className={`w-5 h-5 ${category.color.split(' ')[1]}`} />
              </div>
              <h2 className="text-lg font-medium text-gray-900">{category.title}</h2>
            </div>
            <div className="space-y-3">
              {category.reports.map((report) => (
                <div
                  key={report.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                    onClick={() => {
                      toast.success('Report generation coming soon');
                    }}
                  >
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Today's Sales</p>
            <p className="text-xl font-semibold text-gray-900">ETB 0.00</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Month to Date</p>
            <p className="text-xl font-semibold text-gray-900">ETB 0.00</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-xl font-semibold text-red-600">0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expiring Soon</p>
            <p className="text-xl font-semibold text-yellow-600">0</p>
          </div>
        </div>
      </Card>

      {/* Note about implementation */}
      <Card className="bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Detailed report pages are under development. 
          These will include charts, export options (PDF/Excel), and detailed analytics.
        </p>
      </Card>
    </div>
  );
};

export default Reports;
