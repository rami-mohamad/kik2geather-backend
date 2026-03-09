const jwt = require("jsonwebtoken");
const transporter = require("../config/mail");
const APP_URL = process.env.APP_URL || "http://localhost:4000";
const FROM = process.env.MAIL_FROM || "no-reply@k2g.com";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || FROM;

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET;
const EMAIL_TOKEN_EXPIRES = process.env.EMAIL_TOKEN_EXPIRES || "1d";

function signEmailToken(payload, expiresIn = EMAIL_TOKEN_EXPIRES) {
  if (!EMAIL_TOKEN_SECRET) throw new Error("Missing EMAIL_TOKEN_SECRET in env");
  return jwt.sign(payload, EMAIL_TOKEN_SECRET, { expiresIn });
}

async function sendMail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject,
    text: text || subject,
    html,
  });

  return info;
}

function confirmTemplate({ name, confirmLink }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>Confirm your email</h2>
      <p>Hello ${name || "player"},</p>
      <p>Thanks for registering. Please confirm your email by clicking below:</p>
      <p><a href="${confirmLink}">Confirm registration</a></p>
      <p>If you did not create an account, ignore this email.</p>
    </div>
  `;
}

function resetTemplate({ resetLink }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>Reset your password</h2>
      <p>Click below to reset your password:</p>
      <p><a href="${resetLink}">Reset password</a></p>
      <p>If you didn’t request this, ignore this email.</p>
    </div>
  `;
}

function bookedTemplate({ name, pin }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>Booking confirmed</h2>
      <p>Dear ${name || "player"}, thanks for booking.</p>
      <p>Your booked extras (T-shirt, shoes, towel) will be prepared for you.</p>
      <p><b>Your PIN code:</b> ${pin}</p>
    </div>
  `;
}

function contactTemplate({ name, email, message }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>Contact request</h2>
      <p><b>From:</b> ${name} (${email})</p>
      <p><b>Message:</b></p>
      <p>${String(message || "").replaceAll("\n", "<br/>")}</p>
    </div>
  `;
}

exports.sendConfirmEmail = async ({ userId, email, name }) => {
  const token = signEmailToken({ type: "confirm", userId, email });
  const confirmLink = `${APP_URL}/user/confirmation?token=${encodeURIComponent(token)}`;

  return sendMail({
    to: email,
    subject: "Confirm your registration",
    html: confirmTemplate({ name, confirmLink }),
  });
};

exports.sendResetEmail = async ({ userId, email }) => {
  const token = signEmailToken({ type: "reset", userId, email }, "15m");
  const resetLink = `${APP_URL}/user/resetconfirm?token=${encodeURIComponent(token)}`;

  return sendMail({
    to: email,
    subject: "Password reset",
    html: resetTemplate({ resetLink }),
  });
};

exports.sendBookedEmail = async ({ email, name, pin }) => {
  return sendMail({
    to: email,
    subject: "Booking confirmed",
    html: bookedTemplate({ name, pin }),
  });
};

exports.sendContactEmail = async ({ name, email, message }) => {
  return sendMail({
    to: SUPPORT_EMAIL,
    subject: "New contact request",
    html: contactTemplate({ name, email, message }),
  });
};
