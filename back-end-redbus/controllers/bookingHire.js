const BookingHire = require("../models/bookingHire");

exports.addBookingHire = async (req, res) => {
  try {
    const bookingHire = await BookingHire.create(req.body);
    return res.status(201).json(bookingHire);
  } catch (err) {
    console.error("Error creating booking hire:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getBookingHire = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    const bookings = await BookingHire.find({ email }).lean().exec();
    return res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching booking hires:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getAllBookingHires = async (req, res) => {
  try {
    const bookings = await BookingHire.find().lean().exec();
    return res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching all booking hires:", err);
    return res.status(500).json({ error: err.message });
  }
};
