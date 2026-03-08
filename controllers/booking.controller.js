const bookingService = require("../services/booking.service");

exports.searchDay = async (req, res) => {
  const { date } = req.body;
  const slots = await bookingService.findSlotsForDate(date);
  res.json(slots);
};

exports.dashboard = async (req, res) => {
  console.log("start");

  const data = await bookingService.getDashboard(req.user.id);
  console.log(data);

  res.json({ success: true, ...data });
};

exports.book = async (req, res) => {
  const result = await bookingService.createBooking(req.user.id, req.body);
  res.status(201).json(result);
};

exports.deleteBooking = async (req, res) => {
  console.log(req.params);

  const { bookingId } = req.params;
  const result = await bookingService.deleteBooking(req.user.id, bookingId);
  res.json(result);
};
