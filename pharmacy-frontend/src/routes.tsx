import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Medicines from './pages/medicines/Medicines';
import MedicineDetail from './pages/medicines/MedicineDetail';
import Inventory from './pages/inventory/Inventory';
import Batches from './pages/inventory/Batches';
import Customers from './pages/customers/Customers';
import Suppliers from './pages/suppliers/Suppliers';
import Sales from './pages/sales/Sales';
import Checkout from './pages/sales/Checkout';
import Invoice from './pages/sales/Invoice';
import Reports from './pages/reports/Reports';
import Login from './pages/auth/Login';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'medicines',
        children: [
          {
            index: true,
            element: <Medicines />,
          },
          {
            path: ':id',
            element: <MedicineDetail />,
          },
        ],
      },
      {
        path: 'inventory',
        children: [
          {
            index: true,
            element: <Inventory />,
          },
          {
            path: 'batches',
            element: <Batches />,
          },
        ],
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'suppliers',
        element: <Suppliers />,
      },
      {
        path: 'sales',
        children: [
          {
            index: true,
            element: <Sales />,
          },
          {
            path: 'checkout',
            element: <Checkout />,
          },
          {
            path: 'invoice/:invoiceNumber',
            element: <Invoice />,
          },
        ],
      },
      {
        path: 'reports',
        element: <Reports />,
      },
    ],
  },
]);