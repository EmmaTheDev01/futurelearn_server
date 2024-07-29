import express from 'express';
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroupById,
  deleteGroupById,
  submitAssignmentAnswers,
  submitGroupAssignment,
  getMyGroups,
} from '../controllers/groupController.js';
import { verifyLecturer, verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/create', verifyLecturer, createGroup);
router.get('/', getAllGroups);
router.get('/my-group',verifyStudent, getMyGroups); // Move this route up
router.get('/:id', getGroupById);

// Protected routes for group chief
router.put('/:id', updateGroupById);
router.delete('/:id', deleteGroupById);
router.post('/:id/submitAnswers', submitAssignmentAnswers);
router.post('/:id/submitAssignment', submitGroupAssignment);

export default router;
