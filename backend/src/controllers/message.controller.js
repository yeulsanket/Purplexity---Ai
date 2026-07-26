import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import aiService from '../services/ai.service.js';
import { generateTitle } from '../services/title.service.js';
import { getConversationHistory } from '../services/context.service.js';
import { performWebSearch } from '../services/search.service.js';

// @desc    Send a message (and potentially create a new chat)
// @route   POST /api/chats/message
// @access  Private
export const sendMessage = asyncHandler(async (req, res, next) => {
  let { message, chatId, modelChoice, webSearch, mode } = req.body;

  if (!message) {
    return next(new ApiError(400, 'Message content is required'));
  }

  let chat;

  // 1. Handle New Chat Flow or Existing Chat
  if (!chatId) {
    // Generate short title using AI
    const title = await generateTitle(message, modelChoice || 'groq');
    
    chat = await Chat.create({
      user: req.user._id,
      title: title,
    });
    chatId = chat._id;
  } else {
    chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new ApiError(404, 'Chat not found'));
    }
    if (chat.user.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Not authorized to send message to this chat'));
    }
  }

  // 2. Save user message
  const userMessage = await Message.create({
    chatId: chat._id,
    user: req.user._id,
    role: 'user',
    content: message,
    model: modelChoice || 'groq',
  });

  // 3. Retrieve Conversation Context
  const conversationHistory = await getConversationHistory(chatId, 10);
  
  // We append the current message because it's not in the history yet (or we can just pass the history if we fetched after save, wait we just saved it so it IS in the history). 
  // Let's ensure the history we pass to LangChain has everything.
  // getConversationHistory returns the last N messages INCLUDING the userMessage we just saved.
  
  const systemPrompt = `You are an advanced, intelligent AI assistant. 
  Provide accurate, helpful, and clear answers. 
  Format your responses cleanly using Markdown, including fenced code blocks for code snippets.
  Be concise but thorough.
  When provided with Web Search Context, heavily rely on it to answer the question, and cite your sources using [1], [2], etc.`;

  // 3.5 Perform Web Search (if enabled)
  let searchContext = null;
  let searchSources = [];
  
  if (webSearch || mode === 'web') {
    const searchData = await performWebSearch(message);
    searchContext = searchData.context;
    searchSources = searchData.sources;
  }

  // 4. Generate AI Response
  const aiResponse = await aiService.generateResponse({
    modelChoice: modelChoice || 'groq',
    messages: conversationHistory,
    systemPrompt: systemPrompt,
    context: searchContext
  });

  // 5. Save AI Response
  const aiMessage = await Message.create({
    chatId: chat._id,
    user: req.user._id,
    role: 'assistant',
    content: aiResponse.content,
    model: modelChoice || 'groq',
    sources: searchSources,
  });

  // Update chat's updatedAt timestamp
  chat.updatedAt = Date.now();
  await chat.save();

  res.status(200).json({
    success: true,
    data: {
      chatId: chat._id,
      userMessage,
      aiMessage,
    },
  });
});

// @desc    Get all messages for a specific chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
export const getMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ApiError(404, 'Chat not found'));
  }

  if (chat.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized to access messages in this chat'));
  }

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: messages,
  });
});
