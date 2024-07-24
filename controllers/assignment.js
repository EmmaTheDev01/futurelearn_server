import Assignment from '../models/Assignment.js';
import Group from '../models/Group.js';
import User from '../models/User.js';

// Function to create a new assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, description, department,lecturerId } = req.body;

    // Check if lecturer exists and is valid
    const lecturer = await User.findById(lecturerId);
    if (!lecturer || lecturer.role !== 'lecturer') {
      return res.status(404).json({ message: 'Lecturer not found or unauthorized' });
    }

    // Create new assignment
    const newAssignment = new Assignment({
      title,
      description,
      lecturer: lecturerId,
      department,
    });

    await newAssignment.save();

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create assignment', error: error.message });
  }
};

// Function to get all assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
  }
};

// Function to get a single assignment by ID
export const getAssignmentById = async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignment', error: error.message });
  }
};

// Function to update an assignment by ID
export const updateAssignmentById = async (req, res) => {
  const assignmentId = req.params.id;
  const { title, description } = req.body;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { title, description },
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update assignment', error: error.message });
  }
};

// Function to delete an assignment by ID
export const deleteAssignmentById = async (req, res) => {
  const assignmentId = req.params.id;
  try {
    await Assignment.findByIdAndDelete(assignmentId);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete assignment', error: error.message });
  }
};

// Function to submit an assignment contribution by a group
export const submitAssignmentContribution = async (req, res) => {
  const assignmentId = req.params.id;
  const { groupId, answers } = req.body;

  try {
    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verify that the group's chief is submitting the contribution
    if (group.chief.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group chief can submit contributions' });
    }

    // Update assignment with group's answers
    assignment.groups.push({
      groupId,
      answers,
      completed: true,
    });

    await assignment.save();

    res.status(200).json({ message: 'Assignment contribution submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit assignment contribution', error: error.message });
  }
};

// Function to grade an assignment
export const gradeAssignment = async (req, res) => {
  const assignmentId = req.params.id;
  const { groupId, grades } = req.body;

  try {
    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if lecturer is grading the assignment
    if (req.user.role !== 'lecturer') {
      return res.status(403).json({ message: 'Only lecturers are allowed to grade assignments' });
    }

    // Find the group's contribution in the assignment
    const groupIndex = assignment.groups.findIndex(group => group.groupId.toString() === groupId);
    if (groupIndex === -1) {
      return res.status(404).json({ message: 'Group contribution not found in assignment' });
    }

    // Update grades in the assignment
    assignment.groups[groupIndex].grades = grades;

    await assignment.save();

    res.status(200).json({ message: 'Assignment graded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to grade assignment', error: error.message });
  }
};
