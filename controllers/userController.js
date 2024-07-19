import User from '../models/User';
import moment from 'moment';

// Update User Controller
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true });
        res.status(200).json({
            success: true,
            message: "Successfully updated user",
            data: updatedUser
        });
    } catch (err) {
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
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted user'
        });
    } catch (err) {
        return res.status(500).json({
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
        return res.status(200).json({
            success: true,
            message: 'User details found',
            data: foundUser,
        });
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: 'Failed to find user'
        });
    }
};

// Find All Users Controller
export const findAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        if (allUsers.length > 0) {
            res.status(200).json({
                success: true,
                message: "All users available",
                data: allUsers,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No users available",
            });
        }
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
        if (students.length > 0) {
            res.status(200).json({
                success: true,
                message: "All students available",
                data: students,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No students available",
            });
        }
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
        if (lecturers.length > 0) {
            res.status(200).json({
                success: true,
                message: "All lecturers available",
                data: lecturers,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No lecturers available",
            });
        }
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

