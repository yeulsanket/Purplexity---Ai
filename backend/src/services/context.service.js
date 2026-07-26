import Message from '../models/Message.js';

export const getConversationHistory = async (chatId, limit = 10) => {
  // Fetch last N messages from database
  const messages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .limit(limit);

  // Reverse to chronological order (oldest to newest)
  messages.reverse();

  // Format for LangChain: array of ['role', 'content']
  return messages.map((msg) => {
    return [msg.role, msg.content]; 
  });
};
