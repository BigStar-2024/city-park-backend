import express from "express";
import lotModel from "../../models/lot";
import dataModel from "../../models/data";

const payingAppLouter = express.Router();

payingAppLouter
    .route("/lot")
    .get(async (req, res) => {
        const lot = await lotModel.find();

        if(lot) {
            res.status(200).json(lot);
        } else {
            res.status(500).json({message: "server error"});
        }
    })

payingAppLouter
    .route("/data")
    .get(async (req, res) => {
        let dataList = await dataModel.find().sort({ time: -1 });
        if(dataList) {
            res.status(200).json(dataList)
        } else {
            res.status(500).json({message: "No data"});
        }
    })

export default payingAppLouter;