import mongoose from "mongoose"

const paymentLogSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true,
        },
        parkName: {
            type: String,
            required: true,
        },
        licensePlateNumber: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        receiptEmail: {
            type: String,
            required: true,
        },
        createDate: {
            type: String,
            required: true,
        },
    }
)

const logModel = mongoose.models.PaymentLog || mongoose.model("PaymentLog", paymentLogSchema)

export default logModel;