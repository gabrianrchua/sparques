import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';

// import routes
import postsRoutes from './routes/posts/index.js';
import authRoutes from './routes/auth/index.js';
import communitiesRoutes from './routes/communities/index.js';
import canvasRoutes from './routes/canvas/index.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// middlewares
app.use(bodyParser.json({ limit: '2mb' }));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// connect to mongo
connectDB();

// register routes
app.get('/', (_, res) => {
  res.json({ message: 'alive' });
});

app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/community', communitiesRoutes);
app.use('/api/canvas', canvasRoutes);

export default app;
