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
        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

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

// findAllStudents Controller to fetch only students
export const findAllStudents = async (req, res) => {
    try {
        // Fetch all users with the role 'student'
        const students = await User.find({ role: 'student' }).exec();

        // Check if no students are found
        if (!students || students.length === 0) {
            console.log('No students found');
            return res.status(404).json({
                success: false,
                message: "No students found",
                data: []
            });
        }

        // Log the number of students found
        console.log(`Found ${students.length} students`);
        res.status(200).json({
            success: true,
            message: "Students found",
            data: students,
        });
    } catch (error) {
        // Log the error and return a 500 status code
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
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

// Search Users Controller
export const searchUsers = async (req, res) => {
    const { query } = req.query;
    console.log(`Received search query: ${query}`); // Log the incoming search query
    
    if (!query) {
        console.log('Search query parameter is missing');
        return res.status(400).json({
            success: false,
            message: 'Search query parameter is required'
        });
    }

    try {
        // Use a regex for case-insensitive search
        const searchRegex = new RegExp(query, 'i');
        console.log(`Search regex: ${searchRegex}`); // Log the regex used for search
        
        // Find users matching the query in firstname, lastname, username, or email fields
        const results = await User.find({
            $or: [
                { firstname: { $regex: searchRegex } },
                { lastname: { $regex: searchRegex } },
                { username: { $regex: searchRegex } },
                { email: { $regex: searchRegex } }
            ]
        });

        console.log(`Number of users found: ${results.length}`); // Log the number of results found

        if (results.length === 0) {
            console.log('No users found matching the search criteria');
            return res.status(404).json({
                success: false,
                message: 'No users found matching the search criteria',
                data: []
            });
        }

        console.log('Users found matching the search criteria');
        res.status(200).json({
            success: true,
            message: 'Users found matching the search criteria',
            data: results
        });
    } catch (err) {
        console.error('Error searching users:', err); // Log the error with details
        res.status(500).json({
            success: false,
            message: 'Failed to search users'
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
    updateUserRole,
    searchUsers
};
