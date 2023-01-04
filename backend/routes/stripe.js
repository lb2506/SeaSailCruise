const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/Order");
const { Product } = require("../models/Product");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);
const router = express.Router();

const calculateOrderAmount = (items) => {
  return items.cartTotal * 100;
};

router.post("/create-payment-intent", async (req, res) => {

  const { items } = req.body;

  const line_items = items.cartItems.map((item) => {
    return {
      id: item._id,
      name: item.name,
      dureeLocation: item.dureeLocation,
      startLocation: item.startLocation,
      endLocation: item.endLocation,
      choiceGuide: item.choiceGuide,
    }
  })

  // Create a PaymentIntent with the order amount, currency and metadata
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    metadata: {
      userId: items.userId,
      userFirstName: items.userFirstName,
      userLastName: items.userLastName,
      products: JSON.stringify(line_items),
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


// Create order function

const createOrder = async (data) => {

  const newOrder = new Order({
    userId: data.metadata.userId,
    userFirstName: data.metadata.userFirstName,
    userLastName: data.metadata.userLastName,
    products: data.metadata.products,
    subtotal: data.amount / 100,
    total: data.amount / 100,
    payment_status: data.status,
    type: 'En ligne'
  });

  try {
    const savedOrder = await newOrder.save();
    // console.log("Processed Order:", savedOrder);
    console.log("Commande enregistrée");
  } catch (err) {
    console.log(err);
  }

  // ajout de la réservation dans le produit en fonction de l'id du produit

  const productsParse = JSON.parse(data.metadata.products);

  productsParse.forEach(async (product) => {
    const productId = product.id;
    const productReservation = await Product
      .findById
      (productId);

    if (productReservation) {
      productReservation.reservation = [...productReservation.reservation, { userId: data.metadata.userId, userFirstName: data.metadata.userFirstName, userLastName: data.metadata.userLastName, startLocation: product.startLocation, endLocation: product.endLocation, dureeLocation: product.dureeLocation, choiceGuide: product.choiceGuide }]
      await productReservation.save();
      console.log("Réservation ajoutée au(x) produit(s)");
    } else {
      console.log("Product not found");
    }
  })
};


// Stripe webhoook
// let endpointSecret = "whsec_5826fea4ea506fb45ee57ce34e23d49630bacf0d7e9c7bd01a90656806e8bbb0"

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    webhookSecret = process.env.STRIPE_WEB_HOOK; // mettre en commentaire si error 500

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      const payload = req.body;
      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret
      })
      let event;
      // let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          // req.body,
          // signature,
          // webhookSecret
          payloadString,
          header,
          webhookSecret
        );
        console.log("webhook vérifié")
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "payment_intent.succeeded") {
      createOrder(data);
    }

    res.status(200).end();
  }
);

module.exports = router;