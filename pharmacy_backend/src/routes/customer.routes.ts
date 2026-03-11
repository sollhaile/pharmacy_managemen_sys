import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  getCustomerByPhone,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customer.controller';

const router = Router();

// GET /api/customers - Get all customers
router.get('/', getCustomers);

// GET /api/customers/phone/:phone - Get customer by phone
router.get('/phone/:phone', getCustomerByPhone);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', getCustomerById);

// POST /api/customers - Create customer
router.post('/', createCustomer);

// PUT /api/customers/:id - Update customer
router.put('/:id', updateCustomer);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', deleteCustomer);

export default router;
