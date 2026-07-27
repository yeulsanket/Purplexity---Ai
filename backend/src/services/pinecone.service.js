import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ENV } from '../config/env.js';

class PineconeService {
  constructor() {
    this.pineconeClient = null;
    this.vectorStore = null;
    this.embeddings = null;
    this.isInitialized = false;
  }

  async init() {
    if (!ENV.PINECONE_API_KEY || !ENV.PINECONE_INDEX || !ENV.GOOGLE_API_KEY) {
      console.log('Pinecone or Google API Key missing. RAG features are disabled.');
      return false;
    }

    try {
      this.pineconeClient = new Pinecone({
        apiKey: ENV.PINECONE_API_KEY,
      });

      const pineconeIndex = this.pineconeClient.Index(ENV.PINECONE_INDEX);

      // Initialize embeddings
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        model: "gemini-embedding-2", // Latest Google Embedding Model
        apiKey: ENV.GOOGLE_API_KEY,
      });

      // Initialize Langchain Vector Store
      this.vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex }
      );

      this.isInitialized = true;
      console.log('Pinecone Vector Store Initialized Successfully.');
      return true;
    } catch (error) {
      console.error('Failed to initialize Pinecone:', error);
      return false;
    }
  }

  async getContext(query, topK = 3) {
    if (!this.isInitialized) {
      return '';
    }

    try {
      const results = await this.vectorStore.similaritySearch(query, topK);
      const contextText = results.map(doc => doc.pageContent).join('\n\n');
      return contextText;
    } catch (error) {
      console.error('Failed to retrieve context from Pinecone:', error);
      return '';
    }
  }
}

export default new PineconeService();
