import express from 'express';
import { handleChatMessage } from '../controllers/chatbot.js';

const router = express.Router();

// POST endpoint for sending and receiving messages
router.post('/', handleChatMessage);

export default router;
