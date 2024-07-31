import nodemailer from 'nodemailer';
import Email from '../models/Email.js';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
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

    // Generate a new threadId if not provided (for new threads)
    const newThreadId = threadId || uuidv4();

    // Create email object
    const newEmail = new Email({
      from,
      to,
      subject,
      text,
      html,
      threadId: newThreadId // Use the existing or newly generated threadId
    });

    // Save email to database
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

// Function to get all emails a user participates in by email addresses
export const getUserEmails = async (req, res) => {
  try {
    const { userEmail } = req.params;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    // Find all emails where userEmail is either sender or recipient
    const emails = await Email.find({
      $or: [
        { from: userEmail },
        { to: userEmail }
      ]
    }).sort({ createdAt: -1 });

    // Log emails for debugging
    console.log('Querying for userEmail:', userEmail);
    console.log('Retrieved emails:', emails);

    if (emails.length === 0) {
      return res.status(404).json({ message: 'No emails found for this user' });
    }

    res.status(200).json({ message: 'Emails retrieved successfully', emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ message: 'Failed to fetch emails', error: error.message });
  }
};

// Function to reply to a conversation by threadId
export const replyToConversation = async (req, res) => {
  const { threadId } = req.params;
  const { from, to, subject, text, html } = req.body;

  try {
    // Check if threadId is provided
    if (!threadId) {
      return res.status(400).json({ message: 'Thread ID is required for replies' });
    }

    // Create email object for reply
    const replyEmail = new Email({
      from,
      to,
      subject,
      text,
      html,
      threadId // Use the existing threadId for replies
    });

    // Save reply email to database
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

// Function to get an email by its ID
export const getEmailById = async (req, res) => {
  const { emailId } = req.params;

  try {
    // Find email by its ID
    const email = await Email.findById(emailId);

    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    res.status(200).json({ message: 'Email retrieved successfully', email });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ message: 'Failed to fetch email', error: error.message });
  }
};
