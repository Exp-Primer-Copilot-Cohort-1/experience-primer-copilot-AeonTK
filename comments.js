// Create web server
// ====================

// Include the modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

// Import comments schema
const Comments = require('../models/comments');

// Create router
const commentRouter = express.Router();

commentRouter.use(bodyParser.json());

// Route for '/'
commentRouter.route('/')
// GET method
.get((req, res, next) => {
    // Find all comments
    Comments.find({})
    // Populate author field
    .populate('author')
    .then((comments) => {
        // Send response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// POST method
.post(authenticate.verifyUser, (req, res, next) => {
    // Check if user is admin
    if (req.user.admin) {
        // Send error message
        res.statusCode = 403;
        res.end('You are not authorized to perform this operation!');
    } else {
        // Create new comment
        Comments.create(req.body)
        .then((comment) => {
            // Send response
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
})
// PUT method
.put(authenticate.verifyUser, (req, res, next) => {
    // Send error message
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments');
})
// DELETE method
.delete(authenticate.verifyUser, (req, res, next) => {
    // Check if user is admin
    if (req.user.admin) {
        // Delete all comments
        Comments.remove({})
        .then((resp) => {
            // Send response
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
        // Send error message
        res.statusCode = 403;
        res.end('You are not authorized to perform this operation!');
    }
});

// Route for '/:commentId'
commentRouter.route('/:commentId')
// GET