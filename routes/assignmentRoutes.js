import express from 'express';
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
} from '../controllers/assignment.js';
import { verifyLecturer } from '../utils/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/create', verifyLecturer, createAssignment);
router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);

// Protected routes for lecturers
router.put('/:id',  verifyLecturer, updateAssignmentById);
router.delete('/:id',  verifyLecturer, deleteAssignmentById);


export default router;
