const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: String, required: true },
    localisation: { type: String, required: true },
    tailleMax: { type: String, required: true },
    horaireStart: { type: String, required: true },
    horaireEnd: { type: String, required: true },
    emplacement: { type: String, required: true },
    armement: { type: String, required: true },
    longueur: { type: String, required: true },
    type_moteur: { type: String, required: true },
    nbr_moteur: { type: String, required: true },
    carburant: { type: String, required: true },
    caution: { type: String, required: true },
    annulation: { type: String, required: true },
    largeur: { type: String, required: true },
    tirant_eau: { type: String, required: true },
    power: { type: String, required: true },
    guide: { type: String, required: true },
    navigation: { type: Object, required: true },
    sanitaire: { type: Object, required: true },
    confort: { type: Object, required: true },
    loisir: { type: Object, required: true },
    cuisine: { type: Object, required: true },
    energie: { type: Object, required: true },
    utilisation: { type: Object, required: true },
    options: { type: Object, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Object, required: true },
    carousel: { type: Object, required: false },
    reservation: { type: Object, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

exports.Product = Product;