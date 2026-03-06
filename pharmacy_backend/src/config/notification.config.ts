// Email configuration
export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || ''
  }
};

// Telegram configuration
export const telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || ''
};

// Notification preferences
export const notificationConfig = {
  lowStockThreshold: 1.5,
  expiryWarningDays: [90, 30, 15, 7, 1],
  dailySummaryTime: '20:00',
  enableEmail: true,
  enableTelegram: true
};