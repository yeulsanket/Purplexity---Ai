import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All message routes require authentication

// Endpoint for sending a new message (creates chat if chatId is null)
router.post('/message', sendMessage);

// Endpoint for retrieving messages of a specific chat
router.get('/:chatId/messages', getMessages);

export default router;
