// routes/AnnouncementRoutes.js

import express from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById,
  updateApprovalStatus,
} from '../controllers/announcement.js';

const router = express.Router();

// Create a new Announcement
router.post('/create', createAnnouncement); 

// Get all Announcements
router.get('/', getAllAnnouncements);

// Get a Announcement by ID
router.get('/:id', getAnnouncementById);

// Update a Announcement by ID
router.put('/:id', updateAnnouncementById);

// Delete a Announcement by ID
router.delete('/:id', deleteAnnouncementById);

// Update approval status of a Announcement
router.patch('/:id/approve', updateApprovalStatus);

export default router;
