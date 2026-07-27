import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { ENV } from '../config/env.js';
import pineconeService from './pinecone.service.js';

class AIService {
  getModel(modelName) {
    switch (modelName) {
      case 'gemini':
        if (!ENV.GOOGLE_API_KEY) return null;
        return new ChatGoogleGenerativeAI({ apiKey: ENV.GOOGLE_API_KEY, model: 'gemini-2.5-flash' });
      case 'mistral':
        if (!ENV.MISTRAL_API_KEY) return null;
        return new ChatMistralAI({ apiKey: ENV.MISTRAL_API_KEY, model: 'mistral-large-latest' });
      case 'groq':
      default:
        // Default to Groq LLaMA 3.1
        if (!ENV.GROQ_API_KEY) return null;
        return new ChatGroq({ apiKey: ENV.GROQ_API_KEY, model: 'llama-3.1-8b-instant' });
    }
  }

  async generateResponse({ modelChoice, messages, systemPrompt, context }) {
    // 1. Resolve model
    const model = this.getModel(modelChoice);
    
    // 2. Mock fallback if API key is missing
    if (!model) {
      return {
        content: `AI service is currently running in demo mode. Configure the required API key for '${modelChoice}' to enable live AI responses.`,
      };
    }

    // 3. Prepare System Prompt with optional Web and RAG Context
    let combinedContext = context || '';
    
    // Retrieve RAG Context from Pinecone based on the latest message (if available)
    const latestUserMessage = messages.slice().reverse().find(m => m[0] === 'user');
    if (latestUserMessage) {
      const ragContext = await pineconeService.getContext(latestUserMessage[1]);
      if (ragContext) {
        combinedContext += `\n\nDatabase Context (Use this to answer the user's question, provide citations if applicable):\n${ragContext}`;
      }
    }

    const formattedSystemPrompt = combinedContext
      ? `${systemPrompt}\n\n${combinedContext}`
      : systemPrompt;

    // 4. Construct message chain
    const langchainMessages = [
      ['system', formattedSystemPrompt],
      ...messages // Array of ['user', 'content'] or ['assistant', 'content']
    ];

    // 5. Generate response
    try {
      const response = await model.invoke(langchainMessages);
      return {
        content: typeof response.content === 'string' ? response.content : JSON.stringify(response.content)
      };
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new Error('Failed to generate AI response: ' + error.message);
    }
  }
}

export default new AIService();
