import React from 'react';
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export interface Column<T = any> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  const renderSortIcon = (key: string) => {
    if (!onSort) return null;
    if (sortKey !== key) {
      return <ChevronUpDownIcon className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 ml-1 text-primary-600" />
      : <ChevronDownIcon className="w-4 h-4 ml-1 text-primary-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}
                onClick={() => column.sortable && onSort?.(String(column.key))}
                style={{ width: column.width }}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && renderSortIcon(String(column.key))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.cell ? column.cell(item) : item[column.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;