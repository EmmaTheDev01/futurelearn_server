// controllers/AnnouncementController.js

import Announcement from '../models/Announcement.js';
import mongoose from 'mongoose';

// Create a new Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, desc, imageUrl, redirect } = req.body;
    
    const newAnnouncement = new Announcement({
      title,
      desc,
      imageUrl,
      redirect,
    });

    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Announcement', error: error.message });
  }
};

// Get all Announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const Announcements = await Announcement.find();
    res.status(200).json(Announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve Announcements', error: error.message });
  }
};

// Get a Announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const AnnouncementId = req.params.id;
    const Announcement = await Announcement.findById(AnnouncementId);
    if (!Announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json(Announcement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve Announcement', error: error.message });
  }
};

// Update a Announcement by ID
export const updateAnnouncementById = async (req, res) => {
  try {
    const AnnouncementId = req.params.id;
    const updatedAnnouncement = req.body; // Assuming req.body contains updated Announcement information
    const result = await Announcement.findByIdAndUpdate(AnnouncementId, updatedAnnouncement, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement updated successfully', Announcement: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Announcement', error: error.message });
  }
};

// Delete a Announcement by ID
export const deleteAnnouncementById = async (req, res) => {
  try {
    const AnnouncementId = req.params.id;
    const result = await Announcement.findByIdAndDelete(AnnouncementId);
    if (!result) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted successfully', Announcement: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Announcement', error: error.message });
  }
};

// Update approval status of a Announcement
export const updateApprovalStatus = async (req, res) => {
  try {
    const AnnouncementId = req.params.id;
    const { approved } = req.body;
    const result = await Announcement.findByIdAndUpdate(AnnouncementId, { approved }, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Approval status updated successfully', Announcement: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update approval status', error: error.message });
  }
};


