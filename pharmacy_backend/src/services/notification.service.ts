import nodemailer from 'nodemailer';
import TelegramBot from 'node-telegram-bot-api';
import PDFDocument from 'pdfkit';
import { Op } from 'sequelize';
import { emailConfig, telegramConfig, notificationConfig } from '../config/notification.config';
import { Medicine } from '../models/Medicine';
import { Batch } from '../models/Batch';
import { Sale } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';

// ============= EMAIL SERVICE =============
const emailTransporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass
  }
});

// ============= TELEGRAM SERVICE =============
let telegramBot: TelegramBot | null = null;
if (telegramConfig.botToken) {
  telegramBot = new TelegramBot(telegramConfig.botToken, { polling: false });
}

// ============= EMAIL NOTIFICATIONS =============
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!notificationConfig.enableEmail || !emailConfig.auth.user) {
      console.log('📧 Email disabled or not configured');
      return;
    }
    
    const info = await emailTransporter.sendMail({
      from: `"Pharmacy System" <${emailConfig.auth.user}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
};

// ============= TELEGRAM NOTIFICATIONS =============
export const sendTelegramMessage = async (message: string) => {
  try {
    if (!notificationConfig.enableTelegram || !telegramBot || !telegramConfig.chatId) {
      console.log('📱 Telegram disabled or not configured');
      return;
    }
    
    await telegramBot.sendMessage(telegramConfig.chatId, message, {
      parse_mode: 'HTML'
    });
    console.log('✅ Telegram message sent');
  } catch (error) {
    console.error('❌ Telegram failed:', error);
  }
};

// ============= INVOICE PDF GENERATOR =============
export const generateInvoicePDF = async (sale: any, items: any[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(20).text('PHARMACY INVOICE', { align: 'center' });
      doc.moveDown();
      
      // Pharmacy info
      doc.fontSize(10).text('Your Pharmacy Name', { align: 'center' });
      doc.text('123 Pharmacy Street, City', { align: 'center' });
      doc.text('Phone: +251-XXX-XXX-XXX', { align: 'center' });
      doc.moveDown(2);

      // Invoice details
      doc.fontSize(12).text(`Invoice: ${sale.invoice_number}`);
      doc.text(`Date: ${new Date(sale.sale_date).toLocaleDateString()}`);
      doc.text(`Customer: ${sale.customer_name}`);
      doc.text(`Phone: ${sale.customer_phone}`);
      doc.text(`Prescription: ${sale.prescription_id}`);
      if (sale.doctor_name) doc.text(`Doctor: ${sale.doctor_name}`);
      doc.moveDown();

      // Table header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 250, tableTop);
      doc.text('Price', 350, tableTop);
      doc.text('Total', 450, tableTop);
      
      // Line
      doc.moveTo(50, tableTop + 20)
         .lineTo(550, tableTop + 20)
         .stroke();

      // Items
      let y = tableTop + 30;
      doc.font('Helvetica');
      
      items.forEach(item => {
        doc.text(item.medicine_name.substring(0, 30), 50, y);
        doc.text(item.quantity.toString(), 250, y);
        doc.text(`ETB ${item.unit_price}`, 350, y);
        doc.text(`ETB ${item.total_price}`, 450, y);
        y += 20;
      });

      // Total
      y += 20;
      doc.font('Helvetica-Bold');
      doc.text(`Subtotal: ETB ${sale.items_total}`, 350, y);
      y += 20;
      doc.text(`Discount: ETB ${sale.discount}`, 350, y);
      y += 20;
      doc.text(`Tax: ETB ${sale.tax}`, 350, y);
      y += 20;
      doc.fontSize(14).text(`TOTAL: ETB ${sale.total_amount}`, 350, y);
      
      // Footer
      doc.fontSize(10).text('Thank you for your purchase!', 50, 700, { align: 'center' });
      doc.text('This is a computer generated invoice', 50, 720, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// ============= INVOICE NOTIFICATION =============
export const sendInvoiceNotification = async (sale: any, items: any[]) => {
  try {
    // Generate PDF
    await generateInvoicePDF(sale, items);
    
    // Send Telegram notification to pharmacy
    const telegramMessage = `
🧾 <b>NEW SALE - INVOICE ${sale.invoice_number}</b>

👤 <b>Customer:</b> ${sale.customer_name}
📞 <b>Phone:</b> ${sale.customer_phone}
💊 <b>Prescription:</b> ${sale.prescription_id}
👨‍⚕️ <b>Doctor:</b> ${sale.doctor_name || 'N/A'}

📋 <b>Items:</b>
${items.map(item => `   • ${item.medicine_name} x${item.quantity} = ETB ${item.total_price}`).join('\n')}

💰 <b>Subtotal:</b> ETB ${sale.items_total}
🏷️ <b>Discount:</b> ETB ${sale.discount}
📊 <b>Tax:</b> ETB ${sale.tax}
💎 <b>TOTAL:</b> ETB ${sale.total_amount}

💵 <b>Payment:</b> ${sale.payment_method.toUpperCase()}
⏰ <b>Time:</b> ${new Date(sale.sale_date).toLocaleTimeString()}
    `;

    await sendTelegramMessage(telegramMessage);

  } catch (error) {
    console.error('❌ Invoice notification failed:', error);
  }
};

// ============= LOW STOCK ALERTS =============
export const checkLowStock = async () => {
  try {
    const medicines = await Medicine.findAll({ where: { is_active: true } });
    const lowStockItems = [];

    for (const medicine of medicines) {
      const batches = await Batch.findAll({
        where: { medicine_id: medicine.medicine_id, is_active: true }
      });
      
      const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
      const threshold = medicine.reorder_level * notificationConfig.lowStockThreshold;
      
      if (totalStock <= threshold) {
        lowStockItems.push({
          name: medicine.name,
          stock: totalStock,
          reorder_level: medicine.reorder_level,
          status: totalStock <= medicine.reorder_level ? 'CRITICAL' : 'WARNING'
        });
      }
    }

    if (lowStockItems.length > 0) {
      let message = `⚠️ <b>LOW STOCK ALERT</b>\n\n`;
      
      lowStockItems.forEach(item => {
        const emoji = item.status === 'CRITICAL' ? '🔴' : '🟡';
        message += `${emoji} <b>${item.name}</b>\n`;
        message += `   Current: ${item.stock} units\n`;
        message += `   Reorder at: ${item.reorder_level} units\n`;
        message += `   Need: ${item.reorder_level - item.stock} units\n\n`;
      });

      await sendTelegramMessage(message);
    }

    return lowStockItems;
  } catch (error) {
    console.error('❌ Low stock check failed:', error);
    return [];
  }
};

// ============= EXPIRY ALERTS =============
export const checkExpiringBatches = async () => {
  try {
    const today = new Date();
    const alerts = [];

    for (const days of notificationConfig.expiryWarningDays) {
      const expiryDate = new Date();
      expiryDate.setDate(today.getDate() + days);

      const batches = await Batch.findAll({
        where: {
          is_active: true,
          expiry_date: {
            [Op.between]: [today, expiryDate]
          }
        },
        include: [{
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['name']
        }]
      });

      if (batches.length > 0) {
        alerts.push({ days, batches });
      }
    }

    // Send alerts for each expiry window
    for (const alert of alerts) {
      const emoji = alert.days <= 7 ? '🔴' : alert.days <= 15 ? '🟠' : '🟡';
      
      let message = `${emoji} <b>EXPIRY ALERT - ${alert.days} DAYS LEFT</b>\n\n`;
      
      alert.batches.forEach(batch => {
        message += `💊 <b>${(batch as any).batch_medicine?.name}</b>\n`;
        message += `   Batch: ${batch.batch_number}\n`;
        message += `   Expires: ${new Date(batch.expiry_date).toLocaleDateString()}\n`;
        message += `   Stock: ${batch.quantity} units\n`;
        message += `   Value: ETB ${Number(batch.quantity) * Number(batch.cost_price || 0)}\n\n`;
      });

      await sendTelegramMessage(message);
    }

    return alerts;
  } catch (error) {
    console.error('❌ Expiry check failed:', error);
    return [];
  }
};

// ============= DAILY SALES SUMMARY =============
export const sendDailySummary = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const sales = await Sale.findAll({
      where: {
        sale_date: { [Op.between]: [startOfDay, endOfDay] },
        payment_status: 'paid'
      },
      include: [{
        model: SaleItem,
        as: 'items'
      }]
    });

    if (sales.length === 0) {
      await sendTelegramMessage('📊 <b>Daily Summary</b>\n\nNo sales today.');
      return;
    }

    // Calculate totals
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const totalItems = sales.reduce((sum, s) => {
      const items = (s as any).items || [];
      return sum + items.reduce((itemSum: number, i: any) => itemSum + i.quantity, 0);
    }, 0);
    const avgTransaction = totalRevenue / sales.length;

    // Top products
    const productSales: any = {};
    sales.forEach(sale => {
      const items = (sale as any).items || [];
      items.forEach((item: any) => {
        if (!productSales[item.medicine_name]) {
          productSales[item.medicine_name] = { qty: 0, revenue: 0 };
        }
        productSales[item.medicine_name].qty += item.quantity;
        productSales[item.medicine_name].revenue += Number(item.total_price);
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([,a]: any, [,b]: any) => b.revenue - a.revenue)
      .slice(0, 5);

    // Build message
    let message = `📊 <b>DAILY SALES SUMMARY</b>\n`;
    message += `📅 ${startOfDay.toLocaleDateString()}\n\n`;
    message += `💰 <b>Revenue:</b> ETB ${totalRevenue}\n`;
    message += `🧾 <b>Transactions:</b> ${sales.length}\n`;
    message += `📦 <b>Items Sold:</b> ${totalItems}\n`;
    message += `💎 <b>Avg Transaction:</b> ETB ${avgTransaction.toFixed(2)}\n\n`;
    message += `🏆 <b>Top Products:</b>\n`;

    topProducts.forEach(([name, data]: any, i) => {
      message += `   ${i+1}. ${name} - ${data.qty} units (ETB ${data.revenue})\n`;
    });

    await sendTelegramMessage(message);

  } catch (error) {
    console.error('❌ Daily summary failed:', error);
  }
};

// ============= CRITICAL ALERTS =============
export const sendCriticalAlerts = async () => {
  try {
    // 1. Expired batches
    const expiredBatches = await Batch.findAll({
      where: {
        is_active: true,
        expiry_date: { [Op.lt]: new Date() }
      },
      include: [{
        model: Medicine,
        as: 'batch_medicine',
        attributes: ['name']
      }]
    });

    if (expiredBatches.length > 0) {
      let message = `🆘 <b>CRITICAL: EXPIRED BATCHES DETECTED!</b>\n\n`;
      
      expiredBatches.forEach(batch => {
        message += `❌ <b>${(batch as any).batch_medicine?.name}</b>\n`;
        message += `   Batch: ${batch.batch_number}\n`;
        message += `   Expired: ${new Date(batch.expiry_date).toLocaleDateString()}\n`;
        message += `   Stock: ${batch.quantity} units\n`;
        message += `   Value: ETB ${Number(batch.quantity) * Number(batch.cost_price || 0)}\n\n`;
      });

      await sendTelegramMessage(message);
      
      // Auto-deactivate expired batches
      await Batch.update(
        { is_active: false },
        { where: { batch_id: expiredBatches.map(b => b.batch_id) } }
      );
    }

    // 2. Out of stock items
    const medicines = await Medicine.findAll({ where: { is_active: true } });
    const outOfStock = [];

    for (const medicine of medicines) {
      const batches = await Batch.findAll({
        where: { medicine_id: medicine.medicine_id, is_active: true }
      });
      const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
      
      if (totalStock === 0) {
        outOfStock.push(medicine.name);
      }
    }

    if (outOfStock.length > 0) {
      await sendTelegramMessage(
        `🆘 <b>OUT OF STOCK ALERT</b>\n\n` +
        `The following medicines are OUT OF STOCK:\n\n` +
        outOfStock.map(name => `   • ${name}`).join('\n')
      );
    }

  } catch (error) {
    console.error('❌ Critical alerts failed:', error);
  }
};