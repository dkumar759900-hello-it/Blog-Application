
const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");

// Authentication Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Create Blog
router.post("/create", verifyToken, async (req, res) => {
    try {
        const { title, category, description, content } = req.body;

        const blog = await Blog.create({
            title,
            category,
            description,
            content,
            author: req.userId
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Blogs
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Logged-in User's Blogs
router.get("/my-blogs", verifyToken, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.userId })
            .sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Single Blog Details
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json(blog);

    } catch (error) {
        res.status(400).json({
            message: "Invalid blog ID"
        });
    }
});


// Update Blog
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { title, category, description, content } = req.body;

        const blog = await Blog.findOneAndUpdate(
            { _id: req.params.id, author: req.userId },
            { title, category, description, content },
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Blog
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({
            _id: req.params.id,
            author: req.userId
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog deleted successfully"
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;
