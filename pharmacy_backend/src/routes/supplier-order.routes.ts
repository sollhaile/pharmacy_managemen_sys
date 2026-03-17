
import { Router } from 'express';
import { sendPurchaseOrderEmail } from '../controllers/supplier-order.controller';

const router = Router();

// POST /api/supplier-orders/email - Send purchase order via email
router.post('/email', sendPurchaseOrderEmail);

export default router;
