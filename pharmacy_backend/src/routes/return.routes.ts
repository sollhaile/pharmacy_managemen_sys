import { Router } from 'express';
import {
  customerReturn,
  supplierReturn,
  updateReturnStatus,
  getReturns
} from '../controllers/return.controller';

const router = Router();

// POST /api/returns/customer - Customer return (sale reversal)
router.post('/customer', customerReturn);

// POST /api/returns/supplier - Supplier return (expired/damaged)
router.post('/supplier', supplierReturn);

// PUT /api/returns/:id/status - Approve/reject return
router.put('/:id/status', updateReturnStatus);

// GET /api/returns - Get all returns
router.get('/', getReturns);

export default router;