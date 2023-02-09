const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const orders = require("./routes/orders");
const stripe = require("./routes/stripe");
const productsRoute = require("./routes/products");
const users = require("./routes/users");
const contracts = require("./routes/contracts");
const bodyParser = require('body-parser');

const app = express();

require("dotenv").config();

app.use(bodyParser.json({ limit: '20mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))

app.use(express.json());
app.use(cors());

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/orders", orders);
app.use("/api/stripe", stripe);
app.use("/api/products", productsRoute);
app.use("/api/users", users);
app.use("/api/contracts", contracts);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de réservation en ligne...");
});

app.get("/products", (req, res) => {
  res.send(products);
});

const uri = process.env.DB_URI;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Backend fonctionnel sur le port: ${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à la base de données réussie..."))
  .catch((error) => console.error("porblème lors de la connexion à la base de données ->", error.message));