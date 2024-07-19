import express from 'express';
import { createConversation, getUserConversations, sendMessage } from '../controllers/Conversation.js';

const router = express.Router();

// POST /api/v1/conversation - Create a new conversation
router.post('/', createConversation);

// GET /api/v1/conversation/user/:userId - Get conversations for a user
router.get('/user/:userId', getUserConversations);

// POST /api/v1/conversation/message - Send a message in a conversation
router.post('/message', sendMessage);

export default router;
