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

    // Check if any of the members are already in another group
    const existingGroups = await Group.find({ members: { $in: memberIds } });
    if (existingGroups.length > 0) {
      const groupNames = existingGroups.map(group => group.name).join(', ');
      return res.status(400).json({ message: `One or more members are already in the following groups: ${groupNames}` });
    }

    // Create new group
    const newGroup = new Group({
      name,
      chief: chiefId, // Set chiefId to the chief field
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

export const submitAssignmentAnswers = async (req, res) => {
  const { groupId } = req.params; // Extract groupId from URL parameters
  const { assignmentId, answers } = req.body;
  const userId = req.user.id; // Assuming userId is set in req.user from authentication middleware

  console.log("submitAssignmentAnswers function started");
  console.log("Request Parameters:", { groupId, assignmentId, answers });
  console.log("User:", req.user);

  try {
    // Check if the group exists
    const group = await Group.findById(groupId);
    
    // Debug log to verify groupId and fetched group
    console.log("Fetched Group Data:", group);

    if (!group) {
      console.log("Group not found");
      return res.status(404).json({ error: "Group not found" });
    }

    console.log("Group found:", group);

    // Check if user is a member of the group
    if (!group.members.some(member => member.toString() === userId.toString())) {
      console.log("User is not a member of the group");
      return res.status(403).json({ error: "User is not a member of this group" });
    }

    console.log("User is a member of the group:", { groupId, userId });

    // Process answers
    if (!assignmentId || !answers) {
      console.log("Invalid input");
      return res.status(400).json({ error: "Invalid input" });
    }

    // Example of updating answers, assuming the structure of your group model
    const existingAnswerIndex = group.answers.findIndex(
      a => a.assignment.toString() === assignmentId.toString() && a.user.toString() === userId.toString()
    );

    if (existingAnswerIndex !== -1) {
      // Update existing answer
      console.log("Updating existing answer for assignment:", { assignmentId, userId });
      group.answers[existingAnswerIndex].answer = answers;
    } else {
      // Add new answer
      console.log("Adding new answer for assignment:", { assignmentId, userId });
      group.answers.push({
        assignment: assignmentId,
        user: userId,
        answer: answers
      });
    }

    // Save group with updated answers
    await group.save();
    
    console.log("Assignment answers submitted successfully");
    res.status(200).json({ message: "Assignment answers submitted successfully" });
  } catch (error) {
    console.error("Error in submitAssignmentAnswers function:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

// Function to fetch groups that a user participates in
export const getMyGroups = async (req, res) => {
  const userId = req.user.id; 
  
  try {
    const groups = await Group.find({ members: userId }).populate('members', 'firstname lastname');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups', error: error.message });
  }
};

