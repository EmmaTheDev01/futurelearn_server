import express from 'express';
import {
  updateUser,
  deleteUser,
  findUser,
  findAllUsers,
  findAllStudents,
  findAllLecturers,
  updateUserRole,
  searchUsers
} from '../controllers/userController.js';
import { verifyAdmin, verifyLecturer, verifyStudent } from '../utils/verifyToken.js';

const router = express.Router();

// Protected routes
router.put('/:id', verifyStudent, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);
router.get('/:id', verifyStudent, findUser);

// Admin routes
router.get('/', verifyStudent, findAllUsers);
router.get('/all-students', verifyLecturer, findAllStudents);  // Ensure this route matches the one in your frontend
router.get('/lecturers', verifyAdmin, findAllLecturers);
router.put('/:id/updateRole', verifyAdmin, updateUserRole);

// Search route
router.get('/search', searchUsers); // Add search route with appropriate middleware

export default router;
