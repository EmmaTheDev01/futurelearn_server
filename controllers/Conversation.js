import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// Helper function to validate ObjectIds
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createConversation = async (req, res) => {
  const userId = req.user.id; // Assuming userId is retrieved from authentication
  const { participants } = req.body; // Expecting an array of participants

  console.log('Participants received:', participants); // Debugging log

  if (!Array.isArray(participants) || participants.length !== 2 || !participants.every(id => isValidObjectId(id))) {
    return res.status(400).json({ message: 'Invalid participants format or length' });
  }

  try {
    // Check if participants exist and are valid users
    const existingParticipants = await User.find({ _id: { $in: participants } });
    if (existingParticipants.length !== 2) {
      return res.status(404).json({ message: 'One or more participants not found' });
    }

    // Check if conversation already exists between these participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
      deleted: false
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const newConversation = new Conversation({ participants });
    await newConversation.save();

    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Error creating or retrieving conversation:', error);
    res.status(500).json({ message: 'Failed to create or retrieve conversation', error: error.message });
  }
};



// Function to get conversations for a user
export const getUserConversations = async (req, res) => {
  const userId = req.params.id;

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

export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { senderId, content } = req.body;

  console.log('Request received to send a message');
  console.log(`Conversation ID: ${conversationId}`);
  console.log(`Sender ID: ${senderId}`);
  console.log(`Message content: ${content}`);

  try {
    // Validate conversationId and senderId
    if (!isValidObjectId(conversationId)) {
      console.error('Invalid conversation ID');
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }
    if (!isValidObjectId(senderId)) {
      console.error('Invalid sender ID');
      return res.status(400).json({ message: 'Invalid sender ID' });
    }

    // Check if sender exists
    console.log('Checking if sender exists...');
    const sender = await User.findById(senderId);
    if (!sender) {
      console.error('Sender not found');
      return res.status(404).json({ message: 'Sender not found' });
    }
    console.log('Sender found:', sender);

    // Find the conversation
    console.log('Finding conversation...');
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      console.error('Conversation not found');
      return res.status(404).json({ message: 'Conversation not found' });
    }
    console.log('Conversation found:', conversation);

    // Ensure sender is a participant in the conversation
    if (!conversation.participants.includes(senderId)) {
      console.error('Sender is not a participant in this conversation');
      return res.status(403).json({ message: 'Sender is not a participant in this conversation' });
    }

    // Create a new message and push it to the conversation
    console.log('Creating new message...');
    const receiverId = conversation.participants.find(id => id.toString() !== senderId);
    if (!receiverId) {
      console.error('Receiver not found');
      return res.status(400).json({ message: 'Receiver not found' });
    }

    const newMessage = {
      sender: senderId,
      content,
      receiver: receiverId
    };

    conversation.messages.push(newMessage);
    await conversation.save();
    console.log('Message saved to conversation');

    // Retrieve and populate the updated conversation
    console.log('Retrieving updated conversation...');
    const updatedConversation = await Conversation.findById(conversationId)
      .populate('participants', 'username')
      .populate('messages.sender', 'username')
      .populate('messages.receiver', 'username') // Populate receiver if needed
      .exec();
    console.log('Updated conversation:', updatedConversation);

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error('Failed to send message:', error.message);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};


// Function to get conversations where a user participated
export const getUserParticipatedConversations = async (req, res) => {
  const userId = req.user.id; // Assuming userId is retrieved from authentication

  try {
    // Log the user ID to verify
    console.log('User ID:', userId);

    // Find conversations where the user is a participant and not deleted
    const conversations = await Conversation.find({ participants: userId, deleted: false })
      .populate('participants', 'username') // Populate participant details
      .populate({
        path: 'messages',
        populate: [
          { path: 'sender', select: 'username' },
          { path: 'receiver', select: 'username' }
        ]
      })
      .exec(); // Execute the query

    // Log the result for debugging
    console.log('Conversations found:', conversations);

    // Return the conversations
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Failed to fetch user participated conversations:', error);
    res.status(500).json({ message: 'Failed to fetch user participated conversations', error: error.message });
  }
};

// Function to search for conversations using username, firstname, lastname, or email of a user
export const searchConversations = async (req, res) => {
  const { query } = req.params; // Search query

  try {
    // Find users matching the search query
    const users = await User.find({
      $or: [
        { username: new RegExp(query, 'i') },
        { firstname: new RegExp(query, 'i') },
        { lastname: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') }
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Extract user IDs from the found users
    const userIds = users.map(user => user._id);

    // Find conversations involving the found users
    const conversations = await Conversation.find({
      participants: { $in: userIds },
      deleted: false
    })
      .populate('participants', 'username firstname lastname email') // Populate participant details
      .populate('messages.sender', 'username');

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search conversations', error: error.message });
  }
};

export const getConversationById = async (req, res) => {
  const { conversationId } = req.params; // Use conversationId here
  try {
    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    // Find the conversation by ID
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'username firstname lastname email') // Populate participant details
      .populate({
        path: 'messages',
        populate: [
          { path: 'sender', select: 'username firstname lastname' },
          { path: 'receiver', select: 'username firstname lastname' }
        ]
      });

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Return the conversation
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Failed to fetch conversation', error: error.message });
  }
};
