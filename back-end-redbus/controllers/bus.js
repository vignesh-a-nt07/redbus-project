const Bus = require("../models/bus");

exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().lean().exec();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id).lean().exec();
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBus = async (req, res) => {
  try {
    const newBus = await Bus.create(req.body);
    res.status(201).json(newBus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
