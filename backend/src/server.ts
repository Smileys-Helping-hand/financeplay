import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import aiRouter from './routes/ai';
import reportRouter from './routes/report';
import dataRouter from './routes/data';
import financeRouter from './routes/finance';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/ai', aiRouter(prisma));
app.use('/reports', reportRouter(prisma));
app.use('/data', dataRouter(prisma));
app.use('/', financeRouter(prisma));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(port, () => console.log(`FinancePlay API running on ${port}`));
