const dayjs = require("dayjs");
const Booking = require("../models/Booking");

// hours your system supports (14:00 - 22:00 start times)
const OPEN_HOURS = [14, 15, 16, 17, 18, 19, 20, 21, 22];

const FIELD_KEY_BY_NUMBER = {
  1: "field_1",
  2: "field_2",
  3: "field_3",
  4: "field_4",
};

function createEmptyBookedPlaces() {
  const out = {};
  for (const h of OPEN_HOURS) out[h] = null;
  return out;
}

function createEmptyCounts() {
  return { field_1: 0, field_2: 0, field_3: 0, field_4: 0 };
}

/**
 * Returns booked persons per field for each hour slot of that day.
 * Example:
 * {
 *   14: { field_1: 3, field_2: 0, field_3: 10, field_4: 0 },
 *   15: null,
 *   ...
 * }
 */
async function findFreeSlots(dateInput) {
  const dayStart = dayjs(dateInput).startOf("day").toDate();
  const dayEnd = dayjs(dateInput).endOf("day").toDate();

  // only bookings that overlap the day
  const bookings = await Booking.find({
    startTime: { $lte: dayEnd },
    endTime: { $gte: dayStart },
  })
    .populate("field", "name number")
    .select("startTime endTime numberOfPersons field")
    .lean();

  const bookedPlaces = createEmptyBookedPlaces();

  for (const b of bookings) {
    const fieldName = b.field?.name;
    const key = FIELD_KEY_BY_NUMBER[b.field?.number];
    if (!key) continue;

    const startHour = dayjs(b.startTime).hour();
    const endHour = dayjs(b.endTime).hour();

    for (let h = startHour; h < endHour; h++) {
      if (!OPEN_HOURS.includes(h)) continue;

      if (bookedPlaces[h] === null) bookedPlaces[h] = createEmptyCounts();
      bookedPlaces[h][key] += Number(b.numberOfPersons || 0);
    }
  }

  return bookedPlaces;
}

/**
 * Range version (if you still need it).
 * Returns the same structure but for a start+end date range.
 */
async function findFreeSlotsRange(dateStart, dateFinish) {
  const start = dayjs(dateStart).startOf("day").toDate();
  const end = dayjs(dateFinish).endOf("day").toDate();

  const bookings = await Booking.find({
    startTime: { $lte: end },
    endTime: { $gte: start },
  })
    .populate("field", "name")
    .select("startTime endTime numberOfPersons field")
    .lean();

  return { bookings };
}

module.exports = { findFreeSlots, findFreeSlotsRange };
