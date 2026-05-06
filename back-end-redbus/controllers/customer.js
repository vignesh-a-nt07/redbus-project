const Customer = require("../models/customer");

// Add or update customer when a Google login occurs
exports.addNewCustomer = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }

    const existingCustomer = await Customer.findOne({ email }).exec();

    if (existingCustomer) {
      if (req.body.name) existingCustomer.name = req.body.name;
      existingCustomer.googleId = req.body.googleId || existingCustomer.googleId;
      existingCustomer.profilePicture = req.body.profilePicture || existingCustomer.profilePicture;
      const updatedCustomer = await existingCustomer.save();
      return res.send(updatedCustomer);
    }

    const newCustomer = await Customer.create({
      name: req.body.name || "Google User",
      email,
      googleId: req.body.googleId,
      profilePicture: req.body.profilePicture,
    });

    res.send(newCustomer);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// GET ALL CUSTOMERS
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).send(customers);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// GET CUSTOMER BY ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.status(200).send(customer);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};