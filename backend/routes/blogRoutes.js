
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
        const blogs = await Blog.find({ author: req.userId });

        res.json(blogs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
