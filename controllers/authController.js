import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  console.log(req.body)
;  try {
    const { name, email, password, branch, year } = req.body;
    // Validate fields
    if (!name || !email || !password || !branch || !year) {
      return res.status(400).json({
        error: "Please fill all fields",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      branch,
      year,
    });
    // Generate JWT
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        points: user.points,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email });
    // Check credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    // Generate JWT
    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        points: user.points,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
export const getMe = (req, res) => {
  res.status(200).json(req.user);
};
// @desc    Leaderboard
// @route   GET /api/auth/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select("name points branch");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};