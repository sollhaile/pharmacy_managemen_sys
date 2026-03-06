import { Router } from 'express';
import { createSupplierOrder, quickReorder } from '../controllers/supplier-order.controller';

const router = Router();

// POST /api/supplier-orders - Create new purchase order
router.post('/', createSupplierOrder);

// POST /api/supplier-orders/reorder/:medicine_id - Quick reorder for low stock
router.post('/reorder/:medicine_id', quickReorder);

export default router;