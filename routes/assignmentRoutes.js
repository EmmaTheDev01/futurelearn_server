import express from 'express';
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
  addGroupToAssignment
} from '../controllers/assignment.js';
import { verifyLecturer, verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/create', verifyLecturer, createAssignment);
router.get('/', verifyStudent, getAllAssignments);
router.get('/:id', getAssignmentById);

// Protected routes for lecturers
router.put('/:id', verifyLecturer, updateAssignmentById);
router.delete('/:id', verifyLecturer, deleteAssignmentById);

// New route to add a group to an assignment
router.put('/:id/add-group', verifyStudent, addGroupToAssignment);

export default router;
