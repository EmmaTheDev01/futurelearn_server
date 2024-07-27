// models/ChatBot.js
import mongoose from 'mongoose';

const chatBotSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: true
  },
  botReply: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatBot = mongoose.model('ChatBot', chatBotSchema);

export default ChatBot;
