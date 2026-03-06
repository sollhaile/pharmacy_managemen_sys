import { body, param, query } from 'express-validator';

export const createBatchValidator = [
  body('batch_number')
    .notEmpty().withMessage('Batch number is required')
    .isString().withMessage('Batch number must be a string')
    .isLength({ max: 100 }).withMessage('Batch number cannot exceed 100 characters'),
  
  body('medicine_id')
    .notEmpty().withMessage('Medicine ID is required')
    .isInt({ min: 1 }).withMessage('Invalid medicine ID')
    .toInt(),
  
  body('expiry_date')
    .notEmpty().withMessage('Expiry date is required')
    .isISO8601().withMessage('Invalid expiry date format')
    .toDate(),
  
  body('manufacturing_date')
    .optional()
    .isISO8601().withMessage('Invalid manufacturing date format')
    .toDate(),
  
  body('supplier_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid supplier ID')
    .toInt(),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a positive integer')
    .toInt(),
  
  body('cost_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Cost price must be a positive number')
    .toFloat(),
  
  body('selling_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Selling price must be a positive number')
    .toFloat()
];

export const updateBatchValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid batch ID')
    .toInt(),
  
  body('batch_number')
    .optional()
    .isString().withMessage('Batch number must be a string')
    .isLength({ max: 100 }).withMessage('Batch number cannot exceed 100 characters'),
  
  body('expiry_date')
    .optional()
    .isISO8601().withMessage('Invalid expiry date format')
    .toDate(),
  
  body('manufacturing_date')
    .optional()
    .isISO8601().withMessage('Invalid manufacturing date format')
    .toDate(),
  
  body('supplier_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid supplier ID')
    .toInt(),
  
  body('cost_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Cost price must be a positive number')
    .toFloat(),
  
  body('selling_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Selling price must be a positive number')
    .toFloat(),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
    .toBoolean()
];

export const batchIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid batch ID')
    .toInt()
];

export const medicineIdValidator = [
  param('medicineId')
    .isInt({ min: 1 }).withMessage('Invalid medicine ID')
    .toInt()
];

export const expiringBatchesValidator = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365')
    .toInt()
];

export const stockAdjustValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid batch ID')
    .toInt(),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
    .toInt(),
  
  body('operation')
    .notEmpty().withMessage('Operation is required')
    .isIn(['add', 'remove']).withMessage('Operation must be either "add" or "remove"'),
  
  body('reason')
    .optional()
    .isString().withMessage('Reason must be a string')
    .isLength({ max: 255 }).withMessage('Reason cannot exceed 255 characters')
];