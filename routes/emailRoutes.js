// routes/emailRoutes.js

import express from 'express';
import { sendEmail, getUserEmails, getEmailById, replyToConversation } from '../controllers/emailController.js';
import { verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/send', verifyStudent, sendEmail);
router.get('/my-emails/:userEmail', verifyStudent, getUserEmails);
router.get('/conversation/:emailId', verifyStudent, getEmailById);
router.post('/reply/:threadId', verifyStudent, replyToConversation);

export default router;
