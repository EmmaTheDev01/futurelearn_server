import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// Function to create a new conversation or retrieve an existing one
export const createConversation = async (req, res) => {
  const { userId } = req.params; // User initiating the conversation
  const { participantId } = req.body; // The other participant

  try {
    // Check if participants exist and are valid users
    const existingParticipants = await User.find({ _id: { $in: [userId, participantId] } });
    if (existingParticipants.length !== 2) {
      return res.status(404).json({ message: 'One or more participants not found' });
    }

    // Check if conversation already exists between these participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      deleted: false // Assuming there's a field 'deleted' in Conversation model
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const newConversation = new Conversation({ participants: [userId, participantId] });
    await newConversation.save();

    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create or retrieve conversation', error: error.message });
  }
};

// Function to get conversations for a user
export const getUserConversations = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find conversations where the user is a participant and not deleted
    const conversations = await Conversation.find({ participants: userId, deleted: false })
      .populate('participants', 'username') // Populate participant details
      .populate('messages.sender', 'username'); // Populate message sender details

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user conversations', error: error.message });
  }
};

// Function to send a message in a conversation
export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { senderId, content } = req.body;

  try {
    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if sender is a participant in the conversation
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: 'Sender is not a participant in this conversation' });
    }

    // Add message to the conversation
    const newMessage = {
      sender: senderId,
      content
    };

    conversation.messages.push(newMessage);
    await conversation.save();

    // Fetch updated conversation with populated messages
    const updatedConversation = await Conversation.findById(conversationId)
      .populate('participants', 'username')
      .populate('messages.sender', 'username');

    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// Function to get conversations where a user participated
export const getUserParticipatedConversations = async (req, res) => {
  const userId = req.user._id; // Assuming userId is retrieved from authentication

  try {
    // Find conversations where the user is a participant and not deleted
    const conversations = await Conversation.find({ participants: userId, deleted: false })
      .populate('participants', 'username') // Populate participant details
      .populate('messages.sender', 'username'); // Populate message sender details

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user participated conversations', error: error.message });
  }
};
