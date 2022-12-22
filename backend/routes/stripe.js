const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/Order");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

const calculateOrderAmount = (items) => {

  // console.log(items[0].cartItems)


  return items.cartTotal;
};

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });

});

// Create order function

const createOrder = async (customer, data, line_items) => {

  const newOrder = new Order({
    userId: customer.metadata.userId,
    userFirstName: customer.metadata.userFirstName,
    userLastName: customer.metadata.userLastName,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: line_items.data,
    subtotal: data.amount_subtotal / 100,
    total: data.amount_total / 100,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
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
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            stripe.checkout.sessions.listLineItems(
              data.id,
              {},
              function (err, lineItems) {
                console.log("line_items", lineItems)
                createOrder(customer, data, lineItems);
              }
            )
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);

module.exports = router;
