import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import workordersRoutes from './routes/workorders.routes';
import { errorHandler } from './middlewares/errorHandler';
import authLocalRoutes from './routes/auth.local.routes';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', workordersRoutes);
app.use('/api', authLocalRoutes);

app.use(errorHandler);

export default app;
