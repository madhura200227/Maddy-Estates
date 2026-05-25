import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import propertyRoutes from './routes/properties.js';
import leadRoutes from './routes/leads.js';
import authRoutes from './routes/auth.js';
import { seedProperties } from './seed.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'Maddy Estates API running' }));

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log('💚 MongoDB connected successfully.');
    await seedProperties();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed. Running server with local in-memory fallback.');
    console.warn(`Connection details: ${err.message}`);
  })
  .finally(() => {
    if (process.env.NODE_ENV !== 'production') {
      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`🏡 Maddy Estates server running on port ${port}`);
        console.log(`🔗 API Health Check: http://localhost:${port}/api/health`);
      });
    }
  });

export default app;
