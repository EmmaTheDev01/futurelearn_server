import mongoose from 'mongoose';
import User from '../models/User.js';

// Update User Controller
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: "Successfully updated user",
            data: updatedUser
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};

// Delete User Controller
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Successfully deleted user'
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};

// Find User Controller
export const findUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User details found',
            data: foundUser,
        });
    } catch (err) {
        console.error('Error finding user:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to find user'
        });
    }
};

// Find All Users Controller
export const findAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.status(200).json({
            success: true,
            message: allUsers.length > 0 ? "All users available" : "No users available",
            data: allUsers,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Find All Students Controller
export const findAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        res.status(200).json({
            success: true,
            message: students.length > 0 ? "All students available" : "No students available",
            data: students,
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Find All Lecturers Controller
export const findAllLecturers = async (req, res) => {
    try {
        const lecturers = await User.find({ role: 'lecturer' });
        res.status(200).json({
            success: true,
            message: lecturers.length > 0 ? "All lecturers available" : "No lecturers available",
            data: lecturers,
        });
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Update User Role Controller
export const updateUserRole = async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user role'
        });
    }
};

export default {
    updateUser,
    deleteUser,
    findUser,
    findAllUsers,
    findAllStudents,
    findAllLecturers,
    updateUserRole
};
