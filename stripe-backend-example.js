    
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Feed Me backend is alive, checkout endpoint added!");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, method, customer } = req.body;

    const line_items = items.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (method === "delivery") {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: { name: "Delivery fee" },
          unit_amount: 300,
        },
        quantity: 1,
      });
    }

    line_items.push({
      price_data: {
        currency: "gbp",
        product_data: { name: "Service fee" },
        unit_amount: 99,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customer?.email || undefined,
      metadata: {
        method,
        customerName: customer?.name || "",
        customerPhone: customer?.phone || "",
        customerAddress: customer?.address || "",
      },
      success_url: "https://your-domain.co.uk/order-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://your-domain.co.uk/checkout",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not start checkout." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));      

    
