import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import medicineRoutes from './routes/medicine.routes';
import batchRoutes from './routes/batch.routes';
import supplierRoutes from './routes/supplier.routes';  // Add this
import checkoutRoutes from './routes/checkout.routes';
import dashboardRoutes from './routes/dashboard.routes';
import alertRoutes from './routes/alert.routes'; // 
import wastageRoutes from './routes/wastage.routes';
import returnRoutes from './routes/return.routes';
import supplierOrderRoutes from './routes/supplier-order.routes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Register API routes - MAKE SURE THESE ARE HERE!
app.use('/api/medicines', medicineRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/suppliers', supplierRoutes);  // Add this
app.use('/api/checkout', checkoutRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertRoutes); // ✅ ADD THIS
app.use('/api/wastage', wastageRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/supplier-orders', supplierOrderRoutes);





// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;