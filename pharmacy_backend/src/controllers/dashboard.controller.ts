import { Request, Response } from 'express';
import { Sequelize, Op, fn, col, literal } from 'sequelize';
import { sequelize } from '../config/database';
import { Sale } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';
import { Medicine } from '../models/Medicine';
import { Batch } from '../models/Batch';
import { Customer } from '../models/Customer';
import { Supplier } from '../models/Supplier';
import { Wastage } from '../models/Wastage';
import { Return } from '../models/Return';

// ============================================
// 1. FINANCIAL SUMMARY & COMPARISONS
// ============================================

// @desc    Get financial dashboard with comparisons
// @route   GET /api/dashboard/financial
export const getFinancialDashboard = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);

    // Run all calculations in parallel
    const [
      // Revenue
      revenueToday, revenueYesterday, revenueThisWeek, revenueLastWeek,
      revenueThisMonth, revenueLastMonth, revenueThisYear, revenueLastYear,
      
      // Cost of Goods Sold
      cogsToday, cogsThisWeek, cogsThisMonth, cogsThisYear,
      
      // Profit
      profitToday, profitYesterday, profitThisWeek, profitLastWeek,
      profitThisMonth, profitLastMonth, profitThisYear, profitLastYear,
      
      // Expenses & Losses
      wastageLossThisMonth, returnsLossThisMonth,
      
      // Margins
      topProducts, topCustomers,
      
      // Trends
      weeklyTrend, monthlyTrend, yearlyTrend,
      
      // Inventory Value
      inventoryValue, totalLiabilities
    ] = await Promise.all([
      // ===== REVENUE =====
      getRevenue(startOfToday, new Date()),
      getRevenue(startOfYesterday, startOfToday),
      getRevenue(startOfThisWeek, new Date()),
      getRevenue(startOfLastWeek, startOfThisWeek),
      getRevenue(startOfThisMonth, new Date()),
      getRevenue(startOfLastMonth, endOfLastMonth),
      getRevenue(startOfThisYear, new Date()),
      getRevenue(startOfLastYear, endOfLastYear),
      
      // ===== COGS =====
      getCOGS(startOfToday, new Date()),
      getCOGS(startOfThisWeek, new Date()),
      getCOGS(startOfThisMonth, new Date()),
      getCOGS(startOfThisYear, new Date()),
      
      // ===== PROFIT =====
      getProfit(startOfToday, new Date()),
      getProfit(startOfYesterday, startOfToday),
      getProfit(startOfThisWeek, new Date()),
      getProfit(startOfLastWeek, startOfThisWeek),
      getProfit(startOfThisMonth, new Date()),
      getProfit(startOfLastMonth, endOfLastMonth),
      getProfit(startOfThisYear, new Date()),
      getProfit(startOfLastYear, endOfLastYear),
      
      // ===== LOSSES =====
      getWastageLoss(startOfThisMonth, new Date()),
      getReturnsLoss(startOfThisMonth, new Date()),
      
      // ===== PERFORMANCE =====
      getTopProducts(10),
      getTopCustomers(10),
      
      // ===== TRENDS =====
      getWeeklyTrend(12),
      getMonthlyTrend(12),
      getYearlyTrend(5),
      
      // ===== BALANCE SHEET =====
      getInventoryValue(),
      getSupplierLiabilities()
    ]);

    // Calculate percentage changes
    const revenueChange = {
      today: calculateChange(revenueToday, revenueYesterday),
      week: calculateChange(revenueThisWeek, revenueLastWeek),
      month: calculateChange(revenueThisMonth, revenueLastMonth),
      year: calculateChange(revenueThisYear, revenueLastYear)
    };

    const profitChange = {
      today: calculateChange(profitToday, profitYesterday),
      week: calculateChange(profitThisWeek, profitLastWeek),
      month: calculateChange(profitThisMonth, profitLastMonth),
      year: calculateChange(profitThisYear, profitLastYear)
    };

    // Calculate profit margins
    const profitMargin = {
      today: revenueToday ? (profitToday / revenueToday) * 100 : 0,
      week: revenueThisWeek ? (profitThisWeek / revenueThisWeek) * 100 : 0,
      month: revenueThisMonth ? (profitThisMonth / revenueThisMonth) * 100 : 0,
      year: revenueThisYear ? (profitThisYear / revenueThisYear) * 100 : 0
    };

    res.json({
      success: true,
      data: {
        summary: {
          revenue: {
            today: revenueToday,
            yesterday: revenueYesterday,
            this_week: revenueThisWeek,
            last_week: revenueLastWeek,
            this_month: revenueThisMonth,
            last_month: revenueLastMonth,
            this_year: revenueThisYear,
            last_year: revenueLastYear,
            change: revenueChange
          },
          profit: {
            today: profitToday,
            yesterday: profitYesterday,
            this_week: profitThisWeek,
            last_week: profitLastWeek,
            this_month: profitThisMonth,
            last_month: profitLastMonth,
            this_year: profitThisYear,
            last_year: profitLastYear,
            change: profitChange,
            margin: profitMargin
          },
          cogs: {
            today: cogsToday,
            this_week: cogsThisWeek,
            this_month: cogsThisMonth,
            this_year: cogsThisYear,
            percentage_of_revenue: {
              today: revenueToday ? (cogsToday / revenueToday) * 100 : 0,
              month: revenueThisMonth ? (cogsThisMonth / revenueThisMonth) * 100 : 0,
              year: revenueThisYear ? (cogsThisYear / revenueThisYear) * 100 : 0
            }
          },
          losses: {
            wastage: wastageLossThisMonth,
            returns: returnsLossThisMonth,
            total: wastageLossThisMonth + returnsLossThisMonth
          }
        },
        performance: {
          top_products: topProducts,
          top_customers: topCustomers
        },
        trends: {
          weekly: weeklyTrend,
          monthly: monthlyTrend,
          yearly: yearlyTrend
        },
        balance_sheet: {
          inventory_value: inventoryValue,
          supplier_credit: totalLiabilities,
          net_worth: inventoryValue - totalLiabilities
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// ============================================
// 2. PROFIT & LOSS STATEMENT
// ============================================

// @desc    Get P&L statement for any period
// @route   GET /api/dashboard/pl

// @desc    Get P&L statement for any period
// @route   GET /api/dashboard/pl
// @desc    Get P&L statement for any period
// @route   GET /api/dashboard/pl
// @desc    Get P&L statement for any period
// @route   GET /api/dashboard/pl
export const getProfitLossStatement = async (req: Request, res: Response) => {
  try {
    const { period, start_date, end_date } = req.query;
    
    let startDate: Date;
    let endDate: Date = new Date();
    let periodName: string;

    // Set date range based on period
    switch(period) {
      case 'today':
        startDate = new Date(endDate.setHours(0, 0, 0, 0));
        periodName = 'Today';
        break;
      case 'yesterday':
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        periodName = 'Yesterday';
        break;
      case 'week':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        periodName = 'Last 7 Days';
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        periodName = `This Month (${endDate.toLocaleString('default', { month: 'long' })} ${endDate.getFullYear()})`;
        break;
      case 'last_month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        periodName = `Last Month (${startDate.toLocaleString('default', { month: 'long' })})`;
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        periodName = `Year ${endDate.getFullYear()}`;
        break;
      case 'last_year':
        startDate = new Date(endDate.getFullYear() - 1, 0, 1);
        endDate = new Date(endDate.getFullYear() - 1, 11, 31);
        periodName = `Year ${endDate.getFullYear() - 1}`;
        break;
      case 'custom':
        startDate = new Date(start_date as string);
        endDate = new Date(end_date as string);
        periodName = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        periodName = `This Month`;
    }

    // ============ SIMPLIFIED CALCULATIONS ============
    
    // 1. Get total revenue
    const revenue = await Sale.sum('total_amount', {
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      }
    }) || 0;

    // 2. Get sales count
    const salesCount = await Sale.count({
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      }
    });

    // 3. Get COGS (Cost of Goods Sold)
    const sales = await Sale.findAll({
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      },
      include: [{
        model: SaleItem,
        as: 'items',
        include: [{
          model: Batch,
          as: 'batch',
          attributes: ['cost_price']
        }]
      }]
    });

    let cogs = 0;
    let itemsSold = 0;

    sales.forEach(sale => {
      const saleJson = sale.toJSON();
      const items = (saleJson as any).items || [];
      items.forEach((item: any) => {
        cogs += Number(item.batch?.cost_price || 0) * item.quantity;
        itemsSold += item.quantity;
      });
    });

    // 4. Calculate gross profit
    const grossProfit = revenue - cogs;

    // 5. Get wastage losses
    const wastageLoss = await Wastage.sum('total_loss', {
      where: {
        reported_date: { [Op.between]: [startDate, endDate] }
      }
    }) || 0;

    // 6. Get customer returns
    const returnsLoss = await Return.sum('total_amount', {
      where: {
        created_at: { [Op.between]: [startDate, endDate] },
        return_type: 'CUSTOMER',
        status: 'COMPLETED'
      }
    }) || 0;

    // 7. Get supplier returns
    const supplierReturns = await Return.sum('total_amount', {
      where: {
        created_at: { [Op.between]: [startDate, endDate] },
        return_type: 'SUPPLIER',
        status: 'APPROVED'
      }
    }) || 0;

    // 8. Get unique customers
    const uniqueCustomersResult = await Sale.findAll({
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      },
      attributes: [
        [fn('COUNT', fn('DISTINCT', col('customer_id'))), 'count']
      ],
      raw: true
    });
    const uniqueCustomers = Number((uniqueCustomersResult[0] as any)?.count || 0);

    // 9. SIMPLIFIED Category breakdown - REMOVED complex query
    // Return empty array for now to avoid GROUP BY errors
    const categoryBreakdown = [];

    // 10. Calculate final metrics
    const netProfit = grossProfit - wastageLoss - returnsLoss - supplierReturns;
    const expenseRatio = revenue ? ((wastageLoss + returnsLoss + supplierReturns) / revenue) * 100 : 0;
    const profitMargin = revenue ? (netProfit / revenue) * 100 : 0;
    const avgTransactionValue = salesCount ? revenue / salesCount : 0;
    const avgItemsPerTransaction = salesCount ? itemsSold / salesCount : 0;
    const revenuePerCustomer = uniqueCustomers ? revenue / uniqueCustomers : 0;

    // ============ SEND RESPONSE ============
    res.json({
      success: true,
      data: {
        period: {
          name: periodName,
          start_date: startDate,
          end_date: endDate
        },
        income: {
          revenue: Number(revenue.toFixed(2)),
          cost_of_goods_sold: Number(cogs.toFixed(2)),
          gross_profit: Number(grossProfit.toFixed(2)),
          gross_margin: revenue ? Number(((grossProfit / revenue) * 100).toFixed(2)) : 0
        },
        expenses: {
          wastage_loss: Number(wastageLoss.toFixed(2)),
          customer_returns: Number(returnsLoss.toFixed(2)),
          supplier_returns: Number(supplierReturns.toFixed(2)),
          total_expenses: Number((wastageLoss + returnsLoss + supplierReturns).toFixed(2)),
          expense_ratio: Number(expenseRatio.toFixed(2))
        },
        net_profit: {
          amount: Number(netProfit.toFixed(2)),
          margin: Number(profitMargin.toFixed(2))
        },
        metrics: {
          total_transactions: salesCount,
          items_sold: itemsSold,
          unique_customers: uniqueCustomers,
          average_transaction_value: Number(avgTransactionValue.toFixed(2)),
          average_items_per_transaction: Number(avgItemsPerTransaction.toFixed(2)),
          revenue_per_customer: Number(revenuePerCustomer.toFixed(2))
        },
        breakdown: {
          by_category: categoryBreakdown,
          by_day: []
        }
      }
    });

  } catch (error) {
    console.error('P&L Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate profit & loss statement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
// ============================================
// 3. INVENTORY VALUATION & TURNOVER
// ============================================

// @desc    Get inventory valuation and turnover metrics
// @route   GET /api/dashboard/inventory-valuation
export const getInventoryValuation = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      currentValue,
      costValue,
      retailValue,
      turnoverRate,
      slowMoving,
      deadStock,
      categoryValue,
      expiryValue
    ] = await Promise.all([
      getInventoryValue(),
      getInventoryCost(),
      getInventoryRetail(),
      getInventoryTurnoverRate(startOfYear, today),
      getSlowMovingItems(),
      getDeadStock(),
      getInventoryValueByCategory(),
      getExpiringInventoryValue()
    ]);

    const potentialProfit = retailValue - costValue;
    const turnoverDays = turnoverRate > 0 ? 365 / turnoverRate : 0;

    res.json({
      success: true,
      data: {
        summary: {
          current_value: currentValue,
          cost_value: costValue,
          retail_value: retailValue,
          potential_profit: potentialProfit,
          profit_margin: costValue ? (potentialProfit / costValue) * 100 : 0
        },
        performance: {
          turnover_rate: turnoverRate,
          turnover_days: turnoverDays,
          slow_moving_items: slowMoving,
          dead_stock: deadStock,
          expiring_value: expiryValue
        },
        breakdown: {
          by_category: categoryValue,
          by_expiry: await getExpiryBreakdown()
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// ============================================
// 4. CASH FLOW & SUPPLIER PAYABLES
// ============================================

// @desc    Get cash flow and supplier payables
// @route   GET /api/dashboard/cashflow
export const getCashFlow = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      monthlyRevenue,
      monthlyProfit,
      monthlyPurchases,
      supplierBalance,
      paymentDue,
      cashFlowTrend
    ] = await Promise.all([
      getRevenue(startOfMonth, today),
      getProfit(startOfMonth, today),
      getMonthlyPurchases(startOfMonth, today),
      getSupplierLiabilities(),
      getPaymentDue(),
      getCashFlowTrend(12)
    ]);

    res.json({
      success: true,
      data: {
        monthly: {
          revenue: monthlyRevenue,
          profit: monthlyProfit,
          purchases: monthlyPurchases,
          net_cash_flow: monthlyRevenue - monthlyPurchases
        },
        payables: {
          total_due: supplierBalance,
          overdue: paymentDue.overdue,
          due_this_week: paymentDue.thisWeek,
          due_this_month: paymentDue.thisMonth
        },
        trend: cashFlowTrend
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// ============================================
// 5. HELPER FUNCTIONS - FINANCIAL
// ============================================

async function getRevenue(startDate: Date, endDate: Date): Promise<number> {
  const result = await Sale.sum('total_amount', {
    where: {
      sale_date: { [Op.between]: [startDate, endDate] },
      payment_status: 'paid'
    }
  });
  return Number(result || 0);
}

async function getCOGS(startDate: Date, endDate: Date): Promise<number> {
  const saleItems = await SaleItem.findAll({
    include: [
      {
        model: Sale,
        as: 'sale',
        where: {
          sale_date: { [Op.between]: [startDate, endDate] },
          payment_status: 'paid'
        }
      },
      {
        model: Batch,
        as: 'batch',
        attributes: ['cost_price']
      }
    ]
  });

  const cogs = saleItems.reduce((sum, item) => {
    const costPrice = Number((item as any).batch?.cost_price || 0);
    return sum + (costPrice * item.quantity);
  }, 0);

  return cogs;
}

async function getProfit(startDate: Date, endDate: Date): Promise<number> {
  const revenue = await getRevenue(startDate, endDate);
  const cogs = await getCOGS(startDate, endDate);
  return revenue - cogs;
}

async function getWastageLoss(startDate: Date, endDate: Date): Promise<number> {
  const result = await Wastage.sum('total_loss', {
    where: {
      reported_date: { [Op.between]: [startDate, endDate] }
    }
  });
  return Number(result || 0);
}

async function getReturnsLoss(startDate: Date, endDate: Date): Promise<number> {
  const result = await Return.sum('total_amount', {
    where: {
      created_at: { [Op.between]: [startDate, endDate] },
      return_type: 'CUSTOMER',
      status: 'COMPLETED'
    }
  });
  return Number(result || 0);
}

async function getSupplierReturnsLoss(startDate: Date, endDate: Date): Promise<number> {
  const result = await Return.sum('total_amount', {
    where: {
      created_at: { [Op.between]: [startDate, endDate] },
      return_type: 'SUPPLIER',
      status: 'APPROVED'
    }
  });
  return Number(result || 0);
}

async function getSalesCount(startDate: Date, endDate: Date): Promise<number> {
  return await Sale.count({
    where: {
      sale_date: { [Op.between]: [startDate, endDate] },
      payment_status: 'paid'
    }
  });
}

async function getItemsSoldCount(startDate: Date, endDate: Date): Promise<number> {
  const result = await SaleItem.findAll({
    include: [{
      model: Sale,
      as: 'sale',
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      }
    }],
    attributes: [[fn('SUM', col('quantity')), 'total']],
    raw: true
  });
  return Number((result[0] as any)?.total || 0);
}

async function getUniqueCustomersCount(startDate: Date, endDate: Date): Promise<number> {
  const result = await Sale.findAll({
    where: {
      sale_date: { [Op.between]: [startDate, endDate] },
      payment_status: 'paid'
    },
    attributes: [[fn('COUNT', fn('DISTINCT', col('customer_id'))), 'count']],
    raw: true
  });
  return Number((result[0] as any)?.count || 0);
}

async function getCategoryRevenue(startDate: Date, endDate: Date) {
  const results = await SaleItem.findAll({
    include: [
      {
        model: Sale,
        as: 'sale',
        where: {
          sale_date: { [Op.between]: [startDate, endDate] },
          payment_status: 'paid'
        }
      },
      {
        model: Medicine,
        as: 'medicine',
        attributes: ['category']
      }
    ],
    attributes: [
      [col('medicine.category'), 'category'],
      [fn('SUM', col('total_price')), 'revenue'],
      [fn('SUM', col('quantity')), 'quantity']
    ],
    group: ['medicine.category'],
    raw: true
  });

  return results;
}

async function getDailyRevenue(startDate: Date, endDate: Date) {
  const results = await Sale.findAll({
    where: {
      sale_date: { [Op.between]: [startDate, endDate] },
      payment_status: 'paid'
    },
    attributes: [
      [fn('DATE', col('sale_date')), 'date'],
      [fn('SUM', col('total_amount')), 'revenue'],
      [fn('COUNT', col('sale_id')), 'transactions']
    ],
    group: [fn('DATE', col('sale_date'))],
    order: [[fn('DATE', col('sale_date')), 'ASC']],
    raw: true
  });

  return results;
}

async function getInventoryValue(): Promise<number> {
  const result = await Batch.findAll({
    where: { is_active: true },
    attributes: [[literal('SUM(quantity * selling_price)'), 'total']],
    raw: true
  });
  return Number((result[0] as any)?.total || 0);
}

async function getInventoryCost(): Promise<number> {
  const result = await Batch.findAll({
    where: { is_active: true },
    attributes: [[literal('SUM(quantity * cost_price)'), 'total']],
    raw: true
  });
  return Number((result[0] as any)?.total || 0);
}

async function getInventoryRetail(): Promise<number> {
  return await getInventoryValue();
}

async function getInventoryTurnoverRate(startDate: Date, endDate: Date): Promise<number> {
  const cogs = await getCOGS(startDate, endDate);
  const avgInventory = await getInventoryCost();
  return avgInventory > 0 ? cogs / avgInventory : 0;
}

async function getSlowMovingItems() {
  const medicines = await Medicine.findAll({ where: { is_active: true } });
  const slowMoving = [];

  for (const medicine of medicines) {
    // Check sales in last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const sales = await SaleItem.findAll({
      include: [{
        model: Sale,
        as: 'sale',
        where: {
          sale_date: { [Op.gte]: ninetyDaysAgo },
          payment_status: 'paid'
        }
      }],
      where: { medicine_id: medicine.medicine_id }
    });

    const quantitySold = sales.reduce((sum, s) => sum + s.quantity, 0);
    
    if (quantitySold === 0) {
      const batches = await Batch.findAll({
        where: { medicine_id: medicine.medicine_id, is_active: true }
      });
      const currentStock = batches.reduce((sum, b) => sum + b.quantity, 0);
      
      if (currentStock > 0) {
        slowMoving.push({
          medicine_id: medicine.medicine_id,
          name: medicine.name,
          current_stock: currentStock,
          days_without_sale: Math.floor((Date.now() - ninetyDaysAgo.getTime()) / (1000 * 60 * 60 * 24)),
          estimated_value: currentStock * Number(medicine.reorder_level)
        });
      }
    }
  }

  return slowMoving;
}

async function getDeadStock() {
  const medicines = await Medicine.findAll({ where: { is_active: true } });
  const deadStock = [];

  for (const medicine of medicines) {
    const batches = await Batch.findAll({
      where: { medicine_id: medicine.medicine_id, is_active: true }
    });
    const currentStock = batches.reduce((sum, b) => sum + b.quantity, 0);
    
    if (currentStock === 0) {
      // Check if it was ever sold
      const everSold = await SaleItem.findOne({
        where: { medicine_id: medicine.medicine_id }
      });
      
      if (!everSold) {
        deadStock.push({
          medicine_id: medicine.medicine_id,
          name: medicine.name,
          added_date: await getFirstBatchDate(medicine.medicine_id),
          status: 'NEVER_SOLD'
        });
      }
    }
  }

  return deadStock;
}

async function getFirstBatchDate(medicineId: number) {
  const batch = await Batch.findOne({
    where: { medicine_id: medicineId },
    order: [['created_at', 'ASC']]
  });
  return batch?.created_at;
}

async function getInventoryValueByCategory() {
  const medicines = await Medicine.findAll({
    where: { is_active: true },
    attributes: ['category'],
    group: ['category'],
    raw: true
  });

  const result = [];

  for (const med of medicines) {
    const category = med.category;
    if (!category) continue;

    const batches = await Batch.findAll({
      include: [{
        model: Medicine,
        as: 'batch_medicine',
        where: { category }
      }],
      where: { is_active: true }
    });

    const value = batches.reduce((sum, b) => {
      return sum + (b.quantity * Number(b.cost_price || 0));
    }, 0);

    result.push({ category, value });
  }

  return result;
}

async function getExpiringInventoryValue() {
  const ninetyDays = new Date();
  ninetyDays.setDate(ninetyDays.getDate() + 90);

  const batches = await Batch.findAll({
    where: {
      is_active: true,
      expiry_date: { [Op.between]: [new Date(), ninetyDays] }
    }
  });

  const value = batches.reduce((sum, b) => {
    return sum + (b.quantity * Number(b.cost_price || 0));
  }, 0);

  return value;
}

async function getExpiryBreakdown() {
  const today = new Date();
  const thirtyDays = new Date(today);
  thirtyDays.setDate(today.getDate() + 30);
  
  const sixtyDays = new Date(today);
  sixtyDays.setDate(today.getDate() + 60);
  
  const ninetyDays = new Date(today);
  ninetyDays.setDate(today.getDate() + 90);

  const [
    critical,
    warning,
    moderate,
    good
  ] = await Promise.all([
    getBatchesValueBetween(today, thirtyDays),
    getBatchesValueBetween(thirtyDays, sixtyDays),
    getBatchesValueBetween(sixtyDays, ninetyDays),
    getBatchesValueAfter(ninetyDays)
  ]);

  return { critical, warning, moderate, good };
}

async function getBatchesValueBetween(start: Date, end: Date) {
  const batches = await Batch.findAll({
    where: {
      is_active: true,
      expiry_date: { [Op.between]: [start, end] }
    }
  });
  return batches.reduce((sum, b) => sum + (b.quantity * Number(b.cost_price || 0)), 0);
}

async function getBatchesValueAfter(date: Date) {
  const batches = await Batch.findAll({
    where: {
      is_active: true,
      expiry_date: { [Op.gt]: date }
    }
  });
  return batches.reduce((sum, b) => sum + (b.quantity * Number(b.cost_price || 0)), 0);
}

async function getSupplierLiabilities(): Promise<number> {
  // This would need a purchases/payables table
  // For now, estimate based on recent batches
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const batches = await Batch.findAll({
    where: {
      created_at: { [Op.gte]: thirtyDaysAgo },
      is_active: true
    }
  });

  return batches.reduce((sum, b) => sum + (b.quantity * Number(b.cost_price || 0)), 0);
}

async function getMonthlyPurchases(startDate: Date, endDate: Date): Promise<number> {
  const batches = await Batch.findAll({
    where: {
      created_at: { [Op.between]: [startDate, endDate] }
    }
  });
  return batches.reduce((sum, b) => sum + (b.quantity * Number(b.cost_price || 0)), 0);
}

async function getPaymentDue() {
  // This would need a proper payables system
  // Placeholder for now
  return {
    overdue: 0,
    thisWeek: 0,
    thisMonth: 0
  };
}

async function getCashFlowTrend(months: number) {
  const result = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
    
    const revenue = await getRevenue(month, nextMonth);
    const purchases = await getMonthlyPurchases(month, nextMonth);
    
    result.push({
      month: month.toLocaleString('default', { month: 'short', year: 'numeric' }),
      revenue,
      purchases,
      cash_flow: revenue - purchases
    });
  }

  return result;
}

async function getWeeklyTrend(weeks: number) {
  const result = [];
  const today = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(today);
    end.setDate(today.getDate() - (i * 7));
    const start = new Date(end);
    start.setDate(end.getDate() - 7);

    const revenue = await getRevenue(start, end);
    const profit = await getProfit(start, end);
    
    result.push({
      week: `Week ${weeks - i}`,
      start_date: start.toLocaleDateString(),
      end_date: end.toLocaleDateString(),
      revenue,
      profit,
      margin: revenue ? (profit / revenue) * 100 : 0
    });
  }

  return result;
}

async function getMonthlyTrend(months: number) {
  const result = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
    
    const revenue = await getRevenue(start, end);
    const profit = await getProfit(start, end);
    const cogs = await getCOGS(start, end);
    const wastage = await getWastageLoss(start, end);
    const returns = await getReturnsLoss(start, end);
    
    result.push({
      month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
      revenue,
      cogs,
      profit,
      wastage,
      returns,
      margin: revenue ? (profit / revenue) * 100 : 0
    });
  }

  return result;
}

async function getYearlyTrend(years: number) {
  const result = [];
  const today = new Date();

  for (let i = years - 1; i >= 0; i--) {
    const year = today.getFullYear() - i;
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    
    const revenue = await getRevenue(start, end);
    const profit = await getProfit(start, end);
    const cogs = await getCOGS(start, end);
    
    result.push({
      year,
      revenue,
      cogs,
      profit,
      margin: revenue ? (profit / revenue) * 100 : 0
    });
  }

  return result;
}

async function getTopProducts(limit: number) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // ✅ FIXED: Only select and group by medicine_id and medicine_name
  const products = await SaleItem.findAll({
    include: [{
      model: Sale,
      as: 'sale',
      where: {
        sale_date: { [Op.gte]: thirtyDaysAgo },
        payment_status: 'paid'
      },
      attributes: []  // Don't select any sale attributes
    }],
    attributes: [
      'medicine_id',
      'medicine_name',
      [fn('SUM', col('quantity')), 'quantity'],
      [fn('SUM', col('total_price')), 'revenue']
    ],
    group: ['medicine_id', 'medicine_name'],
    order: [[literal('revenue'), 'DESC']],
    limit,
    raw: true
  });

  // Get current stock for each product
  for (const product of products) {
    const batches = await Batch.findAll({
      where: { 
        medicine_id: (product as any).medicine_id,
        is_active: true 
      }
    });
    (product as any).current_stock = batches.reduce((sum, b) => sum + b.quantity, 0);
  }

  return products;
}

async function getTopCustomers(limit: number) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // ✅ This is already correct - only grouping by customer columns
  return await Sale.findAll({
    where: {
      sale_date: { [Op.gte]: thirtyDaysAgo },
      payment_status: 'paid'
    },
    attributes: [
      'customer_id',
      'customer_name',
      'customer_phone',
      [fn('SUM', col('total_amount')), 'total_spent'],
      [fn('COUNT', col('sale_id')), 'visit_count']
    ],
    group: ['customer_id', 'customer_name', 'customer_phone'],
    order: [[literal('total_spent'), 'DESC']],
    limit,
    raw: true
  });
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
// ============================================
// EXPORT ORIGINAL DASHBOARD FUNCTIONS
// ============================================

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalSalesToday,
      totalSalesWeek,
      totalSalesMonth,
      totalSalesYear,
      totalCustomers,
      totalMedicines,
      lowStockCount,
      expiringCount,
      topSelling,
      dailySales,
      profitToday,
      profitMonth
    ] = await Promise.all([
      getRevenue(startOfDay, new Date()),
      getRevenue(startOfWeek, new Date()),
      getRevenue(startOfMonth, new Date()),
      getRevenue(startOfYear, new Date()),
      Customer.count(),
      Medicine.count({ where: { is_active: true } }),
      getLowStockCount(),
      Batch.count({
        where: {
          is_active: true,
          expiry_date: {
            [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
          }
        }
      }),
      getTopProducts(5),
      getDailyRevenue(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
      getProfit(startOfDay, new Date()),
      getProfit(startOfMonth, new Date())
    ]);

    res.json({
      success: true,
      data: {
        sales: {
          today: totalSalesToday || 0,
          week: totalSalesWeek || 0,
          month: totalSalesMonth || 0,
          year: totalSalesYear || 0
        },
        profit: {
          today: profitToday || 0,
          month: profitMonth || 0
        },
        counts: {
          customers: totalCustomers,
          medicines: totalMedicines,
          low_stock: lowStockCount,
          expiring_soon: expiringCount
        },
        top_selling: topSelling,
        sales_chart: dailySales
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get sales report
// @route   GET /api/dashboard/sales-report
// @desc    Get sales report
// @route   GET /api/dashboard/sales-report
// @desc    Get sales report
// @route   GET /api/dashboard/sales-report
export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { period = 'month' } = req.query;
    let startDate: Date;
    let endDate: Date = new Date();

    switch(period) {
      case 'day':
        startDate = new Date(endDate.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(endDate.setDate(endDate.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    // Get revenue - using simple sum query
    const revenue = await Sale.sum('total_amount', {
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      }
    }) || 0;

    // Get profit - calculate from sales and batches
    const sales = await Sale.findAll({
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      },
      include: [{
        model: SaleItem,
        as: 'items',
        include: [{
          model: Batch,
          as: 'batch',
          attributes: ['cost_price']
        }]
      }]
    });

    let totalCost = 0;
    let totalItems = 0;
    let transactionCount = sales.length;

    sales.forEach(sale => {
      const saleJson = sale.toJSON();
      const items = (saleJson as any).items || [];
      items.forEach((item: any) => {
        totalCost += Number(item.batch?.cost_price || 0) * item.quantity;
        totalItems += item.quantity;
      });
    });

    const profit = Number(revenue) - totalCost;

    // Get daily breakdown - FIXED: Simple query with proper grouping
    const dailyBreakdown = await Sale.findAll({
      where: {
        sale_date: { [Op.between]: [startDate, endDate] },
        payment_status: 'paid'
      },
      attributes: [
        [fn('DATE', col('sale_date')), 'date'],
        [fn('SUM', col('total_amount')), 'revenue'],
        [fn('COUNT', col('sale_id')), 'transactions']
      ],
      group: [fn('DATE', col('sale_date'))],
      order: [[fn('DATE', col('sale_date')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        period,
        date_range: { 
          start: startDate, 
          end: endDate 
        },
        summary: {
          revenue: Number(revenue),
          profit: Number(profit),
          transactions: transactionCount,
          items_sold: totalItems,
          avg_transaction: transactionCount ? Number(revenue) / transactionCount : 0
        },
        daily: dailyBreakdown || []
      }
    });
  } catch (error) {
    console.error('Sales Report Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get inventory insights
// @route   GET /api/dashboard/inventory-insights
export const getInventoryInsights = async (req: Request, res: Response) => {
  try {
    const [
      totalStockValue,
      totalPotentialRevenue,
      expiringBatches,
      outOfStock,
      categoryBreakdown
    ] = await Promise.all([
      getInventoryCost(),
      getInventoryValue(),
      Batch.findAll({
        where: {
          is_active: true,
          expiry_date: {
            [Op.between]: [new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)]
          }
        },
        include: [{
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['name']
        }],
        order: [['expiry_date', 'ASC']]
      }),
      getOutOfStockMedicines(),
      getInventoryValueByCategory()
    ]);

    res.json({
      success: true,
      data: {
        stock_value: {
          cost: totalStockValue,
          retail: totalPotentialRevenue,
          potential_profit: totalPotentialRevenue - totalStockValue
        },
        expiring_soon: {
          count: expiringBatches.length,
          batches: expiringBatches.map(b => ({
            batch_number: b.batch_number,
            medicine: (b as any).batch_medicine?.name,
            expiry_date: b.expiry_date,
            days_left: b.getDaysUntilExpiry(),
            quantity: b.quantity,
            value: Number(b.quantity) * Number(b.cost_price || 0)
          }))
        },
        out_of_stock: outOfStock,
        category_breakdown: categoryBreakdown
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get customer insights
// @route   GET /api/dashboard/customer-insights
export const getCustomerInsights = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalCustomers,
      newCustomersToday,
      newCustomersMonth,
      topCustomers
    ] = await Promise.all([
      Customer.count(),
      Customer.count({ where: { created_at: { [Op.gte]: startOfDay } } }),
      Customer.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
      getTopCustomers(10)
    ]);

    res.json({
      success: true,
      data: {
        total_customers: totalCustomers,
        new_customers: {
          today: newCustomersToday,
          month: newCustomersMonth
        },
        top_customers: topCustomers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Helper function for low stock count
async function getLowStockCount(): Promise<number> {
  const medicines = await Medicine.findAll({ where: { is_active: true } });
  let count = 0;
  
  for (const medicine of medicines) {
    const batches = await Batch.findAll({
      where: { medicine_id: medicine.medicine_id, is_active: true }
    });
    const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
    if (totalStock <= medicine.reorder_level) count++;
  }
  
  return count;
}

// Helper function for out of stock medicines
async function getOutOfStockMedicines() {
  const medicines = await Medicine.findAll({ where: { is_active: true } });
  const outOfStock = [];

  for (const medicine of medicines) {
    const batches = await Batch.findAll({
      where: { medicine_id: medicine.medicine_id, is_active: true }
    });
    const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
    
    if (totalStock === 0) {
      outOfStock.push({
        medicine_id: medicine.medicine_id,
        name: medicine.name
      });
    }
  }

  return outOfStock;
}