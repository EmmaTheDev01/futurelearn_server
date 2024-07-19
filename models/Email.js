// models/Email.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const emailSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  html: { type: String },
  threadId: { type: String }  // Add threadId to identify email threads
}, { timestamps: true });

const Email = mongoose.model('Email', emailSchema);

export default Email;
