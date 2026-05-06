const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer");

// CREATE
router.post("/v1/api/customers", customerController.addNewCustomer);

// GET ALL
router.get("/v1/api/customers", customerController.getAllCustomers);

// GET BY ID
router.get("/v1/api/customers/:id", customerController.getCustomerById);

module.exports = router;