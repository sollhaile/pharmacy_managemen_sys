import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, CubeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import { batchService, Batch } from '../../services/api/batch.service';
import { useDebounce } from '../../hooks/useDebounce';

const Batches: React.FC = () => {
  const location = useLocation();
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [displayedBatches, setDisplayedBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'expiring' | 'critical' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Check for filter in URL on initial load and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    
    if (filterParam === 'expiring') {
      setFilter('expiring');
    } else if (filterParam === 'critical') {
      setFilter('critical');
    } else if (filterParam === 'expired') {
      setFilter('expired');
    } else {
      setFilter('all');
    }
  }, [location]);

  // Load all batches on component mount
  useEffect(() => {
    fetchAllBatches();
  }, []);

  // Apply filters whenever filter, allBatches, or searchTerm changes
  useEffect(() => {
    if (!allBatches.length) return;

    let filtered = [...allBatches];
    
    // Apply status filter
    if (filter === 'expiring') {
      filtered = filtered.filter(b => {
        const days = b.days_until_expiry || 0;
        return days > 0 && days <= 30;
      });
    } else if (filter === 'critical') {
      filtered = filtered.filter(b => {
        const days = b.days_until_expiry || 0;
        return days > 0 && days <= 180;
      });
    } else if (filter === 'expired') {
      filtered = filtered.filter(b => (b.days_until_expiry || 0) < 0);
    }
    
    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(batch => {
        const medicineName = getMedicineName(batch).toLowerCase();
        const batchNumber = batch.batch_number.toLowerCase();
        return medicineName.includes(searchLower) || batchNumber.includes(searchLower);
      });
    }
    
    setDisplayedBatches(filtered);
  }, [filter, allBatches, debouncedSearch]);

  const fetchAllBatches = async () => {
    try {
      setLoading(true);
      const response = await batchService.getAll();
      if (response.success) {
        console.log('Fetched batches:', response.data);
        setAllBatches(response.data || []);
        setDisplayedBatches(response.data || []);
      } else {
        toast.error('Failed to load batches');
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const getExpiryStatusBadge = (days: number) => {
    if (days < 0) return <Badge variant="danger">Expired</Badge>;
    if (days <= 180) return <Badge variant="danger">Critical</Badge>;
    if (days <= 90) return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="success">Good</Badge>;
  };

  // Helper function to get medicine name safely
  const getMedicineName = (batch: Batch): string => {
    if (batch.medicine?.name) return batch.medicine.name;
    if ((batch as any).batch_medicine?.name) return (batch as any).batch_medicine.name;
    if ((batch as any).medicine_name) return (batch as any).medicine_name;
    return 'Unknown Medicine';
  };

  const getFilterTitle = () => {
    switch(filter) {
      case 'expiring': return 'Expiring Soon (30 days)';
      case 'critical': return 'Critical Batches (1-180 days)';
      case 'expired': return 'Expired Batches';
      default: return 'All Batches';
    }
  };

  const getFilterDescription = () => {
    switch(filter) {
      case 'expiring':
        return 'Batches expiring within the next 30 days';
      case 'critical':
        return 'Batches that are critical and cannot be sold';
      case 'expired':
        return 'Batches that have expired and need to be written off';
      default:
        return 'Track medicine batches and expiry dates';
    }
  };

  // Calculate counts for filter cards
  const getCounts = () => {
    const total = allBatches.length;
    const expiring = allBatches.filter(b => {
      const days = b.days_until_expiry || 0;
      return days > 0 && days <= 180;
    }).length;
    const expired = allBatches.filter(b => (b.days_until_expiry || 0) < 0).length;
    
    return { total, expiring, expired };
  };

  const counts = getCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/inventory">
            <Button variant="secondary" size="sm" icon={<ArrowLeftIcon className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getFilterTitle()}</h1>
            <p className="mt-1 text-sm text-gray-500">{getFilterDescription()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {filter !== 'all' && (
            <Link to="/inventory/batches">
              <Button variant="secondary" size="sm">
                View All Batches
              </Button>
            </Link>
          )}
          {filter === 'expired' && (
            <Link to="/inventory/wastage">
              <Button variant="danger" size="sm">
                Go to Wastage
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <Input
          placeholder="Search by medicine name or batch number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
        />
      </Card>

      {/* Filter Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/inventory/batches" className="block">
          <Card className={`p-3 hover:shadow-md transition-shadow ${filter === 'all' ? 'border-2 border-blue-500 bg-blue-50' : ''}`}>
            <p className="text-sm font-medium text-gray-500">All Batches</p>
            <p className="text-xl font-semibold">{counts.total}</p>
          </Card>
        </Link>
        <Link to="/inventory/batches?filter=expiring" className="block">
          <Card className={`p-3 hover:shadow-md transition-shadow ${filter === 'expiring' ? 'border-2 border-yellow-500 bg-yellow-50' : ''}`}>
            <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
            <p className="text-xl font-semibold text-yellow-600">{counts.expiring}</p>
          </Card>
        </Link>
        <Link to="/inventory/batches?filter=critical" className="block">
          <Card className={`p-3 hover:shadow-md transition-shadow ${filter === 'critical' ? 'border-2 border-orange-500 bg-orange-50' : ''}`}>
            <p className="text-sm font-medium text-gray-500">Critical (1-180 days)</p>
            <p className="text-xl font-semibold text-orange-600">{counts.expiring}</p>
          </Card>
        </Link>
        <Link to="/inventory/batches?filter=expired" className="block">
          <Card className={`p-3 hover:shadow-md transition-shadow ${filter === 'expired' ? 'border-2 border-red-500 bg-red-50' : ''}`}>
            <p className="text-sm font-medium text-gray-500">Expired</p>
            <p className="text-xl font-semibold text-red-600">{counts.expired}</p>
          </Card>
        </Link>
      </div>

      {/* Results count */}
      {!loading && displayedBatches.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing {displayedBatches.length} of {allBatches.length} batches
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      )}

      {/* Batches List */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : displayedBatches.length === 0 ? (
          <div className="text-center py-12">
            <CubeIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No batches found</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm 
                ? `No batches matching "${searchTerm}"` 
                : filter === 'expiring' 
                  ? 'No batches expiring in the next 30 days'
                  : filter === 'critical'
                    ? 'No critical batches found'
                    : filter === 'expired'
                      ? 'No expired batches found'
                      : 'Get started by adding your first batch'
              }
            </p>
            {filter !== 'all' && (
              <Link to="/inventory/batches">
                <Button variant="primary">
                  View All Batches
                </Button>
              </Link>
            )}
            {filter === 'expired' && (
              <Link to="/inventory/wastage" className="ml-3">
                <Button variant="danger">
                  Go to Wastage
                </Button>
              </Link>
            )}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedBatches.map((batch) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.days_until_expiry || 0} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ETB {batch.selling_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Batches;
