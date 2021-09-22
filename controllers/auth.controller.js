const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const config = require("../config/config");

const signup = () => {};

const jwtSecret = process.env.jWT_SECRET || config.jwtSecret || "VideoStream";

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    res.status(400).json({
      message: "Please send valid Email Address",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user === null || user === undefined) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        message: "Email and Password don't match",
      });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      jwtSecret
    );
    res.cookie("t", token, {
      expire: new Date() + 9999,
    });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).json({
      error: error.message,
    });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "Successfully Signed out",
  });
};

const requireSignin = expressJwt({
  secret: "VideoStream",
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile &&
    req.auth &&
    req.profile._id.toString() === req.auth._id.toString();

  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

module.exports = { signIn, signout, requireSignin, hasAuthorization, signup };
