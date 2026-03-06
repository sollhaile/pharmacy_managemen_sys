import { Router } from 'express';
import { Op } from 'sequelize';
import {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
  getMedicineBatches,
  getExpiringBatches,
  adjustStock
} from '../controllers/batch.controller';
import {
  createBatchValidator,
  updateBatchValidator,
  batchIdValidator,
  medicineIdValidator,
  expiringBatchesValidator,
  stockAdjustValidator
} from '../validators/batch.validator';

const router = Router();

// GET /api/batches/expiring - Get expiring soon batches (MUST be before /:id)
router.get('/expiring', expiringBatchesValidator, getExpiringBatches);

// GET /api/batches - Get all batches
router.get('/', getBatches);

// GET /api/batches/:id - Get single batch
router.get('/:id', batchIdValidator, getBatch);

// POST /api/batches - Create new batch
router.post('/', createBatchValidator, createBatch);

// PUT /api/batches/:id - Update batch
router.put('/:id', updateBatchValidator, updateBatch);

// DELETE /api/batches/:id - Delete batch
router.delete('/:id', batchIdValidator, deleteBatch);

// PATCH /api/batches/:id/stock - Adjust stock
router.patch('/:id/stock', stockAdjustValidator, adjustStock);

// GET /api/medicines/:medicineId/batches - Get batches for a medicine
router.get('/medicines/:medicineId/batches', medicineIdValidator, getMedicineBatches);

export default router;