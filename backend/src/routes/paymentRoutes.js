import express from "express";
import Stripe from "stripe";
import { db } from "../db/firebase.js"; 

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

router.post("/create-payment-intent", async (req, res) => {
  const { tourId, userId } = req.body;

  if (!tourId) return res.status(400).json({ error: "Missing tourId" });

  try {
    const tourDoc = await db.collection("tours").doc(tourId).get();
    if (!tourDoc.exists) return res.status(404).json({ error: "Tour not found" });

    const tour = { id: tourDoc.id, ...tourDoc.data() };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: tour.price_tour * 100, // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { tourId: tour.id, userId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PaymentIntent creation failed" });
  }
});

export default router;
