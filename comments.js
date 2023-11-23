// Create web server
// This file contains all the routes for the comments

// Import express module
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { ensureAuthenticated } = require('../config/auth');
const { post } = require('./posts');

// Route for saving a comment
router.post('/save', ensureAuthenticated, [
    check('comment').not().isEmpty().withMessage('Comment cannot be empty'),
    check('post').not().isEmpty().withMessage('Post cannot be empty'),
], async (req, res) => {
    // Check if there are any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are errors, return the errors
        return res.status(400).json({ errors: errors.array() });
    }
    // Save comment to database
    try {
        // Create a new comment object
        const comment = new Comment({
            comment: req.body.comment,
            post: req.body.post,
            user: req.user.id,
        });
        // Save comment to database
        await comment.save();
        // Find the post that the comment belongs to
        const post = await Post.findById(req.body.post);
        // Add comment to post
        post.comments.push(comment);
        // Save post to database
        await post.save();
        // Find the user that wrote the comment
        const user = await User.findById(req.user.id);
        // Add comment to user
        user.comments.push(comment);
        // Save user to database
        await user.save();
        // Return success message
        res.status(200).json({ msg: 'Comment saved' });
    } catch (err) {
        // Log error to console
        console.error(err.message);
        // Return server error
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route for deleting a comment
router.delete('/delete', ensureAuthenticated, async (req, res) => {
    // Delete comment from database
    try {
        // Find comment in database
        const comment = await Comment.findById(req.body.comment);
        // Check if comment exists
        if (!comment) {
            // If comment does not exist, return error
            return res.status(404).json({ msg: