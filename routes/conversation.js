import express from 'express';
import { createConversation, getUserConversations, getUserParticipatedConversations, sendMessage, searchConversations, getConversationById } from '../controllers/Conversation.js';
import { verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

// POST /api/v1/conversation/start/:userId - Create a new conversation
router.post('/start', verifyStudent, createConversation);

// GET /api/v1/conversation/user/:userId - Get conversations for a user
router.get('/user/:conversationId', verifyStudent, getUserConversations);
//GET conversation by Id
router.get('/conversation/:conversationId', verifyStudent, getConversationById);
// POST /api/v1/conversation/message/:conversationId - Send a message in a conversation
router.post('/message/:conversationId', verifyStudent, sendMessage);

// GET /api/v1/conversation/my-conversations - Get conversations where the authenticated user participated
router.get('/my-conversations', verifyStudent, getUserParticipatedConversations);

// GET /api/v1/conversation/search/:query - Search conversations using user details
router.get('/search/:query', verifyStudent, searchConversations);

export default router;
