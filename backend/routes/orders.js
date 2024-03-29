const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

//CREATE

router.post("/", isAdmin, async (req, res) => {

  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    const productId = req.body.products[0].id;
    const productReservation = await Product
      .findById
      (productId);

    if (productReservation) {
      productReservation.reservation = [...productReservation.reservation, { _id: savedOrder._id, userId: req.body.userId, userFirstName: req.body.userFirstName, userLastName: req.body.userLastName, startLocation: req.body.products[0].startLocation, endLocation: req.body.products[0].endLocation, dureeLocation: req.body.products[0].dureeLocation, choiceGuide: req.body.products[0].choiceGuide }]
      await productReservation.save();
      console.log("Réservation ajoutée au(x) produit(s)");
    } else {
      console.log("Product not found");
    }
    res.status(200).send(savedOrder);
    console.log("Commande enregistrée");
  } catch (err) {
    res.status(500).send(err);
  }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findById(req.params.id);
    const productId = deletedOrder.products[0].id;
    const productReservation = await Product.findById(productId);

    console.log(req.params.id);
    console.log(productId);
    console.log(productReservation);

    if (productReservation) {
      productReservation.reservation = productReservation.reservation.filter(
        reservation => reservation._id.toString() !== deletedOrder._id.toString());

      await productReservation.save();
      console.log("Réservation supprimée du produit");
    } else {
      console.log("Product not found");
    }

    await deletedOrder.remove();
    res.status(200).send("Order has been deleted...");
  } catch (err) {
    res.status(500).send(err);
  }

});


//UPDATE
router.put("/:id", isAdmin, async (req, res) => {

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});


//GET USER ORDERS
router.get("/find/:userId", isUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});


// GET AN ORDER

router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);


    if (!req.user.isAdmin && req.user._id !== order.userId)
      return res.status(403).send("Accès refusé, Non autorisé...");

    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err)
  }
});

// GET LAST 4 ORDERS

router.get("/", isAdmin, async (req, res) => {

  const query = req.query.new

  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 })

    res.status(200).send(orders);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", isAdmin, async (req, res) => {

  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date(lastMonth).setMonth(lastMonth.getMonth() - 1));

  try {

    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth }, payment_status: { $in: ["paid", "succeeded"] }, type: { $ne: "Propriétaire" } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  }
  catch (err) {
    res.status(500).send(err);
  }

});

// GET 1 WEEK SALES

router.get("/week-sales", async (req, res) => {
  // récupérer les 7 derniers jours
  const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7)
  );

  try {
    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: lastWeek }, payment_status: { $in: ["paid", "succeeded"] }, type: { $ne: "Propriétaire" } } },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$date",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(sales);
  }
  catch (err) {
    res.status(500).send(err);
  }
});


// GET ORDERS STATS

router.get("/stats", isAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date(date).setMonth(lastMonth.getMonth() - 1));

  try {
    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth }, type: { $ne: "Propriétaire" } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
