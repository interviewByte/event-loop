const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const util = require("util");
const snedEmail = require("../Utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.SCERET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const {eamil, password} = req.body;
  if (!email || !password) {
    res.status(400).json({
      status: "fail",
      message: "Please provide Email ID! and Password",
    });
    // const error = "Please provide Email ID! and Password"
    // call global handling middleware
    // return next(error)
  }
  const user = await User.findOne({ email }).select("+password");
  // const isMatch = await user.comparePasswordInDb(password, user.password)
  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    res.status(400).json({
      status: "fail",
      message: "Incorrect Email or Password",
    });
  }
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token,
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  //1. Read the token & check if it exist
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "You are not logged in !",
    });
    next();
  }
  //2. validate the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SCERET_STR
  );
  // console.log("decodedToken",decodedToken)
  //3. if the user exist
  const user = await User.findById(decodedToken.id);

  if (!user) {
    res.status(401).json({
      status: "fail",
      message: "The User given token does not exist!",
    });
    next();
  }
  //4 if the user change password after the token was issued
  const isPasswordChanged = await user.isPasswordChange(decodedToken.iat);
  if (isPasswordChanged) {
    res.status(401).json({
      status: "fail",
      message: "The Password has been changed recently! Please login again",
    });
    return next();
  }
  // Allow user to access the route (added new property in req object)
  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
//for multipl role
// exports.restrict = (...role) => {
//   return (req, res, next) => {
//     if (!role.includes(req.user.role)) {
//       return res.status(403).json({
//         status: "fail",
//         message: "You do not have permission to perform this action",
//       });
//     }
//     next();
//   };
// };

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //1. GET USER BASED ON POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "We could not find user with given Email",
    });
  }
  // 2. GENERATE A RANDOM RESET TOKEN
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // 3. SEND THE TOKEN BACK TO THE USER EMAIL
  const resetUrl = `${req.protocol}://${req.hostname}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have received a password reset request Please use the below link to reset your password\n\n${resetUrl}\n\nThis password line will be valid only for 10 minutes.`;
  try {
    await snedEmail({
      email: user.email,
      subject: "Password change request received",
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "Password reset link send to the user email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      status: "fail",
      message:
        "There was an error sending the password reset email. Please try again later",
    });
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  //1. IF THE USER EXIST WITH GIVEN TOKEN & TOKEN HAS NOT EXPIRED
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired!",
    });
  }
  //2. RESETING THE USER PASSWORD
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  user.save();

  //3. LOGIN THE USER
  const loginToken = signToken(user._id);
  res.status(201).json({
    status: "success",
    token: loginToken,
  });
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  //GET CURRENT USER DATA FROM DATABASE
  const user = await User.findById(req.user._id).select("+password");
  //CHECK IF THE SUPPLOED CURRENT PASSWORD
  if (
    !(await user.comparePasswordInDb(req.body.currentPassword, user.password))
  ) {
    return res.status(401).json({
      status: "fail",
      message: "The current passowrd you provided is wrong with new value",
    });
  }
  //IF SUPPLIED PASSWORD IS CORRECT, UPDATE THE USER PASSWORD WITH NEW VALUE
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  //LOGIN USER & SEND JWT
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token: token,
    data: {
      user,
    },
  });
});
