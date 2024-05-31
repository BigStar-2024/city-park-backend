import express from "express";
import lotModel from "../../models/lot";

const payingAppLouter = express.Router();

payingAppLouter
    .route("/lot")
    .get(async (req, res) => {
        const lot = await lotModel.find();
        res.status(200).json(lot);
    })

export default payingAppLouter;