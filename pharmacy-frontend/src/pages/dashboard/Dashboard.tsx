import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  CubeIcon,
  UserGroupIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { dashboardService, DashboardSummary, InventoryInsights } from '../../services/api/dashboard.service';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [inventory, setInventory] = useState<InventoryInsights | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [summaryRes, inventoryRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getInventoryInsights()
      ]);

      if (summaryRes.success && summaryRes.data) {
        console.log('Dashboard Summary:', summaryRes.data);
        setSummary(summaryRes.data);
      }

      if (inventoryRes.success && inventoryRes.data) {
        setInventory(inventoryRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
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

  // Generate sample data for chart when no data exists
  const generateSampleChartData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        total: 0
      });
    }
    return data;
  };

  const chartData = summary?.sales_chart?.length ? summary.sales_chart : generateSampleChartData();
  const hasSalesData = chartData.some(d => d.total > 0);

  // Card click handlers
  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const stats = [
    {
      name: 'Total Stock Value',
      value: inventory?.stock_value?.retail || 0,
      subtext: 'Retail value',
      icon: CubeIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      format: 'currency',
      path: '/inventory',
      description: 'View detailed inventory valuation',
    },
    {
      name: 'Low Stock Items',
      value: summary?.counts?.low_stock || 0,
      subtext: 'Below reorder level',
      icon: ExclamationTriangleIcon,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      format: 'number',
      path: '/medicines?filter=low-stock',
      description: 'View medicines that need reordering',
    },
    {
      name: 'Expiring Soon',
      value: summary?.counts?.expiring_soon || 0,
      subtext: 'Within 30 days',
      icon: BeakerIcon,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      format: 'number',
      path: '/inventory/batches?filter=expiring',
      description: 'View batches expiring soon',
    },
    {
      name: 'Total Medicines',
      value: summary?.counts?.medicines || 0,
      subtext: 'Active products',
      icon: CubeIcon,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      format: 'number',
      path: '/medicines',
      description: 'View all medicines',
    },
    {
      name: 'Total Customers',
      value: summary?.counts?.customers || 0,
      subtext: 'Registered patients',
      icon: UserGroupIcon,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      format: 'number',
      path: '/customers',
      description: 'View all customers',
    },
    {
      name: 'Today\'s Sales',
      value: summary?.sales?.today || 0,
      subtext: 'Total revenue',
      icon: CurrencyDollarIcon,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      format: 'currency',
      path: '/sales',
      description: 'View today\'s sales',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your pharmacy.
        </p>
      </div>

      {/* Stats Grid - Clickable Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            onClick={() => handleCardClick(stat.path)}
            className="cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Card className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {stat.format === 'currency' 
                      ? formatCurrency(stat.value as number)
                      : formatNumber(stat.value as number)
                    }
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {stat.subtext}
                  </p>
                  <p className="mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view details →
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sales Overview (Last 7 Days)</h3>
            {!hasSalesData && (
              <Badge variant="info" size="sm">No Data</Badge>
            )}
          </div>
          <div className="h-80">
            {hasSalesData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Sales']}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ChartBarIcon className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">No Sales Data</p>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  Start making sales to see your revenue trends here. 
                  Visit the Sales page to create your first transaction.
                </p>
                <button
                  onClick={() => navigate('/sales/checkout')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Sale
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Stock Value by Category */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Value by Category</h3>
          <div className="h-80 overflow-y-auto">
            {inventory?.category_breakdown && inventory.category_breakdown.length > 0 ? (
              <div className="space-y-4">
                {inventory.category_breakdown.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {category.category}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(category.value)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{
                            width: `${(category.value / (inventory?.stock_value?.retail || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <CubeIcon className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">No Inventory Data</p>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  Add medicines and batches to see your stock value breakdown by category.
                </p>
                <button
                  onClick={() => navigate('/medicines')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Medicine
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Expiring Soon Alert */}
      {inventory?.expiring_soon?.count ? inventory.expiring_soon.count > 0 && (
        <div onClick={() => navigate('/inventory/batches?filter=expiring')} className="cursor-pointer">
          <Card className="bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <BeakerIcon className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Expiring Soon Alert
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {inventory.expiring_soon.count} batch{inventory.expiring_soon.count > 1 ? 'es' : ''} expiring within 30 days.
                  Total value at risk: {formatCurrency(inventory.expiring_soon.batches.reduce((sum, b) => sum + b.value, 0))}
                </p>
              </div>
              <Badge variant="danger" size="sm">
                Action Required
              </Badge>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Low Stock Alert */}
      {summary?.counts?.low_stock ? summary.counts.low_stock > 0 && (
        <div onClick={() => navigate('/medicines?filter=low-stock')} className="cursor-pointer">
          <Card className="bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Low Stock Alert
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  {summary.counts.low_stock} medicine{summary.counts.low_stock > 1 ? 's are' : ' is'} below reorder level.
                  Please restock soon.
                </p>
              </div>
              <Badge variant="warning" size="sm">
                Action Required
              </Badge>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Top Selling Products */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
          <span className="text-xs text-gray-500">Last 30 days</span>
        </div>
        <div className="space-y-4">
          {summary?.top_selling && summary.top_selling.length > 0 ? (
            summary.top_selling.map((product, index) => (
              <div
                key={product.medicine_id}
                onClick={() => navigate(`/medicines/${product.medicine_id}`)}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-gray-100 text-gray-700' : 
                      index === 2 ? 'bg-orange-100 text-orange-700' : 
                      'bg-blue-50 text-blue-700'}
                  `}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.medicine_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatNumber(product.total_quantity)} units sold
                    </p>
                    {product.current_stock !== undefined && (
                      <p className="text-xs text-gray-400">
                        Current stock: {formatNumber(product.current_stock)} units
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.total_revenue)}
                  </p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <ChartBarIcon className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">No Sales Data</p>
              <p className="text-xs text-gray-500">Complete sales to see your top products</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
