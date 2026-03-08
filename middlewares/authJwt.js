const jwt = require("jsonwebtoken");

function auth(requiredRole) {
  return (req, res, next) => {
    console.log("start");

    try {
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: ["JWT_SECRET is missing on the server"],
        });
      }

      const bearer = req.headers.authorization;
      const token =
        req.cookies?.jwt ||
        (bearer && bearer.startsWith("Bearer ") ? bearer.slice(7) : null);

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: ["Unauthorized"] });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // { id, role, email, ... }

      if (requiredRole) {
        // allow string OR array of roles
        const allowed = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];

        if (!allowed.includes(payload.role)) {
          return res
            .status(403)
            .json({ success: false, message: ["Forbidden"] });
        }
      }

      return next();
    } catch (err) {
      const msg =
        err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";

      return res.status(401).json({ success: false, message: [msg] });
    }
  };
}

module.exports = auth;
