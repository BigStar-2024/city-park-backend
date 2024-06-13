import express from "express";
import violationListModel from "../../models/violationLog";

const violationAppRouter = express.Router();

interface Violation {
    lot: string;
    plateNumber: string;
    entryTime: string; 
    exitTime: string; 
}

const parkingPricePerLot = 10;

violationAppRouter
    .route("/get-list")
    .get(async (req, res) => {
        try {
            // Retrieve the list of violations from the model
            const violationList: Violation[] = await violationListModel.find();
            
            // If we retrieved a list, proceed to map it to another array
            if(violationList.length > 0) {
                const resultArr = violationList.map((obj) => ({
                    lot: obj.lot,
                    plateNumber: obj.plateNumber,
                    // Calculate the parking fee based on entry and exit times
                    fee: (Math.abs(new Date(obj.exitTime).getTime() - new Date(obj.entryTime).getTime()) / 36e5 * parkingPricePerLot).toFixed(2), // Fix the typo here as well
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