// controllers/emailController.js

import nodemailer from 'nodemailer';
import Email from '../models/Email.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send an email and manage threads
export const sendEmail = async (req, res) => {
  try {
    const { from, to, subject, text, html, threadId } = req.body;

    // Validate email data
    if (!from || !to || !subject || (!text && !html)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create email object
    const newEmail = new Email({
      from,
      to,
      subject,
      text,
      html,
      threadId
    });

    // Save email to database (optional)
    await newEmail.save();

    // Send email using Nodemailer
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    res.status(200).json({ message: 'Email sent successfully', email: newEmail });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};


// Function to get email conversations (threads)
export const getEmailThreads = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find all emails where userId is either sender or recipient
      const emails = await Email.find({
        $or: [
          { from: userId },
          { to: userId }
        ]
      }).sort({ createdAt: -1 });
  
      // Group emails by threadId to form conversations
      const conversations = {};
      emails.forEach(email => {
        const threadId = email.threadId;
        if (!conversations[threadId]) {
          conversations[threadId] = [];
        }
        conversations[threadId].push(email);
      });
  
      res.status(200).json({ message: 'Email conversations retrieved successfully', conversations });
    } catch (error) {
      console.error('Error fetching email conversations:', error);
      res.status(500).json({ message: 'Failed to fetch email conversations', error: error.message });
    }
  };

// Function to get a conversation by threadId
export const getConversationById = async (req, res) => {
    const { threadId } = req.params;
  
    try {
      // Find all emails with the given threadId
      const conversation = await Email.find({ threadId });
  
      if (!conversation || conversation.length === 0) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
  
      res.status(200).json({ message: 'Conversation retrieved successfully', conversation });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ message: 'Failed to fetch conversation', error: error.message });
    }
  };
  
  // Function to reply to a conversation by threadId
  export const replyToConversation = async (req, res) => {
    const { threadId } = req.params;
    const { from, to, subject, text, html } = req.body;
  
    try {
      // Create email object for reply
      const replyEmail = new Email({
        from,
        to,
        subject,
        text,
        html,
        threadId
      });
  
      // Save reply email to database (optional)
      await replyEmail.save();
  
      // Send reply email using Nodemailer
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      });
  
      res.status(200).json({ message: 'Reply sent successfully', email: replyEmail });
    } catch (error) {
      console.error('Error replying to conversation:', error);
      res.status(500).json({ message: 'Failed to reply to conversation', error: error.message });
    }
  };

