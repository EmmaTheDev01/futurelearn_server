import express from 'express';
import { createConversation, getUserConversations, getUserParticipatedConversations, sendMessage } from '../controllers/Conversation.js';
import { verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

// POST /api/v1/conversation/start/:userId - Create a new conversation
router.post('/start/:userId', verifyStudent, createConversation);

// GET /api/v1/conversation/user/:userId - Get conversations for a user
router.get('/user/:userId', verifyStudent, getUserConversations);

// POST /api/v1/conversation/message/:conversationId - Send a message in a conversation
router.post('/message/:conversationId', verifyStudent, sendMessage);

// GET /api/v1/conversation/my-conversations - Get conversations where the authenticated user participated
router.get('/my-conversations', verifyStudent, getUserParticipatedConversations);

export default router;
