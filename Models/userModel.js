const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [100, "Please Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please Enter a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    // This validator is only work with save() and create()
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password and Confirm Password does not match",
    },
  },
  passwordChangedAt: Date,
});
// Pre save middleware(encrypt the password before saving in db using pre save middleware)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.comparePasswordInDb = async function (pass, passDB) {
  return await bcrypt.compare(pass, passDB);
};
userSchema.methods.isPasswordChange = async function(JWTTimestemp) {
    if(this.passwordChangedAt) {
        const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimestemp < pswdChangedTimestamp
    }
    return false;
};
// USER model will created in mongodb
const User = mongoose.model("User", userSchema);
module.exports = User;
