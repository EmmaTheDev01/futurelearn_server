import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// Function to create a new conversation
export const createConversation = async (req, res) => {
  const { participants } = req.body;

  try {
    // Check if participants exist and are valid users
    const existingParticipants = await User.find({ _id: { $in: participants } });
    if (existingParticipants.length !== participants.length) {
      return res.status(404).json({ message: 'One or more participants not found' });
    }

    // Create new conversation
    const newConversation = new Conversation({ participants });
    await newConversation.save();

    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create conversation', error: error.message });
  }
};

// Function to get conversations for a user
export const getUserConversations = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find conversations where the user is a participant
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username') // Populate participant details
      .populate('messages.sender', 'username'); // Populate message sender details

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user conversations', error: error.message });
  }
};

// Function to send a message in a conversation
export const sendMessage = async (req, res) => {
  const { conversationId, senderId, content } = req.body;

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

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
