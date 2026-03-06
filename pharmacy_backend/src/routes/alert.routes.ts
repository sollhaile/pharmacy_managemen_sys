import { Router } from 'express';
import { 
  checkLowStock, 
  checkExpiringBatches, 
  sendDailySummary,
  sendCriticalAlerts 
} from '../services/notification.service';

const router = Router();

// Manual trigger low stock check
router.post('/check-low-stock', async (req, res) => {
  const result = await checkLowStock();
  res.json({ success: true, data: result });
});

// Manual trigger expiry check
router.post('/check-expiry', async (req, res) => {
  const result = await checkExpiringBatches();
  res.json({ success: true, data: result });
});

// Manual trigger daily summary
router.post('/send-daily-summary', async (req, res) => {
  await sendDailySummary();
  res.json({ success: true, message: 'Daily summary sent' });
});

// Manual trigger critical alerts
router.post('/check-critical', async (req, res) => {
  await sendCriticalAlerts();
  res.json({ success: true, message: 'Critical alerts checked' });
});

export default router;