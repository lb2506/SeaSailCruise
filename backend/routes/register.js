const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email().messages({
      "string.email": "Merci de saisir une adresse email valide"
    }),
    phone: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(200).required().messages({
      "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Utilisateur déjà existant, veuillez vous connecter.");

  const { firstName, lastName, email, phone, password } = req.body;

  user = new User({ firstName, lastName, email, phone, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = generateAuthToken(user);

  res.send(token);
});

module.exports = router;
