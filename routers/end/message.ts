import express from "express";
import messageModel from "../../models/message";
import {
  authEndUserMiddleware,
  authSuperMiddleware,
} from "../../middleware/auth";

import { io } from "../../server";

const messageRouter = express.Router();

messageRouter.route("/").get(authSuperMiddleware, async (req, res) => {
  let list = [];

  list = await messageModel.find().sort({ createdAt: -1 }).limit(3);

  res.status(200).json(list);
});

messageRouter.route("/getAll").get(authSuperMiddleware, async (req, res) => {
  let list = [];

  list = await messageModel.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$sender", // Group by the 'sender' field
        count: { $sum: 1 }, // Count the number of documents in each group
        contents: {
          $push: { id: "$_id", content: "$content", createdAt: "$createdAt" },
        }, // Collect message 'content' and 'createdAt' into an array
      },
    },
    {
      $project: {
        _id: 0, // Exclude the '_id' field from the output
        sender: "$_id", // Map the '_id' (which is the sender) to the 'sender' field
        count: 1, // Include the 'count' field
        contents: 1, // Include the 'contents' array
      },
    },
  ]);

  res.status(200).json(list);
});

messageRouter.route("/").post(authEndUserMiddleware, async (req, res) => {
  try {
    const { message, sender } = req.body;

    const data = await messageModel.create({ content: message, sender });

    res.status(201).json({
      success: true,
      data: data,
    });

    io.emit("receive_message");
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.send(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
});

messageRouter.route("/:_id").delete(authSuperMiddleware, async (req, res) => {
  const { _id } = req.params;
  try {
    await messageModel.deleteOne({ _id });
    res.status(200).json({ success: true });
  } catch (e) {
    res.send(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default messageRouter;
