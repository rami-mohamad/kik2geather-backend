// app.js
const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const corsMiddleware = require("./config/cors");
const connectDB = require("./config/db");
const cors = require("cors");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// Routes
const userRouter = require("./routes/user.routes");
const bookingRouter = require("./routes/booking.routes");

const app = express();

// ✅ connect db once when app is created
connectDB();

// ✅ core middleware
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// ✅ CORS (important: must be before routes)
app.use(corsMiddleware);
// app.options("*", corsMiddleware);

// ✅ routes
app.use("/user", userRouter);
app.use("/booking", bookingRouter);

// ✅ 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
