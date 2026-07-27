import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import messageRoutes from './routes/message.routes.js';
import pineconeService from './services/pinecone.service.js';

// Connect to Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging Middleware
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running normally' });
});

// Setup Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', messageRoutes); // Mount message routes FIRST to match /api/chats/message
app.use('/api/chats', chatRoutes);    // Mount chat routes SECOND to match /api/chats and /api/chats/:chatId

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all route to serve the React index.html
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
});

// Centralized Error Handling Middleware (must be at the end)
app.use(errorHandler);

const PORT = ENV.PORT || 5000;

// Initialize Pinecone then start server
pineconeService.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${ENV.NODE_ENV} mode on port ${PORT}`);
  });
});
