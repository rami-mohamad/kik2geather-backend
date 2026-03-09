const mongoose = require("mongoose");
const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    field: {
      type: Schema.Types.ObjectId,
      ref: "Field",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
      validate: {
        validator: (date) => {
          const now = dayjs();
          const limit = now.add(90, "days");
          // ✅ not in the past AND not after 90 days
          return (
            dayjs(date).isSameOrBefore(limit) &&
            dayjs(date).isAfter(now.subtract(1, "minute"))
          );
        },
        message:
          "Start time must be within the next 90 days and not in the past",
      },
    },

    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (end) {
          // ✅ end must be after start
          if (!this.startTime || !end) return false;
          return dayjs(end).isAfter(dayjs(this.startTime));
        },
        message: "End time must be after start time",
      },
    },

    numberOfPersons: { type: Number, required: true, min: 1, max: 10 },

    tshirt: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((s) =>
            ["S", "M", "L", "XL", "XXL"].includes(String(s).toUpperCase()),
          ),
        message: "Invalid t-shirt size",
      },
    },

    shoes: {
      type: [Number],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((n) => Number(n) >= 36 && Number(n) <= 46),
        message: "Invalid shoe size",
      },
    },

    towels: { type: Number, default: 0, min: 0, max: 10 },

    pin: { type: Number, min: 1000, max: 9999, select: false },
  },
  { timestamps: true },
);

BookingSchema.index({ field: 1, startTime: 1, endTime: 1 });
BookingSchema.index({ user: 1, startTime: -1 });

module.exports = mongoose.model("Booking", BookingSchema);
