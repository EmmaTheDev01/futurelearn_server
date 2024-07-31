// groupRoutes.js
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
import { verifyAdmin, verifyLecturer, verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

// Define routes here
router.post('/create', verifyLecturer, createGroup);
router.get('/', verifyLecturer, getAllGroups);
router.get('/my-group', verifyStudent, getMyGroups);
router.get('/:id', getGroupById);
router.put('/:id', updateGroupById);
router.delete('/:id', deleteGroupById);
router.put('/:groupId/submit-answers', verifyStudent, submitAssignmentAnswers);
router.post('/:id/submit', verifyStudent, submitGroupAssignment);

export default router;
