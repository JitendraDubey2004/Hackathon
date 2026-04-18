const User = require("../models/User");
const { generateToken } = require("../middleware/authMiddleware");

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        errorCode: "USER_ALREADY_EXISTS"
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "user"
    });

    return res.status(201).json({
      message: "Signup successful",
      token: generateToken({ id: user._id, role: user.role }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS"
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken({ id: user._id, role: user.role }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserProfile(req, res) {
  return res.status(200).json({ user: req.user });
}

module.exports = {
  getUserProfile,
  login,
  signup
};
