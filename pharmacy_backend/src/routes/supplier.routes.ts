import { Router } from 'express';
import { getSuppliers, createSupplier } from '../controllers/supplier.controller';

const router = Router();

router.get('/', getSuppliers);
router.post('/', createSupplier);

export default router;