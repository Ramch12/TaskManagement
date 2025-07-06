const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { required } = require("joi");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    mobile:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }

  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(this.toJSON(), process.env.PRIVATE_KEY, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.isPassMatch = async function (password) {
  const isPassMatch = await bcrypt.compare(password, this.password);
  if (isPassMatch) return true;
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
