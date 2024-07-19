import express from 'express';
import { createAssignment } from '../controllers/assignmentController';
import { verifyLecturer } from '../utils/verifyToken';

const router = express.Router();

// Route to create a new assignment (restricted to lecturers)
router.post('/assignments', verifyLecturer, createAssignment);

export default router;
