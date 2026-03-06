// Email configuration (using nodemailer)
export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// Telegram configuration
export const telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN',
  chatId: process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID' // Pharmacy group chat
};

// Notification preferences
export const notificationConfig = {
  lowStockThreshold: 1.5, // Alert when stock <= reorder_level * 1.5
  expiryWarningDays: [90, 30, 15, 7, 1], // Send alerts at these days
  dailySummaryTime: '20:00', // 8 PM daily report
  enableEmail: true,
  enableTelegram: true
};