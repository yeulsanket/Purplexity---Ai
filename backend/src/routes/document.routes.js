import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/document.controller.js';

const router = express.Router();

// Setup Multer to store uploaded files in a temp directory
const upload = multer({ dest: 'uploads/' });

// POST /api/documents/upload
router.post('/upload', upload.single('file'), uploadDocument);

export default router;
