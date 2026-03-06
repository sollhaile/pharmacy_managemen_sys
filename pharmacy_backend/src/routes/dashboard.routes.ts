import { Router } from 'express';
import {
  getDashboardSummary,
  getSalesReport,
  getInventoryInsights,
  getCustomerInsights,
  getFinancialDashboard,      // ✅ NEW
  getProfitLossStatement,    // ✅ NEW
  getInventoryValuation,     // ✅ NEW
  getCashFlow,
       
} from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/summary - Main dashboard overview
router.get('/summary', getDashboardSummary);

// GET /api/dashboard/sales-report - Detailed sales with profit
router.get('/sales-report', getSalesReport);

// GET /api/dashboard/inventory-insights - Stock value, expiring, out of stock
router.get('/inventory-insights', getInventoryInsights);

// GET /api/dashboard/customer-insights - Customer stats
router.get('/customer-insights', getCustomerInsights);
router.get('/financial', getFinancialDashboard);
router.get('/pl', getProfitLossStatement);
router.get('/inventory-valuation', getInventoryValuation);
router.get('/cashflow', getCashFlow);


export default router;