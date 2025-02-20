const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const util = require("util");

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
    if(req.user.role !== role){
      res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  }
}
