import { Router } from 'express';
import { reportWastage, getWastageReports } from '../controllers/wastage.controller';

const router = Router();

// POST /api/wastage - Report damaged/expired medicine
router.post('/', reportWastage);

// GET /api/wastage - Get wastage reports
router.get('/', getWastageReports);

export default router;