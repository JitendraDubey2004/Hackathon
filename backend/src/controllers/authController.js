const Admin = require("../models/Admin");
const { generateToken } = require("../middleware/authMiddleware");

async function registerAdmin(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const existingAdmin = await Admin.findOne({ email: email?.toLowerCase() });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin already exists",
        errorCode: "ADMIN_ALREADY_EXISTS"
      });
    }

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "admin"
    });

    return res.status(201).json({
      message: "Admin created",
      token: generateToken({ id: admin._id, role: admin.role }),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS"
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken({ id: admin._id, role: admin.role }),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res) {
  return res.status(200).json({ admin: req.user });
}

module.exports = {
  getProfile,
  registerAdmin,
  loginAdmin
};
