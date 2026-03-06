import { Request, Response } from 'express';
import { Batch } from '../models/Batch';
import { Medicine } from '../models/Medicine';
import { Supplier } from '../models/Supplier';
import { Op } from 'sequelize';  // ✅ ADD THIS IMPORT
import { sendTelegramMessage } from '../services/notification.service';

// @desc    Create purchase order and send to supplier via Telegram
// @route   POST /api/supplier-orders
export const createSupplierOrder = async (req: Request, res: Response) => {
  try {
    const { supplier_id, items, notes } = req.body;
    const user_id = req.body.user_id || 1;

    // Get supplier details
    const supplier = await Supplier.findByPk(supplier_id);
    
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }

    // Generate order reference
    const orderRef = `PO-${Date.now().toString().slice(-8)}`;

    // Build order items list
    let orderItems = '';
    let totalAmount = 0;

    for (const item of items) {
      const medicine = await Medicine.findByPk(item.medicine_id);
      const medicineName = medicine?.name || 'Unknown';
      const itemTotal = (item.quantity * (item.unit_price || 0));
      totalAmount += itemTotal;
      
      orderItems += `   • ${medicineName} - ${item.quantity} units @ ETB ${item.unit_price || '?'} = ETB ${itemTotal}\n`;
    }

    // Send Telegram message to supplier
    const message = `
📦 <b>NEW PURCHASE ORDER</b>

🏢 <b>Supplier:</b> ${supplier.name}
👤 <b>Contact:</b> ${supplier.contact_person || 'N/A'}
📞 <b>Phone:</b> ${supplier.phone || 'N/A'}
📧 <b>Email:</b> ${supplier.email || 'N/A'}

🆔 <b>Order #:</b> ${orderRef}
📅 <b>Date:</b> ${new Date().toLocaleDateString()}

📋 <b>Items Ordered:</b>
${orderItems}
💰 <b>Total:</b> ETB ${totalAmount}
📝 <b>Notes:</b> ${notes || 'N/A'}

✅ Please confirm this order and provide delivery date.
    `;

    await sendTelegramMessage(message);

    // Send confirmation to pharmacy group
    const confirmMessage = `
✅ <b>ORDER SENT TO SUPPLIER</b>

🆔 <b>Order #:</b> ${orderRef}
🏢 <b>Supplier:</b> ${supplier.name}
💰 <b>Total:</b> ETB ${totalAmount}
📦 <b>Items:</b> ${items.length}

⏰ <b>Sent at:</b> ${new Date().toLocaleString()}
👤 <b>Ordered by:</b> User #${user_id}

📌 Waiting for supplier confirmation...
    `;

    await sendTelegramMessage(confirmMessage);

    res.status(201).json({
      success: true,
      message: 'Purchase order sent to supplier via Telegram',
      data: {
        order_reference: orderRef,
        supplier: supplier.name,
        items_count: items.length,
        total_amount: totalAmount,
        sent_at: new Date()
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Quick order - Reorder based on low stock
// @route   POST /api/supplier-orders/reorder/:medicine_id
export const quickReorder = async (req: Request, res: Response) => {
  try {
    const medicine_id = parseInt(req.params.medicine_id as string);  // ✅ FIXED: Added 'as string'
    const { supplier_id, quantity } = req.body;

    const medicine = await Medicine.findByPk(medicine_id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    // Get preferred supplier (last used or specified)
    let targetSupplierId = supplier_id;
    
    if (!targetSupplierId) {
      // Get last batch's supplier
      const lastBatch = await Batch.findOne({
        where: { medicine_id },
        order: [['created_at', 'DESC']]
      });
      targetSupplierId = lastBatch?.supplier_id;
    }

    if (!targetSupplierId) {
      return res.status(400).json({ 
        success: false, 
        error: 'No supplier specified and no previous supplier found' 
      });
    }

    const supplier = await Supplier.findByPk(targetSupplierId);

    // Calculate reorder quantity (default to reorder_level * 2)
    const orderQuantity = quantity || (medicine.reorder_level * 2);

    // Send order
    const orderRef = `REORDER-${Date.now().toString().slice(-8)}`;
    
    const message = `
⚡ <b>QUICK REORDER</b>

🏢 <b>Supplier:</b> ${supplier?.name || 'Unknown'}
💊 <b>Medicine:</b> ${medicine.name}
📊 <b>Current Stock:</b> Below reorder level (${medicine.reorder_level})
📦 <b>Order Quantity:</b> ${orderQuantity} units
🆔 <b>Order #:</b> ${orderRef}

📌 This is an automatic reorder based on low stock alert.
    `;

    await sendTelegramMessage(message);

    res.json({
      success: true,
      message: 'Quick reorder sent to supplier',
      data: {
        medicine: medicine.name,
        supplier: supplier?.name,
        quantity: orderQuantity,
        order_reference: orderRef
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};