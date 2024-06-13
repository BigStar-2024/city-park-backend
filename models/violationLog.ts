import mongoose, { Schema, mongo } from "mongoose";

const violationSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    lot: {
        type: String
    },
    camera: {
        type: String
    },
    plateNumber: {
        type: String
    },
    plate: {
        type: String
    },
    vehicle1: {
        type: String
    },
    vehicle2: {
        type: String
    },
    direction: {
        type: String
    },
    entryTime: {
        type: String
    },
    exitTime: {
        type: String
    }
}, { timestamps: false })

const violationListModel =  mongoose.models.ViolationListModel || mongoose.model("ViolationListModel", violationSchema);
export default violationListModel;