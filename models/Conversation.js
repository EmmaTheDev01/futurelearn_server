import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Message Schema
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Conversation Schema
const conversationSchema = new Schema({
  participants: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    validate: {
      validator: function (v) {
        // Ensure that the array has exactly 2 elements
        return v.length === 2;
      },
      message: 'Participants array should have exactly 2 elements.'
    },
    required: [true, 'Participants are required']
  },
  messages: [messageSchema],
  timestamp: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
