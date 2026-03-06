import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { Sale } from '../models/Sale';
import { Batch } from '../models/Batch';
import { Medicine } from '../models/Medicine';
import { sequelize } from '../config/database';
import { Op } from 'sequelize'; 
import { sendInvoiceNotification } from '../services/notification.service';
import { SaleItem } from '../models/SaleItem';

// @desc    Checkout - Simple! Just phone, name, prescription, items, payment
// @route   POST /api/checkout
export const checkout = async (req: Request, res: Response) => {
  console.log('=== CHECKOUT DEBUG ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Items:', req.body.items);
  const t = await sequelize.transaction();
  
  try {
    const {
      phone,                // Customer phone
      name,                // Customer name
      prescription_id,     // Prescription number
      doctor_name,         // Optional
      items,              // [{ batch_id, quantity }]
      payment_method,     // 'cash' or 'transfer'
      discount,           // Optional
      tax                // Optional
    } = req.body;

    // 1. Find or create customer (by phone)
    let [customer] = await Customer.findOrCreate({
      where: { phone },
      defaults: { 
        name,
        phone,
        total_visits: 0,
        last_visit: new Date()
      },
      transaction: t
    });

    // Update customer info
    await customer.update({
      name,
      last_visit: new Date(),
      total_visits: sequelize.literal('total_visits + 1')
    }, { transaction: t });

    // 2. Calculate totals and check stock
    let items_total = 0;
    const saleItems = [];

    for (const item of items) {
      // Get batch with medicine
      const batch = await Batch.findOne({
        where: { 
          batch_id: item.batch_id,
          is_active: true,
          quantity: { [Op.gte]: item.quantity }
        },
        include: [{
          model: Medicine,
          as: 'batch_medicine'  // ✅ CORRECT ALIAS
        }],
        transaction: t
      });

      if (!batch) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: `Batch ${item.batch_id} has insufficient stock or is invalid`
        });
      }

      // Check expiry
      if (batch.getDaysUntilExpiry() <=7) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: `Batch ${batch.batch_number} is expired`
        });
      }

      const itemTotal = Number(batch.selling_price) * item.quantity;
      items_total += itemTotal;

      // Reduce stock
      await batch.update({
        quantity: batch.quantity - item.quantity
      }, { transaction: t });

      // ✅ FIXED: Using batch_medicine alias
      saleItems.push({
        batch_id: batch.batch_id,
        medicine_id: batch.medicine_id,
        medicine_name: batch.batch_medicine?.name || 'Unknown',
        batch_number: batch.batch_number,
        quantity: item.quantity,
        unit_price: batch.selling_price,
        total_price: itemTotal
      });
    }

    // 3. Calculate final amount
    const discountAmount = discount || 0;
    const taxAmount = tax || 0;
    const total_amount = items_total - discountAmount + taxAmount;

    // 4. Create sale
    const sale = await Sale.create({
      customer_id: customer.customer_id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      prescription_id,
      doctor_name: doctor_name || null,
      items_total,
      discount: discountAmount,
      tax: taxAmount,
      total_amount,
      payment_method,
      payment_status: 'paid',
      sold_by: req.body.user_id || 1
    }, { transaction: t });

    // 5. Create sale items
    for (const item of saleItems) {
      await SaleItem.create({
        ...item,
        sale_id: sale.sale_id
      }, { transaction: t });
    }

    await t.commit();
// After t.commit() and before sending response

// Send invoice notification
    try {
    await sendInvoiceNotification(sale, saleItems);
    } catch (error) {
    console.error('Failed to send invoice:', error);
    // Don't fail the checkout if notification fails
    }
    // 6. Return invoice
    res.status(201).json({
      success: true,
      message: 'Checkout successful',
      data: {
        invoice_number: sale.invoice_number,
        customer: {
          name: customer.name,
          phone: customer.phone
        },
        prescription_id,
        items: saleItems,
        subtotal: items_total,
        discount: discountAmount,
        tax: taxAmount,
        total: total_amount,
        payment_method,
        sale_date: sale.sale_date
      }
    });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Checkout failed' 
    });
  }
};

// @desc    Get sale by invoice
// @route   GET /api/sales/:invoice
export const getSale = async (req: Request, res: Response) => {
  try {
    const { invoice } = req.params;
    
    const sale = await Sale.findOne({
      where: { invoice_number: invoice },
      include: [{
        model: SaleItem,
        as: 'items'
      }]
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get customer sales history
// @route   GET /api/customers/:phone/sales
export const getCustomerSales = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    
    const customer = await Customer.findOne({
      where: { phone }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const sales = await Sale.findAll({
      where: { customer_id: customer.customer_id },
      order: [['sale_date', 'DESC']],
      include: [{
        model: SaleItem,
        as: 'items',
        limit: 5
      }]
    });

    res.json({
      success: true,
      customer: {
        name: customer.name,
        phone: customer.phone,
        total_visits: customer.total_visits,
        last_visit: customer.last_visit
      },
      count: sales.length,
      data: sales
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
