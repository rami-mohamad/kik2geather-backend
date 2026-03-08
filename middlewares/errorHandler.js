// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error("❌ Error:", err);

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",
  });
};
