// models/Conversation.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' }, // User who sent the message
  content: String, // Message content
  timestamp: { type: Date, default: Date.now } // Timestamp of the message
});

const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, validate: [arrayLimit, '{PATH} exceeds the limit of 2'] }], // Array of participants (must be exactly 2)
  messages: [messageSchema], // Array of messages in the conversation
  timestamp: { type: Date, default: Date.now }, // Timestamp of conversation creation/update
  deleted: { type: Boolean, default: false } // Flag to mark conversation as deleted
});

function arrayLimit(val) {
  return val.length === 2;
}

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
