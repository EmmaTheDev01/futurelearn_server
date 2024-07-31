import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    regNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
    photo: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
    department: {
      type: String,
      enum: ['computer science', 'Surveying', 'Civil Engineering', 'Architecture', 'Business', 'law', 'not assigned'],
      default: 'not assigned',
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
