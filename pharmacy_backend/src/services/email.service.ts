
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"Pharmacy System" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

// Email template for purchase order
export const generatePurchaseOrderEmail = (
  supplierName: string,
  orderNumber: string,
  items: Array<{
    medicine_name: string;
    quantity: number;
    unit_price?: number;
    total?: number;
  }>,
  notes?: string
): string => {
  const itemsList = items.map(item => {
    const itemTotal = item.total || (item.unit_price ? item.quantity * item.unit_price : 0);
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.medicine_name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        ${item.unit_price ? `<td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">ETB ${item.unit_price.toFixed(2)}</td>` : ''}
        ${itemTotal ? `<td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">ETB ${itemTotal.toFixed(2)}</td>` : ''}
      </tr>
    `;
  }).join('');

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.total || (item.unit_price ? item.quantity * item.unit_price : 0));
  }, 0);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Purchase Order</h1>
        <p style="margin: 5px 0 0;">Order #: ${orderNumber}</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <p><strong>Dear ${supplierName},</strong></p>
        <p>We would like to place the following order with you. Please review and confirm at your earliest convenience.</p>
        
        <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; text-align: left;">Medicine</th>
                <th style="padding: 8px; text-align: center;">Quantity</th>
                ${items[0]?.unit_price ? '<th style="padding: 8px; text-align: right;">Unit Price</th>' : ''}
                ${items[0]?.total ? '<th style="padding: 8px; text-align: right;">Total</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            ${totalAmount > 0 ? `
            <tfoot>
              <tr>
                <td colspan="${items[0]?.unit_price ? 3 : 2}" style="padding: 8px; text-align: right; font-weight: bold;">Total Amount:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #2563eb;">ETB ${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
            ` : ''}
          </table>
        </div>
        
        ${notes ? `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Notes:</strong> ${notes}</p>
        </div>
        ` : ''}
        
        <p><strong>Next Steps:</strong></p>
        <ol style="margin-top: 5px;">
          <li>Review the order details above</li>
          <li>Confirm availability of all items</li>
          <li>Reply to this email with your confirmation and estimated delivery date</li>
        </ol>
        
        <div style="background-color: #e0f2fe; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0;"><strong>Pharmacy Contact:</strong><br>
          📞 +251 911 223344<br>
          📧 pharmacy@example.com</p>
        </div>
        
        <p style="margin-top: 20px;">Thank you for your continued partnership!</p>
        <p><strong>Pharmacy Management System</strong></p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>This is an automated email from your Pharmacy Management System.</p>
        <p>&copy; 2026 Pharmacy Management System. All rights reserved.</p>
      </div>
    </div>
  `;
};
