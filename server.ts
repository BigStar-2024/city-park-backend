import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import connectToMongodb from "./db/mongodb";
import { authEndUserMiddleware, authSenderMiddleware } from "./middleware/auth";
import endUserRouter from "./routers/end";
import senderRouter from "./routers/sender";
import payingAppRouter from "./routers/payingapp";
const mainRouter = express.Router();
dotenv.config();
connectToMongodb();
const app: Application = express();
const port = process.env.PORT || 8000;
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
endUserRouter.use(
  "/public",
  express.static(
    path.join(
      __dirname,
      process.env.NODE_ENV === "production" ? "../public" : "public"
    )
  )
);
mainRouter.use("/end-user", authEndUserMiddleware, endUserRouter);
mainRouter.use("/sender", authSenderMiddleware, senderRouter);
mainRouter.use("/payingapp", payingAppRouter);
app.use(
  process.env.NODE_ENV === "production" ? "/city-park-lot/api" : "/",
  mainRouter
);

app.use(
  process.env.NODE_ENV === "production" ? "/city-park-lot/api" : "/",
  mainRouter
);

app.get("/city-park-lot/api/end-user/getPassDataCount", async (req, res) => {
  console.log("getPassDataCount");
  try {
    const database = await mongoose.connect(process.env.MONGO_URI || "");
    const myCollection = mongoose.model("Data");
    const documentCount = await myCollection.countDocuments({});
    console.log(documentCount);
    res.json(documentCount);
  } catch (error: any) {
    console.log(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
});

const server = http.createServer(app);

export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
