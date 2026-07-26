import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
export const getChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: chats,
  });
});

// @desc    Get a single chat by ID
// @route   GET /api/chats/:chatId
// @access  Private
export const getChatById = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    return next(new ApiError(404, 'Chat not found'));
  }

  // Ownership check
  if (chat.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized to access this chat'));
  }

  res.status(200).json({
    success: true,
    data: chat,
  });
});

// @desc    Create an empty chat
// @route   POST /api/chats
// @access  Private
export const createChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.create({
    user: req.user._id,
    title: 'New Chat',
  });

  res.status(201).json({
    success: true,
    data: chat,
  });
});

// @desc    Delete a chat and its messages
// @route   DELETE /api/chats/:chatId
// @access  Private
export const deleteChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    return next(new ApiError(404, 'Chat not found'));
  }

  // Ownership check
  if (chat.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized to delete this chat'));
  }

  await chat.deleteOne();
  
  // Also delete all messages associated with this chat
  await Message.deleteMany({ chatId: req.params.chatId });

  res.status(200).json({
    success: true,
    message: 'Chat deleted successfully',
  });
});
