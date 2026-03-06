import { body, param, query } from 'express-validator';

export const createMedicineValidator = [
  body('name').notEmpty().withMessage('Medicine name is required'),
  body('reorder_level').optional().isInt({ min: 0 }).toInt()
];

export const updateMedicineValidator = [
  param('id').isInt().toInt(),
  body('reorder_level').optional().isInt({ min: 0 }).toInt()
];

export const medicineIdValidator = [
  param('id').isInt().toInt()
];
