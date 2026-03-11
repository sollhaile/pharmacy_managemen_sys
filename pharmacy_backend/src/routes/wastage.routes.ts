import { Router } from 'express';
import { 
  reportWastage, 
  getWastageReports,
  getWastageSummary,
  autoDetectExpired,
  getWastageByDateRange,
  getWastageByReason,
  deleteWastage
} from '../controllers/wastage.controller';

const router = Router();

// POST /api/wastage - Report damaged/expired medicine
router.post('/', reportWastage);

// GET /api/wastage - Get wastage reports
router.get('/', getWastageReports);

// GET /api/wastage/summary - Get summary statistics
router.get('/summary', getWastageSummary);

// POST /api/wastage/auto-detect - Auto-detect expired batches
router.post('/auto-detect', autoDetectExpired);

// GET /api/wastage/date-range - Get by date range
router.get('/date-range', getWastageByDateRange);

// GET /api/wastage/reason/:reason - Get by reason
router.get('/reason/:reason', getWastageByReason);

// DELETE /api/wastage/:id - Delete wastage record
router.delete('/:id', deleteWastage);

export default router;
