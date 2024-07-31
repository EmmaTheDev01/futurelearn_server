import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    chief: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    assignments: [
      {
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Assignment',
        },
        finished: {
          type: Boolean,
          default: false,
        },
      },
    ],
    answers: [
      {
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Assignment',
        },
        answer: {
          type: String,
        },
        user: {  // New field to reference the user who posted the answer
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Group', groupSchema);
