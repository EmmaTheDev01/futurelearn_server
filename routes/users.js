import express from 'express';
import {
  updateUser,
  deleteUser,
  findUser,
  findAllUsers,
  findAllStudents,
  findAllLecturers,
  updateUserRole,
} from '../controllers/userController.js';
import { verifyAdmin, verifyLecturer, verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

// Protected routes
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', verifyStudent, findUser);

// Admin routes
router.get('/', verifyStudent, findAllUsers);
router.get('/all-students', verifyLecturer, findAllStudents);  // Ensure this route matches the one in your frontend
router.get('/lecturers', verifyAdmin, findAllLecturers);
router.put('/:id/updateRole', verifyAdmin, updateUserRole);

export default router;
