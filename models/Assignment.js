import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: ['computer science', 'Surveying', 'Civil Engineering', 'Architecture', 'Business','law', 'all'],
      default: 'all',
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groups: [
      {
        group: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Group',
        },
        finished: {
          type: Boolean,
          default: false,
        },
        grades: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            grade: {
              type: Number,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
