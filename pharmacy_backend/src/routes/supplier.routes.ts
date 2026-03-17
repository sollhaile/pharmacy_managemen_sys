import { Router } from 'express';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplier.controller';

const router = Router();

// GET /api/suppliers - Get all suppliers
router.get('/', getSuppliers);

// GET /api/suppliers/:id - Get supplier by ID
router.get('/:id', getSupplierById);

// POST /api/suppliers - Create supplier
router.post('/', createSupplier);

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', updateSupplier);

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', deleteSupplier);

export default router;
