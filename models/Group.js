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
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Group', groupSchema);
