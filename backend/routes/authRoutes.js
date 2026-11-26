
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Authentication Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    try {
        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;
        next();

    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// Get Logged-in User Profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
