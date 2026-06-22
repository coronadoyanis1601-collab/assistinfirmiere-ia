import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import appelsRoutes from './routes/appels.js';
import infirmieresRoutes from './routes/infirmieres.js';
import webhookRoutes from './routes/webhook.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'assistinfirmiere-backend', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appels', appelsRoutes);
app.use('/api/infirmieres', infirmieresRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`✅ Assist'Infirmière IA backend démarré sur le port ${PORT}`);
});
