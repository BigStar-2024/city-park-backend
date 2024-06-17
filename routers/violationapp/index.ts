import express from "express";
import violationListModel from "../../models/violationLog";

const violationAppRouter = express.Router();

interface Violation {
    _id: string;
    lot: string;
    plateNumber: string;
    entryTime: string; 
    exitTime: string; 
    vehicle1: string;
    vehicle2: string;
}

const parkingPricePerLot = 10;
const delayPrice = 0.1

violationAppRouter
    .route("/get-list")
    .get(async (req, res) => {
        try {
            // Retrieve the list of violations from the model
            const violationList: Violation[] = await violationListModel.find();
            
            // If we retrieved a list, proceed to map it to another array
            if(violationList.length > 0) {
                const resultArr = violationList.map((obj) => ({
                    parkingChargeNumber: obj._id,
                    lot: obj.lot,
                    plateNumber: obj.plateNumber,
                    // Calculate the parking fee based on entry and exit times
                    fee: parseFloat((Math.abs(new Date(obj.exitTime).getTime() - new Date(obj.entryTime).getTime()) / 36e5 * parkingPricePerLot).toFixed(2)), // Fix the typo here as well
                    delay_fee:parseFloat((Math.abs(new Date().getTime() - new Date(obj.entryTime).getTime()) / 36e5 * delayPrice).toFixed(2)),
                    issue_date: obj.entryTime,
                    image1: obj.vehicle1,
                    image2: obj.vehicle2,
                    // fee: , // Fix the typo here as well
                }));
                // Send success response with the result array
                res.status(200).json(resultArr);
            } else {
                // Send not found status if there are no violations
                res.status(404).send('No violations found.');
            }
        } catch (error) {
            // It's a good practice to log the actual error for debug purposes on the server side
            console.error(error); 
            
            // Include the error message for debugging purposes
            res.status(500).send(`Internal Server Error: ${error}`);
        }
    });
// Export the router
export default violationAppRouter;