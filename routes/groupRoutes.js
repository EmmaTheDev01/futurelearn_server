import express from 'express';
import { createGroup } from '../controllers/groupController';
import { verifyLecturer } from '../utils/verifyToken';

const router = express.Router();

// Route to create a new group (restricted to lecturers)
router.post('/groups', verifyLecturer, createGroup);

export default router;
