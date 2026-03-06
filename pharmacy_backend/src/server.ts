import app from './app';
import { connectDB } from './config/database';
import { setupAssociations } from './models';
import { sequelize } from './config/database';
import dotenv from 'dotenv';
import './services/cron.service'; // ✅ ADD THIS LINE - Starts cron jobs
import { Wastage } from './models/Wastage';
import { Return } from './models/Return';
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();
    
    // Setup model associations
    setupAssociations();
     await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced');
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 http://localhost:${PORT}`);
      console.log(`⏰ Notification system active`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();