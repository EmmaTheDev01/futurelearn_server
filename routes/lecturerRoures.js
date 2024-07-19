// routes/lecturerRoutes.js

import express from 'express';
import { createGroup } from '../controllers/lecturerController';
import { createAssignment } from '../controllers/lecturerController';
import { verifyLecturer } from '../utils/verifyToken';

const router = express.Router();

// Route to create a new group
router.post('/groups', verifyLecturer, createGroup);

// Route to create a new assignment
router.post('/assignments', verifyLecturer, createAssignment);

export default router;
