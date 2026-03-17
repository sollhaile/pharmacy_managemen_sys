import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CartProvider } from './context/CartContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import Medicines from './pages/medicines/Medicines';
import MedicineDetail from './pages/medicines/MedicineDetail';
import Inventory from './pages/inventory/Inventory';
import Batches from './pages/inventory/Batches';
import WastagePage from './pages/inventory/Wastage';
import Customers from './pages/customers/Customers';
import Suppliers from './pages/suppliers/Suppliers';
import Sales from './pages/sales/Sales';
import CheckoutSimple from './pages/sales/CheckoutSimple';
import Invoice from './pages/sales/Invoice';
import Reports, { ReportDashboard } from './pages/reports/Reports';
import SalesReport from './pages/reports/SalesReport';
import InventoryReport from './pages/reports/InventoryReport';
import ExpiryReport from './pages/reports/ExpiryReport';
import Login from './pages/auth/Login';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="medicines">
                <Route index element={<Medicines />} />
                <Route path=":id" element={<MedicineDetail />} />
              </Route>
              <Route path="inventory">
                <Route index element={<Inventory />} />
                <Route path="batches" element={<Batches />} />
                <Route path="wastage" element={<WastagePage />} />
              </Route>
              <Route path="customers" element={<Customers />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="sales">
                <Route index element={<Sales />} />
                <Route path="checkout" element={<CheckoutSimple />} />
                <Route path="invoice/:invoiceNumber" element={<Invoice />} />
              </Route>
              <Route path="reports" element={<Reports />}>
                <Route index element={<ReportDashboard />} />
                <Route path="sales" element={<SalesReport />} />
                <Route path="inventory" element={<InventoryReport />} />
                <Route path="expiry" element={<ExpiryReport />} />
              </Route>
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
