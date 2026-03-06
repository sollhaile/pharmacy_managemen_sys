import { Request, Response } from 'express';
import { Return } from '../models/Return';
import { Batch } from '../models/Batch';
import { Sale } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';
import { Medicine } from '../models/Medicine';
import { Supplier } from '../models/Supplier';  // ✅ ADD THIS IMPORT
import { sequelize } from '../config/database';
import { Op } from 'sequelize';  // ✅ ADD THIS IMPORT
import { sendTelegramMessage } from '../services/notification.service';

// @desc    Return from customer (sale reversal)
// @route   POST /api/returns/customer
export const customerReturn = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const { sale_id, items, reason, notes } = req.body;
    const user_id = req.body.user_id || 1;

    // Get the original sale
    const sale = await Sale.findByPk(sale_id, {
      include: [{
        model: SaleItem,
        as: 'items'
      }],
      transaction: t
    });

    if (!sale) {
      await t.rollback();
      return res.status(404).json({ success: false, error: 'Sale not found' });
    }

    const returns = [];

    for (const item of items) {
      const { batch_id, quantity } = item;

      // Get batch
      const batch = await Batch.findByPk(batch_id, {
        include: [{
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['name']
        }],
        transaction: t
      });

      if (!batch) {
        await t.rollback();
        return res.status(404).json({ success: false, error: `Batch ${batch_id} not found` });
      }

      // Restock
      await batch.update({
        quantity: batch.quantity + quantity
      }, { transaction: t });

      // Calculate refund amount
      const unitPrice = Number(batch.selling_price || 0);
      const totalAmount = unitPrice * quantity;

      // Create return record
      const returnRecord = await Return.create({
        return_type: 'CUSTOMER',
        reference_id: sale.invoice_number,
        batch_id: batch.batch_id,
        medicine_id: batch.medicine_id,
        medicine_name: (batch as any).batch_medicine?.name || 'Unknown',
        batch_number: batch.batch_number,
        quantity,
        unit_price: unitPrice,
        total_amount: totalAmount,
        reason,
        notes: notes || `Return from invoice ${sale.invoice_number}`,
        status: 'COMPLETED',
        created_by: user_id
      }, { transaction: t });

      returns.push(returnRecord);
    }

    await t.commit();

    // Send Telegram notification
    const totalRefund = returns.reduce((sum, r) => sum + Number(r.total_amount), 0);
    const message = `
🔄 <b>CUSTOMER RETURN</b>

🧾 <b>Invoice:</b> ${sale.invoice_number}
👤 <b>Customer:</b> ${sale.customer_name}
📞 <b>Phone:</b> ${sale.customer_phone}

📋 <b>Items Returned:</b>
${returns.map(r => `   • ${r.medicine_name} x${r.quantity} = ETB ${r.total_amount}`).join('\n')}

💰 <b>Total Refund:</b> ETB ${totalRefund}
📌 <b>Reason:</b> ${reason}
⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `;

    await sendTelegramMessage(message);

    res.json({
      success: true,
      message: 'Customer return processed successfully',
      data: {
        invoice: sale.invoice_number,
        refund_total: totalRefund,
        items: returns
      }
    });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Return to supplier (for credit/refund)
