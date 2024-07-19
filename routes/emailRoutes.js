// routes/emailRoutes.js

import express from 'express';
import { sendEmail, getEmailThreads, getConversationById, replyToConversation } from '../controllers/emailController.js';
import { VerifyUser } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/send', VerifyUser, sendEmail);
router.get('/threads/:userId', VerifyUser, getEmailThreads);
router.get('/conversation/:threadId', VerifyUser, getConversationById); 
router.post('/reply/:threadId', VerifyUser, replyToConversation); 

export default router;
