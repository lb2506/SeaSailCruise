const { Contract } = require('../models/Contract');
const { auth, isUser, isAdmin } = require('../middleware/auth');

const router = require("express").Router();

//CREATE

router.post("/", isAdmin, async (req, res) => {
    const newContract = new Contract(req.body);

    try {
        const savedContract = await newContract.save();
        res.status(200).send(savedContract);
        console.log('Nouveau contrat enregistré');
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET ALL CONTRACTS

router.get("/", async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.status(200).send(contracts);
    } catch (error) {
        res.status(500).send
    }
});

// UPDATE CONTRACT

router.put("/", isAdmin, async (req, res) => {

    try {
        const updatedContract = await Contract.findByIdAndUpdate(
            req.body.id,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                },
            },
            { new: true }
        );

        res.status(200).send(updatedContract);
        console.log('Contrat mis à jour');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;