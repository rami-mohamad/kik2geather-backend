const User = require("../models/User");
const jwtService = require("../services/jwt.service");
const mail = require("../services/mail.service");

const cookieOptions = {
  httpOnly: true,
  samSite: "none",
  secure: process.env.NODE_ENV === "production",
};

exports.register = async (req, res) => {
  const { name, email, password, nickName } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res
      .status(400)
      .json({ success: false, message: ["Email already in use"] });
  }

  const user = await User.create({ name, email, password, nickName });

  await mail.sendConfirmEmail({
    userId: user._id,
    email: user.email,
    name: user.name,
  });

  return res.status(201).json({
    success: true,
    message: ["User registered. Please confirm your email."],
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: ["Invalid email or password"] });
  }

  const matched = await user.comparePassword(password);
  if (!matched) {
    return res
      .status(400)
      .json({ success: false, message: ["Invalid email or password"] });
  }

  if (!user.confirmed) {
    return res
      .status(400)
      .json({ success: false, message: ["Email not confirmed"] });
  }

  const token = jwtService.sign(user);

  return res
    .cookie("jwt", token, cookieOptions)
    .status(200)
    .json({ success: true, message: ["Logged in"] });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "name email nickName role confirmed",
  );
  return res.json({ success: true, user });
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword, repeatedPassword } = req.body;
  if (newPassword !== repeatedPassword) {
    return res
      .status(400)
      .json({ success: false, message: ["Passwords do not match"] });
  }

  const user = await User.findById(req.user.id);
  const matched = await user.comparePassword(oldPassword);
  if (!matched) {
    return res
      .status(400)
      .json({ success: false, message: ["Invalid old password"] });
  }

  user.password = newPassword;
  await user.save();

  return res.json({ success: true, message: ["Password updated"] });
};

exports.deleteMe = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  return res.json({ success: true, message: ["User deleted"] });
};

exports.logout = async (req, res) => {
  res.clearCookie("jwt", cookieOptions);
  return res.json({ success: true, message: ["Logged out"] });
};

exports.contact = async (req, res) => {
  console.log(req.body);

  await mail.sendContactEmail(req.body);
  return res.json({ success: true, message: ["Contact request sent"] });
};
