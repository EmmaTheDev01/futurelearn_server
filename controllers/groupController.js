import Group from '../models/Group.js';
import User from '../models/User.js';
import Assignment from '../models/Assignment.js';

// Function to create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, chiefId, memberIds, message } = req.body;

    // Check if chief and members exist and are valid
    const chief = await User.findById(chiefId);
    if (!chief) {
      return res.status(404).json({ message: 'Chief user not found' });
    }

    const members = await User.find({ _id: { $in: memberIds } });
    if (members.length !== memberIds.length) {
      return res.status(404).json({ message: 'One or more members not found' });
    }

    // Create new group
    const newGroup = new Group({
      name,
      chief: chiefId,
      members: memberIds,
      message,
    });

    await newGroup.save();

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create group', error: error.message });
  }
};

// Function to get all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups', error: error.message });
  }
};

// Function to get a single group by ID
export const getGroupById = async (req, res) => {
  const groupId = req.params.id;
  try {
    const group = await Group.findById(groupId).populate('members', 'username');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group', error: error.message });
  }
};

// Function to update a group by ID
export const updateGroupById = async (req, res) => {
  const groupId = req.params.id;
  const { name, message } = req.body;
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name, message },
      { new: true }
    );
    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update group', error: error.message });
  }
};

// Function to delete a group by ID
export const deleteGroupById = async (req, res) => {
  const groupId = req.params.id;
  try {
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete group', error: error.message });
  }
};

// Function for a member to submit their assignment answers
export const submitAssignmentAnswers = async (req, res) => {
  const groupId = req.params.id;
  const { assignmentId, answers } = req.body;

  try {
    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Ensure only group members can submit their answers
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only group members can submit answers' });
    }

    // Find assignment in which group is participating
    const assignment = await Assignment.findOne({ _id: assignmentId, 'groups.groupId': groupId });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or group is not participating' });
    }

    // Update group's answers in the assignment
    const groupIndex = assignment.groups.findIndex(g => g.groupId.toString() === groupId);
    assignment.groups[groupIndex].answers = answers;

    await assignment.save();

    res.status(200).json({ message: 'Assignment answers submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit assignment answers', error: error.message });
  }
};

// Function for the chief to submit the group's assignment after all answers are in
export const submitGroupAssignment = async (req, res) => {
  const groupId = req.params.id;
  const { assignmentId } = req.body;

  try {
    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Ensure only the group chief can submit the assignment
    if (group.chief.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group chief can submit the assignment' });
    }

    // Find assignment in which group is participating
    const assignment = await Assignment.findOne({ _id: assignmentId, 'groups.groupId': groupId });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or group is not participating' });
    }

    // Check if all group members have submitted their answers
    const groupIndex = assignment.groups.findIndex(g => g.groupId.toString() === groupId);
    const groupAnswers = assignment.groups[groupIndex].answers;

    if (groupAnswers.length !== group.members.length) {
      return res.status(400).json({ message: 'All group members must submit their answers first' });
    }

    // Mark assignment as completed for the group
    assignment.groups[groupIndex].completed = true;

    await assignment.save();

    res.status(200).json({ message: 'Assignment submitted successfully by the group chief' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit assignment', error: error.message });
  }
};
