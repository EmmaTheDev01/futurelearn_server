// models/Conversation.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of participants (students)
  messages: [
    {
      sender: { type: Schema.Types.ObjectId, ref: 'User' }, // User who sent the message
      content: String, // Message content
      timestamp: { type: Date, default: Date.now } // Timestamp of the message
    }
  ],
  timestamp: { type: Date, default: Date.now },
});


const Conversation = mongoose.model('Conversation', conversationSchema);


export default Conversation;
