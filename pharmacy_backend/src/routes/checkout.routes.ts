import { Router } from 'express';
import { checkout, getSale, getCustomerSales } from '../controllers/sale.controller';

const router = Router();

// POST /api/checkout - One simple endpoint for everything!
router.post('/', checkout);

// GET /api/checkout/sale/:invoice - View invoice
router.get('/sale/:invoice', getSale);

// GET /api/checkout/customer/:phone/sales - View customer history
router.get('/customer/:phone/sales', getCustomerSales);

export default router;