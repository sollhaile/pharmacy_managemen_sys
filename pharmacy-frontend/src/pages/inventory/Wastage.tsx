import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { wastageService, Wastage as WastageType } from '../../services/api/wastage.service';
import { batchService, Batch } from '../../services/api/batch.service';

const WastagePage: React.FC = () => {
  const [wastageReports, setWastageReports] = useState<WastageType[]>([]);
  const [expiredBatches, setExpiredBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWastageModal, setShowWastageModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchWastageReports(),
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

  const fetchExpiredBatches = async () => {
    try {
      const response = await batchService.getExpired();
      if (response.success) {
        console.log('Expired batches fetched:', response.data);
        setExpiredBatches(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch expired batches:', error);
    }
  };

  const handleWastageSubmit = async () => {
    if (!selectedBatch) return;

    if (quantity <= 0 || quantity > selectedBatch.quantity) {
      toast.error(`Quantity must be between 1 and ${selectedBatch.quantity}`);
      return;
    }

    try {
      const response = await wastageService.create({
        batch_id: selectedBatch.batch_id,
        quantity,
        reason: 'EXPIRED',
        notes: notes || `Expired batch written off. Expired on ${new Date(selectedBatch.expiry_date).toLocaleDateString()}`
      });

      if (response.success) {
        toast.success('Wastage reported successfully');
        setShowWastageModal(false);
        setSelectedBatch(null);
        setQuantity(1);
        setNotes('');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to report wastage:', error);
      toast.error('Failed to report wastage');
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

  const calculateTotalLoss = () => {
    return wastageReports.reduce((sum, report) => sum + report.total_loss, 0);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const getMedicineName = (batch: Batch): string => {
    if (batch.medicine?.name) return batch.medicine.name;
    if ((batch as any).batch_medicine?.name) return (batch as any).batch_medicine.name;
    if ((batch as any).medicine_name) return (batch as any).medicine_name;
    return 'Unknown Medicine';
  };

  const getDaysExpiredText = (days: number) => {
    if (days === 0) return 'Expires today';
    if (days > 0) return `${days} days until expiry`;
    
    const absDays = Math.abs(days);
    if (absDays === 1) return 'Expired yesterday';
    return `Expired ${absDays} days ago`;
  };

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
      </div>

      {/* Debug Info - Remove in production */}
      <Card className="bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
        <p className="text-xs text-gray-600">
          Expired batches found: {expiredBatches.length}<br />
          Today's date: {new Date().toLocaleDateString()}<br />
          {expiredBatches.map(b => (
            <span key={b.batch_id} className="block">
              Batch {b.batch_number}: Expires {new Date(b.expiry_date).toLocaleDateString()}, 
              Days: {b.days_until_expiry}, Status: {b.expiry_status}
            </span>
          ))}
        </p>
      </Card>

      {/* Expired Batches Alert - Only shows when there are ACTUAL expired batches */}
      {expiredBatches.length > 0 ? (
        <Card className="bg-red-50 border border-red-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                ⚠️ {expiredBatches.length} Expired Batch{expiredBatches.length > 1 ? 'es' : ''} Found
              </h3>
              <p className="mt-1 text-sm text-red-700">
                These batches have expired and cannot be sold. Please write them off immediately.
              </p>
              
              <div className="mt-4 space-y-3">
                {expiredBatches.map((batch) => {
                  const lossValue = batch.quantity * Number(batch.cost_price || 0);
                  
                  return (
                    <div key={batch.batch_id} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-base font-semibold text-gray-900">
                              {getMedicineName(batch)}
                            </h4>
                            <Badge variant="danger">EXPIRED</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Batch:</span>
                              <span className="ml-2 font-medium">{batch.batch_number}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Expired:</span>
                              <span className="ml-2 font-medium text-red-600">
                                {getDaysExpiredText(batch.days_until_expiry || 0)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Stock:</span>
                              <span className="ml-2 font-medium">{batch.quantity} units</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Loss Value:</span>
                              <span className="ml-2 font-medium text-red-600">
                                {formatCurrency(lossValue)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            Expiry Date: {new Date(batch.expiry_date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedBatch(batch);
                            setQuantity(batch.quantity);
                            setShowWastageModal(true);
                          }}
                          className="whitespace-nowrap"
                        >
                          Write Off {batch.quantity} units
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-green-50 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">
                No Expired Batches
              </h3>
              <p className="text-sm text-green-700">
                All batches are within their expiry dates. Good job managing your inventory!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Wastage Reports</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {wastageReports.length}
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
              <p className="text-sm font-medium text-gray-500">Active Expired Batches</p>
              <p className="mt-2 text-3xl font-semibold text-red-600">
                {expiredBatches.length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Date Filter */}
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
            onClick={handleDateFilter}
          >
            Filter
          </Button>
        </div>
      </Card>

      {/* Wastage History */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wastage History</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : wastageReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No wastage records found
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
                  <tr key={report.wastage_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.reported_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.medicine_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.batch_number}
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

      {/* Write-off Modal */}
      <Modal
        isOpen={showWastageModal}
        onClose={() => {
          setShowWastageModal(false);
          setSelectedBatch(null);
          setQuantity(1);
          setNotes('');
        }}
        title="Write Off Expired Batch"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowWastageModal(false);
                setSelectedBatch(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleWastageSubmit}
            >
              Confirm Write-Off
            </Button>
          </div>
        }
      >
        {selectedBatch && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                <strong className="text-red-800">⚠️ EXPIRED BATCH</strong><br />
                <strong>Medicine:</strong> {getMedicineName(selectedBatch)}<br />
                <strong>Batch:</strong> {selectedBatch.batch_number}<br />
                <strong>Expiry Date:</strong> {new Date(selectedBatch.expiry_date).toLocaleDateString()}<br />
                <strong>Days Until Expiry:</strong> {selectedBatch.days_until_expiry} days<br />
                <strong>Status:</strong> {selectedBatch.expiry_status}<br />
                <strong>Stock:</strong> {selectedBatch.quantity} units<br />
                <strong>Cost Price:</strong> {formatCurrency(Number(selectedBatch.cost_price || 0))} per unit
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to write off *
              </label>
              <input
                type="number"
                min="1"
                max={selectedBatch.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(selectedBatch.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
              <p className="mt-1 text-sm font-medium text-red-600">
                Loss amount: {formatCurrency(quantity * Number(selectedBatch.cost_price || 0))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WastagePage;
