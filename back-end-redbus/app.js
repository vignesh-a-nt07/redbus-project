const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "config.env") });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing in config.env");
}

const stripe = require("stripe")(stripeSecretKey);

mongoose.pluralize(null);
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "redbus-backend",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const busRoutes = require("./routes/bus");
const bookingRoutes = require("./routes/booking");
const customerRoutes = require("./routes/customer");
const routeRoutes = require("./routes/route");
const Route = require("./models/route");
const Bus = require("./models/bus");

const seedDemoRouteData = async () => {
  try {
    const routeQuery = {
      "departureLocation.name": { $regex: "^Lucknow$", $options: "i" },
      "arrivalLocation.name": { $regex: "^Delhi$", $options: "i" },
    };

    let route = await Route.findOne(routeQuery);
    if (!route) {
      route = await Route.create({
        departureLocation: { name: "Lucknow", subLocations: ["Charbagh", "Alambagh"] },
        arrivalLocation: { name: "Delhi", subLocations: ["Kashmere Gate", "Anand Vihar"] },
        duration: 10,
      });
      console.log("Seeded demo route: Lucknow -> Delhi");
    }

    const existingBus = await Bus.findOne({ routes: route._id });
    if (!existingBus) {
      await Bus.create({
        operatorName: "Redbus Demo Travels",
        busType: "A/C Sleeper",
        departureTime: "10:00",
        rating: [4, 5, 5, 4],
        totalSeats: 42,
        routes: route._id,
        images:
          "https://images.unsplash.com/photo-1526481280690-07c236d8f0a8?auto=format&fit=crop&w=1200&q=80",
        liveTracking: 1,
        reschedulable: 1,
      });
      console.log("Seeded demo bus for Lucknow -> Delhi route");
    }
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
};

app.post("/v1/api/stripe-payments", async (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempotencyKey = uuidv4();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      return stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "inr",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

app.use(busRoutes);
app.use(bookingRoutes);
app.use(customerRoutes);
app.use(routeRoutes);
const bookingHireRoutes = require("./routes/bookinghire");
app.use(bookingHireRoutes);

const busServiceRoutes = require("./routes/busservice");
app.use(busServiceRoutes);

const connect = () => {
  const db = mongoose.connection;

  db.once("open", () => {
    console.log("MongoDB connection established.");
  });

  const connectionString = process.env.DATABASE?.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

  if (!connectionString) {
    throw new Error(
      "DATABASE or DATABASE_PASSWORD is missing in config.env"
    );
  }

  return mongoose.connect(connectionString, {
    dbName: "redbus",
    serverSelectionTimeoutMS: 5000,
  });
};


const port = process.env.PORT || 3020;
let host = process.env.HOST;

const start = async () => {
  try {
    await connect();
    console.log("Database connected");

    await seedDemoRouteData();

    const server = app.listen(port, host, () => console.log("Server is running"));
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${port} already in use. Close the existing process or choose a different port.`
        );
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(
      "Check that your current IP is allowed in MongoDB Atlas, the database user/password is correct, and your network allows TLS connections to Atlas."
    );
    process.exit(1);
  }
};
start();
