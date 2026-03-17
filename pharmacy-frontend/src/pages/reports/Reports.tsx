import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  CubeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import axiosInstance from '../../services/api/axios';
import { dashboardService } from '../../services/api/dashboard.service';
import { medicineService } from '../../services/api/medicine.service';
import { supplierService } from '../../services/api/supplier.service';
import SalesReport from './SalesReport';
import InventoryReport from './InventoryReport';
import ExpiryReport from './ExpiryReport';

// Export the Dashboard component so it can be used in routes
export const ReportDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [expiringData, setExpiringData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalBatches: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    salesToday: 0,
    salesMonth: 0,
    lowStock: 0,
    expiringSoon: 0,
    expiringValue: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [summaryRes, medicinesRes, suppliersRes, batchesRes, expiringRes] = await Promise.all([
        dashboardService.getSummary(),
        medicineService.getAll(),
        supplierService.getAll(),
        axiosInstance.get('/batches/count').catch(() => ({ data: { data: 0 } })),
        axiosInstance.get('/batches/expiring?days=90').catch(() => ({ data: { data: [] } }))
      ]);

      // Calculate expiring value
      const expiringBatches = expiringRes.data?.data || [];
      const expiringValue = expiringBatches.reduce((sum: number, batch: any) => {
        return sum + (batch.quantity * (batch.cost_price || 0));
      }, 0);

      setExpiringData(expiringBatches);

      setStats({
        totalMedicines: summaryRes.data?.counts?.medicines || 0,
        totalBatches: batchesRes.data?.data || 0,
        totalCustomers: summaryRes.data?.counts?.customers || 0,
        totalSuppliers: suppliersRes.data?.length || 0,
        salesToday: summaryRes.data?.sales?.today || 0,
        salesMonth: summaryRes.data?.sales?.month || 0,
        lowStock: summaryRes.data?.counts?.low_stock || 0,
        expiringSoon: expiringBatches.length || 0,
        expiringValue
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Summary Card */}
        <Link to="/reports/sales">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Sales Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Revenue, profit, top products, and customer analytics
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Today</p>
                <p className="text-sm font-medium">{formatCurrency(stats.salesToday)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Month</p>
                <p className="text-sm font-medium">{formatCurrency(stats.salesMonth)}</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Inventory Summary Card */}
        <Link to="/reports/inventory">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Inventory Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Stock value, category breakdown, low stock alerts
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <CubeIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Medicines</p>
                <p className="text-sm font-medium">{formatNumber(stats.totalMedicines)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Low Stock</p>
                <p className="text-sm font-medium text-yellow-600">{formatNumber(stats.lowStock)}</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Expiry Summary Card */}
        <Link to="/reports/expiry">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Expiry Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Expiring batches, value at risk, status distribution
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <ClockIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Expiring Soon</p>
                <p className="text-sm font-medium text-red-600">{formatNumber(stats.expiringSoon)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Value at Risk</p>
                <p className="text-sm font-medium text-red-600">{formatCurrency(stats.expiringValue)}</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Quick Stats Card */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
              <p className="text-sm text-gray-500 mt-1">Key metrics at a glance</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DocumentChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Medicines</p>
              <p className="text-sm font-medium">{formatNumber(stats.totalMedicines)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Batches</p>
              <p className="text-sm font-medium">{formatNumber(stats.totalBatches)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Customers</p>
              <p className="text-sm font-medium">{formatNumber(stats.totalCustomers)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Suppliers</p>
              <p className="text-sm font-medium">{formatNumber(stats.totalSuppliers)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Expiring Soon Preview */}
      {expiringData.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Expiring Soon (Next 90 Days)</h3>
            <Link to="/reports/expiry" className="text-sm text-blue-600 hover:text-blue-800">
              View Full Report →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Medicine</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Batch</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Expiry Date</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Days Left</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Value</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expiringData.slice(0, 5).map((batch: any) => {
                  const daysLeft = batch.days_until_expiry;
                  const value = batch.quantity * (batch.cost_price || 0);
                  
                  let statusColor = 'bg-green-100 text-green-800';
                  if (daysLeft <= 30) statusColor = 'bg-red-100 text-red-800';
                  else if (daysLeft <= 60) statusColor = 'bg-yellow-100 text-yellow-800';
                  
                  return (
                    <tr key={batch.batch_id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {batch.batch_medicine?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {batch.batch_number}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {new Date(batch.expiry_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {daysLeft}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {batch.quantity}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(value)}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                          {daysLeft <= 30 ? 'Critical' : daysLeft <= 60 ? 'Warning' : 'Monitoring'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

const Reports: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('sales')) return 'sales';
    if (location.pathname.includes('inventory')) return 'inventory';
    if (location.pathname.includes('expiry')) return 'expiry';
    return 'dashboard';
  });

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon, path: '/reports' },
    { id: 'sales', name: 'Sales Report', icon: CurrencyDollarIcon, path: '/reports/sales' },
    { id: 'inventory', name: 'Inventory Report', icon: CubeIcon, path: '/reports/inventory' },
    { id: 'expiry', name: 'Expiry Report', icon: ClockIcon, path: '/reports/expiry' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive business insights with interactive charts and detailed analytics
        </p>
      </div>

      {/* Navigation Tabs */}
      <Card className="p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Report Routes */}
      <Routes>
        <Route path="/" element={<ReportDashboard />} />
        <Route path="/sales" element={<SalesReport />} />
        <Route path="/inventory" element={<InventoryReport />} />
        <Route path="/expiry" element={<ExpiryReport />} />
      </Routes>
    </div>
  );
};

export default Reports;
