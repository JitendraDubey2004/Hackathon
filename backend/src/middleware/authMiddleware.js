const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

function apiKeyAuth(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (!process.env.API_KEY) {
    return res.status(500).json({
      message: "API key is not configured",
      errorCode: "API_KEY_NOT_CONFIGURED"
    });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      message: "Invalid API key",
      errorCode: "INVALID_API_KEY"
    });
  }

  return next();
}

async function protect(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized, token missing",
      errorCode: "TOKEN_MISSING"
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let identity = null;

    if (decoded.role === "admin") {
      identity = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === "user") {
      identity = await User.findById(decoded.id).select("-password");
    }

    if (!identity) {
      identity = (await Admin.findById(decoded.id).select("-password")) || (await User.findById(decoded.id).select("-password"));
    }

    if (!identity) {
      return res.status(401).json({
        message: "Not authorized, user not found",
        errorCode: "USER_NOT_FOUND"
      });
    }

    req.user = identity;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
      errorCode: "TOKEN_INVALID"
    });
  }
}

function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
        errorCode: "FORBIDDEN"
      });
    }

    return next();
  };
}

module.exports = {
  apiKeyAuth,
  authorizeRole,
  generateToken,
  protect
};
