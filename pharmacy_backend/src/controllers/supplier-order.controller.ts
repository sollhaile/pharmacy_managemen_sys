import { Request, Response } from 'express';
import { Supplier } from '../models/Supplier';
import { Medicine } from '../models/Medicine';
import { sendEmail, generatePurchaseOrderEmail } from '../services/email.service';
import { sendTelegramMessage } from '../services/notification.service';

// @desc    Send purchase order to supplier via email
// @route   POST /api/supplier-orders/email
export const sendPurchaseOrderEmail = async (req: Request, res: Response) => {
  try {
    const { supplier_id, items, notes, send_telegram } = req.body;

    // Get supplier details
    const supplier = await Supplier.findByPk(supplier_id);
    
    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        error: 'Supplier not found' 
      });
    }

    if (!supplier.email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Supplier does not have an email address' 
      });
    }

    // Get medicine names for items
    const itemsWithDetails = [];
    for (const item of items) {
      const medicine = await Medicine.findByPk(item.medicine_id);
      if (medicine) {
        itemsWithDetails.push({
          ...item,
          medicine_name: medicine.name
        });
      } else {
        itemsWithDetails.push({
          ...item,
          medicine_name: `Medicine ID: ${item.medicine_id}`
        });
      }
    }

    // Generate order number
    const orderNumber = `PO-${Date.now().toString().slice(-8)}-${supplier_id}`;

    // Generate email HTML
    const emailHtml = generatePurchaseOrderEmail(
      supplier.name,
      orderNumber,
      itemsWithDetails,
      notes
    );

    // Send email
    const emailSent = await sendEmail({
      to: supplier.email,
      subject: `Purchase Order #${orderNumber} from Your Pharmacy`,
      html: emailHtml
    });

    // Optionally send Telegram notification
    if (send_telegram) {
      const telegramMessage = `
📦 <b>PURCHASE ORDER #${orderNumber}</b>

🏢 <b>Supplier:</b> ${supplier.name}
📧 <b>Email:</b> ${supplier.email}
📞 <b>Phone:</b> ${supplier.phone || 'N/A'}

📋 <b>Items:</b>
${itemsWithDetails.map(item => `   • ${item.medicine_name} - ${item.quantity} units ${item.unit_price ? `@ ETB ${item.unit_price}` : ''}`).join('\n')}

📝 <b>Notes:</b> ${notes || 'N/A'}

✅ Purchase order sent via email.
      `;
      await sendTelegramMessage(telegramMessage);
    }

    res.status(200).json({
      success: true,
      data: {
        order_number: orderNumber,
        supplier: supplier.name,
        supplier_email: supplier.email,
        items_count: items.length,
        email_sent: emailSent,
        telegram_sent: send_telegram ? true : false,
        sent_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Send purchase order error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send purchase order' 
    });
  }
};
