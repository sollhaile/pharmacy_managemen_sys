import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { reportService } from '../../services/api/report.service';

const COLORS = {
  GOOD: '#00C49F',
  WARNING: '#FFBB28',
  CRITICAL: '#FF8042',
  EXPIRED: '#FF4444'
};

const ExpiryReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [daysFilter, setDaysFilter] = useState(90);

  useEffect(() => {
    fetchReport();
  }, [daysFilter]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.getExpiryReport(daysFilter);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch expiry report:', error);
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

  const getStatusBadge = (days: number) => {
    if (days < 0) return <Badge variant="danger">Expired</Badge>;
    if (days <= 30) return <Badge variant="danger">Critical</Badge>;
    if (days <= 90) return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="success">Good</Badge>;
  };

  const handleExport = () => {
    if (!reportData?.critical_batches) return;
    reportService.exportToCSV(reportData.critical_batches, 'expiring_batches');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  // Prepare chart data
  const statusData = [
    { name: 'Good', value: reportData?.summary?.total_batches - reportData?.critical_batches?.length || 0 },
    { name: 'Warning', value: reportData?.critical_batches?.filter((b: any) => b.days_left > 30 && b.days_left <= 90).length || 0 },
    { name: 'Critical', value: reportData?.critical_batches?.filter((b: any) => b.days_left > 0 && b.days_left <= 30).length || 0 },
    { name: 'Expired', value: reportData?.critical_batches?.filter((b: any) => b.days_left <= 0).length || 0 }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Expiry Report</h2>
        <div className="flex items-center gap-3">
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={30}>Next 30 days</option>
            <option value={60}>Next 60 days</option>
            <option value={90}>Next 90 days</option>
            <option value={180}>Next 6 months</option>
            <option value={365}>Next year</option>
          </select>
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowDownTrayIcon className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Batches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(reportData.summary.total_batches)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.total_value)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatNumber(reportData.summary.expiring_30_days)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatNumber(reportData.summary.expired)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {statusData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution Pie Chart */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Expiry Status Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Value at Risk Bar Chart */}
          {reportData?.by_month && reportData.by_month.length > 0 && (
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Value at Risk by Month</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.by_month}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="value" fill="#ff8042" name="Value at Risk" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Critical Batches Table */}
      {reportData?.critical_batches && reportData.critical_batches.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {daysFilter <= 30 ? 'Critical' : 'Expiring'} Batches
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Days Left</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.critical_batches.map((batch: any) => (
                  <tr key={batch.batch_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {batch.medicine_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.batch_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(batch.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {batch.days_left}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {batch.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(batch.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(batch.days_left)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExpiryReport;
