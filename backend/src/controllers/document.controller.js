import path from 'path';
import fs from 'fs';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import pineconeService from '../services/pinecone.service.js';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    
    // 1. Load the PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // 2. Split into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await textSplitter.splitDocuments(docs);

    // 3. Add to Pinecone
    if (!pineconeService.isInitialized) {
      return res.status(500).json({ message: 'Pinecone is not initialized. Check your API keys.' });
    }

    await pineconeService.vectorStore.addDocuments(splitDocs);

    // 4. Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({ 
      message: 'Document successfully processed and added to knowledge base',
      chunks: splitDocs.length
    });

  } catch (error) {
    console.error('Error in uploadDocument:', error);
    
    // Attempt cleanup if it fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    next(error);
  }
};