// @route   POST /api/returns/supplier
export const supplierReturn = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const { batch_id, quantity, reason, notes } = req.body;
    const user_id = req.body.user_id || 1;

    // Get batch details
    const batch = await Batch.findOne({
      where: { batch_id, is_active: true },
      include: [
        {
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['name']
        },
        {
          model: Supplier,
          as: 'batch_supplier',
          attributes: ['name', 'contact_person', 'phone']
        }
      ],
      transaction: t
    });

    if (!batch) {
      await t.rollback();
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    if (batch.quantity < quantity) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient stock. Available: ${batch.quantity}` 
      });
    }

    // Remove from stock
    await batch.update({
      quantity: batch.quantity - quantity
    }, { transaction: t });

    // Calculate credit amount
    const creditAmount = Number(batch.cost_price || 0) * quantity;

    // Create return record
    const returnRecord = await Return.create({
      return_type: 'SUPPLIER',
      reference_id: batch.batch_number,
      batch_id: batch.batch_id,
      medicine_id: batch.medicine_id,
      medicine_name: (batch as any).batch_medicine?.name || 'Unknown',
      batch_number: batch.batch_number,
      quantity,
      unit_price: Number(batch.cost_price || 0),
      total_amount: creditAmount,
      reason,
      notes: notes || `Return to supplier`,
      status: 'PENDING',
      created_by: user_id
    }, { transaction: t });

    await t.commit();

    // Send Telegram message to supplier
    const supplierMessage = `
📦 <b>SUPPLIER RETURN REQUEST</b>

🏢 <b>Supplier:</b> ${(batch as any).batch_supplier?.name || 'Unknown'}
👤 <b>Contact:</b> ${(batch as any).batch_supplier?.contact_person || 'N/A'}
📞 <b>Phone:</b> ${(batch as any).batch_supplier?.phone || 'N/A'}

💊 <b>Medicine:</b> ${returnRecord.medicine_name}
📦 <b>Batch:</b> ${returnRecord.batch_number}
📅 <b>Expiry:</b> ${new Date(batch.expiry_date).toLocaleDateString()}
❌ <b>Quantity:</b> ${returnRecord.quantity} units
💰 <b>Credit:</b> ETB ${returnRecord.total_amount}
📌 <b>Reason:</b> ${returnRecord.reason}
📝 <b>Notes:</b> ${returnRecord.notes}

✅ Please process this return and credit our account.
    `;

    await sendTelegramMessage(supplierMessage);

    // Also send internal alert
    const internalMessage = `
🔄 <b>SUPPLIER RETURN INITIATED</b>

🏢 <b>Supplier:</b> ${(batch as any).batch_supplier?.name || 'Unknown'}
💊 <b>Medicine:</b> ${returnRecord.medicine_name}
📦 <b>Batch:</b> ${returnRecord.batch_number}
❌ <b>Quantity:</b> ${returnRecord.quantity} units
💰 <b>Credit:</b> ETB ${returnRecord.total_amount}
📌 <b>Reason:</b> ${returnRecord.reason}
🆔 <b>Return ID:</b> ${returnRecord.return_id}

⏳ Status: <b>PENDING</b> - Waiting for supplier confirmation
    `;

    await sendTelegramMessage(internalMessage);

    res.status(201).json({
      success: true,
      message: 'Supplier return initiated. Telegram sent to supplier.',
      data: returnRecord
    });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Approve/Reject supplier return
// @route   PUT /api/returns/:id/status
export const updateReturnStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);  // ✅ FIXED: Added 'as string'
    const { status, notes } = req.body;
    const user_id = req.body.user_id || 1;

    const returnRecord = await Return.findByPk(id);

    if (!returnRecord) {
      return res.status(404).json({ success: false, error: 'Return not found' });
    }

    await returnRecord.update({
      status,
      approved_by: user_id,
      notes: notes ? `${returnRecord.notes} | Updated: ${notes}` : returnRecord.notes,
      updated_at: new Date()
    });

    // Send status update via Telegram
    const emoji = status === 'APPROVED' ? '✅' : status === 'REJECTED' ? '❌' : '⏳';
    const message = `
${emoji} <b>RETURN ${status}</b>

🆔 <b>Return ID:</b> ${returnRecord.return_id}
🔄 <b>Type:</b> ${returnRecord.return_type}
💊 <b>Medicine:</b> ${returnRecord.medicine_name}
📦 <b>Batch:</b> ${returnRecord.batch_number}
❌ <b>Quantity:</b> ${returnRecord.quantity}
💰 <b>Amount:</b> ETB ${returnRecord.total_amount}
📌 <b>Status:</b> ${status}
👤 <b>Processed by:</b> User #${user_id}
    `;

    await sendTelegramMessage(message);

    res.json({
      success: true,
      message: `Return ${status.toLowerCase()} successfully`,
      data: returnRecord
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get returns
// @route   GET /api/returns
export const getReturns = async (req: Request, res: Response) => {
  try {
    const { type, status, start_date, end_date } = req.query;
    
    let whereClause: any = {};
    
    if (type) whereClause.return_type = type;
    if (status) whereClause.status = status;
    if (start_date && end_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(start_date as string), new Date(end_date as string)]
      };
    }

    const returns = await Return.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    const totalAmount = returns.reduce((sum, r) => sum + Number(r.total_amount), 0);

    res.json({
      success: true,
      count: returns.length,
      total_amount: totalAmount,
      data: returns
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};