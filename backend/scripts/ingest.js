import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import pineconeService from '../src/services/pinecone.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ingestData() {
  const dataDir = path.join(__dirname, '../data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log(`Created data directory at ${dataDir}. Please place your PDFs or TXT files there and run this script again.`);
    process.exit(0);
  }

  const files = fs.readdirSync(dataDir);
  
  if (files.length === 0) {
    console.log(`No files found in ${dataDir}. Please add PDFs or TXT files.`);
    process.exit(0);
  }

  console.log('Initializing Pinecone...');
  const isInitialized = await pineconeService.init();
  if (!isInitialized) {
    console.error('Failed to initialize Pinecone. Check your API keys in .env');
    process.exit(1);
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const ext = path.extname(file).toLowerCase();
    
    let docs = [];
    console.log(`Processing file: ${file}`);

    try {
      if (ext === '.pdf') {
        const loader = new PDFLoader(filePath);
        docs = await loader.load();
      } else if (ext === '.txt') {
        const loader = new TextLoader(filePath);
        docs = await loader.load();
      } else {
        console.log(`Skipping unsupported file type: ${file}`);
        continue;
      }

      // Split text into chunks
      const splitDocs = await textSplitter.splitDocuments(docs);
      
      console.log(`Uploading ${splitDocs.length} chunks to Pinecone...`);
      await pineconeService.vectorStore.addDocuments(splitDocs);
      console.log(`Successfully ingested ${file}`);
      
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  console.log('Ingestion complete!');
  process.exit(0);
}

ingestData();
