// routes/emailRoutes.js

import express from 'express';
import { sendEmail, getEmailThreads, getConversationById, replyToConversation } from '../controllers/emailController.js';
import { verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/send', verifyStudent, sendEmail);
router.get('/threads/:userId', verifyStudent, getEmailThreads);
router.get('/conversation/:threadId', verifyStudent, getConversationById);
router.post('/reply/:threadId', verifyStudent, replyToConversation);

export default router;
