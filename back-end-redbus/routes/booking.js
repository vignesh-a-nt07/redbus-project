const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking");

// Use like this

router.post("/v1/api/booking", bookingController.addBooking);
router.post("/v1/api/bookings", bookingController.addBooking);
router.get("/v1/api/booking/:id", bookingController.getBooking);
router.get("/v1/api/bookings/:id", bookingController.getBooking);
router.get("/v1/api/bookings", bookingController.getAllBookings);
module.exports = router;
