// controllers/postController.js

import Post from '../models/Post.js';
import mongoose from 'mongoose';

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, desc, imageUrl, redirect } = req.body;
    
    const newPost = new Post({
      title,
      desc,
      imageUrl,
      redirect,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve posts', error: error.message });
  }
};

// Get a post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve post', error: error.message });
  }
};

// Update a post by ID
const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = req.body; // Assuming req.body contains updated post information
    const result = await Post.findByIdAndUpdate(postId, updatedPost, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post updated successfully', post: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

// Delete a post by ID
const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await Post.findByIdAndDelete(postId);
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully', post: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

// Update approval status of a post
const updateApprovalStatus = async (req, res) => {
  try {
    const postId = req.params.id;
    const { approved } = req.body;
    const result = await Post.findByIdAndUpdate(postId, { approved }, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Approval status updated successfully', post: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update approval status', error: error.message });
  }
};

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  updateApprovalStatus,
};
