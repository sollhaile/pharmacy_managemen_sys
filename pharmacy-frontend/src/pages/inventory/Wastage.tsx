import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PlusIcon,
  DocumentTextIcon,
  ArrowPathIcon,  // ✅ Changed from RefreshIcon to ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import WastageForm from '../../components/forms/WastageForm';
import { wastageService, Wastage as WastageType, WastageSummary } from '../../services/api/wastage.service';
import { batchService, Batch } from '../../services/api/batch.service';

const WastagePage: React.FC = () => {
  const [wastageReports, setWastageReports] = useState<WastageType[]>([]);
  const [summary, setSummary] = useState<WastageSummary | null>(null);
  const [expiredBatches, setExpiredBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWastageModal, setShowWastageModal] = useState(false);
  const [showAutoDetectModal, setShowAutoDetectModal] = useState(false);
  const [autoDetectResults, setAutoDetectResults] = useState<any>(null);
  const [autoDetectLoading, setAutoDetectLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedReason, setSelectedReason] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchWastageReports(),
        fetchSummary(),
        fetchExpiredBatches()
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWastageReports = async () => {
    try {
      const response = await wastageService.getAll();
      if (response.success) {
        setWastageReports(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch wastage reports:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await wastageService.getSummary();
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const fetchExpiredBatches = async () => {
    try {
      const response = await batchService.getExpired();
      if (response.success) {
        setExpiredBatches(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch expired batches:', error);
    }
  };

  const handleWastageSubmit = async (data: any) => {
    try {
      const response = await wastageService.create(data);
      if (response.success) {
        toast.success('Wastage reported successfully');
        setShowWastageModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to report wastage:', error);
      toast.error('Failed to report wastage');
    }
  };

  const handleAutoDetect = async () => {
    try {
      setAutoDetectLoading(true);
      const response = await wastageService.autoDetectExpired();
      console.log('Auto-detect response:', response);
      
      if (response.success) {
        setAutoDetectResults(response.data);
        setShowAutoDetectModal(true);
        fetchData();
        toast.success(`Auto-detected ${response.data.processed} expired batches`);
      } else {
        toast.error('Auto-detect failed');
      }
    } catch (error) {
      console.error('Auto-detect failed:', error);
      toast.error('Auto-detect endpoint not available');
    } finally {
      setAutoDetectLoading(false);
    }
  };

  const handleDateFilter = async () => {
    try {
      setLoading(true);
      const response = await wastageService.getByDateRange(dateRange.startDate, dateRange.endDate);
      if (response.success) {
        setWastageReports(response.data || []);
      }
    } catch (error) {
      console.error('Failed to filter wastage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReasonFilter = async (reason: string) => {
    try {
      setLoading(true);
      setSelectedReason(reason);
      if (reason) {
        const response = await wastageService.getByReason(reason);
        if (response.success) {
          setWastageReports(response.data || []);
        }
      } else {
        fetchWastageReports();
      }
    } catch (error) {
      console.error('Failed to filter by reason:', error);
    } finally {
      setLoading(false);
    }
  };

const calculateTotalLoss = () => {
  if (!wastageReports || wastageReports.length === 0) return 0;
  
  return wastageReports.reduce((sum, report) => {
    // Handle different data types safely
    let loss = 0;
    
    if (typeof report.total_loss === 'number') {
      loss = report.total_loss;
    } else if (typeof report.total_loss === 'string') {
      loss = parseFloat(report.total_loss) || 0;
    } else if (report.total_loss) {
      loss = Number(report.total_loss) || 0;
    }
    
    return sum + loss;
  }, 0);
};

  const getReasonBadge = (reason: string) => {
    const variants: Record<string, 'danger' | 'warning' | 'info' | 'default'> = {
      EXPIRED: 'danger',
      DAMAGED: 'warning',
      SPILLED: 'warning',
      BROKEN: 'warning',
      THEFT: 'danger',
      OTHER: 'default'
    };
    return <Badge variant={variants[reason] || 'default'}>{reason}</Badge>;
  };

 const formatCurrency = (value: number) => {
  // Ensure value is a valid number
  const validValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(validValue);
};
  const reasons = ['EXPIRED', 'DAMAGED', 'SPILLED', 'BROKEN', 'THEFT', 'OTHER'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/inventory">
            <Button variant="secondary" size="sm" icon={<ArrowLeftIcon className="w-4 h-4" />}>
              Back to Inventory
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wastage Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track expired, damaged, and lost medicine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<PlusIcon className="w-5 h-5" />}
            onClick={() => setShowWastageModal(true)}
          >
            Manual Entry
          </Button>
          <Button
            variant="danger"
            icon={<ArrowPathIcon className="w-5 h-5" />}  // ✅ Fixed icon
            onClick={handleAutoDetect}
            disabled={expiredBatches.length === 0 || autoDetectLoading}
            loading={autoDetectLoading}
          >
            Auto-Detect ({expiredBatches.length})
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {wastageReports.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Financial Loss</p>
              <p className="mt-2 text-3xl font-semibold text-red-600">
                {formatCurrency(calculateTotalLoss())}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Expired Loss</p>
              <p className="mt-2 text-3xl font-semibold text-red-600">
                {formatCurrency(
                  wastageReports
                    .filter(r => r.reason === 'EXPIRED')
                    .reduce((sum, r) => sum + r.total_loss, 0)
                )}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Expired</p>
              <p className="mt-2 text-3xl font-semibold text-orange-600">
                {expiredBatches.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
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
              onClick={handleDateFilter}
            >
              Filter
            </Button>
          </div>

          {/* Reason Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedReason === '' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleReasonFilter('')}
            >
              All
            </Button>
            {reasons.map((reason) => (
              <Button
                key={reason}
                variant={selectedReason === reason ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleReasonFilter(reason)}
              >
                {reason}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Expired Batches Alert */}
      {expiredBatches.length > 0 && (
        <Card className="bg-red-50 border border-red-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                ⚠️ {expiredBatches.length} Expired Batch{expiredBatches.length > 1 ? 'es' : ''} Detected
              </h3>
              <p className="mt-1 text-sm text-red-700">
                These batches have expired. Click "Auto-Detect" to add them to wastage records.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Wastage Reports Table */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wastage Records</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : wastageReports.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No wastage records</p>
            <p className="text-sm text-gray-500">
              Add your first wastage record manually or use auto-detect for expired batches.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost/Unit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Loss</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wastageReports.map((report) => (
                  <tr key={report.wastage_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.reported_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.medicine_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.batch_number || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getReasonBadge(report.reason)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {report.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(report.cost_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                      {formatCurrency(report.total_loss)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Total Loss:
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                    {formatCurrency(calculateTotalLoss())}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {/* Manual Wastage Modal */}
      <Modal
        isOpen={showWastageModal}
        onClose={() => setShowWastageModal(false)}
        title="Report Wastage - Manual Entry"
        size="lg"
      >
        <WastageForm
          onSubmit={handleWastageSubmit}
          onCancel={() => setShowWastageModal(false)}
        />
      </Modal>

      {/* Auto-Detect Results Modal */}
      <Modal
        isOpen={showAutoDetectModal}
        onClose={() => setShowAutoDetectModal(false)}
        title="Auto-Detect Results"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowAutoDetectModal(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        {autoDetectResults && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <strong>✅ Successfully processed!</strong><br />
                <span className="text-lg font-bold">{autoDetectResults.processed}</span> expired batches processed.<br />
                Total loss added: <span className="font-bold">{formatCurrency(autoDetectResults.total_loss)}</span>
              </p>
            </div>

            {autoDetectResults.details && autoDetectResults.details.length > 0 && (
              <>
                <h4 className="font-medium text-gray-900">Processed Batches:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Medicine</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Batch</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Loss</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {autoDetectResults.details.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{item.medicine_name}</td>
                          <td className="px-4 py-2 text-sm">{item.batch_number}</td>
                          <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right text-red-600 font-medium">
                            {formatCurrency(item.loss)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-medium">Total:</td>
                        <td className="px-4 py-2 text-right font-bold text-red-600">
                          {formatCurrency(autoDetectResults.total_loss)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WastagePage;
