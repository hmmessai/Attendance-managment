const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const dotenv = require("dotenv");

dotenv.config();

const createToken = (user) => {
    return jwt.sign({ id: user._id, name: user.name, email: user.email}, process.env.TOKEN_SECRET);
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const token = createToken(newUser);

        await newUser.save();

        res.status(200).json({ 
            message: "User registered successfully",
            token: token,
            user: { name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid User" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const token = createToken(user);

        res.json({ token: token, user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// const update = async (req, res) => {
//     try {
//         const user_id = req.user
//     }
// }

const currentUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            "name": user.name,
            "email": user.email
        });
    } catch (error) {
        console.error("Current user error:", error.message);
        res.status(401).json({ message: error.message });
    }
};

const protect = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await User.findById(decoded.id);
            req.user = user;
            next();
        }
    } catch (error) {
        res.status(401).json({"message": error.message});
    }
}

module.exports = { register, login, currentUser, protect };