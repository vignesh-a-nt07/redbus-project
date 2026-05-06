const Booking = require("../models/booking");

// CREATE BOOKING
exports.addBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).send(booking);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// GET BOOKINGS BY CUSTOMER
exports.getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({
      customerId: id,
    });

    res.send(bookings);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().lean().exec();
    return res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    return res.status(500).json({ error: err.message });
  }
};