const { Product } = require("../models/Product");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = require("express").Router();

//CREATE

router.post("/", isAdmin, async (req, res) => {
  const { name, year, localisation, emplacement, longueur, largeur, tirant_eau, armement, guide, type_moteur, nbr_moteur, carburant, caution, annulation, horaireStart, horaireEnd, tailleMax, power, desc, navigation, sanitaire, confort, loisir, cuisine, energie, utilisation, options, price, image, carousel, reservation } = req.body;
  try {
    if (image && carousel) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "seasailcruise",
      });
      const uploadedCarousel = carousel.map(async (image) => {
        const response = await cloudinary.uploader.upload(image, {
          upload_preset: "seasailcruise",
        });
        return response;
      });

      Promise.all(uploadedCarousel).then(async (values) => {
        if (uploadedResponse && uploadedCarousel) {
          const product = new Product({
            name,
            year,
            localisation,
            tailleMax,
            emplacement,
            horaireStart,
            horaireEnd,
            longueur,
            largeur,
            tirant_eau,
            type_moteur,
            nbr_moteur,
            carburant,
            caution,
            annulation,
            armement,
            guide,
            power,
            navigation,
            sanitaire,
            confort,
            loisir,
            cuisine,
            energie,
            utilisation,
            options,
            desc,
            price,
            image: uploadedResponse,
            carousel: values,
            reservation,
          });

          const savedProduct = await product.save();
          res.status(200).send(savedProduct);
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).send("Produit non trouvé...");

    console.log(product);
    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(product.image.public_id)

      const destroyCarousel = product.carousel.map(async (image) => {
        const response = await cloudinary.uploader.destroy(image.public_id);
        return response;
      });

      if (destroyResponse && destroyCarousel) {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).send(deletedProduct);
      }
    } else {
      console.log("Action terminée. Echec de la suppression de l'image du produit...");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send
  }
});

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//UPDATE

router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    try {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.product.image.public_id
      );

      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.productImg,
          {
            upload_preset: "seasailcruise"
          }
        );

        if (uploadedResponse) {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadedResponse,
              },
            },
            { new: true }
          );

          res.status(200).send(updatedProduct);
        }
      }
    } catch (err) {
      res.status(500).send(err)
    }
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

module.exports = router;
