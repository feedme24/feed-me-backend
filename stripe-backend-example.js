const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Feed Me backend is alive, Stripe initialized!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));
