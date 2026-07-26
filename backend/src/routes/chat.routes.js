import express from 'express';
import { getChats, getChatById, createChat, deleteChat } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.route('/')
  .get(getChats)
  .post(createChat);

router.route('/:chatId')
  .get(getChatById)
  .delete(deleteChat);

export default router;
