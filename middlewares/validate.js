const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const messages = result.array().map((e) => e.msg);
  return res.status(400).json({ success: false, message: messages });
};
