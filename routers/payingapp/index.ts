import express from "express";
import lotModel from "../../models/lot";
import dataModel from "../../models/data";

const payingAppLouter = express.Router();

payingAppLouter
    .route("/lot")
    .get(async (req, res) => {
        try {
            const lot = await lotModel.find();

            if (lot) {
                res.status(200).json(lot);
            } else {
                res.status(500).json({ message: "server error" });
            }
        } catch (error) {
            res.status(500).json({ error: "Unexpected server error" });
        }

    })

payingAppLouter
    .route("/data")
    .get(async (req, res) => {
        try {
            let dataList = await dataModel.find().sort({ time: -1 });
            if (dataList) {
                res.status(200).json(dataList)
            } else {
                res.status(500).json({ message: "No data" });
            }
        } catch (error) {
            res.status(500).json({ error: "Unexpected server error" });
        }
        
    })

export default payingAppLouter;