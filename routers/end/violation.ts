import express from "express";


const violationappRouter = express.Router();

violationappRouter
    .route('/violation-list')
    .get(async(res, req) => {

    })

violationappRouter
    .route('/list-save')
    .post(async(res, req) => {
        console.log("violtion list request: ", req);
    })

export default violationappRouter;
