import express from "express";


const violationRouter = express.Router();

violationRouter
    .route('/violation-list')
    .get(async(res, req) => {

    })

    violationRouter
    .route('/list-save')
    .post(async(res, req) => {
        console.log("violtion list request: ");
    })

export default violationRouter;
