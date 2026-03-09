const dayjs = require("dayjs");

const User = require("../models/User");
const Booking = require("../models/Booking");
const Field = require("../models/Field");
const mail = require("../services/mail.service");
const { findFreeSlots } = require("../services/fieldAvailability.service");

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000);
}

function parseDate(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) throw new Error("Invalid date format");
  return dt;
}

async function getFieldIdByNumber(fieldNumber) {
  const f = await Field.findOne({ number: fieldNumber });
  if (!f) throw new Error("Field not found");
  return f._id;
}

async function checkAvailability({
  startTime,
  endTime,
  fieldNumber,
  numberOfPersons,
}) {
  const slots = await findFreeSlots(Number(startTime));

  const startHour = startTime.getHours();
  const endHour = endTime.getHours(); // end is exclusive
  if (endHour <= startHour)
    throw new Error("End time must be after start time");

  for (let h = startHour; h < endHour; h++) {
    const slot = slots[h];
    if (slot && slot[`field_${fieldNumber}`] + numberOfPersons > 10) {
      return false;
    }
  }
  return true;
}

exports.findSlotsForDate = async (date) => {
  const startTime = new Date(date);
  if (Number.isNaN(startTime.getTime())) throw new Error("Invalid date");
  return findFreeSlots(Number(startTime));
};

exports.getDashboard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const bookings = await Booking.find({ user: userId }).sort({ startTime: -1 });
  return {
    user: {
      nickname: user.nickName ?? user.nickName,
      name: user.name,
      email: user.email,
    },
    bookings,
  };
};

exports.createBooking = async (userId, body) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const fieldNumber = Number(body.field);
  if (![1, 2, 3, 4].includes(fieldNumber)) throw new Error("Invalid field");

  const startTime = parseDate(body.startTime);
  const endTime = parseDate(body.endTime);

  const numberOfPersons = Number(body.numberOfPersons);
  if (
    !Number.isFinite(numberOfPersons) ||
    numberOfPersons < 1 ||
    numberOfPersons > 10
  ) {
    throw new Error("Maximum Number of Persons is 10");
  }

  const limit = dayjs().add(90, "days");
  if (dayjs(startTime).isAfter(limit)) throw new Error("Date too far ahead");

  const ok = await checkAvailability({
    startTime,
    endTime,
    fieldNumber,
    numberOfPersons,
  });

  if (!ok) {
    throw new Error("No free places for this time and number of people");
  }

  const fieldId = await getFieldIdByNumber(fieldNumber);
  if (!fieldId) throw new Error("Field not configured");

  const pin = generatePin();

  const bookingDoc = await Booking.create({
    user: userId,
    field: fieldId,
    startTime,
    endTime,
    numberOfPersons,
    tshirt: body.tshirt || [],
    shoes: body.shoes || [],
    towels: Number(body.towels || 0),
    pin,
  });

  let emailSent = true;

  try {
    await mail.sendBookedEmail({
      email: user.email,
      name: user.name,
      pin,
    });
  } catch (err) {
    emailSent = false;
    console.error("Booking email failed:", err);
  }

  return {
    success: true,
    message: [`The field is booked, booking number is ${bookingDoc.id}`],
    email: user.email,
    emailSent,
  };
};

exports.deleteBooking = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (String(booking.user) !== String(userId)) {
    return { success: false, message: ["Forbidden"] };
  }

  await Booking.findByIdAndDelete(bookingId);
  return { success: true, message: [`The booking ${bookingId} is deleted`] };
};
