import express from "express";
import violationListModel from "../../models/violationLog";
const violationRouter = express.Router();

violationRouter
    .route('/list-save')
    .post(async (req, res) => {
        try {
            const violationList = req.body.violationArr;

            for (const element of violationList) {
                const bulkOps = {
                    updateOne: {
                        filter: { _id: element._id },
                        update: { $set: element },
                        upsert: true
                    }
                }

                await violationListModel.bulkWrite([bulkOps]);
            }
            res.status(200).send("sucessfully saved")
        } catch (error: any) {
            console.error(`Error😢`, error); // Improved error logging
            res.status(500).send(error.message || 'An unexpected error occurred');
        }
    })

export default violationRouter;
