import express from "express";
import { authReadOnlyMiddleware, authSuperMiddleware } from "../../middleware/auth";
import superUserRouter from "./user";
import lotRouter from "./lot";
import dataRouter from "./data";
import messageRouter from "./message";
import unenforcableDatesRouter from "./unenforcableDates";
import violationRouter from "./violation";
const endUserRouter = express.Router();
endUserRouter.use('/user', authSuperMiddleware, superUserRouter)
endUserRouter.use('/lot', authReadOnlyMiddleware, lotRouter)
endUserRouter.use("/message", messageRouter);
endUserRouter.use('/unenforcable-dates', authReadOnlyMiddleware, unenforcableDatesRouter)
endUserRouter.use('/data', dataRouter);
endUserRouter.use('/violation', violationRouter)
export default endUserRouter