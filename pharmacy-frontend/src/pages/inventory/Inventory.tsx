import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { dashboardService, InventoryInsights } from '../../services/api/dashboard.service';
import { batchService, Batch } from '../../services/api/batch.service';

const Inventory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryInsights | null>(null);
  const [recentBatches, setRecentBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [expiredCount, setExpiredCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    fetchInventoryData();
    fetchRecentBatches();
    fetchExpiryStats();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getInventoryInsights();
      if (response.success && response.data) {
        setInventory(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBatches = async () => {
    try {
      setLoadingBatches(true);
      const response = await batchService.getAll();
      if (response.success) {
        // Get the 5 most recent batches
        const sorted = (response.data || [])
          .sort((a: Batch, b: Batch) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 5);
        setRecentBatches(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch recent batches:', error);
    } finally {
      setLoadingBatches(false);
    }
  };

  const fetchExpiryStats = async () => {
    try {
      const response = await batchService.getAll();
      if (response.success) {
        const batches = response.data || [];
        const expired = batches.filter((b: Batch) => (b.days_until_expiry || 0) < 0).length;
        const critical = batches.filter((b: Batch) => {
          const days = b.days_until_expiry || 0;
          return days > 0 && days <= 30;
        }).length;
        
        setExpiredCount(expired);
        setCriticalCount(critical);
      }
    } catch (error) {
      console.error('Failed to fetch expiry stats:', error);
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

  const getMedicineName = (batch: Batch): string => {
    if (batch.medicine?.name) return batch.medicine.name;
    if ((batch as any).batch_medicine?.name) return (batch as any).batch_medicine.name;
    if ((batch as any).medicine_name) return (batch as any).medicine_name;
    return 'Unknown Medicine';
  };

  const getExpiryStatusBadge = (days: number) => {
    if (days < 0) return <Badge variant="danger">Expired</Badge>;
    if (days <= 30) return <Badge variant="danger">Critical</Badge>;
    if (days <= 90) return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="success">Good</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalStockValue = inventory?.stock_value?.retail || 0;
  const totalCostValue = inventory?.stock_value?.cost || 0;
  const potentialProfit = totalStockValue - totalCostValue;
  const profitMargin = totalCostValue > 0 ? (potentialProfit / totalCostValue) * 100 : 0;

  const expiringCount = inventory?.expiring_soon?.count || 0;
  const expiringValue = inventory?.expiring_soon?.batches?.reduce((sum, b) => sum + b.value, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your stock levels, monitor expiry dates, and manage inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Wastage Button - FIXED: Now points to correct wastage page */}
          <Link to="/inventory/wastage">
            <Button 
              variant="danger" 
              icon={<ExclamationTriangleIcon className="w-5 h-5" />}
            >
              Wastage ({expiredCount})
            </Button>
          </Link>
          <Link to="/inventory/batches">
            <Button variant="primary" icon={<CubeIcon className="w-5 h-5" />}>
              View All Batches
            </Button>
          </Link>
        </div>
      </div>

      {/* Expiry Alerts Summary */}
      {(expiredCount > 0 || criticalCount > 0) && (
        <Card className="bg-red-50 border border-red-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">⚠️ Expiry Alerts</h3>
              <div className="mt-2 flex flex-wrap gap-4">
                {expiredCount > 0 && (
                  <Link to="/inventory/wastage" className="flex items-center gap-2 text-sm text-red-700 hover:text-red-800">
                    <span className="font-bold">{expiredCount}</span> expired batch(es) need write-off
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                )}
                {criticalCount > 0 && (
                  <Link to="/inventory/batches?filter=critical" className="flex items-center gap-2 text-sm text-orange-700 hover:text-orange-800">
                    <span className="font-bold">{criticalCount}</span> critical batch(es) expiring soon
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Stock Value */}
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Stock Value</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {formatCurrency(totalStockValue)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Cost: {formatCurrency(totalCostValue)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Potential Profit</span>
              <span className="font-medium text-green-600">{formatCurrency(potentialProfit)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Profit Margin</span>
              <span className="font-medium text-gray-900">{profitMargin.toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        {/* Expiring Soon - Links to expiring batches */}
        <Link to="/inventory/batches?filter=expiring" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {formatNumber(expiringCount)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Value at risk: {formatCurrency(expiringValue)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <BeakerIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <span className="text-sm text-red-600 flex items-center gap-1">
                View expiring batches <ArrowRightIcon className="w-4 h-4" />
              </span>
            </div>
          </Card>
        </Link>

        {/* Low Stock Items - Links to medicines with low stock */}
        <Link to="/medicines?filter=low-stock" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                <p className="mt-2 text-3xl font-semibold text-yellow-600">
                  {formatNumber(inventory?.out_of_stock?.length || 0)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Medicines below reorder level
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <span className="text-sm text-yellow-600 flex items-center gap-1">
                View low stock <ArrowRightIcon className="w-4 h-4" />
              </span>
            </div>
          </Card>
        </Link>

        {/* Total Batches */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Batches</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {formatNumber(recentBatches.length)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Active inventory batches
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CubeIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Value by Category</h3>
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
                        width: `${(category.value / totalStockValue) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No category data available
          </div>
        )}
      </Card>

      {/* Recent Batches */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Batches</h3>
          <Link to="/inventory/batches" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>

        {loadingBatches ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : recentBatches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CubeIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm">No batches found</p>
            <p className="text-xs text-gray-400 mt-1">Add your first batch to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBatches.map((batch) => (
                  <tr key={batch.batch_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {batch.batch_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getMedicineName(batch)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(batch.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getExpiryStatusBadge(batch.days_until_expiry || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/inventory/batches`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Out of Stock Alert */}
      {inventory?.out_of_stock && inventory.out_of_stock.length > 0 && (
        <Card className="bg-red-50 border border-red-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Out of Stock Alert
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {inventory.out_of_stock.length} medicine{inventory.out_of_stock.length > 1 ? 's are' : ' is'} completely out of stock.
              </p>
              <div className="mt-3">
                <Link to="/medicines?filter=out-of-stock">
                  <Button variant="danger" size="sm">
                    View Out of Stock Items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Inventory;
