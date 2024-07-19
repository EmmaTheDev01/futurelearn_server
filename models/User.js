import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    role: {
      type: String,
      enum: ['student', 'lecturer', 'admin'],
      default: 'student',
    },
    assignments: [
      {
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Assignment',
        },
        contribution: {
          type: Boolean,
          default: false,
        },
        grade: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
