import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CubeIcon,
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { reportService } from '../../services/api/report.service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SalesReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.getSalesReport(period, dateRange.startDate, dateRange.endDate);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
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

  const handleExport = () => {
    if (!reportData?.daily) return;
    reportService.exportToCSV(reportData.daily, `sales_report_${period}_${dateRange.startDate}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sales Report</h2>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
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
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.total_revenue)}
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
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(reportData.summary.total_profit)}
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
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(reportData.summary.total_transactions)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Transaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.avg_transaction_value)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sales Trend Chart */}
      {reportData?.daily && reportData.daily.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.daily}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0ea5e9"
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        {reportData?.top_products && reportData.top_products.length > 0 && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.top_products.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="medicine_name" width={100} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Top Customers */}
        {reportData?.top_customers && reportData.top_customers.length > 0 && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h3>
            <div className="space-y-4">
              {reportData.top_customers.slice(0, 5).map((customer: any, index: number) => (
                <div key={customer.customer_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-gray-100 text-gray-700' : 
                        index === 2 ? 'bg-orange-100 text-orange-700' : 
                        'bg-blue-50 text-blue-700'}`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.customer_name}</p>
                      <p className="text-sm text-gray-500">{customer.visit_count} visits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(customer.total_spent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Daily Breakdown Table */}
      {reportData?.daily && reportData.daily.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg per Transaction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.daily.map((day: any) => (
                  <tr key={day.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(day.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {day.transactions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(day.revenue / day.transactions)}
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

export default SalesReport;
