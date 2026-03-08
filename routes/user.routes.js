const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authJwt");
const user = require("../controllers/user.controller");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => res.send("Inside user route"));

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be 8+ chars"),
    body("nickName").optional().trim(),
  ],
  validate,
  user.register,
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  user.login,
);

router.get("/me", auth(), user.me);

router.put(
  "/updatePassword",
  [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be 8+ chars"),
    body("repeatedPassword")
      .notEmpty()
      .withMessage("Repeat password is required"),
  ],
  validate,
  auth(),
  user.updatePassword,
);

router.delete("/me", auth(), user.deleteMe);

router.post(
  "/contact",
  [
    body("name").trim().notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("message").trim().notEmpty().withMessage("Message required"),
  ],
  validate,
  user.contact,
);

router.get("/confirmation", async (req, res) => {
  try {
    console.log(req.query);

    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");

    const payload = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    if (payload.type !== "confirm")
      return res.status(400).send("Invalid token");
    console.log(payload);

    await User.findByIdAndUpdate(payload.userId, { confirmed: true });
    return res.sendFile(__dirname, "../views/emailConfirmed.html");
  } catch (e) {
    console.log(e);

    return res.status(400).sendFile(__dirname, "../views/emailError.html");
  }
});

router.post("/logout", user.logout);

module.exports = router;
