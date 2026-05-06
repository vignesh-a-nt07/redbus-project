const BusServices = require("../models/busservice");

module.exports.getBusService = async (req, res) => {
  try {
    const getData = await BusServices.find({});
    return res.status(200).json({ data: getData });
  } catch (err) {
    console.error("Error fetching bus services:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports.postBusDetails = async (req, res) => {
  try {
    const postData = await BusServices.create(req.body);
    return res.status(201).json({ data: postData });
  } catch (err) {
    console.error("Error creating bus service:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports.deleteBusDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const dataObj = await BusServices.findByIdAndDelete(id);
    if (!dataObj) {
      return res.status(404).json({ error: "Bus service not found" });
    }
    return res.status(200).json({ data: dataObj });
  } catch (err) {
    console.error("Error deleting bus service:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports.eachBusDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const dataObj = await BusServices.findById(id);
    if (!dataObj) {
      return res.status(404).json({ error: "Bus service not found" });
    }
    return res.status(200).json(dataObj);
  } catch (err) {
    console.error("Error fetching bus service by id:", err);
    return res.status(500).json({ error: err.message });
  }
};
