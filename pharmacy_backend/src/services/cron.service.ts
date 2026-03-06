import cron from 'node-cron';
import { 
  checkLowStock, 
  checkExpiringBatches, 
  sendDailySummary,
  sendCriticalAlerts 
} from './notification.service';

// Run every hour to check for critical issues
cron.schedule('0 * * * *', async () => {
  console.log('🔍 Running hourly health check...');
  await sendCriticalAlerts();
});

// Check low stock every 4 hours
cron.schedule('0 */4 * * *', async () => {
  console.log('📦 Checking low stock...');
  await checkLowStock();
});

// Check expiring batches daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('⏰ Checking expiring batches...');
  await checkExpiringBatches();
});

// Send daily summary at 8 PM
cron.schedule('0 20 * * *', async () => {
  console.log('📊 Sending daily summary...');
  await sendDailySummary();
});

console.log('⏰ Cron jobs scheduled successfully');