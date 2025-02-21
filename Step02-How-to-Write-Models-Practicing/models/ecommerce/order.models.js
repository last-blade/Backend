import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },

    quantity: {
        type: Number,
        required: true,
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true,
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    orderItems: {
        type: [orderItemSchema],
        /*
            //OR

            type: [
                {
                    productId: mongoose.schemas.type.objectid,
                    ref: "Product",
                }
            ]

            agar hum aise likhte toh humein ooapr orderItems naam kaa schema banane ki need nahin padti, lekin hum yahan par alag alag
            tareeke bhi seekh rahe hain ki kaise or likh sakte hain.
        */
    },

    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "ON THE WAY", "DELIVERED"],
        default: "PENDING",
    },
}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);