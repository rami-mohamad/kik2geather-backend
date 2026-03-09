// config/cors.js
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // Vite
  "https://kik2geather-frontend.onrender.com", // if you still run CRA sometimes
];

module.exports = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
