import aiService from './ai.service.js';

export const generateTitle = async (messageContent, modelChoice) => {
  try {
    const systemPrompt = 'Generate a concise title of exactly 2 to 5 words for the following user message. Do not use quotes, markdown, or punctuation in the output. Just the words.';
    
    const messages = [['user', messageContent]];
    
    const response = await aiService.generateResponse({
      modelChoice, // Reuse the user's preferred model to generate the title
      messages,
      systemPrompt
    });

    if (response.content.includes('demo mode')) {
      // Fallback if AI is running in demo mode
      return generateFallbackTitle(messageContent);
    }

    return response.content.replace(/["']/g, '').trim();
  } catch (error) {
    console.error('Title generation failed, using fallback:', error);
    return generateFallbackTitle(messageContent);
  }
};

const generateFallbackTitle = (content) => {
  const words = content.split(' ').slice(0, 4);
  return words.join(' ') + (words.length >= 4 ? '...' : '');
};
