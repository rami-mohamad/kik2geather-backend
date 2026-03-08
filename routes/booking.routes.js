const express = require("express");
const router = express.Router();

const asyncHandler = require("../middlewares/asyncHandler");
const authJwt = require("../middlewares/authJwt");

const bookingController = require("../controllers/booking.controller");

router.post("/search", asyncHandler(bookingController.searchDay));
router.get("/dashboard", authJwt(), asyncHandler(bookingController.dashboard));
router.post("/book", authJwt(), asyncHandler(bookingController.book));
router.delete(
  "/:bookingId",
  authJwt(),
  asyncHandler(bookingController.deleteBooking),
);

module.exports = router;
