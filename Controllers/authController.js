const { token } = require("morgan");
const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require('jsonwebtoken');

const signToken = id=> {
  return jwt.sign({id:id}, process.env.SCERET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES
  })
}


exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id)
  res.status(201).json({
    status: 'success',
    token,
    data: {
        user: newUser
    }
  })
});

exports.login = asyncErrorHandler(async (req, res, next)=> {
  const email = req.body.email;
  const password = req.body.password;
  // const {eamil, password} = req.body;
  if( !email || !password){
    res.status(400).json({
      status: 'fail',
      message: "Please provide Email ID! and Password"
    })
    // const error = "Please provide Email ID! and Password"
    // call global handling middleware
    // return next(error)
  }
  const user = await User.findOne({email}).select('+password');
  // const isMatch = await user.comparePasswordInDb(password, user.password)
  if(!user || !(await user.comparePasswordInDb(password, user.password))){
    res.status(400).json({
      status: 'fail',
      message: "Incorrect Email or Password"
    })
  }
  const token = signToken(user._id)
  res.status(201).json({
    status: "success",
    token
  })
})
